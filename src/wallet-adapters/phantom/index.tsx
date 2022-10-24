import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction, Connection, Signer, Commitment } from '@solana/web3.js';
import { notify } from '../../utils/notifications';
import { DEFAULT_PUBLIC_KEY, WalletAdapter } from '../types';


export type SendOptions = {
  /** disable transaction verification step */
  skipPreflight?: boolean;
  /** preflight commitment level */
  preflightCommitment?: Commitment;
  /** Maximum number of times for the RPC node to retry sending the transaction to the leader. */
  maxRetries?: number;
  /** The minimum slot that the request can be evaluated at */
  minContextSlot?: number;
};

export interface SendTransactionOptions extends SendOptions {
  signers?: Signer[];
};



type PhantomEvent = 'disconnect' | 'connect';
type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions';

interface PhantomProvider {
  publicKey?: PublicKey;
  isConnected?: boolean;
  autoApprove?: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
  listeners: (event: PhantomEvent) => (() => void)[];
}

export class PhantomWalletAdapter
  extends EventEmitter
  implements WalletAdapter {
  constructor() {
    super();
    this.connect = this.connect.bind(this);
  }

  private get _provider(): PhantomProvider | undefined {
    if ((window as any)?.solana?.isPhantom) {
      return (window as any).solana;
    }
    return undefined;
  }

  private _handleConnect = (...args) => {
    this.emit('connect', ...args);
  }

  private _handleDisconnect = (...args) => {
    this.emit('disconnect', ...args);
  }

  get connected() {
    return this._provider?.isConnected || false;
  }

  get autoApprove() {
    return this._provider?.autoApprove || false;
  }

  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    if (!this._provider) {
      return transactions;
    }

    return this._provider.signAllTransactions(transactions);
  }

  get publicKey() {
    return this._provider?.publicKey || DEFAULT_PUBLIC_KEY;
  }

  async signTransaction(transaction: Transaction) {
    if (!this._provider) {
      return transaction;
    }

    return this._provider.signTransaction(transaction);
  }

   prepareTransaction = async(
    transaction: Transaction,
    connection: Connection,
    options: SendOptions = {}
  ): Promise<Transaction> => {
    const publicKey = this.publicKey;
    if (!publicKey) throw new Error;
  
    transaction.feePayer = transaction.feePayer || publicKey;
    transaction.recentBlockhash =
        transaction.recentBlockhash ||
        (
            await connection.getLatestBlockhash({
                commitment: options.preflightCommitment,
                minContextSlot: options.minContextSlot,
            })
        ).blockhash;
  
    return transaction;
  }


  async signAndSendTransaction(transaction: Transaction, options?: SendOptions): Promise<{ signature: string }> {

    const resp = (await this._provider?.request(""))

    const response = (await this._provider?.request({
      method: "send_transaction",
      params: { message: transaction.serialize({ requireAllSignatures: false }).toString("hex"), options },
    })) as string;
    return { signature: response };
  }

  async sendTransaction(transaction: Transaction, connection: Connection, options?: SendTransactionOptions | undefined)
  {
    try {
        const wallet = this._provider;
        if (!wallet)
            throw new Error;
        try {
            const { signers, ...sendOptions } = options;
            transaction = await this.prepareTransaction(transaction, connection, sendOptions);
            signers?.length && transaction.partialSign(...signers);
            sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;
            const { signature } = await wallet.signAndSendTransaction(transaction, sendOptions);
            return signature;
        }
        catch (error) {
            throw new Error;
        }
    }
    catch (error) {
        this.emit('error', error);
        throw error;
    }
}

  connect() {
    if (!this._provider) {
      window.open('https://phantom.app/', '_blank');
      notify({
        message: 'Connection Error',
        description: 'Please install Phantom wallet',
      });
      return;
    }
    if (!this._provider.listeners('connect').length) {
      this._provider?.on('connect', this._handleConnect);
    }
    if (!this._provider.listeners('disconnect').length) {
      this._provider?.on('disconnect', this._handleDisconnect);
    }
    return this._provider?.connect();
  }

  disconnect() {
    if (this._provider) {
      this._provider.disconnect();
    }
  }
}

import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';

export interface IToken {
  chainId: number; // 101,
  address: PublicKey; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags: string[]; // [ 'stablecoin' ]
}

export interface IFormProps {
  inputToken: PublicKey;
  outputToken: PublicKey;
  amount: number;
  decimals: number ;
}

export type IParsedTokenAccountData = {
  info: IParsedTokenAccountInfo;
  type: string;
};

export type IParsedTokenAccountInfo = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: IParsedTokenAccountBalance;
};

export type IParsedTokenAccountBalance = {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
};

export type IParsedTokenAccount = {
  program: string;
  parsed: IParsedTokenAccountData;
  space: number;
};

export type ISplAccounts = {
  pubkey: PublicKey;
  account: AccountInfo<IParsedTokenAccount>;
};

export interface IMergedTokens {
  mint: PublicKey;
  amount: number;
  symbol: string;
  icon: string;
  decimals: number;
}

export interface IGetWalletTokenAccountsBody {
  walletKey: PublicKey;
  connection: Connection;
}

export interface IConvertedToken {
  mint: PublicKey;
  symbol: string;
  icon: string;
  decimals: number;
}

export interface IConvertedAccount {
  mint: PublicKey;
  amount: number;
}

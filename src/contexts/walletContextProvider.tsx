import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-ant-design';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { useAutoConnect } from './walletAutoConnectProvider';
import { WalletAccountsContextProvider } from './accountContextProvider';

export const endpoints = [
  // { url: 'https://raydium.rpcpool.com', weight: 30 },
  { url: 'https://app.solanadino.workers.dev/', weight: 100 },
  // { url: 'https://raydium.genesysgo.net', weight: 100 }
];

export function getRandomEndpoint() {
  let pointer = 0;
  const random = Math.random() * 100;
  let api = endpoints[0].url;

  for (const endpoint of endpoints) {
    if (random > pointer + endpoint.weight) {
      pointer += pointer + endpoint.weight;
    } else if (random >= pointer && random < pointer + endpoint.weight) {
      api = endpoint.url;
      break;
    } else {
      api = endpoint.url;
      break;
    }
  }

  return api;
}

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const endpoints = getRandomEndpoint()
  const { autoConnect } = useAutoConnect();

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet;

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network],
  );

  return (
    <ConnectionProvider
      endpoint={endpoints}
      config={{ commitment: 'confirmed' }}
    >
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletAccountsContextProvider>
          <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
        </WalletAccountsContextProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <WalletContextProvider>{children}</WalletContextProvider>;
};

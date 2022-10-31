import { getPlatformFeeAccounts, JupiterProvider } from '@jup-ag/react-hook';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect } from 'react';

import feeAccounts from '../../consts/feeAccounts.json';

export const JupiterAppProvider = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const generateMap = () => {
    const map = new Map<string, PublicKey>();
    for (const value in feeAccounts) {
      map.set(value, new PublicKey(feeAccounts[value]));
    }
    return map;
  };

  return (
    <JupiterProvider
      cluster="mainnet-beta"
      connection={connection}
      userPublicKey={publicKey || undefined}
      platformFeeAndAccounts={{feeBps: 50,
        feeAccounts: generateMap()}}
    >
      {children}
    </JupiterProvider>
  );
};

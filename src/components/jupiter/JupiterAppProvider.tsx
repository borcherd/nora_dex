import { JupiterProvider } from "@jup-ag/react-hook";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export const JupiterAppProvider = ({ children }) => {
    const {connection} = useConnection();
    const { publicKey } = useWallet(); 
    
    return (
      <JupiterProvider
        cluster="mainnet-beta"
        connection={connection}
        userPublicKey={publicKey || undefined} 
      >
        {children}
      </JupiterProvider>
    );
};


//import { JupiterProvider } from "@jup-ag/react-hook";
import React from "react";
import { useConnection } from "utils/connection";
import { useWallet } from "utils/wallet";

export const JupiterAppProvider = ({ children }) => {
    const connection = useConnection();
    const {  wallet } = useWallet(); 
    
    return (
      // <JupiterProvider
      //   cluster="mainnet-beta"
      //   connection={connection}
      //   userPublicKey={wallet?.publicKey}
      // >
      //   {children}
      // </JupiterProvider>
      <></>
    );
};


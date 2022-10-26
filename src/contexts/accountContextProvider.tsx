import React, {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
  } from "react";
  import { useConnection, useWallet } from "@solana/wallet-adapter-react";
  
  
  export interface IWalletAccountsContext {}
  
  const WalletAccountsContext = createContext<IWalletAccountsContext>({});
  
  export const useWalletAccountsContext = () => {
    const context = useContext(WalletAccountsContext);
  
    return context;
  };
  
  export const WalletAccountsContextProvider: FC<{
    children: ReactNode;
  }> = ({ children }) => {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
  
    return (
      <WalletAccountsContext.Provider value={{}}>
        {children}
      </WalletAccountsContext.Provider>
    );
  };
  
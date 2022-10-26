import React, { createContext, FC, ReactNode, useContext } from "react";
import { useLocalStorage } from "@solana/wallet-adapter-react";

export interface IWalletAutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

export const WalletAutoConnectContext =
  createContext<IWalletAutoConnectContextState>(
    {} as IWalletAutoConnectContextState
  );

export function useAutoConnect(): IWalletAutoConnectContextState {
  return useContext(WalletAutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useLocalStorage("autoConnect", false);

  return (
    <WalletAutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </WalletAutoConnectContext.Provider>
  );
};

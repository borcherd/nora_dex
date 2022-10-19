import React, { useEffect, useState } from 'react';
//import { TOKEN_LIST_URL } from "@jup-ag/core";
import { PublicKey } from '@solana/web3.js';
//import { useJupiter } from '@jup-ag/react-hook';
import JSBI from 'jsbi';

export interface Token {
  chainId: number; // 101,
  address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags: string[]; // [ 'stablecoin' ]
}

export const JupiterApp = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  console.log(tokens) // Look for tokens

  const [inputMint] = useState<PublicKey>(new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"))
  const [outputMint] = useState<PublicKey>(new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"))
  
  // useEffect(() => {
  //   // Fetch token list from Jupiter API
  //   fetch(TOKEN_LIST_URL["mainnet-beta"])
  //     .then((response) => response.json())
  //     .then((result) => setTokens(result));
  // }, []);

  // const jupiter = useJupiter({
  //   amount: JSBI.BigInt(1 * (10 ** 6)), // raw input amount of tokens
  //   inputMint,
  //   outputMint,
  //   slippage: 1, // 1% slippage
  //   debounceTime: 250, // debounce ms time before refresh
  // })
  return (
    <>
      <div>Hook example</div>
      <div>Number of tokens:</div>
      <div>Number of input tokens</div>
      <div>Possible number of routes:</div>
      <div>Best quote:</div>
    </>
  );
};

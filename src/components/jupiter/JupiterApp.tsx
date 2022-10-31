import React, { useEffect, useState } from 'react';
import { RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core';
import { PublicKey } from '@solana/web3.js';
import { useJupiter,} from '@jup-ag/react-hook';
import JSBI from 'jsbi';
import { Button, Form, Input, Select } from 'antd';

import * as styled from './JupiterApp.styled';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getWalletTokenAccounts } from 'utils/tokens';
import {
  IFormProps,
  ISplAccounts,
  IToken,
  IMergedTokens,
  IConvertedToken,
  IConvertedAccount,
} from 'models/jupiter';
import { useForm } from 'react-hook-form';
import { notify } from 'utils/notifications';

import feeAccounts from '../../consts/feeAccounts.json';


const { Option } = Select;

export const JupiterApp = () => {
  const {
    connected,
    wallet,
    publicKey,
    sendTransaction,
    signAllTransactions,
    signTransaction,
  } = useWallet();
  const { connection } = useConnection();

  const [tokens, setTokens] = useState<IToken[]>([]);
  const [mergedTokenList, setMergedTokenList] = useState<IMergedTokens[]>([]);

  const [attemptingSwap, setAttemptingSwap] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const [antdForm] = Form.useForm();
  const form = useForm<IFormProps>({
    mode: 'onSubmit',
    defaultValues: {
      inputToken: new PublicKey('So11111111111111111111111111111111111111112'),
      outputToken: new PublicKey(
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      ),
      amount: 0,
      decimals: 9,
    },
  });
  const formWatch = form.watch();

  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [selectedRoute, setSelectedRoute] = useState<number>();

  const [useableRoutes, setUseableRoutes] = useState<RouteInfo[]>([]);

  const {exchange, refresh, routes} = useJupiter({
    amount: JSBI.BigInt(formWatch.amount * 10 ** formWatch.decimals),
    inputMint: new PublicKey(formWatch.inputToken),
    outputMint: new PublicKey(formWatch.outputToken),
    slippage: 1, // 1% slippage
    
  });

  useEffect(() => {
    // Fetch token list from Jupiter API
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => {
        setTokens(result);
        if (connected && wallet) {
          GetTokenAccountsAndMerge(result);
        }
      });
  }, []);

  useEffect(() => {
    //Look through all routes to select the routes with the correct input- and outputmint
    if (routes) {
      setAttemptingSwap(false);
      setUseableRoutes(
        routes?.filter((route) => {
          return (
            route.marketInfos[0].inputMint.toString() ===
              formWatch.inputToken.toString() &&
            route.marketInfos[0].outputMint.toString() ===
              formWatch.outputToken.toString()
          );
        }),
      );
    }
  }, [routes]);

  useEffect(() => {
    setSelectedRoute(undefined);
  }, [useableRoutes]);

  const cleanTokens = (tokens: IToken[]) => {
    //Clean tokens fetched from jupiter, only keep neccesary fields
    const _tokens: IConvertedToken[] = [];
    tokens.map((token) => {
      _tokens.push({
        mint: token.address,
        symbol: token.symbol,
        icon: token.logoURI,
        decimals: token.decimals,
      });
    });
    return _tokens;
  };
  const cleanTokenAccounts = (tokenAccounts: ISplAccounts[]) => {
    //Clean tokenAccounts fetched from wallet, only keep neccesary fields
    const _tokenAccounts: IConvertedAccount[] = [];
    tokenAccounts.map((tokenAccount) => {
      _tokenAccounts.push({
        mint: new PublicKey(tokenAccount.account.data.parsed.info.mint),
        amount: tokenAccount.account.data.parsed.info.tokenAmount.uiAmount,
      });
    });
    return _tokenAccounts;
  };
  const mergeTokens = (tokensCleaned, tokenAccountsCleaned) => {
    //Merge cleaned tokens and cleaned tokenaccounts into one array
    const tok: IMergedTokens[] = tokensCleaned.map((token) => ({
      ...tokenAccountsCleaned.find(
        (tokenAccountsCleaned) =>
          token.mint === tokenAccountsCleaned.mint.toString() &&
          tokenAccountsCleaned.toString(),
      ),
      ...token,
    }));

    return tok.sort((a, b) =>
      a.amount === undefined
        ? 0
        : a.amount > b.amount === undefined
        ? 0
        : b.amount
        ? -1
        : -1,
    );
  };

  async function GetTokenAccountsAndMerge(_tokens: IToken[] | undefined = undefined) {
    //Fetch tokenAccounts, add sol balance, clean and merge
    if (wallet && connection && publicKey) {
      const _tokenAccounts = await getWalletTokenAccounts({
        connection: connection,
        walletKey: publicKey,
      });
      const _convertedTokenAccountSol: IConvertedAccount = {
        amount: (await connection.getBalance(publicKey)) / 10 ** 9,
        mint: new PublicKey('So11111111111111111111111111111111111111112'),
      };
      const _cleanedTokenAccounts = cleanTokenAccounts(_tokenAccounts);
      _cleanedTokenAccounts.push(_convertedTokenAccountSol);
      if (tokens.length > 0) {
        const _mergedTokenList = mergeTokens(
          cleanTokens(tokens),
          _cleanedTokenAccounts,
        );
        setMergedTokenList(_mergedTokenList);
      } else if (_tokens) {
        const _mergedTokenList = mergeTokens(
          cleanTokens(_tokens),
          _cleanedTokenAccounts,
        );

        setMergedTokenList(_mergedTokenList);
      }
    }
  }
  useEffect(() => {
    if (connected && wallet) {
      GetTokenAccountsAndMerge(tokens);
    }
  }, [connected]);

  const calculateBestRoute = async (values: any) => {
    //Update form used in useJupiter to receive new routes routes.
    setSearching(true);
    setAttemptingSwap(true);
    setUseableRoutes([]);
    form.setValue('inputToken', new PublicKey(values.inputToken));
    form.setValue('outputToken', new PublicKey(values.outputToken));
    form.setValue('amount', values.amount as number);

    let dec = mergedTokenList.find(
      (value) => value.mint.toString() === values.inputToken.toString(),
    )?.decimals;
    if (dec === undefined) {
      throw new Error('decimals of input not found');
    } else {
      form.setValue('decimals', dec);
    }
    refresh();
  };

  const swap = async (idx: number) => {
    //Attempt swap, if there is a fee account with the corresponding outputMint, a 0.5% fee is deducted
    if (
      useableRoutes &&
      wallet &&
      publicKey &&
      signAllTransactions &&
      signTransaction
    ) {
      const _selectedRoute = useableRoutes[idx];
      let _feeAccount = feeAccounts[ _selectedRoute.marketInfos[0].outputMint.toString()]
      let swapResult:any

      if (_feeAccount){
        swapResult = await exchange({
          routeInfo: _selectedRoute,
          wallet: {
            sendTransaction: sendTransaction,
            signAllTransactions: signAllTransactions,
            signTransaction: signTransaction,
          },
          userPublicKey: publicKey,
          feeAccount: new PublicKey( _feeAccount)
        });
      } else {
        swapResult = await exchange({
          routeInfo: _selectedRoute,
          wallet: {
            sendTransaction: sendTransaction,
            signAllTransactions: signAllTransactions,
            signTransaction: signTransaction,
          },
          userPublicKey: publicKey,
  
        });
      }     

      if (swapResult.error) {
        console.log(swapResult.error);
        notify({ message: 'Swap failed', type: 'error' });
        console.log(swapResult.txid)
      } else {
        notify({
          message: `Swap succes. TXiD: ${swapResult.txid}`,
          type: 'success',
        });
        console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
        reset();
      }
    }
  };

  const reset = () => {
    //Reset all fields when the swap is completed
    antdForm.resetFields();
    form.reset();
    setUseableRoutes([]);
    setSearching(false);
    setMaxAmount(0);
    setSelectedRoute(undefined);
    GetTokenAccountsAndMerge();
  };

  const getOutputDecimals = (route: RouteInfo) => {
    //Get the decimals of the outputMint to display the output value
    const dec = mergedTokenList.find(
      (value) =>
        value.mint.toString() === route.marketInfos[0].outputMint.toString(),
    )?.decimals;

    if (dec === undefined) {
      console.log(
        'decimals of outputToken not found, so outputValue might be shown wrong',
      );
      return 8;
    } else {
      return dec;
    }
  };

  return (
    <>
      {connected ? (
        <styled.wrapper>
          <Form form={antdForm} onFinish={calculateBestRoute} name="form">
            <styled.SelectWrapper>
              <h3>Input token:</h3>
              <Form.Item
                name="inputToken"
                rules={[{ required: true, message: 'Please select a token' }]}
              >
                <Select
                  className="select"
                  size={'large'}
                  showSearch
                  placeholder={'Select a token'}
                  optionFilterProp="name"
                  filterOption={(input, option) =>
                    option?.name?.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  }
                  autoClearSearchValue={true}
                  onChange={(value) => {
                    const x: number | undefined = mergedTokenList.find(
                      (token) => token.mint.toString() === value.toString(),
                    )?.amount;
                    if (x !== undefined) {
                      setMaxAmount(x);
                    } else setMaxAmount(0);
                  }}
                >
                  {mergedTokenList.map((token, idx) => {
                    return (
                      <Option name={token.symbol} key={idx} value={token.mint}>
                        <styled.OptionWrapper>
                          <div className="icon-with-symbol">
                            <img src={token.icon} /> {token.symbol || 'unknown'}{' '}
                          </div>
                          <div>
                            {token.amount == undefined ? '' : token.amount}
                          </div>
                        </styled.OptionWrapper>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </styled.SelectWrapper>
            <styled.SelectWrapper>
              <h3>Output token:</h3>
              <Form.Item
                name="outputToken"
                rules={[{ required: true, message: 'Please select a token' }]}
              >
                <Select
                  className="select"
                  showSearch
                  placeholder={'Select a token'}
                  optionFilterProp="name"
                  filterOption={(input, option) =>
                    option?.name?.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  }
                >
                  {mergedTokenList.map((token, idx) => {
                    return (
                      <Option name={token.symbol} key={idx} value={token.mint}>
                        <styled.OptionWrapper>
                          <div className="icon-with-symbol">
                            <img src={token.icon} /> {token.symbol || 'unknown'}{' '}
                          </div>
                          <div>
                            {token.amount == undefined ? '' : token.amount}
                          </div>
                        </styled.OptionWrapper>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </styled.SelectWrapper>
            <styled.InputWrapper>
              <h3>
                Amount:{' '}
                {maxAmount === 0
                  ? ''
                  : '(balance: ' + Math.round(maxAmount * 1000) / 1000 + ')'}
              </h3>
              <div className="div-input-wrapper">
                <Form.Item
                  name="amount"
                  className="div-input-wrapper"
                  rules={[
                    {
                      required: true,
                      message: 'Please define an amount to swap',
                    },
                  ]}
                >
                  <Input
                    name="amount-input"
                    className="input-number"
                    type="number"
                    max={maxAmount}
                  ></Input>
                </Form.Item>
                <Button
                  onClick={() => {
                    antdForm.setFieldValue('amount', maxAmount);
                  }}
                >
                  MAX
                </Button>
              </div>
            </styled.InputWrapper>
            <Button htmlType="submit" className="form-button">
              Calculate best route
            </Button>
          </Form>

          {useableRoutes.length > 0 && mergedTokenList && searching ? (
            <styled.RoutesWrapper>
              {useableRoutes.slice(0, 2).map((route, idx) => {
                return (
                    <div key={idx}
                      className={
                        selectedRoute === idx
                          ? 'route-wrapper selected'
                          : 'route-wrapper'
                      }
                      onClick={() => setSelectedRoute(idx)}
                    >
                      <div className="section">
                        <h3 className="route">
                          {route.marketInfos[0].amm.label}
                        </h3>
                        <h3>
                          {Math.round(
                            (route.marketInfos[0].outAmount[0] /
                              10 ** getOutputDecimals(route)) *
                              100000,
                          ) / 100000}
                        </h3>
                      </div>
                      <div className="section">
                        <h4>
                          {mergedTokenList.find(
                            (value) =>
                              value.mint.toString() ===
                              route.marketInfos[0].inputMint.toString(),
                          )?.symbol +
                            '->' +
                            mergedTokenList.find(
                              (value) =>
                                value.mint.toString() ===
                                route.marketInfos[0].outputMint.toString(),
                            )?.symbol}
                        </h4>
                      </div>
                    </div>
                );
              })}
              {selectedRoute != undefined && routes && (
                <Button onClick={() => swap(selectedRoute)}>Swap</Button>
              )}
            </styled.RoutesWrapper>
          ) : (
            <>
              {attemptingSwap ? (
                <styled.LoadingSwap />
              ) : searching ? (
                'no routes found'
              ) : (
                ''
              )}
            </>
          )}
        </styled.wrapper>
      ) : (
        <h3>Please connect your wallet before attempting a swap.</h3>
      )}
    </>
  );
};

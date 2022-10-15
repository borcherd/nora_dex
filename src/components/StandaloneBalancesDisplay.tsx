import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSendConnection } from '../utils/connection';
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
  useTokenAccounts
} from '../utils/markets';
import { notify } from '../utils/notifications';
import { settleFunds } from '../utils/send';
import { Balances } from '../utils/types';
import { useWallet } from '../utils/wallet';
import DepositDialog from './DepositDialog';
import FloatingElement from './layout/FloatingElement';
import StandaloneTokenAccountsSelect from './StandaloneTokenAccountSelect';

const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const ActionButton = styled(Button)`
  font-size: 12px;
  display: 'inline-block';
  padding-right: 15px;
  padding-left: 15px;
  border-radius: 4px;
`;

export default function StandaloneBalancesDisplay() {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const balances = useBalances();
  const openOrdersAccount = useSelectedOpenOrdersAccount(true);
  const connection = useSendConnection();
  const { wallet, connected } = useWallet();
  const [baseOrQuote, setBaseOrQuote] = useState('');
  const baseCurrencyAccount = useSelectedBaseCurrencyAccount();
  const quoteCurrencyAccount = useSelectedQuoteCurrencyAccount();
  const [tokenAccounts] = useTokenAccounts();
  const baseCurrencyBalances =
    balances && balances.find((b) => b.coin === baseCurrency);
  const quoteCurrencyBalances =
    balances && balances.find((b) => b.coin === quoteCurrency);
  
  async function onSettleFunds() {
    if (!wallet) {
      notify({
        message: 'Wallet not connected',
        description: 'wallet is undefined',
        type: 'error',
      });
      return;
    }

    if (!market) {
      notify({
        message: 'Error settling funds',
        description: 'market is undefined',
        type: 'error',
      });
      return;
    }
    if (!openOrdersAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined 1',
        type: 'error',
      });
      return;
    }
    if (!baseCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined 2',
        type: 'error',
      });
      return;
    }
    if (!quoteCurrencyAccount) {
      notify({
        message: 'Error settling funds',
        description: 'Open orders account is undefined 3',
        type: 'error',
      });
      return;
    }

    try {
      await settleFunds({
        market,
        openOrders: openOrdersAccount,
        connection,
        wallet,
        baseCurrencyAccount,
        quoteCurrencyAccount,
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: 'error',
        type: 'error',
      });
    }
  }

  const formattedBalances: [
    string | undefined,
    Balances | undefined,
    string,
    string | undefined,
  ][] = [
    [
      baseCurrency,
      baseCurrencyBalances,
      'base',
      market?.baseMintAddress.toBase58(),
    ],
    [
      quoteCurrency,
      quoteCurrencyBalances,
      'quote',
      market?.quoteMintAddress.toBase58(),
    ],
  ];
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 9 }}>
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid #1C274F',
          fontSize: 14,
          paddingBottom: 12,
        }}
      >
        Wallet Balance
      </div>
      <div style={{ paddingRight: 10 }}>
        <Row
          style={{
            marginTop: 16,
            color: 'rgba(241, 241, 242, 0.5)',
            fontSize: 12,
            textAlign: 'right',
          }}
        >
          <Col span={6} style={{ textAlign: 'left' }}>
            Asset
          </Col>
          <Col span={9}>Wallet balance</Col>
        </Row>
        {formattedBalances.map(
          ([currency, balances, baseOrQuote, mint], index) => (
            <React.Fragment key={index}>
              <Row
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: 'rgba(241, 241, 242, 1)',
                  textAlign: 'right',
                  paddingBottom: 18,
                }}
              >
                <Col
                  span={6}
                  style={{
                    color: 'rgba(241, 241, 242, 0.5)',
                    textAlign: 'left',
                  }}
                >
                  {currency}
                </Col>
                <Col span={9}>{balances && balances.wallet}</Col>
                <Col span={6} style={{ paddingTop: 8 }}></Col>
                <Col span={9} style={{ paddingTop: 8 }}>
                  {/* <ActionButton
                    size="small"
                    onClick={() => setBaseOrQuote(baseOrQuote)}
                  >
                    Deposit
                  </ActionButton> */}
                </Col>
              </Row>

              {connected && (
                <RowBox
                  align="middle"
                  style={{
                    paddingBottom: 10,
                    borderBottom: '1px solid #1C274F',
                  }}
                >
                  <StandaloneTokenAccountsSelect
                    accounts={tokenAccounts
                      ?.filter(
                        (account) => account.effectiveMint.toBase58() === mint,
                      )
                      .sort((a, b) =>
                        a.pubkey.toString() === wallet?.publicKey.toString()
                          ? -1
                          : 1,
                      )}
                    mint={mint}
                    label
                  />
                </RowBox>
              )}
            </React.Fragment>
          ),
        )}
      </div>
      <DepositDialog
        baseOrQuote={baseOrQuote}
        onClose={() => setBaseOrQuote('')}
      />
    </FloatingElement>
  );
}

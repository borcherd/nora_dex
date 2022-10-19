import React, { Children, useMemo } from 'react';
import ConvertForm from '../components/ConvertForm';
import { Row, Col } from 'antd';
import { DEFAULT_MARKET, MarketProvider } from '../utils/markets';
import { useLocalStorageState } from '../utils/utils';
import { ConnectionProvider, useConnection } from 'utils/connection';
import { Connection } from '@solana/web3.js';
import { useWallet, WalletProvider } from 'utils/wallet';
import styled from '@emotion/styled';



const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function DashboardPage() { 

  return (<></>

  );
}

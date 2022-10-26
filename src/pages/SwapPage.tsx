import React, { Children, useMemo } from 'react';
import ConvertForm from '../components/ConvertForm';
import { Row, Col } from 'antd';
import { DEFAULT_MARKET, MarketProvider } from '../utils/markets';
import { useLocalStorageState } from '../utils/utils';
import { Connection } from '@solana/web3.js';
import styled from '@emotion/styled';
import { JupiterApp } from 'components/jupiter/JupiterApp';



const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function SwapPage() { 

  return (
    <Wrapper style={{ flex: 1, paddingTop: 10, alignItems:'center' }}>
    <JupiterApp/>
    </Wrapper>
  );
}

import React, { Suspense } from 'react';
import './App.less';
import { ConnectionProvider } from './utils/connection';
import { WalletProvider } from './utils/wallet';
import { GlobalStyle } from './global_style';
import { Global } from '@emotion/react';
import { Spin } from 'antd';
import { RoutesComp } from './routes';
import { ReferrerProvider } from './utils/referrer';
import { JupiterAppProvider } from 'components/jupiter/JupiterAppProvider';

export default function App() {
  return (
    <Suspense fallback={() => <Spin size="large" />}>
      <Global styles={GlobalStyle} />
      <ConnectionProvider>
        <ReferrerProvider>
          <WalletProvider>
              <Suspense fallback={() => <Spin size="large" />}>
                <RoutesComp />
              </Suspense>
          </WalletProvider>
        </ReferrerProvider>
      </ConnectionProvider>
    </Suspense>
  );
}

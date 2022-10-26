import React, { Suspense } from 'react';
import './App.less';
import { GlobalStyle } from './global_style';
import { Global } from '@emotion/react';
import { Spin } from 'antd';
import { RoutesComp } from './routes';
import { ReferrerProvider } from './utils/referrer';
import { JupiterAppProvider } from 'components/jupiter/JupiterAppProvider';
import { ContextProvider } from 'contexts';

export default function App() {
  return (
    <Suspense fallback={() => <Spin size="large" />}>
      <Global styles={GlobalStyle} />
      <ContextProvider>
        <ReferrerProvider>
          <JupiterAppProvider>
            <Suspense fallback={() => <Spin size="large" />}>
              <RoutesComp />
            </Suspense>
          </JupiterAppProvider>
        </ReferrerProvider>
      </ContextProvider>
    </Suspense>
  );
}

import { HashRouter, Route, Routes } from 'react-router-dom';
import TradePage from './pages/TradePage';
import OpenOrdersPage from './pages/OpenOrdersPage';
import React from 'react';
import BalancesPage from './pages/BalancesPage';
import SwapPage from './pages/SwapPage';
import BasicLayout from './components/BasicLayout';
import ListNewMarketPage from './pages/ListNewMarketPage';
import NewPoolPage from './pages/pools/NewPoolPage';
import PoolPage from './pages/pools/PoolPage';
import PoolListPage from './pages/pools/PoolListPage';
import DashboardPage from 'pages/DashboardPage';

export function RoutesComp() {
  return (
    <>
      <HashRouter basename={'/'}>
        <BasicLayout>
          <Routes>
            <Route path="/" element={<TradePage />} />
            <Route
              path="/trade/market/:marketAddress"
              element={<TradePage />}
            />
            <Route path="/orders" element={<OpenOrdersPage />} />
            <Route path="/balances" element={<BalancesPage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/list-new-market" element={<ListNewMarketPage />} />
            <Route path="/pools" element={<PoolListPage />} />
            <Route path="/pools/new" element={<NewPoolPage />} />
            <Route path="/pools/:poolAddress" element={<PoolPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </BasicLayout>
      </HashRouter>
    </>
  );
}

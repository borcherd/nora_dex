import { Col, Row, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo_white_text from '../assets/logo_white_text.png'
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import { getTradePageUrl } from '../utils/markets';
import { PRIMARY_PINK } from 'consts/colors.consts';
import styled from '@emotion/styled';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-ant-design';

const Wrapper = styled.div`
  background: transparent; 

  // flex-direction: row;
  // justify-content: flex-end;
  // flex-wrap: wrap;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  color:${PRIMARY_PINK};
  font-weight: bold;
  cursor: pointer;
  img {
    height: 30px;
    margin-right: 8px;
  }
`;

const MENU = [
  {
    title: 'Trading',
    link: '/',
  },
  {
    title: 'Swap',
    link: '/#/swap',
  },
  {
    title: 'Dashboard',
    link: '/#/dashboard',
  },

];

export default function TopBar() {
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useNavigate();

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  const { SubMenu } = Menu;

  const menuDiv = (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={['Trading']}
      selectedKeys={[location.pathname]}
      style={{
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems:'center'
      }}
    >
      {MENU.map((item) => {
        return (
          <Menu.Item key={item.title}>
            <a
              href={item.link}
              target={item.link.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <>
      
      <Wrapper >
        <Row wrap={false} style={{ paddingTop: 25, height: 70 }}>
          <Col flex="none">
            <LogoWrapper
              onClick={() => history(tradePageUrl)}
            >
              <img src={logo_white_text} alt="" style={{ paddingLeft:'5px' }} />
            </LogoWrapper>
          </Col>
          <Col flex="auto" style={{ alignContent: 'center' }}>
            {menuDiv}
          </Col>
          <Col flex="none" style={{ paddingRight: 20 }}>
            <WalletConnect/>
          </Col>
        </Row>
      </Wrapper>
    </>
  );
}

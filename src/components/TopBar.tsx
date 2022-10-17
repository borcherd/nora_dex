import { Col, Row, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo_white_text from '../assets/logo_white_text.png'
import styled from 'styled-components';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import { getTradePageUrl } from '../utils/markets';
import { PRIMARY_PINK } from 'consts/colors.consts';

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
  const { endpointInfo, setEndpoint, availableEndpoints, setCustomEndpoints } =
    useConnectionConfig();
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(
      (e) => e.endpoint === info.endpoint,
    );
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });
      return;
    }

    const handleError = (e) => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getEpochInfo()
        .then((result) => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [
            ...availableEndpoints.filter((e) => e.custom),
            info,
          ];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

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
      <CustomClusterEndpointDialog
        visible={addEndpointVisible}
        testingConnection={testingConnection}
        onAddCustomEndpoint={onAddCustomEndpoint}
        onClose={() => setAddEndpointVisible(false)}
      />
      <Wrapper >
        <Row wrap={false} style={{ paddingTop: 25, height: 70 }}>
          <Col flex="none">
            <LogoWrapper
              onClick={() => history.push(tradePageUrl)}
            >
              <img src={logo_white_text} alt="" style={{ paddingLeft:'5px' }} />
            </LogoWrapper>
          </Col>
          <Col flex="auto" style={{ alignContent: 'center' }}>
            {menuDiv}
          </Col>
          <Col flex="none" style={{ paddingRight: 20 }}>
            <WalletConnect />
          </Col>
        </Row>
      </Wrapper>
    </>
  );
}

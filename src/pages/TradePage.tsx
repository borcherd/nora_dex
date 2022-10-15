import { DeleteOutlined } from '@ant-design/icons';
import { Col, Row, Select } from 'antd';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CustomMarketDialog from '../components/CustomMarketDialog';
import DeprecatedMarketsInstructions from '../components/DeprecatedMarketsInstructions';
import Orderbook from '../components/Orderbook';
import StandaloneBalancesDisplay from '../components/StandaloneBalancesDisplay';
import TradeForm from '../components/TradeForm';
import TradesTable from '../components/TradesTable';
import { TVChartContainer } from '../components/TradingView';
import UserInfoTable from '../components/UserInfoTable';
import {
  getMarketInfos,
  getTradePageUrl,
  MarketProvider,
  useMarket,
  useMarketsList,
  useMarkPrice,
  useUnmigratedDeprecatedMarkets,
} from '../utils/markets';
import { notify } from '../utils/notifications';
import { MarketInfo } from '../utils/types';

const { Option, OptGroup } = Select;

const Wrapper = styled.div`
background: rgb(28,28,28);
background: radial-gradient(circle, rgba(28,28,28,1) 0%, rgba(6,6,6,1) 50%, rgba(25,31,88,1) 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function TradePage() {
  const { marketAddress } = useParams();
  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);
  const history = useHistory();
  function setMarketAddress(address) {
    history.push(getTradePageUrl(address));
  }

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >
      <TradePageInner />
    </MarketProvider>
  );
}

function TradePageInner() {
  const {
    market,
    marketName,
    customMarkets,
    setCustomMarkets,
    setMarketAddress,
  } = useMarket();
  const [handleDeprecated, setHandleDeprecated] = useState(false);
  const [addMarketVisible, setAddMarketVisible] = useState(false);
  const deprecatedMarkets = useUnmigratedDeprecatedMarkets();
  const markPrice = useMarkPrice();

  const [dimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    document.title = marketName ? `${marketName} ` : 'DEX';
  }, [marketName]);

  const changeOrderRef =
    useRef<({ size, price }: { size?: number; price?: number }) => void>();


  const width = dimensions?.width;

  const componentProps = {
    onChangeOrderRef: (ref) => (changeOrderRef.current = ref),
    onPrice: useCallback(
      (price) => changeOrderRef.current && changeOrderRef.current({ price }),
      [],
    ),
    onSize: useCallback(
      (size) => changeOrderRef.current && changeOrderRef.current({ size }),
      [],
    ),
    market: market,
  };
  const component = (() => {
    if (handleDeprecated) {
      return (
        <DeprecatedMarketsPage
          switchToLiveMarkets={() => setHandleDeprecated(false)}
        />
      );
    } else if (width < 1000) {
      return <RenderSmaller {...componentProps} />;
    } else {
      return <RenderNormal {...componentProps} />;
    }
  })();

  const onAddCustomMarket = (customMarket) => {
    const marketInfo = getMarketInfos(customMarkets).some(
      (m) => m.address.toBase58() === customMarket.address,
    );
    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      });
      return;
    }
    const newCustomMarkets = [...customMarkets, customMarket];
    setCustomMarkets(newCustomMarkets);
    setMarketAddress(customMarket.address);
  };

  const onDeleteCustomMarket = (address) => {
    const newCustomMarkets = customMarkets.filter((m) => m.address !== address);
    setCustomMarkets(newCustomMarkets);
  };

  return (
    <>
      <CustomMarketDialog
        visible={addMarketVisible}
        onClose={() => setAddMarketVisible(false)}
        onAddCustomMarket={onAddCustomMarket}
      />
      <Wrapper>
        <Row
          align="middle"
          style={{ paddingLeft: 5, paddingRight: 5, height: 64 }}
          gutter={16}
        >
          <Col>
            <MarketSelector
              markets={useMarketsList()}
              setHandleDeprecated={setHandleDeprecated}
              placeholder={'Select market'}
              customMarkets={customMarkets}
              onDeleteCustomMarket={onDeleteCustomMarket}
            />
          </Col>
          <Col>
            <Row>Price</Row>
            <Row>{markPrice != null ? '$ ' + markPrice : ''}</Row>
          </Col>
        </Row>
        {component}
      </Wrapper>
    </>
  );
}

function MarketSelector({
  markets,
  placeholder,
  setHandleDeprecated,
  customMarkets,
  onDeleteCustomMarket,
}) {
  const { market, setMarketAddress } = useMarket();

  const onSetMarketAddress = (marketAddress) => {
    setHandleDeprecated(false);
    setMarketAddress(marketAddress);
  };

  const selectedMarket = getMarketInfos(customMarkets)
    .find(
      (proposedMarket) =>
        market?.address && proposedMarket.address.equals(market.address),
    )
    ?.address?.toBase58();

  const uniqueArray = (arr) => {
    let addList: string[] = [];
    let reList: MarketInfo[] = [];
    for (let index = 0; index < arr.length; index += 1) {
      if (addList.indexOf(arr[index].address.toBase58()) === -1) {
        reList.push(arr[index]);
        addList.push(arr[index].address.toBase58());
      }
    }
    return reList;
  };

  return (
    <Select
      showSearch
      size={'large'}
      bordered={false}
      style={{ width: 360, border: 1 }}
      placeholder={placeholder || 'Select a market'}
      optionFilterProp="name"
      onSelect={onSetMarketAddress}
      listHeight={400}
      value={selectedMarket}
      filterOption={(input, option) =>
        option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {customMarkets && customMarkets.length > 0 && (
        <OptGroup label="Custom">
          {customMarkets.map(({ address, name }, i) => (
            <Option
              value={address}
              key={nanoid()}
              name={name}
              style={{
                padding: '10px',
                // @ts-ignore
                backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
              }}
            >
              <Row>
                <Col flex="auto">{name}</Col>
                {selectedMarket !== address && (
                  <Col>
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        onDeleteCustomMarket && onDeleteCustomMarket(address);
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Option>
          ))}
        </OptGroup>
      )}
      <OptGroup label="Markets">
        {uniqueArray(markets).map(({ address, name, deprecated }, i) => (
          <Option
            value={address.toBase58()}
            key={nanoid()}
            name={name}
            style={{
              padding: '10px',
              // @ts-ignore
              backgroundColor: i % 2 === 0 ? 'rgb(39, 44, 61)' : null,
            }}
          >
            {name} {deprecated ? ' (Deprecated)' : null}
          </Option>
        ))}
      </OptGroup>
    </Select>
  );
}

const DeprecatedMarketsPage = ({ switchToLiveMarkets }) => {
  return (
    <>
      <Row>
        <Col flex="auto">
          <DeprecatedMarketsInstructions
            switchToLiveMarkets={switchToLiveMarkets}
          />
        </Col>
      </Row>
    </>
  );
};

const RenderNormal = ({ onChangeOrderRef, onPrice, onSize, market }) => {
  return (
    <Row
      style={{
        minHeight: '900px',
        flexWrap: 'nowrap',
      }}
    >
      <Col
        flex="15%"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '280px',
        }}
      >
        <TradeForm setChangeOrderRef={onChangeOrderRef} />
        <StandaloneBalancesDisplay />
      </Col>

      <Col
        flex="auto"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <TVChartContainer />
        <UserInfoTable smallScreen={false} market={market} />
      </Col>

      <Col flex="15%" style={{ height: '100%', minWidth: '280px' }}>
        <Orderbook smallScreen={false} onPrice={onPrice} onSize={onSize} />
        <TradesTable smallScreen={false} />
      </Col>
    </Row>
  );
};

const RenderSmaller = ({ onChangeOrderRef, onPrice, onSize, market }) => {
  return (
    <>
      <Row>
        <Col span={24}>
           <TVChartContainer /> 
        </Col>

        <Col span={16}>
          <TradeForm setChangeOrderRef={onChangeOrderRef} />
        </Col>
        <Col span={8}>
          <Orderbook smallScreen={true} onPrice={onPrice} onSize={onSize} />
        </Col>

        <Col span={24}>
          <UserInfoTable smallScreen={true} market={market} />
        </Col>

        <Col xs={24} sm={12}>
          <StandaloneBalancesDisplay />
        </Col>
        <Col xs={24} sm={12}>
          <TradesTable smallScreen={false} />
        </Col>
      </Row>
    </>
  );
};

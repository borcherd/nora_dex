import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import LinkAddress from './LinkAddress';
import styled from '@emotion/styled';
import { WalletMultiButton } from '@solana/wallet-adapter-ant-design';

export const ButtonWrapper = styled.div({
  '.wallet-multi-button':{
    display:'flex',
    gap:'15px',
    justifyContent:'center',
    alignItems:'center'
  }
});

export default function WalletConnect() {
  return (
    <ButtonWrapper>
      <WalletMultiButton className={'wallet-multi-button'}/>
    </ButtonWrapper>
  );
}

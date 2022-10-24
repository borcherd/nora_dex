import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const wrapper = styled.div({
  textAlign: 'center',
  bottom: '0',
  display: 'flex',
  gap: '20px',
  flexDirection: 'column',
  width: 'max-content',

  Button: { justifyContent: 'center', display: 'flex', alignItems: 'center' },
});

export const SelectWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',

  '.select': {
    width: 360,
    border: 1,
    borderRadius: '12px',
  },
});

export const OptionWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: '5px',
  img: {
    height: '24px',
    width: 'auto',
    // opacity:'25%'
  },
  '.icon-with-symbol': {
    alignItems: 'center',
    display: 'flex',
    gap: '5px',
  },
});

export const InputWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '.div-input-wrapper': {
    display: 'flex',
    flexDirection: 'row-reverse',

    '.input-number': {
      width: 360,
      display: 'flex',
    },
  },
  Button: {
    position: 'absolute',
    backgroundColor: 'black !important',
  },
});

export const RoutesWrapper = styled.div({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',

  '& .selected': {
    border: '3px solid white !important',
  },

  '.route-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    padding: '5px',
    border: '1px solid  #434343',
    width: 360,

    '.section': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '10px',

      '.route': {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  },
});

const rotate360 = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

export const LoadingSwap = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);

  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  align-self: center;
`;

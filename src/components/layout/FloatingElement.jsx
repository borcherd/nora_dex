import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div``;

export default function FloatingElement({ style, children, stretchVertical }) {
  return (
    <Wrapper
      style={{
        height: stretchVertical ? 'calc(100% - 10px)' : undefined,
        ...style,
      }}
    >
      {children}
    </Wrapper>
  );
}

import {  css } from '@emotion/react';

import {
  PRIMARY_BLUE,
  PRIMARY_PINK,
  SECONDARY_BLUE,
} from '../src/consts/colors.consts';

export const GlobalStyle = css`
  html,
  body {
    background: #11161d;
  }
  input[type='number']::-webkit-inner-spin-button {
    opacity: 0;
  }
  input[type='number']:hover::-webkit-inner-spin-button,
  input[type='number']:focus::-webkit-inner-spin-button {
    opacity: 0.25;
  }.ant-slider-track, .ant-slider:hover .ant-slider-track {
    background-color: ${PRIMARY_PINK};
    opacity: 0.75;
  }
  .ant-slider-track,
  .ant-slider ant-slider-track:hover {
    background-color: ${PRIMARY_PINK};
    opacity: 0.75;
  }
  .ant-slider-dot-active,
  .ant-slider-handle,
  .ant-slider-handle-click-focused,
  .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open)  {
    border: 2px solid ${PRIMARY_PINK}; 
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #273043;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 8px solid #1A2029;
  }
  .ant-table-container table > thead > tr:first-child th {
    border-bottom: none;
  }
  .ant-divider-horizontal.ant-divider-with-text::before, .ant-divider-horizontal.ant-divider-with-text::after {
    border-top: 1px solid #434a59 !important;
  }
  .ant-layout { 
    background: rgb(28,28,28);
    background: radial-gradient(circle, rgba(28,28,28,1) 0%, rgba(6,6,6,1) 50%, rgba(25,31,88,1) 100%);
  
    
    }
    .ant-table {
      background: #212734;
    }
    .ant-table-thead > tr > th {
      background: #1A2029;
    }
  .ant-select-item-option-content {
    img {
      margin-right: 4px;
    }
  }
  .ant-modal-content {
    background: rgb(28, 28, 28);
    
  }
  
  @-webkit-keyframes highlight {
    from { background-color: ${PRIMARY_PINK};}
    to {background-color: #1A2029;}
  }
  @-moz-keyframes highlight {
    from { background-color: ${PRIMARY_PINK};}
    to {background-color: #1A2029;}
  }
  @-keyframes highlight {
    from { background-color: ${PRIMARY_PINK};}
    to {background-color: #1A2029;}
  }
  .flash {
    -moz-animation: highlight 0.5s ease 0s 1 alternate ;
    -webkit-animation: highlight 0.5s ease 0s 1 alternate;
    animation: highlight 0.5s ease 0s 1 alternate;
  }`;

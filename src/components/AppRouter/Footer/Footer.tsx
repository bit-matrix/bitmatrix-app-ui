import React from 'react';
import { Icon } from 'rsuite';
import './Footer.scss';

export const Footer = (): JSX.Element => {
  return (
    <div className="swap-page-footer">
      <div className="swap-page-footer-icons">
        <a href="https://medium.com/bit-matrix" className="swap-page-footer-icon-item">
          <Icon className="swap-page-footer-icon" icon="medium" />
        </a>
        <a href="https://twitter.com/bitmatrix_" className="swap-page-footer-icon-item">
          <Icon className="swap-page-footer-icon" icon="twitter" />
        </a>
        <a href="https://t.me/bitmatrix_community" className="swap-page-footer-icon-item">
          <Icon className="swap-page-footer-icon" icon="telegram" />
        </a>
        <a href="https://github.com/bit-matrix" className="swap-page-footer-icon-item">
          <Icon className="swap-page-footer-icon" icon="github" />
        </a>
      </div>
    </div>
  );
};

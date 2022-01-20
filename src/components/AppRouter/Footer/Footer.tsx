import React from 'react';
// import { Icon } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Footer.scss';
import { faGithub, faMedium, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';

export const Footer = (): JSX.Element => {
  return (
    <div className="swap-page-footer">
      <div className="swap-page-footer-icons">
        <a href="https://medium.com/bit-matrix" target="_blank" className="swap-page-footer-icon-item">
          <FontAwesomeIcon icon={faMedium} size="2x" />
        </a>
        <a href="https://twitter.com/bitmatrix_" target="_blank" className="swap-page-footer-icon-item">
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
        <a href="https://t.me/bitmatrix_community" target="_blank" className="swap-page-footer-icon-item">
          <FontAwesomeIcon icon={faTelegram} size="2x" />
        </a>
        <a href="https://github.com/bit-matrix" target="_blank" className="swap-page-footer-icon-item">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>
    </div>
  );
};

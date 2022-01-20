import React from 'react';
import MediumIcon from '../../base/Svg/Icons/Medium';
import TwitterIcon from '../../base/Svg/Icons/Twitter';
import TelegramIcon from '../../base/Svg/Icons/Telegram';
import GithubIcon from '../../base/Svg/Icons/Github';
import './Footer.scss';

export const Footer = (): JSX.Element => {
  return (
    <div className="swap-page-footer">
      <div className="swap-page-footer-icons">
        <a href="https://medium.com/bit-matrix" target="_blank" className="swap-page-footer-icon-item medium-icon-item">
          <MediumIcon />
        </a>
        <a
          href="https://twitter.com/bitmatrix_"
          target="_blank"
          className="swap-page-footer-icon-item twitter-icon-item"
        >
          <TwitterIcon />
        </a>
        <a
          href="https://t.me/bitmatrix_community"
          target="_blank"
          className="swap-page-footer-icon-item telegram-icon-item"
        >
          <TelegramIcon />
        </a>
        <a href="https://github.com/bit-matrix" target="_blank" className="swap-page-footer-icon-item github-icon-item">
          <GithubIcon />
        </a>
      </div>
    </div>
  );
};

import React from 'react';
import info from '../../../images/info2.png';
import './Theme.scss';

export const Theme = (): JSX.Element => {
  return (
    <div>
      <div className="theme-item">
        <div className="theme-item-head">
          <span className="theme-title">Standard Themes</span>
          <img className="theme-icon" src={info} alt="info" />
        </div>
      </div>
      <div className="theme-item">
        <div className="theme-item-head">
          <span className="theme-title">Exclusive Themes</span>
          <img className="theme-icon" src={info} alt="info" />
        </div>
      </div>
    </div>
  );
};

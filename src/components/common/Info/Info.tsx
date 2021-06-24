import React from 'react';
import { Icon } from 'rsuite';
import info from '../../../images/info.png';
import './Info.scss';

type Props = {
  content: string;
};

export const Info: React.FC<Props> = ({ content }) => {
  return (
    <div id="wrap" className="swap-footer-tab">
      <div id="one" className="swap-footer-tab-one">
        <img className="info-img" src={info} alt="" />
      </div>
      <div id="two" className="swap-footer-tab-two">
        {content}
      </div>
      <Icon className="info-close-icon" icon="close" />
    </div>
  );
};

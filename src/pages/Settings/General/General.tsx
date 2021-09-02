import React from 'react';
import { CheckBox } from '../../../components/CheckBox/CheckBox';
import { SliderOption } from '../../../components/SliderOption/SliderOption';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import info from '../../../images/info2.png';
import './General.scss';

export const General = (): JSX.Element => {
  return (
    <div>
      <div>
        <div className="general-item-head">
          <span className="general-title">Slippage & Fee</span>
          <img className="general-icon" src={info} alt="info" />
        </div>
        {/* <SliderOption options={['%0.5', '%0.75', '%1', '%1.25', '%1.5']} /> */}
      </div>
      <div>
        <div className="general-item-head">
          <span className="general-title">Preferred Unit</span>
          <img className="general-icon" src={info} alt="info" />
        </div>
        <div>
          <CheckBox title="L-BTC" />
          <CheckBox title="mBTC" />
          <CheckBox title="µBTC" />
          <CheckBox title="SAT" />
        </div>
      </div>
      <div>
        <div className="general-item-head">
          <span className="general-title">Push Notifications</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch />
        </div>
      </div>
      <div>
        <div className="general-item-head">
          <span className="general-title">Liquid Taxi</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch />
        </div>
      </div>
    </div>
  );
};

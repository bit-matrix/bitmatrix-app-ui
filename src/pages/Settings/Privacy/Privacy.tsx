import React, { useState } from 'react';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import info from '../../../images/info2.png';
import './Privacy.scss';

const confidentialityOptions: Array<string> = [
  'Very Low',
  'Low',
  'Medium',
  'High',
  'VeryHigh',
];

const obfiscationOptions: Array<string> = ['5x', '10x', '25x', '50x', '100x'];

export const Privacy = (): JSX.Element => {
  const [confidentalSwapsSwitch, setConfidentalSwapsSwitch] =
    useState<boolean>(false);

  const [confidentialityOption, setConfidentialityOption] =
    useState<string>('');

  const [coinJoinSwitch, setCoinJoinSwitch] = useState<boolean>(false);

  const [obfiscationOption, setObfiscationOption] = useState<string>('');

  const [torSwitch, setTorSwitch] = useState<boolean>(false);

  return (
    <div>
      <div className="privacy-first-item">
        <div className="privacy-item-head">
          <span className="privacy-title">Confidential Swaps</span>
          <img className="privacy-icon" src={info} alt="info" />
          <ToggleSwitch
            onChange={(checked) => setConfidentalSwapsSwitch(checked)}
            checked={confidentalSwapsSwitch}
          />
        </div>
      </div>
      <div className="privacy-item">
        <div className="privacy-item-head">
          <span className="privacy-sub-title">Confidentiality: </span>
        </div>
        <StripedRadioButton
          key={confidentialityOption}
          options={confidentialityOptions}
          selectedOption={confidentialityOption}
          onChange={(option) => setConfidentialityOption(option)}
        />
      </div>
      <div className="privacy-third-item">
        <div className="privacy-item-head">
          <span className="privacy-title">Coin Join</span>
          <img className="privacy-icon" src={info} alt="info" />
          <ToggleSwitch
            onChange={(checked) => setCoinJoinSwitch(checked)}
            checked={coinJoinSwitch}
          />
        </div>
      </div>
      <div className="privacy-item">
        <div className="privacy-item-head">
          <span className="privacy-sub-title">Obfiscation: </span>
        </div>
        <StripedRadioButton
          key={obfiscationOption}
          options={obfiscationOptions}
          selectedOption={obfiscationOption}
          onChange={(option) => setObfiscationOption(option)}
        />
      </div>
      <div className="privacy-item">
        <div className="privacy-item-head">
          <span className="privacy-title">Tor</span>
          <img className="privacy-icon" src={info} alt="info" />
          <ToggleSwitch
            className="tor-switch"
            onChange={(checked) => setTorSwitch(checked)}
            checked={torSwitch}
          />
        </div>
      </div>
    </div>
  );
};

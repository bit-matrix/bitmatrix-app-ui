import React, { useState } from 'react';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import info from '../../../images/info2.png';
import './Privacy.scss';

enum Confidentiality {
  VERY_LOW = 'Very Low',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  VERY_HIGH = 'Very High',
}

const confidentialityOptions: Array<string> = [
  Confidentiality.VERY_LOW,
  Confidentiality.LOW,
  Confidentiality.MEDIUM,
  Confidentiality.HIGH,
  Confidentiality.VERY_HIGH,
];

enum Obfiscation {
  FIVE = '5x',
  TEN = '10x',
  TWENTYFIVE = '25x',
  FIFTY = '50x',
  HUNDRED = '100x',
}

const obfiscationOptions: Array<string> = [
  Obfiscation.FIVE,
  Obfiscation.TEN,
  Obfiscation.TWENTYFIVE,
  Obfiscation.FIFTY,
  Obfiscation.HUNDRED,
];

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

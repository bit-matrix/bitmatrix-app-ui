import React, { useState } from 'react';
import { useContext } from 'react';
import { CheckBoxGroup } from '../../../components/CheckBoxGroup/CheckBoxGroup';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import SettingsContext from '../../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../../context/SETTINGS_ACTION_TYPES';
import info from '../../../images/info2.png';
import './General.scss';

enum PreferredUnit {
  LBTC = 'L-BTC',
  mBTC = 'mBTC',
  uBTC = 'µBTC',
  SAT = 'SAT',
}

const preferredUnitOptions = [
  PreferredUnit.LBTC,
  PreferredUnit.mBTC,
  PreferredUnit.uBTC,
  PreferredUnit.SAT,
];

enum SlippageFee {
  ZEROPOINTFIVE = '%0.5',
  ZEROPOINTSEVENTYFIVE = '%0.75',
  ONEPOINT = '%1',
  ONEPOINTTWENTYFIVE = '%1.25',
  ONEPOINTFIVE = '%1.5',
}

const SlippageFeeList = [
  {
    text: SlippageFee.ZEROPOINTFIVE,
    value: 200,
  },
  {
    text: SlippageFee.ZEROPOINTSEVENTYFIVE,
    value: 133,
  },
  {
    text: SlippageFee.ONEPOINT,
    value: 100,
  },
  {
    text: SlippageFee.ONEPOINTTWENTYFIVE,
    value: 80,
  },
  {
    text: SlippageFee.ONEPOINTFIVE,
    value: 66,
  },
];

const slippageFeeOptions = [
  SlippageFee.ZEROPOINTFIVE,
  SlippageFee.ZEROPOINTSEVENTYFIVE,
  SlippageFee.ONEPOINT,
  SlippageFee.ONEPOINTTWENTYFIVE,
  SlippageFee.ONEPOINTFIVE,
];

export const General = (): JSX.Element => {
  const [checkedValues, setCheckedValues] = useState<Array<string>>([]);
  const [pushNotificationsSwitch, setPushNotificationsSwitch] =
    useState<boolean>(false);
  const [liquidTaxiSwitch, setLiquidTaxiSwitch] = useState<boolean>(false);
  const { dispatch, payloadData } = useContext(SettingsContext);

  return (
    <div>
      <div className="general-item">
        <div className="general-item-first-head">
          <span className="general-title">Slippage Tolerance</span>
          <img className="general-icon" src={info} alt="info" />
        </div>
        <StripedRadioButton
          options={slippageFeeOptions}
          selectedOption={
            SlippageFeeList.find((sf) => sf.value === payloadData.slippage)
              ?.text || ''
          }
          onChange={(option) => {
            const selectedoOption = SlippageFeeList.find(
              (sf) => sf.text === option,
            )?.value;

            dispatch({
              type: SETTINGS_ACTION_TYPES.SET_SLIPPAGE,
              payload: { slippage: selectedoOption || 200 },
            });
          }}
        />
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Preferred Unit</span>
          <img className="general-icon" src={info} alt="info" />
        </div>

        <CheckBoxGroup
          className="prefferred-unit"
          options={preferredUnitOptions}
          onChange={(checkedValues: Array<string>) => {
            setCheckedValues(checkedValues);
          }}
          checkedValues={checkedValues}
        />
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Push Notifications</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch
            onChange={(checked) => setPushNotificationsSwitch(checked)}
            checked={pushNotificationsSwitch}
          />
        </div>
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Liquid Taxi</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch
            onChange={(checked) => setLiquidTaxiSwitch(checked)}
            checked={liquidTaxiSwitch}
          />
        </div>
      </div>
    </div>
  );
};

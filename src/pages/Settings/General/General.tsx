import React, { useState } from 'react';
import { useContext } from 'react';
import { CheckBoxGroup } from '../../../components/CheckBoxGroup/CheckBoxGroup';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import SettingsContext from '../../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../../context/SETTINGS_ACTION_TYPES';
import { PREFERRED_UNIT } from '../../../enum/PREFERRED_UNIT';
import { SLIPPAGE_FEE } from '../../../enum/SLIPPAGE_FEE';
import info from '../../../images/info2.png';
import './General.scss';

const preferredUnitOptions = [
  PREFERRED_UNIT.LBTC,
  PREFERRED_UNIT.mBTC,
  PREFERRED_UNIT.uBTC,
  PREFERRED_UNIT.SAT,
];

const slippageFeeOptions = [
  SLIPPAGE_FEE.ZEROPOINTTHREE,
  SLIPPAGE_FEE.ZEROPOINTFIVE,
  SLIPPAGE_FEE.ZEROPOINTSEVENTYFIVE,
  SLIPPAGE_FEE.ONEPOINT,
  SLIPPAGE_FEE.ONEPOINTTWENTYFIVE,
  SLIPPAGE_FEE.ONEPOINTFIVE,
];

const SlippageFeeList = [
  {
    text: SLIPPAGE_FEE.ZEROPOINTFIVE,
    value: 333,
  },
  {
    text: SLIPPAGE_FEE.ZEROPOINTFIVE,
    value: 200,
  },
  {
    text: SLIPPAGE_FEE.ZEROPOINTSEVENTYFIVE,
    value: 133,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINT,
    value: 100,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINTTWENTYFIVE,
    value: 80,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINTFIVE,
    value: 66,
  },
];

export const General = (): JSX.Element => {
  const [checkedValue, setCheckedValue] = useState<PREFERRED_UNIT>();
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
          onChange={(checkedValue: PREFERRED_UNIT | undefined) => {
            setCheckedValue(checkedValue);
          }}
          checkedValue={checkedValue}
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

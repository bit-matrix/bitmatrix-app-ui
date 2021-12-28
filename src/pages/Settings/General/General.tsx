import React, { useState } from 'react';
import { useContext } from 'react';
import SETTINGS_ACTION_TYPES from '../../../context/SETTINGS_ACTION_TYPES';
import SettingsContext from '../../../context/SettingsContext';
import { CheckBoxGroup } from '../../../components/CheckBoxGroup/CheckBoxGroup';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/ToggleSwitch/ToggleSwitch';
import { PREFERRED_UNIT } from '../../../enum/PREFERRED_UNIT';
import { preferredUnitList, preferredUnitOptions, SlippageFeeList, slippageFeeOptions } from './utils';
import info from '../../../images/info2.png';
import './General.scss';

export const General = (): JSX.Element => {
  const [pushNotificationsSwitch, setPushNotificationsSwitch] = useState<boolean>(false);
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
          selectedOption={SlippageFeeList.find((sf) => sf.value === payloadData.slippage)?.text || ''}
          onChange={(option) => {
            const selectedOption = SlippageFeeList.find((sf) => sf.text === option)?.value;

            dispatch({
              type: SETTINGS_ACTION_TYPES.SET_SLIPPAGE,
              payload: {
                slippage: selectedOption || 200,
                preferred_unit: payloadData.preferred_unit,
              },
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
            const preferredUnit = preferredUnitList.find((unit) => unit.text === checkedValue);

            if (preferredUnit) {
              dispatch({
                type: SETTINGS_ACTION_TYPES.SET_PREFERRED_UNIT,
                payload: {
                  slippage: payloadData.slippage,
                  preferred_unit: preferredUnit,
                },
              });
            }
          }}
          checkedValue={payloadData.preferred_unit.text}
        />
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Push Notifications</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch onChange={(checked) => setPushNotificationsSwitch(checked)} checked={pushNotificationsSwitch} />
        </div>
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Liquid Taxi</span>
          <img className="general-icon" src={info} alt="info" />
          <ToggleSwitch onChange={(checked) => setLiquidTaxiSwitch(checked)} checked={liquidTaxiSwitch} />
        </div>
      </div>
    </div>
  );
};

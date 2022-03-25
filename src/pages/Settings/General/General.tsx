import React, { useState } from 'react';
import { useContext } from 'react';
import SETTINGS_ACTION_TYPES from '../../../context/SETTINGS_ACTION_TYPES';
import SettingsContext from '../../../context/SettingsContext';
import { CheckBoxGroup } from '../../../components/base/CheckBoxGroup/CheckBoxGroup';
import { StripedRadioButton } from '../../../components/StripedRadioButton/StripedRadioButton';
import { ToggleSwitch } from '../../../components/base/ToggleSwitch/ToggleSwitch';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import { PREFERRED_UNIT } from '../../../enum/PREFERRED_UNIT';
import { preferredUnitList, preferredUnitOptions, SlippageFeeList, slippageFeeOptions } from './utils';
import info from '../../../images/info2.png';
import { notify } from '../../../components/utils/utils';
import './General.scss';

export const General = (): JSX.Element => {
  const [pushNotificationsSwitch, setPushNotificationsSwitch] = useState<boolean>(false);
  const [liquidTaxiSwitch, setLiquidTaxiSwitch] = useState<boolean>(false);
  const { dispatch, payloadData } = useContext(SettingsContext);

  return (
    <div className="general-main">
      <div className="general-item">
        <div className="general-item-first-head">
          <span className="general-title">Slippage Tolerance</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Slippage Tolerance"
            content="Your transaction will revert if the price changes unfavorably by more than this percentage."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
        </div>
        <StripedRadioButton
          options={slippageFeeOptions}
          selectedOption={SlippageFeeList.find((sf) => sf.value === payloadData.slippage)?.text || ''}
          onChange={(option) => {
            const selectedOption = SlippageFeeList.find((sf) => sf.text === option)?.value;

            dispatch({
              type: SETTINGS_ACTION_TYPES.SET_SLIPPAGE,
              payload: {
                ...payloadData,
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
          <CustomPopover
            placement="autoHorizontal"
            title="Preferred Unit"
            content="Your metric preference of denominations used as units of Bitcoin. The smallest denomination base unit is sats."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
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
                  ...payloadData,
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
          <CustomPopover
            placement="autoHorizontal"
            title="Push Notifications"
            content="Receive pop-up messages on your transaction status."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
          <ToggleSwitch
            onChange={(checked) => {
              setPushNotificationsSwitch(checked);
              notify('This feature is not supported yet.', 'Push Notifications : ', 'info');
              setTimeout(() => {
                setPushNotificationsSwitch(false);
              }, 350);
            }}
            checked={pushNotificationsSwitch}
          />
        </div>
      </div>
      <div className="general-item">
        <div className="general-item-head">
          <span className="general-title">Liquid Taxi</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Liquid Taxi"
            content="Swap your Liquid assets without the need to pay fees in L-BTC."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
          <ToggleSwitch
            onChange={(checked) => {
              setLiquidTaxiSwitch(checked);
              notify('This feature is not supported yet.', 'Liquid Taxi : ', 'info');
              setTimeout(() => {
                setLiquidTaxiSwitch(false);
              }, 350);
            }}
            checked={liquidTaxiSwitch}
          />
        </div>
      </div>
    </div>
  );
};

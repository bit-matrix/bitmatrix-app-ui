import React, { useContext } from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import './SwapFromTab.scss';

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT | undefined;
  setselectedFromAmountPercent: (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined) => void;
};

export const SwapFromTab: React.FC<Props> = ({ selectedFromAmountPercent, setselectedFromAmountPercent }) => {
  const { payloadData, dispatch } = useContext(SettingsContext);

  const onChangeSelectedFromTab = (value: any) => {
    if (payloadData.wallet && payloadData.wallet.isEnabled) {
      payloadData.wallet.marina.getBalances().then((balances) => {
        dispatch({
          type: SETTINGS_ACTION_TYPES.SET_WALLET,
          payload: {
            ...payloadData,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            wallet: { marina: payloadData.wallet!.marina, isEnabled: true, balances },
          },
        });
      });
    }

    if (value === selectedFromAmountPercent) {
      setselectedFromAmountPercent(undefined);
    } else {
      setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT);
    }
  };

  return (
    <CheckboxGroup
      className="swap-amount-rate"
      inline
      name="checkboxList"
      value={[selectedFromAmountPercent] as ValueType[]}
      onChange={
        (/*value: Array<FROM_AMOUNT_PERCENT>*/) => {
          // console.log(value[1]);
        }
      }
    >
      <Checkbox
        className="left-radio-item tab-radio"
        classPrefix="radio-item-prefix"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.ALL}
      >
        ALL
      </Checkbox>
      <Checkbox
        className="middle-radio-item tab-radio"
        classPrefix="radio-item-prefix"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.HALF}
      >
        HALF
      </Checkbox>
      <Checkbox
        className="right-radio-item tab-radio"
        classPrefix="radio-item-prefix"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.MIN}
      >
        MIN
      </Checkbox>
    </CheckboxGroup>
  );
};

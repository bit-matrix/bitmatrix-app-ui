import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import './SwapFromTab.scss';

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT | undefined;
  setselectedFromAmountPercent: (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined) => void;
};

export const SwapFromTab: React.FC<Props> = ({ selectedFromAmountPercent, setselectedFromAmountPercent }) => {
  const onChangeSelectedFromTab = (value: any) => {
    if (value === selectedFromAmountPercent) {
      setselectedFromAmountPercent(undefined);
      console.log(value);
    } else {
      setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT);
    }
  };

  return (
    <CheckboxGroup
      className="swap-amount-rate"
      inline
      name="checkboxList"
      value={[selectedFromAmountPercent]}
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

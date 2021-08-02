import React from 'react';
import { Radio, RadioGroup } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import './SwapFromTab.scss';

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT;
  setselectedFromAmountPercent: (
    newFromAmountPercent: FROM_AMOUNT_PERCENT,
  ) => void;
};

export const SwapFromTab: React.FC<Props> = ({
  selectedFromAmountPercent,
  setselectedFromAmountPercent,
}) => {
  const onChangeSelectedFromTab = (value: any) => {
    setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT);
  };

  return (
    <RadioGroup
      className="swap-amount-rate"
      name="radioList"
      inline
      appearance="picker"
      defaultValue={selectedFromAmountPercent}
    >
      <Radio
        classPrefix="radio-item-prefix"
        className="left-radio-item tab-radio"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.ALL}
      >
        ALL
      </Radio>
      <Radio
        classPrefix="radio-item-prefix"
        className="middle-radio-item tab-radio"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.HALF}
      >
        HALF
      </Radio>
      <Radio
        classPrefix="radio-item-prefix"
        className="right-radio-item tab-radio"
        onChange={onChangeSelectedFromTab}
        value={FROM_AMOUNT_PERCENT.MIN}
      >
        MIN
      </Radio>
    </RadioGroup>
  );
};

import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import './SwapFromTab.scss';

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT | undefined;
  setselectedFromAmountPercent: (
    newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined,
  ) => void;
};

export const SwapFromTab: React.FC<Props> = ({
  selectedFromAmountPercent,
  setselectedFromAmountPercent,
}) => {
  const onChangeSelectedFromTab = (value: any) => {
    if (value === selectedFromAmountPercent) {
      setselectedFromAmountPercent(undefined);
      console.log(value);
    } else {
      setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT);
    }
  };

  return (
    // <RadioGroup
    //   className="swap-amount-rate"
    //   name="radioList"
    //   inline
    //   appearance="picker"
    //   // defaultValue={selectedFromAmountPercent}
    // >
    //   <Radio
    //     classPrefix="radio-item-prefix"
    //     className="left-radio-item tab-radio"
    //     onChange={onChangeSelectedFromTab}
    //     value={FROM_AMOUNT_PERCENT.ALL}
    //   >
    //     ALL
    //   </Radio>
    //   <Radio
    //     classPrefix="radio-item-prefix"
    //     className="middle-radio-item tab-radio"
    //     onChange={onChangeSelectedFromTab}
    //     value={FROM_AMOUNT_PERCENT.HALF}
    //   >
    //     HALF
    //   </Radio>
    //   <Radio
    //     classPrefix="radio-item-prefix"
    //     className="right-radio-item tab-radio"
    //     onChange={onChangeSelectedFromTab}
    //     value={FROM_AMOUNT_PERCENT.MIN}
    //   >
    //     MIN
    //   </Radio>
    // </RadioGroup>
    <CheckboxGroup
      className="swap-amount-rate"
      inline
      name="checkboxList"
      value={[selectedFromAmountPercent]}
      onChange={() =>
        // value: any[],
        // event: React.SyntheticEvent<HTMLElement, Event>,
        {
          // console.log(value);
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

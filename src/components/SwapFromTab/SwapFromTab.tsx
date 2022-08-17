import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';
import { ValueType } from 'rsuite/esm/Checkbox';
import { useWalletContext } from '../../context';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import './SwapFromTab.scss';

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT | undefined;
  setselectedFromAmountPercent: (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => void;
};

export const SwapFromTab: React.FC<Props> = ({ selectedFromAmountPercent, setselectedFromAmountPercent }) => {
  const { walletContext, setWalletContext } = useWalletContext();

  const onChangeSelectedFromTab = (value: any) => {
    if (walletContext && walletContext.isEnabled) {
      walletContext.marina.getBalances().then((balances) => {
        setWalletContext({ marina: walletContext.marina, isEnabled: true, balances, coins: walletContext.coins });

        if (value === selectedFromAmountPercent) {
          setselectedFromAmountPercent(undefined, balances);
        } else {
          setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT, balances);
        }
      });
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

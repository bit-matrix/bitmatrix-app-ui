import { Radio, RadioGroup } from "rsuite";
import FROM_AMOUNT_PERCENT from "../../enum/FROM_AMOUNT_PERCENT";

type Props = {
  selectedFromAmountPercent: FROM_AMOUNT_PERCENT;
  setselectedFromAmountPercent: (newFromAmountPercent: FROM_AMOUNT_PERCENT) => void;
};

export const SwapFromTab: React.FC<Props> = ({ selectedFromAmountPercent, setselectedFromAmountPercent }) => {
  const onChangeSelectedFromTab = (value: any, checked: boolean, event: React.SyntheticEvent<HTMLInputElement, Event>) => {
    setselectedFromAmountPercent(value as FROM_AMOUNT_PERCENT);
  };

  return (
    <RadioGroup className="swap-amount-rate" name="radioList" inline appearance="picker" defaultValue={selectedFromAmountPercent}>
      <Radio className="left-radio-item " onChange={onChangeSelectedFromTab} value={FROM_AMOUNT_PERCENT.ALL}>
        ALL
      </Radio>
      <Radio className="middle-radio-item" onChange={onChangeSelectedFromTab} value={FROM_AMOUNT_PERCENT.HALF}>
        HALF
      </Radio>
      <Radio className="right-radio-item" onChange={onChangeSelectedFromTab} value={FROM_AMOUNT_PERCENT.MIN}>
        MIN
      </Radio>
    </RadioGroup>
  );
};

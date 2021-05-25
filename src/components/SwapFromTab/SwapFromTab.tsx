import { Radio, RadioGroup } from "rsuite";
import SWAP_FROM_AMOUNT from "../../enum/SWAP_FROM_AMOUNT";

interface ISwapFromTab {
  selectedFromTab: SWAP_FROM_AMOUNT;
  setSelectedFromTab: (swapFromAount: SWAP_FROM_AMOUNT) => void;
}

const SwapFromTab: React.FC<ISwapFromTab> = ({ selectedFromTab, setSelectedFromTab }) => {
  const onChangeSelectedFromTab = (value: any, checked: boolean, event: React.SyntheticEvent<HTMLInputElement, Event>) => {
    setSelectedFromTab(value as SWAP_FROM_AMOUNT);
  };

  return (
    <RadioGroup className="swap-amount-rate" name="radioList" inline appearance="picker" defaultValue={selectedFromTab}>
      <Radio className="left-radio-item " onChange={onChangeSelectedFromTab} value={SWAP_FROM_AMOUNT.ALL}>
        ALL
      </Radio>
      <Radio className="middle-radio-item" onChange={onChangeSelectedFromTab} value={SWAP_FROM_AMOUNT.HALF}>
        HALF
      </Radio>
      <Radio className="right-radio-item" onChange={onChangeSelectedFromTab} value={SWAP_FROM_AMOUNT.MIN}>
        MIN
      </Radio>
    </RadioGroup>
  );
};

export default SwapFromTab;

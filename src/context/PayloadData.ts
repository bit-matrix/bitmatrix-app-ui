import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';

interface PayloadData {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
}

export default PayloadData;

import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { Pool } from '@bitmatrix/models';

interface PayloadData {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  pools?: Pool[];
}

export default PayloadData;

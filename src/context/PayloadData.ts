import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { Pool, BmConfig } from '@bitmatrix/models';

interface PayloadData {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  pools?: Pool[];
  pool_config?: BmConfig;
}

export default PayloadData;

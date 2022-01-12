import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { Pool, BmConfig } from '@bitmatrix/models';
import { IWallet } from '../lib/wallet/IWallet';

interface PayloadData {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  pools?: Pool[];
  pool_config?: BmConfig;
  wallet?: { marina: IWallet; isEnabled: boolean };
}

export default PayloadData;

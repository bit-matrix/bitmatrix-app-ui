import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { Pool, BmConfig, BmChart } from '@bitmatrix/models';
import { IWallet } from '../lib/wallet/IWallet';
import { Balance } from 'marina-provider';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';

interface PayloadData {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  pools?: Pool[];
  pool_config?: BmConfig;
  wallet?: { marina: IWallet; isEnabled: boolean; balances: Balance[] };
  pool_chart_data?: BmChart[];
  theme: SELECTED_THEME;
}

export default PayloadData;

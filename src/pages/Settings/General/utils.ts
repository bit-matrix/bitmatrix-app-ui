import { EXPLORER } from '../../../enum/EXPLORER';
import { PREFERRED_UNIT } from '../../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { SLIPPAGE_FEE } from '../../../enum/SLIPPAGE_FEE';

export const preferredUnitOptions = [PREFERRED_UNIT.LBTC, PREFERRED_UNIT.mBTC, PREFERRED_UNIT.uBTC, PREFERRED_UNIT.SAT];

export const explorerOptions = [EXPLORER.BLOCK_STREAM, EXPLORER.MEMPOOL];

export const slippageFeeOptions = [
  SLIPPAGE_FEE.ZEROPOINTTHREE,
  SLIPPAGE_FEE.ZEROPOINTFIVE,
  SLIPPAGE_FEE.ZEROPOINTSEVENTYFIVE,
  SLIPPAGE_FEE.ONEPOINT,
  SLIPPAGE_FEE.ONEPOINTTWENTYFIVE,
  SLIPPAGE_FEE.ONEPOINTFIVE,
];

export const SlippageFeeList = [
  {
    text: SLIPPAGE_FEE.ZEROPOINTTHREE,
    value: 333,
  },
  {
    text: SLIPPAGE_FEE.ZEROPOINTFIVE,
    value: 200,
  },
  {
    text: SLIPPAGE_FEE.ZEROPOINTSEVENTYFIVE,
    value: 133,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINT,
    value: 100,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINTTWENTYFIVE,
    value: 80,
  },
  {
    text: SLIPPAGE_FEE.ONEPOINTFIVE,
    value: 66,
  },
];

export const preferredUnitList = [
  { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  { text: PREFERRED_UNIT.SAT, value: PREFERRED_UNIT_VALUE.SAT },
  { text: PREFERRED_UNIT.mBTC, value: PREFERRED_UNIT_VALUE.mBTC },
  { text: PREFERRED_UNIT.uBTC, value: PREFERRED_UNIT_VALUE.uBTC },
];

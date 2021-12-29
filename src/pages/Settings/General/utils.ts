import { PREFERRED_UNIT } from '../../../enum/PREFERRED_UNIT';
import { SLIPPAGE_FEE } from '../../../enum/SLIPPAGE_FEE';

export const preferredUnitOptions = [PREFERRED_UNIT.LBTC, PREFERRED_UNIT.mBTC, PREFERRED_UNIT.uBTC, PREFERRED_UNIT.SAT];

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
  { text: PREFERRED_UNIT.LBTC, value: 100000000 },
  { text: PREFERRED_UNIT.SAT, value: 1 },
  { text: PREFERRED_UNIT.mBTC, value: 100000 },
  { text: PREFERRED_UNIT.uBTC, value: 100 },
];

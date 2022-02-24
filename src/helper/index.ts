import { BmConfig } from '@bitmatrix/models';
import Numeral from 'numeral';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import SWAP_ASSET from '../enum/SWAP_ASSET';

export const timeDifference = (time: number): string => {
  const now = new Date().valueOf();

  let difference = now - time;

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  const minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  const secondsDifference = Math.floor(difference / 1000);

  if (daysDifference > 0) {
    return daysDifference + ' d ';
  } else if (hoursDifference > 0) {
    return hoursDifference + ' h ';
  } else if (minutesDifference > 0) {
    return minutesDifference + ' m ';
  } else if (secondsDifference > 0) {
    return secondsDifference + ' s';
  }

  return '';
};

export const getPrimaryPoolConfig = (poolConfig: BmConfig): BmConfig => {
  const newPoolConfig = { ...poolConfig };

  newPoolConfig.defaultOrderingFee = { number: 3, hex: '03000000' };
  return newPoolConfig;
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export const getAssetPrecession = (asset: SWAP_ASSET, preferred_unit: PREFERRED_UNIT): number => {
  if (asset === SWAP_ASSET.LBTC) {
    switch (preferred_unit) {
      case PREFERRED_UNIT.LBTC:
        return 8;
      case PREFERRED_UNIT.uBTC:
        return 2;
      case PREFERRED_UNIT.SAT:
        return 0;
      case PREFERRED_UNIT.mBTC:
        return 5;
      default:
        return 2;
    }
  } else {
    return 2;
  }
};

export const quoteAmountRound = (quoteAmount: number): string => {
  if (quoteAmount > 1) {
    return Numeral(quoteAmount).format('(0.00a)');
  }
  return quoteAmount.toString();
};

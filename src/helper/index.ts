import { BmConfig } from '@bitmatrix/models';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';

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

export const setQuoteText = (text: PREFERRED_UNIT): string => {
  if (text === PREFERRED_UNIT.LBTC) {
    return `t${text}`;
  } else {
    return `tl-${text}`;
  }
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

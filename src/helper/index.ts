import { BmConfig, Pool, PAsset } from '@bitmatrix/models';
import Numeral from 'numeral';
import { Settings } from '../context/settings/types';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
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
  if (quoteAmount < 1) {
    const quoteAmountStr = String(quoteAmount);
    if (quoteAmountStr.includes('.')) {
      const quoteAmountStrLength = quoteAmountStr.split('.')[1].length;
      if (quoteAmountStrLength > 5) {
        return quoteAmount.toFixed(5);
      } else {
        return quoteAmount.toString();
      }
    }
  } else {
    return Numeral(quoteAmount).format('(0.00a)');
  }

  return quoteAmount.toString();
};

export const poolShareRound = (amount: number): string => {
  if (amount < 1) {
    const res = amount.toFixed(5);

    const first = res.split('.');

    const second = first[1].split('');

    let i = second.length - 1;

    while (i > 0) {
      if (second[i] === '0') {
        second.pop();

        i--;
      } else {
        break;
      }
    }

    return '0.' + second.join('');
  }

  return amount.toFixed(2);
};

export const deepCopy = <T>(oldObject: T): T => {
  return JSON.parse(JSON.stringify(oldObject)) as T;
};

export const uniqueAssetList = (pools: Pool[]): { quote: PAsset[]; token: PAsset[] } => {
  const quoteList: PAsset[] = [];
  const tokenList: PAsset[] = [];
  pools.forEach((pool: Pool) => {
    tokenList.push(pool.token);
    quoteList.push(pool.quote);
  });

  const uniqueQuoteList: string[] = [];
  const uniqueQuoteAssetList: PAsset[] = [];
  quoteList.map((ql) => {
    if (!uniqueQuoteList.includes(ql.assetHash)) {
      uniqueQuoteList.push(ql.assetHash);
      uniqueQuoteAssetList.push({
        assetHash: ql.assetHash,
        ticker: ql.ticker,
        name: ql.name,
        precision: 8,
      });
    }
  });

  const uniqueTokenList: string[] = [];
  const uniqueTokenAssetList: PAsset[] = [];

  tokenList.map((tl) => {
    if (!uniqueTokenList.includes(tl.assetHash)) {
      uniqueTokenList.push(tl.assetHash);
      uniqueTokenAssetList.push({
        assetHash: tl.assetHash,
        ticker: tl.ticker,
        name: tl.name,
        precision: 8,
      });
    }
  });

  return {
    quote: uniqueQuoteAssetList,
    token: uniqueTokenAssetList,
  };
};

export const getUnitValue = (asset: PAsset, settings: Settings): number => {
  if (asset.ticker === SWAP_ASSET.LBTC) {
    return settings.preferred_unit.value;
  } else {
    return PREFERRED_UNIT_VALUE.LBTC;
  }
};

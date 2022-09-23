import { useEffect, useRef } from 'react';
import { esplora } from '@bitmatrix/lib';
import { BmConfig, Pool, PAsset, CALL_METHOD } from '@bitmatrix/models';
import { Utxo } from 'marina-provider';
import Numeral from 'numeral';
import { ChartData } from '../components/AreaChart/AreaChart';
import { Settings } from '../context/settings/types';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import SWAP_ASSET from '../enum/SWAP_ASSET';
import { LBTC_ASSET } from '../env';

export type AssetModel = {
  name: string;
  assetHash: string;
  ticker: string;
  precision: number;
};

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

export const getPrimaryPoolConfig = (poolConfig: BmConfig, methodCall: CALL_METHOD): BmConfig => {
  const newPoolConfig = { ...poolConfig };
  methodCall === CALL_METHOD.REMOVE_LIQUIDITY
    ? (newPoolConfig.defaultOrderingFee = { number: 2, hex: '02000000' })
    : (newPoolConfig.defaultOrderingFee = { number: 3, hex: '03000000' });
  return newPoolConfig;
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export const getAssetPrecession = (asset: AssetModel | PAsset, preferred_unit: PREFERRED_UNIT): number => {
  if (asset.assetHash === LBTC_ASSET.assetHash) {
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
    return asset.precision;
  }
};

export const amountRound = (quoteAmount: number): string => {
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

export const uniqueAssetListAll = (pools: Pool[]): AssetModel[] => {
  const assetList: AssetModel[] = [];

  pools.forEach((pool) => {
    assetList.push({
      assetHash: pool.quote.assetHash,
      ticker: pool.quote.ticker,
      name: pool.quote.name,
      precision: pool.quote.precision,
    });
    assetList.push({
      assetHash: pool.token.assetHash,
      ticker: pool.token.ticker,
      name: pool.token.name,
      precision: pool.token.precision,
    });
  });

  const uniqueList = assetList.filter(
    (value, index, self) => index === self.findIndex((t) => t.assetHash === value.assetHash),
  );

  return uniqueList;
};

export const uniqueQuoteAssetList = (pools: Pool[]): AssetModel[] => {
  const assetList: AssetModel[] = [];

  pools.forEach((pool) => {
    assetList.push({
      assetHash: pool.quote.assetHash,
      ticker: pool.quote.ticker,
      name: pool.quote.name,
      precision: pool.quote.precision,
    });
  });

  const uniqueList = assetList.filter(
    (value, index, self) => index === self.findIndex((t) => t.assetHash === value.assetHash),
  );

  return uniqueList;
};

export const uniqueMatchingAssetList = (pools: Pool[], selectedAssetHash: string): AssetModel[] => {
  const currentPools = pools.filter(
    (pool: Pool) => pool.token.assetHash === selectedAssetHash || pool.quote.assetHash === selectedAssetHash,
  );

  return uniqueAssetListAll(currentPools);
};

export const getUnitValue = (asset: PAsset, settings: Settings): number => {
  if (asset.ticker === SWAP_ASSET.LBTC) {
    return settings.preferred_unit.value;
  } else {
    return PREFERRED_UNIT_VALUE.LBTC;
  }
};

export const getAssetTicker = (asset: AssetModel | PAsset, unit: PREFERRED_UNIT): string => {
  if (asset.assetHash === LBTC_ASSET.assetHash) {
    if (unit === PREFERRED_UNIT.LBTC) {
      return 'L-BTC';
    }
    if (unit === PREFERRED_UNIT.SAT) {
      return 'L-Sats';
    }
    if (unit === PREFERRED_UNIT.uBTC) {
      return 'L-Bits';
    }
    if (unit === PREFERRED_UNIT.mBTC) {
      return 'L-mBTC';
    }
  } else {
    return asset.ticker;
  }

  return asset.ticker;
};

export const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const getMyPoolsChartData = async (coins: Utxo[] | undefined, assetHash?: string): Promise<ChartData[]> => {
  if (coins && coins?.length > 0) {
    const filteredCoins = coins.filter((coin) => coin.asset === assetHash);
    const outSpendsPromises = filteredCoins.map((coin) => esplora.txDetailPromise(coin.txid));
    const outSpends = await Promise.all(outSpendsPromises);

    const finalData = filteredCoins.map((coin) => {
      const spent = outSpends[0][1][coin.vout].spent;

      const date = new Date(outSpends[0][0].status.block_time * 1000);

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Format as hh:mm:ss
      const time = `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

      const year = date.getFullYear();
      const month = padTo2Digits(date.getMonth() + 1);
      const day = padTo2Digits(date.getDate());

      const dateTime = `${year}-${month}-${day} ${time}`;

      const d: ChartData = {
        date: dateTime,
        close: spent ? (coin.value || 0) * -1 : coin.value || 0,
      };

      return d;
    });

    return finalData;
  }

  return [];
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const calculateUsdtPrice = (lbtcPrice: number, assetAmount: number): number => {
  return (lbtcPrice / PREFERRED_UNIT_VALUE.LBTC) * assetAmount;
};

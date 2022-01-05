import { BmChart, Pool } from '@bitmatrix/models';
import { ChartData } from '../AreaChart/AreaChart';

export const groupBydailyPrice = (chartData: BmChart[]): ChartData[] => {
  if (chartData.length === 0) return [];

  const res = chartData.map((d) => {
    const datetime = new Date(d.time * 1000);
    const date =
      datetime.getUTCFullYear() +
      '-' +
      (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      datetime.getUTCDate().toString().padStart(2, '0');
    return { price: d.price, date };
  });

  const result = [];

  let currentDate = res[0].date;
  let cumprice = res[0].price;
  let j = 1;

  for (let i = 1; i < res.length; i++) {
    const r = res[i];

    if (currentDate === r.date) {
      cumprice += r.price;
      j++;
    } else {
      result.push({ date: res[i - 1].date, close: Math.floor(cumprice / j) });

      currentDate = r.date;
      cumprice = r.price;
      j = 1;
    }
  }

  result.push({ date: res[res.length - 1].date, close: Math.floor(cumprice / j) });

  return result;
};

export const groupByDailyTvl = (chartData: BmChart[]): ChartData[] => {
  if (chartData.length === 0) return [];

  const res = chartData.map((d) => {
    const datetime = new Date(d.time * 1000);
    const date =
      datetime.getUTCFullYear() +
      '-' +
      (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      datetime.getUTCDate().toString().padStart(2, '0');
    return { close: Math.floor(d.value.token / 100000000), date };
  });

  const result = [];

  let currentDate = res[0].date;
  let cumclose = res[0].close;
  let j = 1;

  for (let i = 1; i < res.length; i++) {
    const r = res[i];

    if (currentDate === r.date) {
      cumclose += r.close;
      j++;
    } else {
      result.push({ date: res[i - 1].date, close: Math.floor(cumclose / j) * 2 });

      currentDate = r.date;
      cumclose = r.close;
      j = 1;
    }
  }

  result.push({ date: res[res.length - 1].date, close: Math.floor(cumclose / j) * 2 });

  return result;
};

export const groupBydailyVolume = (chartData: BmChart[]): ChartData[] => {
  if (chartData.length === 0) return [];

  const res = chartData.map((d) => {
    const datetime = new Date(d.time * 1000);
    const date =
      datetime.getUTCFullYear() +
      '-' +
      (datetime.getUTCMonth() + 1).toString().padStart(2, '0') +
      '-' +
      datetime.getUTCDate().toString().padStart(2, '0');
    return { volume: Math.floor(d.volume.token / 100000000), date };
  });

  const result = [];

  let currentDate = res[0].date;
  let totalVolume = res[0].volume;

  for (let i = 1; i < res.length; i++) {
    const r = res[i];

    if (currentDate === r.date) {
      totalVolume += r.volume;
    } else {
      result.push({ date: res[i - 1].date, close: totalVolume });

      currentDate = r.date;
      totalVolume = r.volume;
    }
  }

  result.push({ date: res[res.length - 1].date, close: totalVolume });
  return result;
};

export const calculateChartData = (chartData: BmChart[], pool: Pool): any => {
  const allPriceData = groupBydailyPrice(chartData);
  const allVolumeData = groupBydailyVolume(chartData);
  const allTvlData = groupByDailyTvl(chartData);
  const allFeeData = groupBydailyVolume(chartData).map((d) => ({ ...d, close: d.close / 500 }));

  // live current time data
  const todayVolumeData = allVolumeData[allVolumeData.length - 1];
  const todayFeeData = allFeeData[allFeeData.length - 1];
  const todayTvlData = (Number(pool.token.value) * 2) / 100000000;
  const todayPrice = Number(pool.token.value) / Number(pool.quote.value);

  // previous data
  let previousVolumeData: ChartData = { date: '', close: 0 };
  let previousFeeData: ChartData = { date: '', close: 0 };
  let previousTvlData: ChartData = { date: '', close: 0 };
  let previousPriceData: ChartData = { date: '', close: 0 };

  let volumeRate = {
    value: '0',
    direction: 'up',
  };
  let feeRate = {
    value: '0',
    direction: 'up',
  };
  let tvlRate = {
    value: '0',
    direction: 'up',
  };
  let priceRate = {
    value: '0',
    direction: 'up',
  };

  if (allPriceData.length > 2) {
    previousPriceData = allPriceData[allPriceData.length - 2];
    priceRate = {
      value: (todayPrice / previousPriceData.close).toFixed(2),
      direction: todayPrice > previousPriceData.close ? 'up' : 'down',
    };
  }

  if (allVolumeData.length > 2) {
    previousVolumeData = allVolumeData[allVolumeData.length - 2];

    volumeRate = {
      value: (todayVolumeData.close / previousVolumeData.close).toFixed(2),
      direction: todayVolumeData.close > previousVolumeData.close ? 'up' : 'down',
    };
  }

  if (allFeeData.length > 2) {
    previousFeeData = allFeeData[allFeeData.length - 2];

    feeRate = {
      value: (todayFeeData.close / previousFeeData.close).toFixed(2),
      direction: todayFeeData.close > previousFeeData.close ? 'up' : 'down',
    };
  }

  if (allTvlData.length > 2) {
    previousTvlData = allTvlData[allTvlData.length - 2];
    tvlRate = {
      value: (todayTvlData / previousTvlData.close).toFixed(2),
      direction: todayTvlData > previousTvlData.close ? 'up' : 'down',
    };
  }

  return {
    allPriceData,
    allVolumeData,
    allTvlData,
    allFeeData,
    todayVolumeData,
    todayFeeData,
    todayTvlData,
    todayPrice,
    volumeRate,
    feeRate,
    tvlRate,
    priceRate,
  };
};

import { BmChart } from '@bitmatrix/models';
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

import { BmChart, CALL_METHOD } from '@bitmatrix/models';
import { SetPoolChartDataAction, SET_POOL_CHART_DATA } from './types';

export const initialPoolChartDataState: BmChart = {
  time: 0,
  ptxid: '',
  value: {
    quote: 0,
    token: 0,
    lp: 0,
  },
  volume: {
    quote: 0,
    token: 0,
  },
  price: 0,
  method: CALL_METHOD.SWAP_QUOTE_FOR_TOKEN,
};

export const poolChartDataReducer = (state: BmChart[], action: SetPoolChartDataAction): BmChart[] => {
  switch (action.type) {
    case SET_POOL_CHART_DATA:
      return [...state, ...action.payload];

    default:
      return state;
  }
};

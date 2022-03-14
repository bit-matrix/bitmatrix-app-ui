import { BmChart } from '@bitmatrix/models';
import { SetPoolChartDataAction, SET_POOL_CHART_DATA } from './types';

export const poolChartDataReducer = (state: BmChart[], action: SetPoolChartDataAction): BmChart[] => {
  switch (action.type) {
    case SET_POOL_CHART_DATA:
      return [...action.payload];

    default:
      return state;
  }
};

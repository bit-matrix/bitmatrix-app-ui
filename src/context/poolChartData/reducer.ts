import { BmChart } from '@bitmatrix/models';
import { deepCopy } from '../../helper';
import { SetPoolChartDataAction, SET_POOL_CHART_DATA } from './types';

export const poolChartDataReducer = (state: BmChart[], action: SetPoolChartDataAction): BmChart[] => {
  switch (action.type) {
    case SET_POOL_CHART_DATA:
      const poolChartData = deepCopy(action.payload);

      if (state.length !== action.payload.length) {
        return poolChartData;
      } else {
        return state;
      }

    default:
      return state;
  }
};

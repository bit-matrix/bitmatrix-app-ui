import { BmChart } from '@bitmatrix/models';
import { SetPoolChartDataAction, SET_POOL_CHART_DATA } from './types';

export const poolChartDataReducer = (state: BmChart[], action: SetPoolChartDataAction): BmChart[] => {
  switch (action.type) {
    case SET_POOL_CHART_DATA:
      if (state.length > 0) {
        const poolChartData = [...state];
        const newPoolChartData = action.payload;
        const difference = poolChartData.filter(
          ({ ptxid: id1 }) => !newPoolChartData.some(({ ptxid: id2 }) => id2 === id1),
        );
        const newState = poolChartData.concat(difference);
        return newState;
      } else {
        return [...action.payload];
      }

    default:
      return state;
  }
};

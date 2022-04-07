import { BmChart } from '@bitmatrix/models';
import { SetPoolChartDataAction, SET_POOL_CHART_DATA } from './types';

export const setPoolChartDataAction = (
  chart_data: BmChart[],
  dispatch: (action: SetPoolChartDataAction) => void,
): void => {
  dispatch({
    type: SET_POOL_CHART_DATA,
    payload: chart_data,
  });
};

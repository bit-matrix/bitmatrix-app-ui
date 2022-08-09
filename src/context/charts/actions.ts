import { ChartSummary } from '@bitmatrix/models';
import { SetChartsAction, SET_CHARTS } from './types';

export const setChartsAction = (charts: ChartSummary[], dispatch: (action: SetChartsAction) => void): void => {
  dispatch({
    type: SET_CHARTS,
    payload: charts,
  });
};

import { ChartSummary } from '@bitmatrix/models';
import { Reducer } from 'react';
import { deepCopy } from '../../helper';
import { SetChartsAction, SET_CHARTS } from './types';

export const chartsReducer: Reducer<ChartSummary[], SetChartsAction> = (
  state: ChartSummary[],
  action: SetChartsAction,
): ChartSummary[] => {
  switch (action.type) {
    case SET_CHARTS:
      const charts = deepCopy(action.payload);
      return charts;

    default:
      return state;
  }
};

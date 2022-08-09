import { ChartSummary } from '@bitmatrix/models';

export const SET_CHARTS = 'SET_CHARTS';

export type SetChartsAction = {
  type: typeof SET_CHARTS;
  payload: ChartSummary[];
};

export interface IChartContext {
  charts: ChartSummary[];
  setChartsContext: (charts: ChartSummary[]) => void;
}

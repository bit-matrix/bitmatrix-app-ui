import { BmChart } from '@bitmatrix/models';

export const SET_POOL_CHART_DATA = 'SET_POOL_CHART_DATA';

export type SetPoolChartDataAction = {
  type: typeof SET_POOL_CHART_DATA;
  payload: BmChart[];
};

export interface IPoolChartDataContext {
  poolChartDataContext: BmChart[];
  setPoolChartData: (chart_data: BmChart[]) => void;
}

import { BmChart } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setPoolChartDataAction } from './actions';
import { poolChartDataReducer } from './reducer';
import { IPoolChartDataContext } from './types';

type Props = {
  children?: ReactNode;
};

type CP = ComponentProps<FC> & { children?: ReactNode };

const PoolChartDataContext = createContext<IPoolChartDataContext>({} as IPoolChartDataContext);

export const usePoolChartDataContext = (): IPoolChartDataContext => useContext(PoolChartDataContext);

export const PoolChartDataContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [poolChartDataContext, dispatch] = useReducer(poolChartDataReducer, []);

  const setPoolChartDataContext = (chart_data: BmChart[]): void => {
    setPoolChartDataAction(chart_data, dispatch);
  };

  return (
    <PoolChartDataContext.Provider value={{ poolChartDataContext, setPoolChartDataContext }}>
      {children}
    </PoolChartDataContext.Provider>
  );
};

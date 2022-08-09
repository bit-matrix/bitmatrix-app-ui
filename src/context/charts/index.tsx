import { ChartSummary } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setChartsAction } from './actions';
import { chartsReducer } from './reducer';
import { IChartContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const ChartsContext = createContext<IChartContext>({} as IChartContext);

export const useChartsContext = (): IChartContext => useContext(ChartsContext);

export const ChartsContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [charts, dispatch] = useReducer(chartsReducer, []);

  const setChartsContext = (charts: ChartSummary[]): void => {
    setChartsAction(charts, dispatch);
  };

  return <ChartsContext.Provider value={{ charts, setChartsContext }}>{children}</ChartsContext.Provider>;
};

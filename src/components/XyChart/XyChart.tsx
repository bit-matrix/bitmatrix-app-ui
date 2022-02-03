import { curveLinear /* curveStep*/ } from '@visx/curve';
import { XYChart, AnimatedLineSeries } from '@visx/xychart';

export type ChartData = {
  date: string;
  close: number;
};

type Props = {
  width?: number;
  height?: number;
  data: ChartData[];
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
};

export const XyChart: React.FC<Props> = ({
  width = 150,
  height = 50,
  margin = { left: 0, top: 20, bottom: 0, right: 0 },
  color = '#78B98C',
  data,
}): JSX.Element => {
  return (
    <div className="App">
      <XYChart
        height={height}
        width={width}
        margin={margin}
        xScale={{ type: 'band', paddingInner: 0.3 }}
        yScale={{ type: 'linear' }}
        horizontal
      >
        <AnimatedLineSeries
          curve={curveLinear}
          dataKey="Line 1"
          data={data}
          xAccessor={(d: ChartData | undefined) => (d ? d.date : '')}
          yAccessor={(d: ChartData | undefined) => (d ? d.close : 0)}
          stroke={color}
        />
      </XYChart>
    </div>
  );
};

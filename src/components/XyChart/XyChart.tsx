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
};

export const XyChart: React.FC<Props> = ({
  width = 150,
  height = 120,
  margin = { left: -10, top: 60, bottom: 0, right: 0 },
  data,
}): JSX.Element => {
  const accessors = {
    xAccessor: (d: ChartData) => d.date,
    yAccessor: (d: ChartData) => d.close,
  };

  const glyphColor = (d: ChartData): string => {
    if (d.close < 80) {
      return 'red';
    } else {
      return '#78B98C';
    }
  };

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
          {...accessors}
          stroke={glyphColor(data[0])}
        />
      </XYChart>
    </div>
  );
};

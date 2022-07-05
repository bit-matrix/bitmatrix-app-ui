import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';

const socketServerUrl = '//127.0.0.1:9901/';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartSocket = (poolId: string) => {
  const [isChartConnected, setIsChartConnected] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartSummary>();
  const [chartLoading, setChartLoading] = useState<boolean>(true);

  const onChartData = useCallback((chartData: ChartSummary) => {
    setChartData(chartData);
    setChartLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(socketServerUrl);

    socket.on('connect', () => {
      console.log('connect chart');
      setIsChartConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect chart');
      setIsChartConnected(false);
    });

    socket.emit('fetchpool', `${poolId}`);

    socket.on('poolchart', (data) => {
      if (data) onChartData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsChartConnected(false);
      console.log('cleanup chart');
    };
  }, []);

  return {
    isChartConnected,
    chartLoading,
    chartData,
  };
};

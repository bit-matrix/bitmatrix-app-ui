import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';
import { API_SOCKET_SERVER_URL } from '../config';
import { notify } from '../components/utils/utils';

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
    const socket = io(API_SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('connect chart');
      setIsChartConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect chart');
      notify('Chart socket disconnect.', 'Bitmatrix Error : ');
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

import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';

const socketServerUrl = '//127.0.0.1:9901/';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartSocket = (poolId: string) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [chartDatas, setChartDatas] = useState<ChartSummary[]>();
  const [chartData, setChartData] = useState<ChartSummary>();
  const [appLoading, setAppLoading] = useState<boolean>(true);

  // const onChartDatas = useCallback((chartDatas: ChartSummary[]) => {
  //   setChartDatas(chartDatas);
  //   setAppLoading(false);
  // }, []);

  const onChartData = useCallback((chartData: ChartSummary) => {
    setChartData(chartData);
    setAppLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(socketServerUrl);

    socket.on('connect', () => {
      console.log('connect chart');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      setIsConnected(false);
    });

    // const poolId = '6eba8cfcf0e2a710cb7e2ffba647c28c54401a9b1f2318b6e8435ad578c61d17';
    // const poolIds = [
    //   '6eba8cfcf0e2a710cb7e2ffba647c28c54401a9b1f2318b6e8435ad578c61d17',
    //   'dfd72230465f3a75a9d90ba8ae4a63e3fa07b8de7223d2a83b53f909bd929bf2',
    // ];

    socket.emit('fetchpool', `${poolId}`);

    // socket.emit('fetchpools', [
    //   '6eba8cfcf0e2a710cb7e2ffba647c28c54401a9b1f2318b6e8435ad578c61d17',
    //   'dfd72230465f3a75a9d90ba8ae4a63e3fa07b8de7223d2a83b53f909bd929bf2',
    // ]);

    socket.on('poolchart', (data) => {
      if (data) onChartData(data);
    });

    // socket.on('poolcharts', (data) => {
    //   if (data) onChartDatas(data);
    // });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsConnected(false);
      console.log('cleanup');
    };
  }, []);

  return {
    isConnected,
    appLoading,
    chartData,
    // chartDatas,
  };
};

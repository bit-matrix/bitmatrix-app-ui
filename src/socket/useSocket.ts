import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Pool } from '@bitmatrix/models';

const socketServerUrl = '//127.0.0.1:4499';

export const useSocket = () => {
  // const [ws, setWs] = useState<WebSocket>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pools, setPools] = useState<Pool[]>();
  const [poolsLoading, setPoolsLoading] = useState<boolean>(false);

  const socket = io(socketServerUrl);

  // useEffect(() => {
  //   if (ws && ws.readyState) {
  //     setIsConnected(ws.readyState === 1);
  //   }
  // }, [ws, ws?.readyState]);

  const onPools = useCallback((pools: Pool[]) => {
    setPools(pools);
    setPoolsLoading(false);
  }, []);

  useEffect(() => {
    // Open connection
    // const newWs = new WebSocket(WS_URL);
    // newWs.onopen = () => {
    //   setWs(newWs);
    //   setIsConnected(true);
    //   console.log('Connection opened.');
    // };

    // newWs.onerror = (err) => {
    //   console.error('Socket encountered error: ', err, 'Closing socket');
    //   newWs.close();
    //   setPools([]);
    // };

    // newWs.onclose = (event) => {
    //   setPools([]);
    //   setIsConnected(false);
    //   console.log(`Socket is closed.`, event.reason);
    // };

    socket.on('connect', () => {
      console.log('connect');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      setIsConnected(false);
    });

    socket.on('ping', () => {
      console.log('ping');
      socket.emit('pong');
    });

    socket.on('pools', (data) => {
      onPools(data);
    });

    // socket.on('message', (event) => {
    //   try {
    //     console.log('event', event);
    //     const data = JSON.parse(event.data);
    //     onPools(data);
    //   } catch {
    //     console.error(`JSON parse error onmessage: ${event.data}`);
    //   }
    // });

    // newWs.onmessage = (event) => {
    //   try {
    //     if (event.data === 'ping') {
    //       newWs.send('pong');
    //     } else {
    //       const data = JSON.parse(event.data);
    //       onPools(data);
    //     }
    //   } catch {
    //     console.error(`JSON parse error onmessage: ${event.data}`);
    //   }
    // };

    // Close connection
    // return () => {
    //   if (ws) {
    //     ws.close();
    //     setIsConnected(false);
    //   }
    // };

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsConnected(false);
      console.log('clenup');
    };
  }, []);

  return {
    // ws,
    isConnected,
    poolsLoading,
    pools,
  };
};

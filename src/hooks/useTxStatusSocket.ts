/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketServerUrl = '//127.0.0.1:4499/';

enum TX_STATUS {
  PENDING,
  WAITING_PTX,
  WAITING_PTX_CONFIRM,
  SUCCESS,
  FAILED,
}

export type TxStatus = {
  txId: string;
  poolTxId: string;
  status: TX_STATUS;
  timestamp: number;
};

export const useTxStatusSocket = (txIds?: string[]) => {
  const [isTxStatusConnected, setIsTxStatusConnected] = useState<boolean>(false);
  const [txStatues, setTxStatues] = useState<TxStatus[]>();
  const [txStatusLoading, setTxStatusLoading] = useState<boolean>(true);

  const onTxStatusData = useCallback((txStatues: TxStatus[]) => {
    setTxStatues(txStatues);
    setTxStatusLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(socketServerUrl);

    socket.on('connect', () => {
      console.log('connect txStatues');
      setIsTxStatusConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect txStatues');
      setIsTxStatusConnected(false);
    });

    socket.emit('checkTxStatus', `${txIds}`);

    socket.on('checkTxStatusResponse', (data) => {
      console.log('checkTxStatusResponse', data);
      if (data) onTxStatusData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsTxStatusConnected(false);
      console.log('cleanup txStatues');
    };
  }, []);

  return {
    isTxStatusConnected,
    txStatusLoading,
    txStatues,
  };
};

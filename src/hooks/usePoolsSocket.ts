import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { notify } from '../components/utils/utils';
import { useBtcPriceContext, usePoolContext } from '../context';
import { DB_SOCKET_SERVER_URL, LBTC_ASSET } from '../env';
import { Pool } from '@bitmatrix/models';
import { pair1AssetList } from '../helper';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePoolsSocket = () => {
  const [isPoolsConnected, setIsPoolsConnected] = useState<boolean>(false);
  const [poolsLoading, setPoolsLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();
  const { setBtcPriceContext } = useBtcPriceContext();

  useEffect(() => {
    const socket = io(DB_SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('connect pools');
      setIsPoolsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect pools');
      notify('Pools socket disconnect.', 'Bitmatrix Error : ');
      setIsPoolsConnected(false);
    });

    socket.on('pools', (data: Pool[]) => {
      if (data) {
        setPoolsContext(data);

        if (data.length > 0) {
          const filteredPools = data.filter((pl) => {
            return pl.token.assetHash === lbtcAsset.assetHash && pl.quote.assetHash === pair1AssetList[1];
          });

          if (filteredPools.length > 0) {
            const tvlSort = filteredPools.sort((a, b) => Number(b.quote.value) - Number(a.quote.value));
            const bestPool = tvlSort[0];

            const price = Math.floor(Number(bestPool.quote.value) / Number(bestPool.token.value));

            setBtcPriceContext(price);
          }
        }

        setPoolsLoading(false);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsPoolsConnected(false);
      console.log('cleanup pools');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isPoolsConnected,
    poolsLoading,
  };
};

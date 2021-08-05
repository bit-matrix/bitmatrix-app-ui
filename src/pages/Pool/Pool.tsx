import React, { useState } from 'react';
import { PoolDetail } from '../../components/PoolDetail/PoolDetail';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { PoolData } from '../../model/PoolData';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const [selectedPool, setSelectedPool] = useState<PoolData>();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (selectedPool !== undefined) {
    return (
      <div
        className={`pool-main-div ${
          selectedPool !== undefined && 'pool-detail-transition'
        }`}
      >
        <PoolDetail
          back={() => setSelectedPool(undefined)}
          poolData={selectedPool}
        />
      </div>
    );
  }
  return (
    <div className="pool-main-div">
      <PoolManagement onClick={(data) => setSelectedPool(data)} />;
    </div>
  );
};

import React, { useState } from 'react';
import { PoolDetail } from '../../components/PoolDetail/PoolDetail';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { PoolData } from '../../model/PoolData';
import './Pool.scss';

export const Pool = () => {
  const [selectedPool, setSelectedPool] = useState<PoolData>();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (selectedPool !== undefined) {
    return (
      <PoolDetail
        back={() => setSelectedPool(undefined)}
        poolData={selectedPool}
      />
    );
  }
  return <PoolManagement onClick={(data) => setSelectedPool(data)} />;
};

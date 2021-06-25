import React from 'react';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './Pool.scss';

export const Pool = () => {
  document.title = ROUTE_PATH_TITLE.POOL;
  return (
    <div>
      <PoolCard />
    </div>
  );
};

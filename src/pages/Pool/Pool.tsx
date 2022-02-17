import React from 'react';
import { usePoolContext } from '../../context';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const { pools } = usePoolContext();

  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (pools && pools.length > 0) {
    return (
      <div className="pool-main-div">
        <PoolManagement pools={pools} onClick={(poolId: string) => history.push(ROUTE_PATH.POOL + '/' + poolId)} />
      </div>
    );
  }

  return <div className="no-pool-text">There are no pools</div>;
};

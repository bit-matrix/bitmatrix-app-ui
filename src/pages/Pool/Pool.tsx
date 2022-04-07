import React from 'react';
import { usePoolContext } from '../../context';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const { poolsContext } = usePoolContext();

  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (poolsContext && poolsContext.length > 0) {
    return (
      <div className="pool-main-div">
        <PoolManagement
          pools={poolsContext}
          onClick={(poolId: string) => {
            history.push({
              pathname: ROUTE_PATH.POOL + '/' + poolId,
              state: {
                from: history.location.pathname,
              },
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="pool-main-div">
      <div className="no-pool-text">There are no pools</div>
    </div>
  );
};

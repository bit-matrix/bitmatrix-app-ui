import React, { useContext } from 'react';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import SettingsContext from '../../context/SettingsContext';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const { payloadData } = useContext(SettingsContext);
  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (payloadData.pools && payloadData.pools.length > 0) {
    return (
      <div className="pool-main-div">
        <PoolManagement
          pools={payloadData.pools}
          onClick={(poolId: string) => history.push(ROUTE_PATH.POOL + '/' + poolId)}
        />
      </div>
    );
  }

  return <div className="no-pool-text">There are no pools</div>;
};

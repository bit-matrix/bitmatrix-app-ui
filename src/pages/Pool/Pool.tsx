import React, { useContext } from 'react';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Loader } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import { useHistory } from 'react-router-dom';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const { payloadData } = useContext(SettingsContext);
  const history = useHistory();

  document.title = ROUTE_PATH_TITLE.POOL;

  if (payloadData.pools === undefined) {
    return (
      <div id="loaderInverseWrapper" style={{ height: 200 }}>
        <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
      </div>
    );
  } else {
    if (payloadData.pools && payloadData.pools.length > 0) {
      return (
        <div className="pool-main-div">
          <PoolManagement pools={payloadData.pools} onClick={(poolId: string) => history.push('/pool/' + poolId)} />
        </div>
      );
    }

    return <div className="no-pool-text">There are no pools</div>;
  }
};

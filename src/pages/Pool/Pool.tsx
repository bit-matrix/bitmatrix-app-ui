import React, { useContext, useState } from 'react';
import { PoolDetail } from '../../components/PoolDetail/PoolDetail';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import * as models from '@bitmatrix/models';
import { Loader } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const [selectedPool, setSelectedPool] = useState<models.Pool>();
  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.POOL;

  if (payloadData.pools === undefined) {
    return (
      <div id="loaderInverseWrapper" style={{ height: 200 }}>
        <Loader size="md" inverse center content={<span>Loading...</span>} vertical />
      </div>
    );
  } else {
    if (payloadData.pools && payloadData.pools.length > 0) {
      if (selectedPool !== undefined) {
        return (
          <div className={`pool-main-div ${selectedPool !== undefined && 'pool-detail-transition'}`}>
            <PoolDetail back={() => setSelectedPool(undefined)} pool={selectedPool} />
          </div>
        );
      }
      return (
        <div className="pool-main-div">
          <PoolManagement pools={payloadData.pools} onClick={(data) => setSelectedPool(data)} />
        </div>
      );
    }

    return <div className="no-pool-text">There are no pools</div>;
  }
};

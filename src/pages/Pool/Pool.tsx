import React, { useContext, useState } from 'react';
import { PoolDetail } from '../../components/PoolDetail/PoolDetail';
import { PoolManagement } from '../../components/PoolManagement/PoolManagement';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Loader } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import './Pool.scss';

export const Pool = (): JSX.Element => {
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number>();
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
      if (selectedPoolIndex !== undefined) {
        return (
          <div className={`pool-main-div ${selectedPoolIndex !== undefined && 'pool-detail-transition'}`}>
            <PoolDetail back={() => setSelectedPoolIndex(undefined)} pool={payloadData.pools[selectedPoolIndex]} />
          </div>
        );
      } else {
        return (
          <div className="pool-main-div">
            <PoolManagement pools={payloadData.pools} onClick={(index) => setSelectedPoolIndex(index)} />
          </div>
        );
      }
    }

    return <div className="no-pool-text">There are no pools</div>;
  }
};

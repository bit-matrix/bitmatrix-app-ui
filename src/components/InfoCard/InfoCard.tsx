import React from 'react';
import { Icon } from 'rsuite';
import { timeDifference } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { Loading } from '../Loading/Loading';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  const { getTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV2');

  const data = getTxLocalData();

  if (data) {
    return (
      <div className="info-card-main">
        <div className="info-card-content">
          {data
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((dt) => {
              return (
                <div key={dt.txId} className="info-card-item">
                  <Icon className="info-card-item-icon" icon="exchange" />
                  <div>
                    Swap {dt.fromAmount / 100000000} {dt.fromAsset} for {dt.toAsset} (min {dt.toAmount / 100000000})
                  </div>
                  {dt.completed === false ? (
                    <Loading width="1.5rem" height="1.5rem" />
                  ) : (
                    <div>{timeDifference(dt.timestamp)}</div>
                  )}
                </div>
              );
            })}
        </div>
        <div className="info-card-footer">No other record found.</div>
      </div>
    );
  }

  return <div>Coming soon</div>;
};

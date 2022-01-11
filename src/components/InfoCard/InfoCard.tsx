import React from 'react';
import { Icon } from 'rsuite';
import { CALL_METHOD } from '@bitmatrix/models';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { timeDifference } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { Loading } from '../Loading/Loading';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  const { getTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV2');

  const data = getTxLocalData();

  const message = (cs: CommitmentStore): JSX.Element | undefined => {
    if (cs.method === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN || cs.method === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
      return (
        <div>
          <Icon className="info-card-item-icon" icon="exchange" />
          <div>
            Swap {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC} {cs.quoteAsset} for {cs.tokenAsset} (min{' '}
            {cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC})
          </div>
        </div>
      );
    }
    if (cs.method === CALL_METHOD.ADD_LIQUIDITY) {
      <div>
        <Icon className="info-card-item-icon" icon="tint" />
        <div>
          Add {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC} {cs.quoteAsset} and
          {cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC}
        </div>
      </div>;
    }
    if (cs.method === CALL_METHOD.REMOVE_LIQUIDITY) {
      <div>
        <Icon className="info-card-item-icon" icon="tint" />
        <div>
          Remove {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC} {cs.quoteAsset} and
          {cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC}
        </div>
      </div>;
    }
    return;
  };

  if (data) {
    return (
      <div className="info-card-main">
        <div className="info-card-content">
          {data
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((dt) => {
              return (
                <div key={dt.txId} className="info-card-item">
                  {message}
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

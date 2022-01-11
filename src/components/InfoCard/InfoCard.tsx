import React from 'react';
import { Icon } from 'rsuite';
import { CALL_METHOD } from '@bitmatrix/models';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { timeDifference } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { Loading } from '../Loading/Loading';
import liqadd from '../../images/liqadd.png';
import liqremove from '../../images/liqremove.png';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  const { getTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const data = getTxLocalData();

  const message = (cs: CommitmentStore): JSX.Element | undefined => {
    let messageBody: JSX.Element | undefined;

    if (cs.method === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN || cs.method === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
      messageBody = (
        <>
          <Icon className="info-card-item-icon" icon="exchange" />
          <div>
            Swap {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC} {cs.quoteAsset} for {cs.tokenAsset} (min{' '}
            {cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC})
          </div>
        </>
      );
    }
    if (cs.method === CALL_METHOD.ADD_LIQUIDITY) {
      messageBody = (
        <>
          <img className="navbar-item-icon" src={liqadd} alt="" />
          <div>
            Add {cs.quoteAmount} {cs.quoteAsset} and&nbsp;
            {cs.tokenAmount} {cs.tokenAsset}
          </div>
        </>
      );
    }
    if (cs.method === CALL_METHOD.REMOVE_LIQUIDITY) {
      messageBody = (
        <>
          <img className="navbar-item-icon" src={liqremove} alt="" />
          <div>
            Remove {cs.quoteAmount} {cs.quoteAsset} and&nbsp;
            {cs.tokenAmount} {cs.tokenAsset}
          </div>
        </>
      );
    }
    return (
      <div key={cs.txId} className="info-card-item">
        {messageBody}
        {cs.completed === false ? (
          <Loading width="1.5rem" height="1.5rem" />
        ) : (
          <div>{timeDifference(cs.timestamp)}</div>
        )}
      </div>
    );
  };

  if (data) {
    return (
      <div className="info-card-main">
        <div className="info-card-content">
          {data
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((dt) => {
              return message(dt);
            })}
        </div>
        <div className="info-card-footer">No other record found.</div>
      </div>
    );
  }
  return <div>Coming soon</div>;
};

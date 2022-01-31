import React from 'react';
// import { Icon } from 'rsuite';
import { CALL_METHOD } from '@bitmatrix/models';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { timeDifference } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import Numeral from 'numeral';
import { Loading } from '../Loading/Loading';
import liqadd from '../../images/liqadd.png';
import liqremove from '../../images/liqremove.png';
import ExchangeIcon from '../base/Svg/Icons/Exchange';
import ExportIcon from '../base/Svg/Icons/Export';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  const { getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const data = getLocalData();

  const message = (cs: CommitmentStore): JSX.Element | undefined => {
    let messageBody: JSX.Element | undefined;

    if (cs.method === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
      messageBody = (
        <>
          <div className="info-card-item-icon">
            <ExchangeIcon width="1.25rem" height="1.5rem" />
          </div>
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Swap {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC} {cs.quoteAsset} for {cs.tokenAsset} (min{' '}
            {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')})
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
      messageBody = (
        <>
          <div className="info-card-item-icon">
            <ExchangeIcon width="1.25rem" height="1.5rem" />
          </div>
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Swap {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')} {cs.tokenAsset} for{' '}
            {cs.quoteAsset} (min {cs.quoteAmount / PREFERRED_UNIT_VALUE.LBTC})
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.ADD_LIQUIDITY) {
      messageBody = (
        <>
          <img className="info-card-item-icon info-card-img" src={liqadd} alt="" />
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Add {cs.quoteAmount} {cs.quoteAsset} and&nbsp;
            {Numeral(cs.tokenAmount).format('(0.00a)')} {cs.tokenAsset}
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.REMOVE_LIQUIDITY) {
      messageBody = (
        <>
          <img className="info-card-item-icon info-card-img" src={liqremove} alt="" />
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Remove {cs.quoteAmount} {cs.quoteAsset} and&nbsp;
            {Numeral(cs.tokenAmount).format('(0.00a)')} {cs.tokenAsset}
          </div>
        </>
      );
    }

    return (
      <div key={cs.txId} className="info-card-item">
        {messageBody}
        {!cs.completed && (
          <>
            <div
              className="explorer-div"
              onClick={() =>
                window.open(`https://blockstream.info/liquidtestnet/tx/${cs.poolTxId || cs.txId}`, '_blank')
              }
            >
              View in Block Explorer <ExportIcon fill="#575757" width="1.5rem" height="1.5rem" />
            </div>
          </>
        )}
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
        <div className="info-card-footer">Recent Activity</div>
      </div>
    );
  }
  return <div>Coming soon</div>;
};

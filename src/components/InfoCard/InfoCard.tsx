import React from 'react';
// import { Icon } from 'rsuite';
import { CALL_METHOD } from '@bitmatrix/models';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { quoteAmountRound, timeDifference } from '../../helper';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { useSettingsContext } from '../../context';
import Numeral from 'numeral';
import { Loading } from '../Loading/Loading';
import LiquidityAddIcon from '../base/Svg/Icons/LiquidityAdd';
import LiquidityRemoveIcon from '../base/Svg/Icons/LiquidityRemove';
import ExchangeIcon from '../base/Svg/Icons/Exchange';
// import ExportIcon from '../base/Svg/Icons/Export';
import { CustomPopover } from '../CustomPopover/CustomPopover';
import ExclamationIcon from '../base/Svg/Icons/Exclamation';
import MempoolIcon from '../base/Svg/Icons/Mempool';
import './InfoCard.scss';

export const InfoCard: React.FC = () => {
  const { getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const { settings } = useSettingsContext();

  const data = getLocalData();

  const message = (cs: CommitmentStore): JSX.Element | undefined => {
    let messageBody: JSX.Element | undefined;

    if (cs.method === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
      messageBody = (
        <>
          <div className="info-card-item-icon">
            <ExchangeIcon width="1.25rem" height="1.25rem" />
          </div>
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Swap {quoteAmountRound(cs.quoteAmount / settings.preferred_unit.value)}{' '}
            {`tL-${settings.preferred_unit.text}`} for {cs.tokenAsset} (min{' '}
            {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')})
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
      messageBody = (
        <>
          <div className="info-card-item-icon">
            <ExchangeIcon width="1.25rem" height="1.25rem" />
          </div>
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Swap {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')} {cs.tokenAsset} for{' '}
            {`tL-${settings.preferred_unit.text}`} (min{' '}
            {quoteAmountRound(cs.quoteAmount / settings.preferred_unit.value)})
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.ADD_LIQUIDITY) {
      messageBody = (
        <>
          <LiquidityAddIcon className="info-card-item-icon" width="1.25rem" height="1.25rem" />
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Add {quoteAmountRound(cs.quoteAmount / settings.preferred_unit.value)}{' '}
            {`tL-${settings.preferred_unit.text}`} and&nbsp;
            {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')} {cs.tokenAsset}
          </div>
        </>
      );
    }

    if (cs.method === CALL_METHOD.REMOVE_LIQUIDITY) {
      messageBody = (
        <>
          <LiquidityRemoveIcon className="info-card-item-icon" width="1.25rem" height="1.25rem" />
          <div
            className="info-card-item-text"
            unselectable="on"
            onMouseDown={() => {
              return false;
            }}
          >
            Remove {quoteAmountRound(cs.quoteAmount / settings.preferred_unit.value)}{' '}
            {`tL-${settings.preferred_unit.text}`} and&nbsp;
            {Numeral(cs.tokenAmount / PREFERRED_UNIT_VALUE.LBTC).format('(0.00a)')} {cs.tokenAsset}
          </div>
        </>
      );
    }

    const txStatus = (cs: CommitmentStore): JSX.Element => {
      if (cs.completed) {
        if (cs.isOutOfSlippage) {
          return (
            <CustomPopover placement="right" title="" content="Out of slippage">
              <div>
                <ExclamationIcon width="1.5rem" height="1.5rem" />
              </div>
            </CustomPopover>
          );
        } else {
          return <div>{timeDifference(cs.timestamp)}</div>;
        }
      } else {
        return <Loading width="1.5rem" height="1.5rem" />;
      }
    };

    return (
      <div key={cs.txId} className="info-card-item">
        {messageBody}
        {!cs.completed && (
          <>
            <div
              className="explorer-div"
              onClick={() =>
                // window.open(`https://blockstream.info/liquidtestnet/tx/${cs.poolTxId || cs.txId}`, '_blank')
                window.open(`https://liquid.network/testnet/tx/${cs.poolTxId || cs.txId}`, '_blank')
              }
            >
              {/* View in Block Explorer <ExportIcon fill="#575757" width="1.5rem" height="1.5rem" /> */}
              <span className="info-mempool-text">
                View in &nbsp; <MempoolIcon width="6.5rem" height="1.25rem" />
              </span>

              {/* <ExportIcon fill="#575757" width="1.5rem" height="1.5rem" /> */}
            </div>
          </>
        )}
        {txStatus(cs)}
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

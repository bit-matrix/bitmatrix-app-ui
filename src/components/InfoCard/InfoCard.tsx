import React from 'react';
import { CALL_METHOD } from '@bitmatrix/models';
import { getAssetPrecession, amountRound, timeDifference } from '../../helper';
import { CommitmentStore } from '../../model/CommitmentStore';
import { useSettingsContext, useTxHistoryContext } from '../../context';
import { Loading } from '../base/Loading/Loading';
import LiquidityAddIcon from '../base/Svg/Icons/LiquidityAdd';
import LiquidityRemoveIcon from '../base/Svg/Icons/LiquidityRemove';
import ExchangeIcon from '../base/Svg/Icons/Exchange';
// import ExportIcon from '../base/Svg/Icons/Export';
import { CustomPopover } from '../CustomPopover/CustomPopover';
import ExclamationIcon from '../base/Svg/Icons/Exclamation';
import MempoolIcon from '../base/Svg/Icons/Mempool';
import BananaGif from '../../images/banana.gif';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { EXPLORER } from '../../enum/EXPLORER';
import ExportIcon from '../base/Svg/Icons/Export';
import './InfoCard.scss';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';

export const InfoCard: React.FC = () => {
  const { txHistoryContext } = useTxHistoryContext();
  const { settingsContext } = useSettingsContext();

  const message = (cs: CommitmentStore): JSX.Element | undefined => {
    let messageBody: JSX.Element | undefined;
    let quoteAsset: string;
    let quoteAmount: number;
    const tokenAmount =
      cs.tokenAmount / Math.pow(10, getAssetPrecession(cs.tokenAsset, settingsContext.preferred_unit.text));

    if (cs.quoteAsset.assetHash === lbtcAsset.assetHash) {
      quoteAsset = `tL-${settingsContext.preferred_unit.text}`;
      quoteAmount = cs.quoteAmount / settingsContext.preferred_unit.value;
    } else {
      quoteAsset = cs.quoteAsset.ticker;
      quoteAmount =
        cs.quoteAmount / Math.pow(10, getAssetPrecession(cs.quoteAsset, settingsContext.preferred_unit.text));
    }

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
            Swap {amountRound(quoteAmount)} {quoteAsset} for {cs.tokenAsset.ticker} (min {amountRound(tokenAmount)})
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
            Swap {amountRound(tokenAmount)} {cs.tokenAsset.ticker} for {quoteAsset} (min {amountRound(quoteAmount)})
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
            Add {amountRound(quoteAmount)} {quoteAsset} and&nbsp;
            {amountRound(tokenAmount)} {cs.tokenAsset.ticker}
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
            Remove {amountRound(quoteAmount)} {quoteAsset} and&nbsp;
            {amountRound(tokenAmount)} {cs.tokenAsset.ticker}
          </div>
        </>
      );
    }

    const txStatus = (cs: CommitmentStore): JSX.Element => {
      if (cs.completed) {
        if (cs.errorMessage) {
          return (
            <CustomPopover placement="right" title="" content={cs.errorMessage}>
              <div>
                <ExclamationIcon width="1.5rem" height="1.5rem" />
              </div>
            </CustomPopover>
          );
        } else {
          return <div>{timeDifference(cs.timestamp)}</div>;
        }
      } else {
        if (settingsContext.exclusiveThemes.length > 0 && settingsContext.theme === SELECTED_THEME.BANANA) {
          return (
            <div>
              <img src={BananaGif} alt="loading..." className="info-card-banana-gif" />
            </div>
          );
        } else {
          return <Loading width="1.5rem" height="1.5rem" />;
        }
      }
    };

    return (
      <div key={cs.txId} className="info-card-item">
        {messageBody}
        {!cs.completed && (
          <>
            <div
              className="explorer-div"
              onClick={() => {
                if (settingsContext.explorer === EXPLORER.MEMPOOL) {
                  window.open(`https://liquid.network/testnet/tx/${cs.poolTxId || cs.txId}`, '_blank');
                } else {
                  window.open(`https://blockstream.info/liquidtestnet/tx/${cs.poolTxId || cs.txId}`, '_blank');
                }
              }}
            >
              {settingsContext.explorer === EXPLORER.MEMPOOL ? (
                <span className="info-explorer-text">
                  View in &nbsp; <MempoolIcon width="6.5rem" height="1.25rem" />
                </span>
              ) : (
                <span className="info-explorer-text">
                  View in Block Explorer <ExportIcon fill="#575757" width="1.5rem" height="1.5rem" />
                </span>
              )}
            </div>
          </>
        )}
        {txStatus(cs)}
      </div>
    );
  };

  if (txHistoryContext) {
    return (
      <div className="info-card-main">
        <div className="info-card-content">
          {txHistoryContext
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

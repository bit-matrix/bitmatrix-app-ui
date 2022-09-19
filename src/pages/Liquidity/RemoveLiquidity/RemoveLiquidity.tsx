import { useEffect, useMemo, useState } from 'react';
import { commitmentSign, convertion } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import {
  usePoolContext,
  useSettingsContext,
  useWalletContext,
  usePoolConfigContext,
  useTxHistoryContext,
} from '../../../context';
import Decimal from 'decimal.js';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Button, Content, Slider } from 'rsuite';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getAssetPrecession, getAssetTicker, getPrimaryPoolConfig } from '../../../helper';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import './RemoveLiquidity.scss';
import { lbtcAsset } from '../../../lib/liquid-dev/ASSET';

type Props = {
  checkTxStatusWithIds: (txIds: string[]) => void;
};

enum SELECTED_PERCENTAGE {
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  SEVENTY_FIVE = 75,
  HUNDRED = 100,
}

const RemoveLiquidity: React.FC<Props> = ({ checkTxStatusWithIds }): JSX.Element => {
  const [lpTokenAmount, setLpTokenAmount] = useState<number>(0);
  const [removalPercentage, setRemovalPercentage] = useState<SELECTED_PERCENTAGE>(SELECTED_PERCENTAGE.HUNDRED);
  const [calcLpTokenAmount, setCalcLpTokenAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { poolConfigContext } = usePoolConfigContext();
  const { txHistoryContext, setTxHistoryContext } = useTxHistoryContext();

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const currentPool = pools.find((p) => p.id === id);

  useEffect(() => {
    if (currentPool && walletContext) {
      const lpTokenAssetId = currentPool.lp.assetHash;

      const lpTokenInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === lpTokenAssetId);

      setLpTokenAmount(lpTokenInWallet?.amount || 0);
    }
  }, [currentPool, walletContext]);

  useEffect(() => {
    const lpTokenAmountInput = new Decimal(lpTokenAmount)
      .mul(new Decimal(removalPercentage))
      .div(100)
      .ceil()
      .toNumber();

    setCalcLpTokenAmount(lpTokenAmountInput);
  }, [removalPercentage, lpTokenAmount]);

  const removeLiquidityClick = async () => {
    if (walletContext?.marina) {
      if (currentPool && poolConfigContext) {
        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();
        if (addressInformation.publicKey) {
          const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

          let commitmentTxId = '';

          try {
            commitmentTxId = await commitmentSign.case4(
              walletContext.marina,
              calcLpTokenAmount,
              currentPool,
              primaryPoolConfig,
              addressInformation.publicKey,
              lbtcAsset.assetHash,
              true,
            );
          } catch (error) {
            setLoading(false);
          }

          if (commitmentTxId && commitmentTxId !== '') {
            const calcLpAmounts = calcLpValues();
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount:
                new Decimal(calcLpAmounts.quoteReceived).toNumber() *
                Math.pow(10, getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text)),
              quoteAsset: currentPool.quote,
              tokenAmount:
                new Decimal(calcLpAmounts.tokenReceived).toNumber() *
                Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text)),
              tokenAsset: currentPool.token,
              lpAmount: calcLpTokenAmount,
              lpAsset: currentPool.lp.ticker,
              timestamp: new Date().valueOf(),
              errorMessage: undefined,
              completed: false,
              seen: false,
              method: CALL_METHOD.REMOVE_LIQUIDITY,
            };

            const newStoreData = [...txHistoryContext, tempTxData];
            const unconfirmedTxs = newStoreData.filter((utx) => utx.completed === false);
            const txIds = unconfirmedTxs.map((tx) => tx.txId);

            setTxHistoryContext(newStoreData);

            setLoading(false);

            checkTxStatusWithIds(txIds);
          } else {
            notify('Commitment transaction could not be create.', 'Wallet Error : ', 'error');
            setLoading(false);
          }
          // notify(
          //   <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
          //     See in Explorer
          //   </a>,
          //   'Commitment Tx created successfully!',
          //   'success',
          // );
          // setLoading(false);
          // await sleep(3000);
          // payloadData.wallet.marina.reloadCoins();
        } else {
          notify('Commitment transaction could not be created.', 'Wallet Error : ', 'error');
          // payloadData.wallet.marina.reloadCoins();
          setLoading(false);
        }
      }
    }
  };

  const calcLpValues = () => {
    if (currentPool) {
      const lpAmountN = new Decimal(calcLpTokenAmount).toNumber();
      const recipientValue = convertion.calcRemoveLiquidityRecipientValue(currentPool, lpAmountN);
      const tokenPrecision = getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text);
      const quotePrecision = getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text);
      const quoteReceivedCalc = Number(recipientValue.user_lbtc_received);
      const tokenReceivedCalc = Number(recipientValue.user_token_received);

      return {
        quoteReceived: (quoteReceivedCalc / Math.pow(10, quotePrecision)).toFixed(quotePrecision),
        quoteReceivedNum: quoteReceivedCalc,
        tokenReceived: (tokenReceivedCalc / Math.pow(10, tokenPrecision)).toFixed(tokenPrecision),
        tokenReceivedNum: tokenReceivedCalc,
      };
    }
    return { quoteReceived: '0', tokenReceived: '0', quoteReceivedNum: 0, tokenReceivedNum: 0 };
  };

  const quoteTicker = useMemo(() => {
    if (currentPool) return getAssetTicker(currentPool?.quote, settingsContext.preferred_unit.text);
  }, [currentPool, settingsContext.preferred_unit.text]);

  const tokenTicker = useMemo(() => {
    if (currentPool) return getAssetTicker(currentPool?.token, settingsContext.preferred_unit.text);
  }, [currentPool, settingsContext.preferred_unit.text]);

  const removeLiquidityButtonDisabled = () => {
    if (calcLpTokenAmount <= 0 || loading) return true;
    const calculations = calcLpValues();

    if (currentPool) {
      const poolQuoteValue = Number(currentPool.quote.value);
      const poolTokenValue = Number(currentPool.token.value);

      if (currentPool.quote.assetHash === lbtcAsset.assetHash || currentPool.token.assetHash === lbtcAsset.assetHash) {
        if (
          poolQuoteValue - calculations.quoteReceivedNum < 450 ||
          poolTokenValue - calculations.quoteReceivedNum < 450
        )
          return true;
      } else {
        if (
          poolQuoteValue - calculations.quoteReceivedNum < 100000000 ||
          poolTokenValue - calculations.tokenReceivedNum < 100000000
        )
          return true;
      }
    }

    return false;
  };

  return (
    <div className="remove-liquidity-page-main">
      <Content className="remove-liquidity-page-content">
        {/* {loading && <Loader className="remove-liquidity-page-loading" size="md" inverse center />} */}
        <BackButton
          buttonText="Remove Liquidity"
          onClick={() => {
            const prevPageLocation = history.location.state;
            if (prevPageLocation) {
              history.push({
                pathname: (prevPageLocation as { from: string }).from,
                state: {
                  from: history.location.pathname,
                },
              });
            } else {
              history.push({
                pathname: ROUTE_PATH.POOL,
                state: {
                  from: history.location.pathname,
                },
              });
            }
          }}
        />
        <div>
          <div className="remove-liquidity-main">
            <div className="remove-liquidity-text">
              <div className="remove-liquidity-text-header">Removal Percentage</div>
              <div className="remove-liquidity-text-body">% {removalPercentage}</div>
            </div>
            <div className="remove-liquidity-slider">
              <Slider
                min={0}
                max={100}
                step={0.1}
                value={removalPercentage}
                onChange={(value: number) => setRemovalPercentage(value)}
              />
            </div>
            <div className="remove-liquidity-button-toolbar">
              <Button
                className={`remove-liquidity-buttons mobile-hidden ${
                  removalPercentage === SELECTED_PERCENTAGE.TEN && 'selected-percentage'
                }`}
                appearance="ghost"
                onClick={() => setRemovalPercentage(SELECTED_PERCENTAGE.TEN)}
              >
                % {SELECTED_PERCENTAGE.TEN}
              </Button>
              <Button
                className={`remove-liquidity-buttons ${
                  removalPercentage === SELECTED_PERCENTAGE.TWENTY_FIVE && 'selected-percentage'
                }`}
                appearance="ghost"
                onClick={() => setRemovalPercentage(SELECTED_PERCENTAGE.TWENTY_FIVE)}
              >
                % {SELECTED_PERCENTAGE.TWENTY_FIVE}
              </Button>
              <Button
                className={`remove-liquidity-buttons ${
                  removalPercentage === SELECTED_PERCENTAGE.FIFTY && 'selected-percentage'
                }`}
                appearance="ghost"
                onClick={() => setRemovalPercentage(SELECTED_PERCENTAGE.FIFTY)}
              >
                % {SELECTED_PERCENTAGE.FIFTY}
              </Button>
              <Button
                className={`remove-liquidity-buttons ${
                  removalPercentage === SELECTED_PERCENTAGE.SEVENTY_FIVE && 'selected-percentage'
                }`}
                appearance="ghost"
                onClick={() => setRemovalPercentage(SELECTED_PERCENTAGE.SEVENTY_FIVE)}
              >
                % {SELECTED_PERCENTAGE.SEVENTY_FIVE}
              </Button>
              <Button
                className={`remove-liquidity-buttons ${
                  removalPercentage === SELECTED_PERCENTAGE.HUNDRED && 'selected-percentage'
                }`}
                appearance="ghost"
                onClick={() => setRemovalPercentage(SELECTED_PERCENTAGE.HUNDRED)}
              >
                % {SELECTED_PERCENTAGE.HUNDRED}
              </Button>
            </div>
          </div>

          <div className="remove-liquidity-page-footer">
            <div className="remove-liquidity-page-footer-line-item-first">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">{quoteTicker} You Get</span>
                {currentPool?.quote && (
                  <AssetIcon
                    className="liquidity-btc-icon"
                    width="1.5rem"
                    height="1.5rem"
                    asset={currentPool?.quote.assetHash || ''}
                  />
                )}
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().quoteReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-second mobile-hidden">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">{tokenTicker} You Get</span>
                {currentPool?.token && (
                  <AssetIcon
                    className="liquidity-usdt-icon"
                    width="1.5rem"
                    height="1.5rem"
                    asset={currentPool?.token.assetHash}
                  />
                )}
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().tokenReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-third">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">LP You Redeem</span>
                <LpIcon className="lp-icon" width="1.5rem" height="1.5rem" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">
                {(Number(calcLpTokenAmount) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8)}
              </div>
            </div>
          </div>
        </div>
        <div className="remove-liquidity-button-content">
          <WalletButton
            text={`Remove ${quoteTicker} and ${tokenTicker}`}
            loading={loading}
            onClick={() => {
              removeLiquidityClick();
            }}
            disabled={removeLiquidityButtonDisabled()}
            className="remove-liquidity-button"
          />
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;

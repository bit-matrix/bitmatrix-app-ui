import React, { useEffect, useState } from 'react';
import { api, commitmentTx, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import { usePoolConfigContext, usePoolContext, useSettingsContext, useWalletContext } from '../../../context';
import Decimal from 'decimal.js';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Button, Content, Slider } from 'rsuite';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import LbtcIcon from '../../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../../components/base/Svg/Icons/Tether';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getPrimaryPoolConfig } from '../../../helper';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import './RemoveLiquidity.scss';

enum SELECTED_PERCENTAGE {
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50,
  SEVENTY_FIVE = 75,
  HUNDRED = 100,
}

const RemoveLiquidity = (): JSX.Element => {
  const [lpTokenAmount, setLpTokenAmount] = useState<number>(0);
  const [removalPercentage, setRemovalPercentage] = useState<SELECTED_PERCENTAGE>(SELECTED_PERCENTAGE.HUNDRED);
  const [calcLpTokenAmount, setCalcLpTokenAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { poolConfigContext } = usePoolConfigContext();
  const { settingsContext } = useSettingsContext();

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const history = useHistory();

  useEffect(() => {
    if (poolsContext && poolsContext.length > 0 && walletContext) {
      const currentPool = poolsContext[0];
      const lpTokenAssetId = currentPool.lp.asset;

      const lpTokenInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === lpTokenAssetId);

      setLpTokenAmount(lpTokenInWallet?.amount || 0);
    }
  }, [poolsContext, walletContext?.balances]);

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
      const methodCall = CALL_METHOD.REMOVE_LIQUIDITY;

      if (poolsContext && poolConfigContext) {
        const pool = poolsContext[0];
        const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

        const fundingTxInputs = fundingTxForLiquidity(0, calcLpTokenAmount, pool, primaryPoolConfig, methodCall);

        let fundingTxId;

        try {
          setLoading(true);
          const fundingTx = await walletContext.marina.sendTransaction([
            {
              address: fundingTxInputs.fundingOutput1Address,
              value: fundingTxInputs.fundingOutput1Value,
              asset: fundingTxInputs.fundingOutput1AssetId,
            },
            {
              address: fundingTxInputs.fundingOutput2Address,
              value: fundingTxInputs.fundingOutput2Value,
              asset: fundingTxInputs.fundingOutput2AssetId,
            },
          ]);

          fundingTxId = await api.sendRawTransaction(fundingTx.hex);
        } catch (err: any) {
          notify(err.toString(), 'Wallet Error : ', 'error');
          setLoading(false);
          // payloadData.wallet.marina.reloadCoins();
          return Promise.reject();
        }

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (fundingTxId && fundingTxId !== '' && addressInformation.publicKey) {
          const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

          const commitment = commitmentTx.liquidityRemoveCreateCommitmentTx(
            calcLpTokenAmount,
            fundingTxId,
            addressInformation.publicKey,
            primaryPoolConfig,
            pool,
          );

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
            const calcLpAmounts = calcLpValues();

            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: new Decimal(calcLpAmounts.quoteReceived).toNumber() * settingsContext.preferred_unit.value,
              quoteAsset: pool.quote.ticker,
              tokenAmount: new Decimal(calcLpAmounts.tokenReceived).toNumber() * PREFERRED_UNIT_VALUE.LBTC,
              tokenAsset: pool.token.ticker,
              lpAmount: calcLpTokenAmount,
              lpAsset: pool.lp.ticker,
              timestamp: new Date().valueOf(),
              isOutOfSlippage: false,
              completed: false,
              seen: false,
              method: CALL_METHOD.REMOVE_LIQUIDITY,
            };

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);
          }

          // notify(
          //   <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
          //     See in Explorer
          //   </a>,
          //   'Commitment Tx created successfully!',
          //   'success',
          // );

          setLoading(false);
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
    const currentPool = poolsContext;
    if (currentPool && currentPool.length > 0) {
      const lpAmountN = new Decimal(calcLpTokenAmount).toNumber();
      const recipientValue = convertion.calcRemoveLiquidityRecipientValue(currentPool[0], lpAmountN);
      return {
        quoteReceived: (Number(recipientValue.user_lbtc_received) / settingsContext.preferred_unit.value).toString(),
        tokenReceived: (Number(recipientValue.user_token_received) / PREFERRED_UNIT_VALUE.LBTC).toFixed(2),
      };
    }
    return { quoteReceived: '0', tokenReceived: '0' };
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
                <span className="remove-liquidity-page-footer-line-item-texts">
                  tL-{settingsContext.preferred_unit.text} You Get
                </span>
                <LbtcIcon className="liquidity-btc-icon" width="1.5rem" height="1.5rem" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().quoteReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-second mobile-hidden">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">tL-USDT You Get</span>
                <TetherIcon className="liquidity-usdt-icon" width="1.5rem" height="1.5rem" />
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
            text={`Remove tL-${settingsContext.preferred_unit.text} and ${SWAP_ASSET.USDT}`}
            loading={loading}
            onClick={() => {
              removeLiquidityClick();
            }}
            disabled={calcLpTokenAmount <= 0}
            className="remove-liquidity-button"
          />
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;

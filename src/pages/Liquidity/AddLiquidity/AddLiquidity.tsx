import React, { useState } from 'react';
import { commitmentSign, convertion } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import { usePoolConfigContext, usePoolContext, useSettingsContext, useWalletContext } from '../../../context';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Content } from 'rsuite';
import Decimal from 'decimal.js';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getAssetPrecession, getPrimaryPoolConfig, poolShareRound } from '../../../helper';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import LbtcIcon from '../../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../../components/base/Svg/Icons/Tether';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import PercentIcon from '../../../components/base/Svg/Icons/Percent';
import RewardIcon from '../../../components/base/Svg/Icons/Reward';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import { NumericalInput } from '../../../components/NumericalInput/NumericalInput';
import { Balance } from 'marina-provider';
import './AddLiquidity.scss';

const AddLiquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { poolConfigContext } = usePoolConfigContext();
  const { settingsContext } = useSettingsContext();

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const history = useHistory();

  const onChangeQuoteAmount = (input: string) => {
    const inputNum = Number(input);

    if (poolsContext && poolConfigContext && input !== '.') {
      const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

      const output = convertion.convertForLiquidityCtx(
        inputNum * settingsContext.preferred_unit.value,
        poolsContext[0],
        primaryPoolConfig,
      );

      setQuoteAmount(input);
      setTokenAmount((output / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
      setUsdtPercent(undefined);
    }
  };

  const onChangeTokenAmount = (input: string) => {
    const inputNum = Number(input);

    if (poolsContext && poolConfigContext && input !== '.') {
      const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

      const output = convertion.convertForLiquidityCtx(
        inputNum * PREFERRED_UNIT_VALUE.LBTC,
        poolsContext[0],
        primaryPoolConfig,
        true,
      );

      setQuoteAmount((output / settingsContext.preferred_unit.value).toString());
      setTokenAmount(input);
      setLbtcPercent(undefined);
    }
  };

  const calcAmountPercent = (
    lbctPercent: FROM_AMOUNT_PERCENT | undefined,
    usdtPercent: FROM_AMOUNT_PERCENT | undefined,
    balances: Balance[],
  ) => {
    if (poolsContext && poolsContext.length > 0 && poolConfigContext && walletContext && balances.length > 0) {
      const currentPool = poolsContext[0];

      let inputAmount = '';

      const quoteAssetId = currentPool.quote.asset;
      const quoteTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

      const totalFee =
        primaryPoolConfig.baseFee.number +
        primaryPoolConfig.commitmentTxFee.number +
        primaryPoolConfig.defaultOrderingFee.number +
        primaryPoolConfig.serviceFee.number +
        1000;

      if (quoteTotalAmountInWallet) {
        const quoteAmount = quoteTotalAmountInWallet - totalFee;
        if (quoteAmount > 0) {
          if (lbctPercent && quoteTotalAmountInWallet) {
            if (lbctPercent === FROM_AMOUNT_PERCENT.ALL) {
              inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
            }
            if (lbctPercent === FROM_AMOUNT_PERCENT.HALF) {
              const quoteAmountHalf = Math.ceil(quoteAmount / 2);
              inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
            }
            if (lbctPercent === FROM_AMOUNT_PERCENT.MIN) {
              inputAmount = (poolConfigContext.minRemainingSupply / settingsContext.preferred_unit.value).toString();
            }
            onChangeQuoteAmount(inputAmount);
            setUsdtPercent(undefined);
            setLbtcPercent(lbctPercent);
          }
        }
        if (usdtPercent && tokenTotalAmountInWallet) {
          if (usdtPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (tokenTotalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (usdtPercent === FROM_AMOUNT_PERCENT.HALF) {
            const tokenAmountInWalletHalf = tokenTotalAmountInWallet / 2;
            inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (usdtPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfigContext.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          onChangeTokenAmount(inputAmount);
          setLbtcPercent(undefined);
          setUsdtPercent(usdtPercent);
        }
        if (!usdtPercent && !lbctPercent) {
          onChangeTokenAmount('0');
          setLbtcPercent(undefined);
          setUsdtPercent(undefined);
        }
      }
    }
  };

  const inputsIsValid = () => {
    if (poolsContext && poolsContext.length > 0 && poolConfigContext && walletContext) {
      let tokenIsValid = false;
      let quoteIsValid = false;

      const currentPool = poolsContext[0];

      if (parseFloat(quoteAmount) > 0 || parseFloat(tokenAmount) > 0) {
        const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

        const totalFee =
          primaryPoolConfig.baseFee.number +
          primaryPoolConfig.commitmentTxFee.number +
          primaryPoolConfig.defaultOrderingFee.number +
          primaryPoolConfig.serviceFee.number +
          1000;

        const quoteAssetId = currentPool.quote.asset;
        const quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

        const tokenAssetId = currentPool.token.asset;
        const tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

        let quoteAmountWallet = 0;
        if (quoteAmountInWallet && quoteAmountInWallet > 0) {
          quoteAmountWallet = (quoteAmountInWallet - totalFee) / settingsContext.preferred_unit.value;
        }

        let tokenAmountWallet = '';
        if (tokenAmountInWallet && tokenAmountInWallet > 0) {
          tokenAmountWallet = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }

        if (Number(quoteAmount) <= quoteAmountWallet && quoteAmountWallet > 0) {
          quoteIsValid = true;
        } else {
          quoteIsValid = false;
        }

        if (Number(tokenAmount) <= Number(tokenAmountWallet) && Number(tokenAmountWallet) > 0) {
          tokenIsValid = true;
        } else {
          tokenIsValid = false;
        }

        return { tokenIsValid, quoteIsValid };
      }
    }
    return { tokenIsValid: true, quoteIsValid: true };
  };

  const addLiquidityClick = async () => {
    if (walletContext?.marina) {
      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(settingsContext.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();

      if (poolsContext && poolConfigContext) {
        const pool = poolsContext[0];

        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

          const commitment = await commitmentSign.case3(
            walletContext.marina,
            quoteAmountN,
            tokenAmountN,

            pool,
            primaryPoolConfig,
            addressInformation.publicKey,
          );

          if (commitment && commitment !== '') {
            setQuoteAmount('');
            setTokenAmount('');
            setLbtcPercent(undefined);
            setUsdtPercent(undefined);

            const tempTxData: CommitmentStore = {
              txId: commitment,
              quoteAmount: quoteAmountN,
              quoteAsset: pool.quote.ticker,
              tokenAmount: tokenAmountN,
              tokenAsset: pool.token.ticker,
              lpAmount: new Decimal(calcLpValues().lpReceived).toNumber(),
              lpAsset: pool.lp.ticker,
              timestamp: new Date().valueOf(),
              isOutOfSlippage: false,
              completed: false,
              seen: false,
              method: CALL_METHOD.ADD_LIQUIDITY,
            };

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);

            window.open('https://blockstream.info/liquidtestnet/tx/' + commitment, '_blank');
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
    if (currentPool && currentPool.length > 0 && quoteAmount !== '' && tokenAmount !== '') {
      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(settingsContext.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      const recipientValue = convertion.calcAddLiquidityRecipientValue(currentPool[0], quoteAmountN, tokenAmountN);

      return {
        lpReceived: (Number(recipientValue.lpReceived) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8),
        poolRate: poolShareRound(Number(recipientValue.poolRate) * 100),
      };
    }
    return { lpReceived: '0', poolRate: '0' };
  };

  return (
    <div className="add-liquidity-page-main">
      <Content className="add-liquidity-page-content">
        {/* {loading && <Loader className="add-liquidity-page-loading" size="md" inverse center />} */}
        <BackButton
          buttonText="Add Liquidity"
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
          <div className="add-liquidity-main">
            <div
              className={`add-liquidity-item pt8 ${
                !inputsIsValid()?.quoteIsValid ? 'add-liquidity-invalid-content' : ''
              }`}
            >
              <SwapFromTab
                selectedFromAmountPercent={lbctPercent}
                setselectedFromAmountPercent={(lbtcPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(lbtcPercent, undefined, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{`tL-${settingsContext.preferred_unit.text}`} Liquidity</div>
                    <LbtcIcon className="add-liquidity-input-icons" width="1.75rem" height="1.75rem" />
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={quoteAmount}
                    onChange={(inputValue) => {
                      onChangeQuoteAmount(inputValue);
                      setLbtcPercent(undefined);
                    }}
                    decimalLength={getAssetPrecession(SWAP_ASSET.LBTC, settingsContext.preferred_unit.text)}
                  />
                </div>
              </div>
            </div>
            <div className="add-liquidity-plus-icon">
              <img className="add-liquidity-page-icons" src={plus} alt="" />
            </div>
            <div
              className={`add-liquidity-item pt8 ${
                !inputsIsValid()?.tokenIsValid ? 'add-liquidity-invalid-content' : ''
              }`}
            >
              <SwapFromTab
                selectedFromAmountPercent={usdtPercent}
                setselectedFromAmountPercent={(usdtPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(undefined, usdtPercent, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{SWAP_ASSET.USDT} Liquidity</div>
                    <TetherIcon className="add-liquidity-input-icons" width="1.75rem" height="1.75rem" />
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={tokenAmount}
                    onChange={(inputValue) => {
                      onChangeTokenAmount(inputValue);
                      setUsdtPercent(undefined);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add-liquidity-page-footer">
            <div className="add-liquidity-page-footer-line-item-first">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">LP you will get</span>
                <LpIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">{calcLpValues().lpReceived}</div>
            </div>
            <div className="add-liquidity-page-footer-line-item-second mobile-hidden">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">LP rewards</span>
                <RewardIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">% 0.2</div>
            </div>
            <div className="add-liquidity-page-footer-line-item-third">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">Pool Share</span>
                <PercentIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">% {calcLpValues().poolRate}</div>
            </div>
          </div>
          <div className="add-liquidity-button-content">
            <WalletButton
              text={`Add tL-${settingsContext.preferred_unit.text} and ${SWAP_ASSET.USDT}`}
              loading={loading}
              onClick={() => {
                addLiquidityClick();
              }}
              disabled={
                Number(quoteAmount) <= 0 ||
                Number(tokenAmount) <= 0 ||
                !inputsIsValid()?.tokenIsValid ||
                !inputsIsValid()?.quoteIsValid
              }
              className="add-liquidity-button"
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AddLiquidity;

import { useCallback, useEffect, useState } from 'react';
import { commitmentSign, convertion } from '@bitmatrix/lib';
import { CALL_METHOD, PAsset } from '@bitmatrix/models';
import { usePoolContext, useSettingsContext, useWalletContext, usePoolConfigContext } from '../../../context';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Content } from 'rsuite';
import Decimal from 'decimal.js';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getAssetPrecession, getPrimaryPoolConfig, getAssetTicker, poolShareRound } from '../../../helper';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import PercentIcon from '../../../components/base/Svg/Icons/Percent';
import RewardIcon from '../../../components/base/Svg/Icons/Reward';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import { NumericalInput } from '../../../components/NumericalInput/NumericalInput';
import { Balance } from 'marina-provider';
import './AddLiquidity.scss';

type Props = {
  checkTxStatusWithIds: () => void;
};

const AddLiquidity: React.FC<Props> = ({ checkTxStatusWithIds }): JSX.Element => {
  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { poolConfigContext } = usePoolConfigContext();

  const [quote, setQuote] = useState<PAsset>();
  const [token, setToken] = useState<PAsset>();

  const [quotePercent, setQuotePercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenPercent, setTokenPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [loading, setLoading] = useState<boolean>(false);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const currentPool = pools.find((p) => p.id === id);

  useEffect(() => {
    if (currentPool) {
      setQuote({
        ticker: currentPool.quote.ticker,
        name: currentPool.quote.name,
        assetHash: currentPool.quote.assetHash,
        precision: currentPool.quote.precision,
        value: '',
      });
      setToken({
        ticker: currentPool.token.ticker,
        name: currentPool.token.name,
        assetHash: currentPool.token.assetHash,
        precision: currentPool.token.precision,
        value: '',
      });
    }
  }, [currentPool]);

  const onChangeQuoteAmount = useCallback(
    (input: string) => {
      const inputNum = Number(input);

      if (currentPool && poolConfigContext && input !== '.') {
        const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

        const output = convertion.convertForLiquidityCtx(
          inputNum * settingsContext.preferred_unit.value,
          currentPool,
          primaryPoolConfig,
        );

        setQuote({ ...quote, value: input } as PAsset);
        setToken({ ...token, value: (output / PREFERRED_UNIT_VALUE.LBTC).toFixed(2) } as PAsset);
        setQuotePercent(undefined);
      }
    },
    [currentPool, poolConfigContext, settingsContext.preferred_unit.value],
  );

  const onChangeTokenAmount = useCallback(
    (input: string) => {
      const inputNum = Number(input);

      if (currentPool && poolConfigContext && input !== '.') {
        const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

        const output = convertion.convertForLiquidityCtx(
          inputNum * PREFERRED_UNIT_VALUE.LBTC,
          currentPool,
          primaryPoolConfig,
          true,
        );

        if (quote?.ticker === SWAP_ASSET.LBTC) {
          setQuote({ ...quote, value: (output / settingsContext.preferred_unit.value).toFixed(2) } as PAsset);
        } else {
          setQuote({ ...quote, value: (output / PREFERRED_UNIT_VALUE.LBTC).toString() } as PAsset);
        }

        setToken({ ...token, value: input } as PAsset);

        setQuotePercent(undefined);
      }
    },
    [currentPool, poolConfigContext, settingsContext.preferred_unit.value],
  );

  const calcAmountPercent = useCallback(
    (
      quotePercent: FROM_AMOUNT_PERCENT | undefined,
      tokenPercent: FROM_AMOUNT_PERCENT | undefined,
      balances: Balance[],
    ) => {
      if (currentPool && poolConfigContext && walletContext && balances.length > 0) {
        let inputAmount = '';

        const quoteTotalAmountInWallet = balances.find(
          (bl) => bl.asset.assetHash === currentPool.quote.assetHash,
        )?.amount;

        const tokenTotalAmountInWallet = balances.find(
          (bl) => bl.asset.assetHash === currentPool.token.assetHash,
        )?.amount;

        const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

        const totalFee =
          primaryPoolConfig.baseFee.number +
          primaryPoolConfig.commitmentTxFee.number +
          primaryPoolConfig.defaultOrderingFee.number +
          primaryPoolConfig.serviceFee.number +
          1000;

        if (quoteTotalAmountInWallet && quoteTotalAmountInWallet > 0 && quotePercent) {
          const quoteAmount = quoteTotalAmountInWallet - totalFee;

          if (quoteAmount > 0) {
            if (quote?.ticker === SWAP_ASSET.LBTC) {
              if (quotePercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.HALF) {
                const quoteAmountHalf = Math.ceil(quoteAmount / 2);
                inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (poolConfigContext.minRemainingSupply / settingsContext.preferred_unit.value).toString();
              }
            } else {
              if (quotePercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (quoteAmount / PREFERRED_UNIT_VALUE.LBTC).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.HALF) {
                const quoteAmountHalf = Math.ceil(quoteAmount / 2);
                inputAmount = (quoteAmountHalf / PREFERRED_UNIT_VALUE.LBTC).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (poolConfigContext.minRemainingSupply / PREFERRED_UNIT_VALUE.LBTC).toString();
              }
            }
            onChangeQuoteAmount(inputAmount);
            setTokenPercent(undefined);
            setQuotePercent(quotePercent);
          }
        }
        if (tokenPercent && tokenTotalAmountInWallet) {
          if (tokenPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (tokenTotalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (tokenPercent === FROM_AMOUNT_PERCENT.HALF) {
            const tokenAmountInWalletHalf = tokenTotalAmountInWallet / 2;
            inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (tokenPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfigContext.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          onChangeTokenAmount(inputAmount);
          setQuotePercent(undefined);
          setTokenPercent(tokenPercent);
        }
        if (!tokenPercent && !quotePercent) {
          onChangeTokenAmount('0');
          setQuotePercent(undefined);
          setTokenPercent(undefined);
        }
      }
    },
    [currentPool, poolConfigContext, walletContext],
  );

  const inputsIsValid = useCallback(() => {
    if (currentPool && poolConfigContext && walletContext) {
      let tokenIsValid = false;
      let quoteIsValid = false;

      if ((quote?.value && parseFloat(quote?.value) > 0) || (token?.value && parseFloat(token?.value) > 0)) {
        const quoteAssetId = currentPool.quote.assetHash;
        const quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

        const tokenAssetId = currentPool.token.assetHash;
        const tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

        let quoteAmountWallet = 0;
        if (quoteAmountInWallet && quoteAmountInWallet > 0) {
          if (quote?.ticker === SWAP_ASSET.LBTC) {
            const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

            const totalFee =
              primaryPoolConfig.baseFee.number +
              primaryPoolConfig.commitmentTxFee.number +
              primaryPoolConfig.defaultOrderingFee.number +
              primaryPoolConfig.serviceFee.number +
              1000;

            quoteAmountWallet = (quoteAmountInWallet - totalFee) / settingsContext.preferred_unit.value;
          } else {
            quoteAmountWallet = quoteAmountInWallet / PREFERRED_UNIT_VALUE.LBTC;
          }
        }

        let tokenAmountWallet = '';
        if (tokenAmountInWallet && tokenAmountInWallet > 0) {
          tokenAmountWallet = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }

        if (Number(quote?.value) <= quoteAmountWallet && quoteAmountWallet > 0) {
          quoteIsValid = true;
        } else {
          quoteIsValid = false;
        }

        if (Number(token?.value) <= Number(tokenAmountWallet) && Number(tokenAmountWallet) > 0) {
          tokenIsValid = true;
        } else {
          tokenIsValid = false;
        }

        return { tokenIsValid, quoteIsValid };
      }
    }
    return { tokenIsValid: true, quoteIsValid: true };
  }, [currentPool, poolConfigContext, quote?.value, token?.value, walletContext]);

  const addLiquidityClick = async () => {
    if (walletContext?.marina) {
      const quoteAmountN = new Decimal(Number(quote?.value))
        .mul(quote?.ticker === SWAP_ASSET.LBTC ? settingsContext.preferred_unit.value : PREFERRED_UNIT_VALUE.LBTC)
        .toNumber();
      const tokenAmountN = new Decimal(Number(token?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();

      if (currentPool && poolConfigContext) {
        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          setQuote({ ...quote, value: '' } as PAsset);
          setToken({ ...token, value: '' } as PAsset);
          setQuotePercent(undefined);
          setTokenPercent(undefined);
          const primaryPoolConfig = getPrimaryPoolConfig(poolConfigContext);

          const commitmentTxId = await commitmentSign.case3(
            walletContext.marina,
            quoteAmountN,
            tokenAmountN,
            currentPool,
            primaryPoolConfig,
            addressInformation.publicKey,
          );

          if (commitmentTxId && commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: quoteAmountN,
              quoteAsset: currentPool.quote.ticker,
              tokenAmount: tokenAmountN,
              tokenAsset: currentPool.token.ticker,
              lpAmount: new Decimal(calcLpValues().lpReceived).toNumber(),
              lpAsset: currentPool.lp.ticker,
              timestamp: new Date().valueOf(),
              isOutOfSlippage: false,
              completed: false,
              seen: false,
              method: CALL_METHOD.ADD_LIQUIDITY,
            };
            const storeOldData = getLocalData() || [];
            const newStoreData = [...storeOldData, tempTxData];
            setLocalData(newStoreData);
            setLoading(false);

            checkTxStatusWithIds();
          }
          // notify(
          //   <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
          //     See in Explorer
          //   </a>,
          //   'Commitment Tx created successfully!',
          //   'success',
          // );

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

  const calcLpValues = useCallback(() => {
    if (currentPool && quote?.value !== '' && token?.value !== '') {
      const quoteAmountN = new Decimal(Number(quote?.value))
        .mul(quote?.ticker === SWAP_ASSET.LBTC ? settingsContext.preferred_unit.value : PREFERRED_UNIT_VALUE.LBTC)
        .toNumber();
      const tokenAmountN = new Decimal(Number(token?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      const recipientValue = convertion.calcAddLiquidityRecipientValue(currentPool, quoteAmountN, tokenAmountN);

      return {
        lpReceived: (Number(recipientValue.lpReceived) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8),
        poolRate: poolShareRound(Number(recipientValue.poolRate) * 100),
      };
    }
    return { lpReceived: '0', poolRate: '0' };
  }, [currentPool, quote?.value, token?.value]);

  const quoteTicker = getAssetTicker(currentPool?.quote, settingsContext.preferred_unit.text);
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
                selectedFromAmountPercent={quotePercent}
                setselectedFromAmountPercent={(quotePercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(quotePercent, undefined, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{quoteTicker} Liquidity</div>
                    {currentPool?.quote && (
                      <AssetIcon
                        className="add-liquidity-input-icons"
                        width="1.75rem"
                        height="1.75rem"
                        asset={currentPool?.quote}
                      />
                    )}
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={quote?.value || ''}
                    onChange={(inputValue) => {
                      onChangeQuoteAmount(inputValue);
                      setQuotePercent(undefined);
                    }}
                    decimalLength={
                      quote?.ticker === SWAP_ASSET.LBTC
                        ? getAssetPrecession(SWAP_ASSET.LBTC, settingsContext.preferred_unit.text)
                        : 2
                    }
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
                selectedFromAmountPercent={tokenPercent}
                setselectedFromAmountPercent={(tokenPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(undefined, tokenPercent, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{currentPool?.token.ticker} Liquidity</div>
                    {currentPool?.token && (
                      <AssetIcon
                        className="add-liquidity-input-icons"
                        width="1.75rem"
                        height="1.75rem"
                        asset={currentPool.token}
                      />
                    )}
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={token?.value || ''}
                    onChange={(inputValue) => {
                      onChangeTokenAmount(inputValue);
                      setTokenPercent(undefined);
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
              text={`Add ${quoteTicker} and ${token?.ticker}`}
              loading={loading}
              onClick={() => {
                addLiquidityClick();
              }}
              disabled={
                Number(quote?.value) <= 0 ||
                Number(token?.value) <= 0 ||
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

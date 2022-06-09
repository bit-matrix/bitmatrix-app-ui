/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { Button, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SWAP_WAY from '../../enum/SWAP_WAY';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { api, convertion, commitmentSign } from '@bitmatrix/lib';
import { CALL_METHOD, Pool, BmConfig, PAsset } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import { getAssetPrecession, isQuote, uniqueAssetList } from '../../helper';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import { usePoolContext, useWalletContext, useSettingsContext } from '../../context';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import './Swap3.scss';

export const Swap3 = (): JSX.Element => {
  const [swapWay, setSwapWay] = useState<SWAP_WAY>();

  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [pairAsset, setPairAsset] = useState<{
    up?: PAsset;
    down?: PAsset;
  }>({ up: lbtcAsset });

  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);

  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const [currentPool, setCurrentPool] = useState<Pool>();

  const [poolConfig, setPoolConfig] = useState<BmConfig>();

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const [loading, setLoading] = useState<boolean>(false);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();

  const [assetList, setAssetList] = useState<{
    quote: PAsset[];
    token: PAsset[];
  }>(uniqueAssetList(poolsContext));

  document.title = ROUTE_PATH_TITLE.SWAP;

  // const assetList = uniqueAssetList(poolsContext);

  useEffect(() => {
    if (currentPool && poolConfig && pairAsset) {
      if (swapWay === SWAP_WAY.FROM) {
        console.log('FROM');

        onChangeFromInput(currentPool, poolConfig, pairAsset.up?.value || '');
      } else {
        console.log('TO');
        onChangeToInput(currentPool, poolConfig, pairAsset.down?.value || '');
      }
    }
  }, [currentPool, poolConfig, swapWay, pairAsset.down?.value, pairAsset.up?.value]);

  const onChangeFromInput = useCallback(
    (current_pool: Pool, pool_config: BmConfig, input: string) => {
      let inputNum = Number(input);

      let methodCall;

      if (current_pool && pool_config && Number(pairAsset.up?.value) > 0) {
        console.log('onChangeFromInput');
        if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
          inputNum = inputNum * settingsContext.preferred_unit.value;
        } else {
          inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
        }

        if (pairAsset.up && isQuote(current_pool, pairAsset.up)) {
          methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        } else {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        }

        const output = convertion.convertForCtx(
          inputNum,
          settingsContext.slippage,
          current_pool,
          pool_config,
          methodCall,
        );

        if (output.amount > 0) {
          if (isQuote(current_pool, pairAsset.up)) {
            if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
              setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
              setPairAsset({
                ...pairAsset,
                down: { ...pairAsset.down, value: (output.amount / PREFERRED_UNIT_VALUE.LBTC).toString() } as PAsset,
              });
            } else {
              setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
              setPairAsset({
                ...pairAsset,
                down: {
                  ...pairAsset.down,
                  value: (output.amount / settingsContext.preferred_unit.value).toString(),
                } as PAsset,
              });
            }
          } else {
            setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
            setPairAsset({
              ...pairAsset,
              down: {
                ...pairAsset.down,
                value: (output.amount / settingsContext.preferred_unit.value).toString(),
              } as PAsset,
            });
          }
        } else {
          setPairAsset({
            ...pairAsset,
            down: { ...pairAsset.down, value: '' } as PAsset,
          });
          setAmountWithSlippage(0);
        }
      } else {
        setPairAsset({
          ...pairAsset,
          down: { ...pairAsset.down, value: '' } as PAsset,
        });
        setAmountWithSlippage(0);
      }
    },
    [pairAsset],
  );

  const onChangeToInput = useCallback(
    (current_pool: Pool, pool_config: BmConfig, input: string) => {
      let inputNum = Number(input);

      let methodCall;

      if (current_pool && pool_config && Number(pairAsset.down?.value) > 0) {
        console.log('onChangeToInput');
        if (pairAsset.down?.ticker === SWAP_ASSET.LBTC) {
          inputNum = inputNum * settingsContext.preferred_unit.value;
        } else {
          inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
        }

        if (pairAsset.down && !isQuote(current_pool, pairAsset.down)) {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        } else {
          methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        }

        const output = convertion.convertForCtx2(
          inputNum,
          settingsContext.slippage,
          current_pool,
          pool_config,
          methodCall,
        );

        if (output.amount > 0) {
          if (!isQuote(current_pool, pairAsset.up)) {
            if (pairAsset.down?.ticker === SWAP_ASSET.LBTC) {
              setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
              setPairAsset({
                ...pairAsset,
                up: { ...pairAsset.up, value: (output.amount / PREFERRED_UNIT_VALUE.LBTC).toFixed(2) } as PAsset,
              });
            } else {
              setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
              setPairAsset({
                ...pairAsset,
                up: {
                  ...pairAsset.up,
                  value: (output.amount / settingsContext.preferred_unit.value).toString(),
                } as PAsset,
              });
            }
          } else {
            setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
            setPairAsset({
              ...pairAsset,
              up: {
                ...pairAsset.up,
                value: (output.amount / settingsContext.preferred_unit.value).toString(),
              } as PAsset,
            });
          }
        } else {
          setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: '' } as PAsset });
          setAmountWithSlippage(0);
        }
      } else {
        setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: '' } as PAsset });
        setAmountWithSlippage(0);
      }
    },
    [pairAsset],
  );

  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => {
    console.log(pairAsset.up?.ticker);

    if (poolsContext.length > 0 && poolConfig && walletContext && balances.length > 0) {
      let inputAmount = '';
      setSwapWay(SWAP_WAY.FROM);
      const totalAmountInWallet = balances.find((bl) => bl.asset.assetHash === pairAsset.up?.assetHash)?.amount || 0;

      if (totalAmountInWallet > 0) {
        if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
          console.log('btc');

          const totalFee =
            poolConfig.baseFee.number +
            poolConfig.commitmentTxFee.number +
            poolConfig.defaultOrderingFee.number +
            poolConfig.serviceFee.number +
            1000;
          const quoteAmount = totalAmountInWallet - totalFee;

          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
            const quoteAmountHalf = Math.ceil(quoteAmount / 2);
            inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfig.minRemainingSupply / settingsContext.preferred_unit.value).toString();
          }
        } else {
          console.log('usdt');
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (totalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
            const tokenAmountInWalletHalf = totalAmountInWallet / 2;
            inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
        }
        console.log('up', inputAmount);

        setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: inputAmount } as PAsset });
        setSelectedFromAmountPercent(newFromAmountPercent);
      }
    }
  };

  const inputIsValid = useCallback(() => {
    if (currentPool && poolsContext.length > 0 && poolConfig && walletContext) {
      let inputAmount = 0;
      let isValid = false;

      const inputFromValue = Number(pairAsset.up?.value);

      if (inputFromValue > 0) {
        console.log('inputIsValid');
        const pair1AssetHash = pairAsset.up?.assetHash;
        const pair1AmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === pair1AssetHash)?.amount;

        if (pair1AmountInWallet && pair1AmountInWallet > 0) {
          if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
            const totalFee =
              poolConfig.baseFee.number +
              poolConfig.commitmentTxFee.number +
              poolConfig.defaultOrderingFee.number +
              poolConfig.serviceFee.number +
              1000;

            inputAmount = (pair1AmountInWallet - totalFee) / settingsContext.preferred_unit.value;
          } else {
            inputAmount = Number((pair1AmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
          }
        }

        if (inputFromValue <= inputAmount && inputAmount > 0) {
          isValid = true;
        } else {
          isValid = false;
        }
        return isValid;
      }
    }
    return true;
  }, [currentPool, poolsContext, poolConfig, settingsContext.preferred_unit.value, walletContext, pairAsset]);

  const getBmConfigs = useCallback((poolId: string) => {
    api.getBmConfigs(poolId).then((config) => {
      setPoolConfig(config);
    });
  }, []);

  const findCurrentPool = useCallback((from?: PAsset, to?: PAsset) => {
    console.log('findCurrentPool');
    console.log(from, to);

    if (from && to) {
      const filteredPools = poolsContext.filter(
        (pool) =>
          (pool.quote.ticker === from.ticker || pool.quote.ticker === to.ticker) &&
          (pool.token.ticker === from.ticker || pool.token.ticker === to.ticker),
      );
      console.log('filteredPools', filteredPools);

      const sortedPools = filteredPools.sort((a, b) => b.usdPrice - a.usdPrice);
      console.log('sortedPools', sortedPools);

      getBmConfigs(sortedPools[0].id);
      setCurrentPool(sortedPools[0]);
    }
  }, []);

  const assetOnChange = useCallback(
    (asset: PAsset, isFrom = true) => {
      console.log(asset, 'assetOnChange');

      if (isFrom) {
        if (pairAsset.up?.ticker !== asset.ticker) {
          if (pairAsset.down) {
            if (pairAsset.down?.ticker === asset.ticker) {
              setPairAsset({ up: { ...asset, value: '' }, down: { ...pairAsset.up, value: '' } as PAsset });
              findCurrentPool(asset, pairAsset.up);
            } else {
              setPairAsset({ ...pairAsset, up: { ...asset, value: '' } });
              findCurrentPool(asset, pairAsset.down);
            }
          } else {
            setPairAsset({ ...pairAsset, up: { ...asset, value: '' } });
            findCurrentPool(asset, pairAsset.up);
          }
        }
      } else {
        if (pairAsset.down?.ticker !== asset.ticker) {
          if (pairAsset.up?.ticker === asset.ticker) {
            setPairAsset({ up: { ...pairAsset.down, value: '' } as PAsset, down: { ...asset, value: '' } });
            findCurrentPool(pairAsset.down, asset);
          } else {
            setPairAsset({ ...pairAsset, down: { ...asset, value: '' } });
            findCurrentPool(pairAsset.up, asset);
          }
        }
      }

      setSelectedFromAmountPercent(undefined);
    },
    [pairAsset],
  );

  const swapRouteChange = () => {
    console.log(pairAsset, 'swapRouteChange');
    setPairAsset({
      ...pairAsset,
      up: { ...pairAsset.down, value: '' } as PAsset,
      down: { ...pairAsset.up, value: '' } as PAsset,
    });
    setAssetList({ quote: assetList.token, token: assetList.quote });
    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (walletContext?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (currentPool && poolConfig) {
        if (isQuote(currentPool, pairAsset.up)) {
          if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
            methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
            numberFromAmount = new Decimal(Number(pairAsset.up.value))
              .mul(settingsContext.preferred_unit.value)
              .toNumber();
            numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
          } else {
            methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
            numberFromAmount = new Decimal(Number(pairAsset.up?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
            numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
          }
        } else {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
          numberFromAmount = new Decimal(Number(pairAsset.up?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
          numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
        }

        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          setSwapWay(undefined);
          setPairAsset({
            up: { ...pairAsset.up, value: '' } as PAsset,
            down: { ...pairAsset.down, value: '' } as PAsset,
          });
          setSelectedFromAmountPercent(undefined);

          let commitmentTxId = '';

          if (isQuote(currentPool, pairAsset.up)) {
            commitmentTxId = await commitmentSign.case1(
              walletContext.marina,
              numberFromAmount,
              numberToAmount,
              currentPool,
              poolConfig,
              addressInformation.publicKey,
            );
          } else {
            commitmentTxId = await commitmentSign.case2(
              walletContext.marina,
              numberFromAmount,
              numberToAmount,
              currentPool,
              poolConfig,
              addressInformation.publicKey,
            );
          }

          if (commitmentTxId !== '') {
            // notify(
            //   <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
            //     See in Explorer
            //   </a>,
            //   'Commitment Tx created successfully!',
            //   'success',
            // );

            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberFromAmount : numberToAmount,
              quoteAsset: currentPool.quote.ticker,
              tokenAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberToAmount : numberFromAmount,
              tokenAsset: currentPool.token.ticker,
              timestamp: new Date().valueOf(),
              isOutOfSlippage: false,
              completed: false,
              seen: false,
              method: methodCall,
            };

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);

            setLoading(false);

            // await sleep(3000);

            // payloadData.wallet.marina.reloadCoins();
          } else {
            notify('Commitment transaction could not be created.', 'Bitmatrix Error : ');
            setLoading(false);
          }
        } else {
          notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
          // payloadData.wallet.marina.reloadCoins();
        }
      } else {
        notify('Pool Error', 'Error : ', 'error');
        setLoading(false);
      }
    } else {
      notify('Wallet Error', 'Error : ', 'error');
      setLoading(false);
    }
  };

  const infoMessage = useCallback((): string => {
    if (poolConfig && currentPool && poolsContext.length > 0) {
      const config = poolConfig;
      const totalFee =
        config.baseFee.number +
        config.commitmentTxFee.number +
        config.defaultOrderingFee.number +
        config.serviceFee.number;

      const currentUsdtPrice = (
        (Number(currentPool.token.value) / Number(currentPool.quote.value) / PREFERRED_UNIT_VALUE.LBTC) *
        totalFee
      ).toFixed(2);

      return 'Network fee ' + totalFee + ' sats ' + '($' + currentUsdtPrice + ')';
    }
    return 'Network fee 801 sats';
  }, [poolConfig, currentPool, poolsContext]);

  return (
    <div className="swap-page-main">
      {/* Wallet list modal */}

      <Content className="swap-page-main-content">
        <div className="swap-page-layout">
          <div className="swap-page-content">
            {/* {loading && <Loader className="swap-page-loading" size="md" inverse center />} */}
            <div className={`from-content pt8 ${!inputIsValid() ? 'invalid-content' : ''}`}>
              <SwapFromTab
                selectedFromAmountPercent={selectedFromAmountPercent}
                setselectedFromAmountPercent={calcAmountPercent}
              />
              <div className="from-input-content">
                <div className="from-amount-div">
                  <div className="from-text">From</div>
                  <NumericalInput
                    className="from-input"
                    inputValue={pairAsset.up?.value || ''}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;
                      setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: inputValue } as PAsset });
                      // setInputFromAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                      setSwapWay(SWAP_WAY.FROM);
                    }}
                    decimalLength={getAssetPrecession(
                      pairAsset.up?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${pairAsset?.up?.assetHash && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair1AssetListModal(true);
                    }}
                  >
                    {pairAsset.up?.assetHash ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={pairAsset.up}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{pairAsset.up?.ticker}</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    ) : (
                      <div className="asset-button-default-text-container">
                        <div className="asset-button-default-text">Select an asset</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="swap-arrow-icon" onClick={swapRouteChange}>
              <ArrowDownIcon width="1.25rem" height="1.25rem" />
            </div>
            <div className="from-content">
              <div className="from-input-content">
                <div className="from-amount-div">
                  <div className="from-text">To</div>
                  <NumericalInput
                    className="from-input"
                    inputValue={pairAsset.down?.value || ''}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;
                      setPairAsset({ ...pairAsset, down: { ...pairAsset.down, value: inputValue } as PAsset });
                      // setInputToAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                      setSwapWay(SWAP_WAY.TO);
                    }}
                    decimalLength={getAssetPrecession(
                      pairAsset.down?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${pairAsset.down?.assetHash && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair2AssetListModal(true);
                    }}
                  >
                    {pairAsset.down?.assetHash ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={pairAsset.down}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{pairAsset.down.ticker}</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    ) : (
                      <div className="asset-button-default-text-container">
                        <div className="asset-button-default-text">Select an asset</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <WalletButton
              text="Swap"
              onClick={() => {
                swapClick();
              }}
              loading={loading}
              disabled={Number(pairAsset.down?.value) <= 0 || !inputIsValid()}
            />
          </div>
        </div>
        <Info content={infoMessage()} />
        <AssetListModal
          show={showPair1AssetListModal}
          selectedAsset={pairAsset?.up}
          close={() => {
            setShowPair1AssetListModal(false);
          }}
          onSelectAsset={(asset) => {
            setPairAsset({ ...pairAsset, up: asset });
            assetOnChange(asset, true);
            setShowPair1AssetListModal(false);
          }}
          assetList={assetList.quote}
        />
        <AssetListModal
          show={showPair2AssetListModal}
          close={() => {
            setShowPair2AssetListModal(false);
          }}
          selectedAsset={pairAsset.down}
          onSelectAsset={(asset) => {
            setPairAsset({ ...pairAsset, down: asset });
            assetOnChange(asset, false);
            setShowPair2AssetListModal(false);
          }}
          assetList={assetList.token}
        />
      </Content>
    </div>
  );
};

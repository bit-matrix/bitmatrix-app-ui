/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useState } from 'react';
import { Button, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SWAP_WAY from '../../enum/SWAP_WAY';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { commitmentTx, fundingTx, api, convertion } from '@bitmatrix/lib';
import { CALL_METHOD, Pool, BmConfig, PAsset } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import Decimal from 'decimal.js';
import { getAssetPrecession, uniqueAssetList } from '../../helper';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import { usePoolContext, useWalletContext, useSettingsContext } from '../../context';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import './Swap.scss';

export const Swap = (): JSX.Element => {
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [selectedPairAsset, setSelectedPairAsset] = useState<{
    from?: PAsset;
    to?: PAsset;
  }>({ from: lbtcAsset });

  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);

  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);

  const [inputFromAmount, setInputFromAmount] = useState<string>('');

  const [inputToAmount, setInputToAmount] = useState<string>('');

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const [currentPool, setCurrentPool] = useState<Pool>();

  const [poolConfig, setPoolConfig] = useState<BmConfig>();

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const [loading, setLoading] = useState<boolean>(false);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();

  const [swapWay, setSwapWay] = useState<SWAP_WAY>();

  document.title = ROUTE_PATH_TITLE.SWAP;

  const assetList: PAsset[] = uniqueAssetList(poolsContext);

  useEffect(() => {
    if (currentPool && poolConfig && swapWay) {
      if (swapWay === SWAP_WAY.FROM) {
        onChangeFromInput(currentPool, poolConfig, inputFromAmount);
      } else {
        onChangeToInput(currentPool, poolConfig, inputToAmount);
      }
    }
  }, [currentPool, poolConfig, swapWay, inputFromAmount, inputToAmount, selectedFromAmountPercent]);

  const onChangeFromInput = useCallback(
    (current_pool: Pool, pool_config: BmConfig, input: string) => {
      let inputNum = Number(input);

      let methodCall;

      if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC) {
        inputNum = inputNum * settingsContext.preferred_unit.value;
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
      } else {
        inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
      }

      if (current_pool && pool_config) {
        const output = convertion.convertForCtx(
          inputNum,
          settingsContext.slippage,
          current_pool,
          pool_config,
          methodCall,
        );

        if (output.amount > 0) {
          if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC) {
            setInputToAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
            setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
          } else {
            setInputToAmount((output.amount / settingsContext.preferred_unit.value).toString());
            setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
          }
        } else {
          setInputToAmount('');
          setAmountWithSlippage(0);
        }

        setInputFromAmount(input);
      }
    },
    [selectedPairAsset, settingsContext],
  );

  const onChangeToInput = useCallback(
    (current_pool: Pool, pool_config: BmConfig, input: string) => {
      let inputNum = Number(input);

      if (current_pool && pool_config) {
        let methodCall;

        if (selectedPairAsset.to?.ticker === SWAP_ASSET.LBTC) {
          inputNum = inputNum * settingsContext.preferred_unit.value;
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        } else {
          inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
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
          if (selectedPairAsset.to?.ticker === SWAP_ASSET.LBTC) {
            setInputFromAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
            setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
          } else {
            setInputFromAmount((output.amount / settingsContext.preferred_unit.value).toString());
            setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
          }
        } else {
          setInputFromAmount('');
          setAmountWithSlippage(0);
        }
        setInputToAmount(input);
      }
    },
    [settingsContext, selectedPairAsset],
  );

  const calcAmountPercent = useCallback(
    (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => {
      if (currentPool && poolsContext.length > 0 && poolConfig && walletContext && balances.length > 0) {
        setSwapWay(SWAP_WAY.FROM);

        let inputAmount = '';

        const quoteAssetId = currentPool.quote.assetHash;
        const quoteTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

        const tokenAssetId = currentPool.token.assetHash;
        const tokenTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

        const totalFee =
          poolConfig.baseFee.number +
          poolConfig.commitmentTxFee.number +
          poolConfig.defaultOrderingFee.number +
          poolConfig.serviceFee.number +
          1000;

        if (quoteTotalAmountInWallet) {
          const quoteAmount = quoteTotalAmountInWallet - totalFee;
          if (quoteAmount > 0) {
            if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC && quoteTotalAmountInWallet) {
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
            } else if (selectedPairAsset.from?.ticker === SWAP_ASSET.USDT && tokenTotalAmountInWallet) {
              if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (tokenTotalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
              if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
                const tokenAmountInWalletHalf = tokenTotalAmountInWallet / 2;
                inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
              if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (poolConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
            }
            setInputFromAmount(inputAmount);
            setSelectedFromAmountPercent(newFromAmountPercent);
          }
        }
      }
    },
    [currentPool, poolConfig, settingsContext, selectedPairAsset, walletContext],
  );

  const inputIsValid = useCallback(() => {
    if (currentPool && poolsContext.length > 0 && poolConfig && walletContext) {
      let inputAmount = 0;
      let isValid = false;

      const inputFromValue = Number(inputFromAmount);

      if (inputFromValue > 0) {
        const totalFee =
          poolConfig.baseFee.number +
          poolConfig.commitmentTxFee.number +
          poolConfig.defaultOrderingFee.number +
          poolConfig.serviceFee.number +
          1000;

        const pair1AssetHash = selectedPairAsset.from?.assetHash;
        const pair1AmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === pair1AssetHash)?.amount;

        if (pair1AmountInWallet && pair1AmountInWallet > 0) {
          if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC) {
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
  }, [currentPool, poolConfig, settingsContext, walletContext, selectedPairAsset.from?.ticker, inputFromAmount]);

  const getBmConfigs = useCallback((poolId: string) => {
    api.getBmConfigs(poolId).then((config) => {
      setPoolConfig(config);
    });
  }, []);

  const findCurrentPool = useCallback((from?: PAsset, to?: PAsset) => {
    if (from && to) {
      const filteredPools = poolsContext.filter(
        (pool) =>
          (pool.quote.ticker === from.ticker || pool.quote.ticker === to.ticker) &&
          (pool.token.ticker === from.ticker || pool.token.ticker === to.ticker),
      );

      const sortedPools = filteredPools.sort((a, b) => b.usdPrice - a.usdPrice);
      getBmConfigs(sortedPools[0].id);
      setCurrentPool(sortedPools[0]);
    }
  }, []);

  const assetOnChange = useCallback(
    (asset: PAsset, isFrom = true) => {
      if (isFrom) {
        if (selectedPairAsset.from?.ticker !== asset.ticker) {
          if (selectedPairAsset.to) {
            if (selectedPairAsset.to?.ticker === asset.ticker) {
              setSelectedPairAsset({ from: asset, to: selectedPairAsset.from });
              findCurrentPool(asset, selectedPairAsset.from);
            } else {
              setSelectedPairAsset({ ...selectedPairAsset, from: asset });
              findCurrentPool(asset, selectedPairAsset.to);
            }
          } else {
            setSelectedPairAsset({ ...selectedPairAsset, from: asset });
            findCurrentPool(asset, selectedPairAsset.from);
          }
        }
      } else {
        if (selectedPairAsset.to?.ticker !== asset.ticker) {
          if (selectedPairAsset.from?.ticker === asset.ticker) {
            setSelectedPairAsset({ from: selectedPairAsset.to, to: asset });
            findCurrentPool(selectedPairAsset.to, asset);
          } else {
            setSelectedPairAsset({ ...selectedPairAsset, to: asset });
            findCurrentPool(selectedPairAsset.from, asset);
          }
        }
      }

      setInputFromAmount('');
      setInputToAmount('');
      setSelectedFromAmountPercent(undefined);
    },
    [selectedPairAsset],
  );

  const swapRouteChange = () => {
    setSelectedPairAsset({ from: selectedPairAsset.to, to: selectedPairAsset.from });
    setInputFromAmount('');
    setInputToAmount('');
    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (walletContext?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC) {
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(settingsContext.preferred_unit.value).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      } else {
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
      }

      if (currentPool && poolConfig) {
        const fundingTxInputs = fundingTx(numberFromAmount, currentPool, poolConfig, methodCall);
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
          setSwapWay(undefined);
          setInputFromAmount('');
          setInputToAmount('');
          setSelectedFromAmountPercent(undefined);

          let commitment: string;

          if (selectedPairAsset.from?.ticker === SWAP_ASSET.LBTC) {
            commitment = commitmentTx.quoteToTokenCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              addressInformation.publicKey,
              numberToAmount,
              poolConfig,
              currentPool,
            );
          } else {
            commitment = commitmentTx.tokenToQuoteCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              addressInformation.publicKey,
              numberToAmount,
              poolConfig,
              currentPool,
            );
          }

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
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
                    inputValue={inputFromAmount}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;
                      setInputFromAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                      setSwapWay(SWAP_WAY.FROM);
                    }}
                    decimalLength={getAssetPrecession(
                      selectedPairAsset.from?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${selectedPairAsset?.from && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair1AssetListModal(true);
                    }}
                  >
                    {selectedPairAsset.from ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={selectedPairAsset.from}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{selectedPairAsset.from?.ticker}</div>
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
                    inputValue={inputToAmount}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;
                      setInputToAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                      setSwapWay(SWAP_WAY.TO);
                    }}
                    decimalLength={getAssetPrecession(
                      selectedPairAsset.to?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${selectedPairAsset.to && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair2AssetListModal(true);
                    }}
                  >
                    {selectedPairAsset.to ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={selectedPairAsset.to}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{selectedPairAsset.to.ticker}</div>
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
              disabled={Number(inputToAmount) <= 0 || !inputIsValid()}
            />
          </div>
        </div>
        <Info content={infoMessage()} />
        <AssetListModal
          show={showPair1AssetListModal}
          selectedAsset={selectedPairAsset?.from}
          close={() => {
            setShowPair1AssetListModal(false);
          }}
          onSelectAsset={(asset) => {
            assetOnChange(asset, true);
            setShowPair1AssetListModal(false);
          }}
          assetList={assetList}
        />
        <AssetListModal
          show={showPair2AssetListModal}
          close={() => {
            setShowPair2AssetListModal(false);
          }}
          selectedAsset={selectedPairAsset.to}
          onSelectAsset={(asset) => {
            assetOnChange(asset, false);
            setShowPair2AssetListModal(false);
          }}
          assetList={assetList}
        />
      </Content>
    </div>
  );
};

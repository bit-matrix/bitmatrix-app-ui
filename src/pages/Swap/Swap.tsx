/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { Button, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SWAP_WAY from '../../enum/SWAP_WAY';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { convertion, commitmentSign } from '@bitmatrix/lib';
import { CALL_METHOD, Pool, BmConfig } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import Decimal from 'decimal.js';
import { getAssetPrecession } from '../../helper';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import { usePoolConfigContext, usePoolContext, useWalletContext, useSettingsContext } from '../../context';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { Asset } from '../../model/Asset';
import './Swap.scss';

const pairAssetList: Asset[] = [
  {
    assetHash: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
    name: 'Liquid Bitcoin',
    precision: 8,
    ticker: SWAP_ASSET.LBTC,
  },
  {
    assetHash: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
    name: 'Tether USD',
    precision: 8,
    ticker: SWAP_ASSET.USDT,
  },
];

export const Swap = (): JSX.Element => {
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [selectedPairAsset, setSelectedPairAsset] = useState<{
    from: Asset;
    to: Asset;
  }>({ from: pairAssetList[0], to: pairAssetList[1] });

  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);

  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);

  const [inputFromAmount, setInputFromAmount] = useState<string>('');

  const [inputToAmount, setInputToAmount] = useState<string>('');

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const [loading, setLoading] = useState<boolean>(false);

  const { poolsContext } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { poolConfigContext } = usePoolConfigContext();
  const { settingsContext } = useSettingsContext();

  const [swapWay, setSwapWay] = useState<SWAP_WAY>();

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    if (poolsContext && poolsContext.length > 0 && poolConfigContext && swapWay) {
      if (swapWay === SWAP_WAY.FROM) {
        onChangeFromInput(poolsContext[0], poolConfigContext, inputFromAmount);
      } else {
        onChangeToInput(inputToAmount);
      }
    }
  }, [poolsContext, poolConfigContext, inputFromAmount, inputToAmount, selectedFromAmountPercent]);

  const onChangeFromInput = (currentPool: Pool, pool_config: BmConfig, input: string) => {
    let inputNum = Number(input);

    let methodCall;

    if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC) {
      inputNum = inputNum * settingsContext.preferred_unit.value;
      methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    } else {
      inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
      methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    }

    const output = convertion.convertForCtx(
      inputNum,
      settingsContext.slippage,
      currentPool,
      poolConfigContext,
      methodCall,
    );

    if (output.amount > 0) {
      if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC) {
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
  };

  const onChangeToInput = (input: string) => {
    let inputNum = Number(input);

    if (poolsContext && poolConfigContext) {
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
        poolsContext[0],
        poolConfigContext,
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
  };
  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => {
    if (poolsContext && poolsContext.length > 0 && poolConfigContext && walletContext && balances.length > 0) {
      setSwapWay(SWAP_WAY.FROM);

      const currentPool = poolsContext[0];

      let inputAmount = '';

      const quoteAssetId = currentPool.quote.asset;
      const quoteTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenTotalAmountInWallet = balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      const totalFee =
        poolConfigContext.baseFee.number +
        poolConfigContext.commitmentTxFee.number +
        poolConfigContext.defaultOrderingFee.number +
        poolConfigContext.serviceFee.number +
        1000;

      if (quoteTotalAmountInWallet) {
        const quoteAmount = quoteTotalAmountInWallet - totalFee;
        if (quoteAmount > 0) {
          if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC && quoteTotalAmountInWallet) {
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
              inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
            }
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
              const quoteAmountHalf = Math.ceil(quoteAmount / 2);
              inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
            }
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
              inputAmount = (poolConfigContext.minRemainingSupply / settingsContext.preferred_unit.value).toString();
            }
          } else if (selectedPairAsset.from.ticker === SWAP_ASSET.USDT && tokenTotalAmountInWallet) {
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
              inputAmount = (tokenTotalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
            }
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
              const tokenAmountInWalletHalf = tokenTotalAmountInWallet / 2;
              inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
            }
            if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
              inputAmount = (poolConfigContext.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
            }
          }
          setInputFromAmount(inputAmount);
          setSelectedFromAmountPercent(newFromAmountPercent);
        }
      }
    }
  };

  const inputIsValid = () => {
    if (poolsContext && poolsContext.length > 0 && poolConfigContext && walletContext) {
      let inputAmount = 0;

      const inputValue = Number(inputFromAmount);
      let isValid = false;
      if (inputValue > 0) {
        const totalFee =
          poolConfigContext.baseFee.number +
          poolConfigContext.commitmentTxFee.number +
          poolConfigContext.defaultOrderingFee.number +
          poolConfigContext.serviceFee.number +
          1000;

        const currentPool = poolsContext[0];

        const quoteAssetId = currentPool.quote.asset;
        const quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

        const tokenAssetId = currentPool.token.asset;
        const tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

        if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC && quoteAmountInWallet && quoteAmountInWallet > 0) {
          inputAmount = (quoteAmountInWallet - totalFee) / settingsContext.preferred_unit.value;
        } else if (
          selectedPairAsset.from.ticker === SWAP_ASSET.USDT &&
          tokenAmountInWallet &&
          tokenAmountInWallet > 0
        ) {
          inputAmount = Number((tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
        }

        if (inputValue <= inputAmount && inputAmount > 0) {
          isValid = true;
        } else {
          isValid = false;
        }
        return isValid;
      }
    }
    return true;
  };

  const assetOnChange = (asset: Asset, isFrom = true) => {
    if (isFrom) {
      if (asset.ticker === SWAP_ASSET.LBTC) {
        setSelectedPairAsset({
          from: asset,
          to: pairAssetList[1],
        });
      } else {
        setSelectedPairAsset({
          from: asset,
          to: pairAssetList[0],
        });
      }
    } else {
      if (asset.ticker === SWAP_ASSET.LBTC) {
        setSelectedPairAsset({
          from: pairAssetList[1],
          to: asset,
        });
      } else {
        setSelectedPairAsset({
          from: pairAssetList[0],
          to: asset,
        });
      }
    }

    setInputFromAmount('');
    setInputToAmount('');
    setSelectedFromAmountPercent(undefined);
  };

  const swapRouteChange = () => {
    if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC) {
      setSelectedPairAsset({
        from: pairAssetList[1],
        to: pairAssetList[0],
      });
    } else {
      setSelectedPairAsset({
        from: pairAssetList[0],
        to: pairAssetList[1],
      });
    }

    setInputFromAmount('');
    setInputToAmount('');
    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (walletContext?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC) {
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(settingsContext.preferred_unit.value).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      } else {
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
      }

      if (poolsContext && poolConfigContext) {
        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          setSwapWay(undefined);
          setInputFromAmount('');
          setInputToAmount('');
          setSelectedFromAmountPercent(undefined);

          let commitmentTxId = '';

          if (selectedPairAsset.from.ticker === SWAP_ASSET.LBTC) {
            commitmentTxId = await commitmentSign.case1(
              walletContext.marina,
              numberFromAmount,
              numberToAmount,
              poolsContext[0],
              poolConfigContext,
              addressInformation.publicKey,
            );
          } else {
          }

          if (commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberFromAmount : numberToAmount,
              quoteAsset: poolsContext[0].quote.ticker,
              tokenAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberToAmount : numberFromAmount,
              tokenAsset: poolsContext[0].token.ticker,
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

  const infoMessage = (): string => {
    if (poolConfigContext && poolsContext && poolsContext.length > 0) {
      const config = poolConfigContext;
      const currentPool = poolsContext[0];
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
    return '';
  };

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
                      selectedPairAsset.from.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                {/* <SwapAssetList selectedAsset={selectedAsset.from} setSelectedAsset={assetOnChange} /> */}
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${selectedPairAsset?.from && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair1AssetListModal(true);
                    }}
                  >
                    <div className="create-new-pool-img-content">
                      <AssetIcon
                        asset={selectedPairAsset.from}
                        className="create-new-pool-lbtc-icon"
                        width="1.5rem"
                        height="1.5rem"
                      />
                      <div>{selectedPairAsset.from.ticker}</div>
                      <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                    </div>
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
                      selectedPairAsset.to.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                {/* <SwapAssetList
                selectedAsset={selectedAsset.to}
                setSelectedAsset={(asset: SWAP_ASSET) => assetOnChange(asset, false)}
              /> */}
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
            // setSelectedPairAsset({ ...selectedPairAsset, from: asset! });
            assetOnChange(asset, true);
            setShowPair1AssetListModal(false);
          }}
          assetList={pairAssetList}
        />
        <AssetListModal
          show={showPair2AssetListModal}
          close={() => {
            setShowPair2AssetListModal(false);
          }}
          selectedAsset={selectedPairAsset.to}
          onSelectAsset={(asset) => {
            // setSelectedPairAsset({ from: { ...selectedPairAsset?.from }, to: asset });
            assetOnChange(asset, false);
            setShowPair2AssetListModal(false);
          }}
          assetList={pairAssetList}
        />
      </Content>
    </div>
  );
};

import Decimal from 'decimal.js';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api, poolDeployment } from '@bitmatrix/lib';
import { Button, Content, Dropdown } from 'rsuite';
import { BackButton } from '../../components/base/BackButton/BackButton';
import LpIcon from '../../components/base/Svg/Icons/Lp';
import PriceIcon from '../../components/base/Svg/Icons/Price';
import TVLIcon from '../../components/base/Svg/Icons/TVL';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { useSettingsContext, useWalletContext, usePoolContext, useBtcPriceContext } from '../../context';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import { AssetModel, getAssetPrecession, testnetPair1AssetList } from '../../helper';
import plus from '../../images/plus.png';
import { notify } from '../../components/utils/utils';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { lpFeeTiers } from '@bitmatrix/lib/pool';
import './CreateNewPool.scss';
import { LBTC_ASSET, USDT_ASSET } from '../../env';

export const CreateNewPool: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pair1Amount, setPair1Amount] = useState<string>('');
  const [pair2Amount, setPair2Amount] = useState<string>('');
  const [selectedPair1Asset, setSelectedPair1Asset] = useState<AssetModel>();
  const [selectedPair2Asset, setSelectedPair2Asset] = useState<AssetModel>();
  const [pair1AssetList, setPair1AssetList] = useState<AssetModel[]>([]);
  const [pair2AssetList, setPair2AssetList] = useState<AssetModel[]>([]);
  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);
  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);
  const [lpFeeTier, setLpFeeTier] = useState<{ value: string; index: number }>({
    value: '%0.25',
    index: 3,
  });

  const { settingsContext } = useSettingsContext();
  const { walletContext } = useWalletContext();
  const { pools } = usePoolContext();
  const { btcPrice } = useBtcPriceContext();

  const history = useHistory();

  useEffect(() => {
    if (walletContext) {
      const filteredPair1AssetList = walletContext?.balances
        .filter((balance) => testnetPair1AssetList.findIndex((p1) => p1 === balance.asset.assetHash) > -1)
        .map((balance) => {
          return {
            name: balance.asset.name || '',
            assetHash: balance.asset.assetHash,
            ticker: balance.asset.ticker || '',
            precision: balance.asset.precision,
          };
        });

      const filteredPair2AssetList = walletContext.balances.map((balance) => {
        return {
          name: balance.asset.name || '',
          assetHash: balance.asset.assetHash,
          ticker: balance.asset.ticker || '',
          precision: balance.asset.precision,
        };
      });

      setPair1AssetList(filteredPair1AssetList);
      setPair2AssetList(filteredPair2AssetList);
    }
  }, [walletContext]);

  const onChangePair1Amount = (input: string) => {
    setPair1Amount(input);
  };

  const onChangePair2Amount = (input: string) => {
    setPair2Amount(input);
  };

  const inputsIsValid = () => {
    if (walletContext) {
      let pair1IsValid = false;
      let pair2IsValid = false;

      if ((parseFloat(pair1Amount) > 0 || parseFloat(pair2Amount) > 0) && selectedPair1Asset && selectedPair2Asset) {
        const totalFee = 1000;

        const quoteAssetId = selectedPair1Asset?.assetHash;
        let quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount || 0;

        const tokenAssetId = selectedPair2Asset?.assetHash;
        let tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount || 0;

        if (quoteAssetId === lbtcAsset.assetHash) {
          quoteAmountInWallet = quoteAmountInWallet - totalFee;
        } else if (tokenAssetId === lbtcAsset.assetHash) {
          tokenAmountInWallet = tokenAmountInWallet - totalFee;
        }

        const finalPair1Value =
          Number(pair1Amount) *
          Math.pow(10, getAssetPrecession(selectedPair1Asset, settingsContext.preferred_unit.text));

        const finalPair2Value =
          Number(pair2Amount) *
          Math.pow(10, getAssetPrecession(selectedPair2Asset, settingsContext.preferred_unit.text));

        if (quoteAmountInWallet && finalPair1Value <= quoteAmountInWallet && quoteAmountInWallet > 0) {
          pair1IsValid = true;
        } else {
          pair1IsValid = false;
        }
        if (tokenAmountInWallet && finalPair2Value <= tokenAmountInWallet && tokenAmountInWallet > 0) {
          pair2IsValid = true;
        } else {
          pair2IsValid = false;
        }
        return { pair1IsValid, pair2IsValid };
      }
    }

    return { pair1IsValid: true, pair2IsValid: true };
  };

  const liquidityPoolButtonDisabled = (): boolean => {
    return (
      Number(pair1Amount) <= 0 ||
      Number(pair2Amount) <= 0 ||
      !inputsIsValid()?.pair1IsValid ||
      !inputsIsValid()?.pair2IsValid ||
      !selectedPair1Asset ||
      !selectedPair2Asset
    );
  };

  const pair1CoefficientCalculation = () => {
    let pair1Coefficient = 1;
    if (selectedPair1Asset) {
      const pair1IsLbtc = selectedPair1Asset.assetHash === lbtcAsset.assetHash ? true : false;

      if (pair1IsLbtc) {
        pair1Coefficient = 50;
      } else {
        const assetPrecision = selectedPair1Asset.precision;

        if (assetPrecision === 0 || assetPrecision === 1 || assetPrecision === 2) {
          pair1Coefficient = 1;
        } else if (assetPrecision === 3) {
          pair1Coefficient = 10;
        } else if (assetPrecision === 4) {
          pair1Coefficient = 100;
        } else if (assetPrecision === 5) {
          pair1Coefficient = 1000;
        } else if (assetPrecision === 6) {
          pair1Coefficient = 10000;
        } else if (assetPrecision === 7) {
          pair1Coefficient = 100000;
        } else if (assetPrecision === 8) {
          pair1Coefficient = 1000000;
        }
      }
    }

    return pair1Coefficient;
  };

  const createNewPoolClick = async () => {
    if (walletContext?.marina && selectedPair1Asset && selectedPair2Asset) {
      const pair1AmountN = new Decimal(Number(pair1Amount))
        .mul(Math.pow(10, getAssetPrecession(selectedPair1Asset, settingsContext.preferred_unit.text)))
        .toNumber();

      const pair2AmountN = new Decimal(Number(pair2Amount))
        .mul(Math.pow(10, getAssetPrecession(selectedPair2Asset, settingsContext.preferred_unit.text)))
        .toNumber();

      let fundingTxId;

      try {
        setLoading(true);

        const fundingTx = await walletContext.marina.sendTransaction([
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: 500,
            asset: LBTC_ASSET,
          },
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: 500,
            asset: LBTC_ASSET,
          },
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: pair1AmountN,
            asset: selectedPair1Asset.assetHash,
          },
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: pair2AmountN,
            asset: selectedPair2Asset.assetHash,
          },
        ]);

        fundingTxId = await api.sendRawTransaction(fundingTx.hex);
      } catch (err: any) {
        notify(err.toString(), 'Wallet Error : ', 'error');
        setLoading(false);
        return Promise.reject();
      }

      setLoading(true);

      const addressInformation = await walletContext.marina.getNextChangeAddress();

      if (fundingTxId && fundingTxId !== '' && addressInformation.publicKey) {
        setPair1Amount('');
        setPair2Amount('');

        const newPool = poolDeployment.poolDeploy(
          fundingTxId,
          selectedPair1Asset.assetHash,
          selectedPair2Asset.assetHash,
          pair1AmountN,
          pair2AmountN,
          addressInformation.publicKey,
          1,
          pair1CoefficientCalculation(),
          lpFeeTier.index,
        );

        const poolTxId = await api.sendRawTransaction(newPool);

        setLoading(false);

        notify(poolTxId, 'New Pool Creation Successfully', 'info');
      } else {
        notify('Pool could not be created.', 'Wallet Error : ', 'error');
        setLoading(false);
      }
    }
  };

  // todo
  const calcLpValues = () => {
    if (pools && pools.length > 0 && Number(pair1Amount) > 0 && Number(pair2Amount) > 0 && selectedPair1Asset) {
      if (selectedPair1Asset?.assetHash === lbtcAsset.assetHash) {
        const initialLPCirculation = poolDeployment.calculateInitialLpCirculation(
          pair1CoefficientCalculation(),
          Number(pair1Amount) * settingsContext.preferred_unit.value,
        );

        const initialTVL = Number(pair1Amount) * btcPrice * 2;

        const initialAssetPrice =
          (Number(pair1Amount) * settingsContext.preferred_unit.value) /
          ((Number(pair2Amount) * PREFERRED_UNIT_VALUE.LBTC) / btcPrice);

        return {
          initialLPCirculation,
          initialTVL: '$' + initialTVL.toFixed(2),
          initialAssetPrice: '$' + initialAssetPrice.toFixed(2),
        };
      } else {
        const initialLPCirculation = poolDeployment.calculateInitialLpCirculation(
          pair1CoefficientCalculation(),
          Number(pair1Amount) * Math.pow(10, selectedPair1Asset.precision),
        );

        const initialTVL = Number(pair1Amount) * 2;

        const initialAssetPrice =
          (Number(pair1Amount) * PREFERRED_UNIT_VALUE.LBTC) / (Number(pair2Amount) * PREFERRED_UNIT_VALUE.LBTC);

        return {
          initialLPCirculation,
          initialTVL: '$' + initialTVL.toFixed(2),
          initialAssetPrice: '$' + initialAssetPrice.toFixed(2),
        };
      }
    }
    return { initialLPCirculation: '-', initialTVL: '-', initialAssetPrice: '-' };
  };

  return (
    <div className="create-new-pool-page-main">
      <Content className="create-new-pool-page-content">
        <div className="create-new-pool-page-header">
          <BackButton
            buttonText="Create New Pool"
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
            <Dropdown
              className="create-new-pool-lp-fee-tier"
              title={lpFeeTier.value}
              activeKey={lpFeeTier.index}
              onSelect={(eventKey: any) => {
                const lpFeeTiersKeys = Object.keys(lpFeeTiers);

                setLpFeeTier({ value: lpFeeTiersKeys[eventKey], index: eventKey });
              }}
            >
              {Object.keys(lpFeeTiers).map((feeTier, i: number) => {
                return (
                  <Dropdown.Item key={i} eventKey={i}>
                    {feeTier}
                  </Dropdown.Item>
                );
              })}
            </Dropdown>
          </div>
        </div>
        <div>
          <div className="create-new-pool-main">
            <div
              className={`create-new-pool-item ${
                !inputsIsValid()?.pair1IsValid ? 'create-new-pool-invalid-content' : ''
              }`}
            >
              <div className="create-new-pool-text">Base Pair : </div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={pair1Amount}
                    onChange={(inputValue) => {
                      onChangePair1Amount(inputValue);
                    }}
                    decimalLength={
                      selectedPair1Asset && getAssetPrecession(selectedPair1Asset, settingsContext.preferred_unit.text)
                    }
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${selectedPair1Asset && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair1AssetListModal(true);
                    }}
                  >
                    {selectedPair1Asset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={selectedPair1Asset.assetHash}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{selectedPair1Asset.ticker}</div>
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
            <div className="create-new-pool-plus-icon">
              <img className="create-new-pool-page-icons" src={plus} alt="" />
            </div>
            <div
              className={`create-new-pool-item ${
                !inputsIsValid()?.pair2IsValid ? 'create-new-pool-invalid-content' : ''
              }`}
            >
              <div className="create-new-pool-text">Asset Pair : </div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={pair2Amount}
                    onChange={(inputValue) => {
                      onChangePair2Amount(inputValue);
                    }}
                    decimalLength={
                      selectedPair2Asset && getAssetPrecession(selectedPair2Asset, settingsContext.preferred_unit.text)
                    }
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${selectedPair2Asset && 'asset-button-selected'}`}
                    onClick={() => {
                      setShowPair2AssetListModal(true);
                    }}
                  >
                    {selectedPair2Asset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={selectedPair2Asset.assetHash}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{selectedPair2Asset.ticker}</div>
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
          </div>
          <div className="create-new-pool-page-footer">
            <div className="create-new-pool-page-footer-line-item-first">
              <div className="create-new-pool-text-icon-content">
                <span className="create-new-pool-page-footer-line-item-texts">Initial LP circulation</span>
                <LpIcon className="create-new-pool-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="create-new-pool-page-footer-line-item-values">{calcLpValues().initialLPCirculation}</div>
            </div>
            <div className="create-new-pool-page-footer-line-item-second mobile-hidden">
              <div className="create-new-pool-text-icon-content">
                <span className="create-new-pool-page-footer-line-item-texts">Initial TVL</span>
                <TVLIcon className="create-new-pool-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="create-new-pool-page-footer-line-item-values">{calcLpValues().initialTVL}</div>
            </div>
            <div className="create-new-pool-page-footer-line-item-third">
              <div className="create-new-pool-text-icon-content">
                <span className="create-new-pool-page-footer-line-item-texts">
                  Initial {selectedPair2Asset?.ticker || 'asset'} price
                </span>
                <PriceIcon className="create-new-pool-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="create-new-pool-page-footer-line-item-values">{calcLpValues().initialAssetPrice}</div>
            </div>
          </div>
          <div className="create-new-pool-button-content">
            <WalletButton
              text=" Create New Liquidity Pool"
              loading={loading}
              onClick={() => {
                createNewPoolClick();
              }}
              disabled={liquidityPoolButtonDisabled()}
              className="create-new-pool-button"
            />
          </div>

          <AssetListModal
            show={showPair1AssetListModal}
            selectedAsset={{
              assetHash: selectedPair1Asset?.assetHash || '',
              name: selectedPair1Asset?.name || '',
              ticker: selectedPair1Asset?.ticker || '',
              precision: selectedPair1Asset?.precision || 0,
            }}
            close={() => {
              setShowPair1AssetListModal(false);
            }}
            onSelectAsset={(asset) => {
              if (selectedPair2Asset?.assetHash === asset.assetHash) {
                setSelectedPair2Asset(undefined);
              }
              setSelectedPair1Asset(asset);
              setShowPair1AssetListModal(false);
            }}
            assetList={pair1AssetList}
          />
          <AssetListModal
            show={showPair2AssetListModal}
            close={() => {
              setShowPair2AssetListModal(false);
            }}
            selectedAsset={selectedPair2Asset}
            onSelectAsset={(asset) => {
              if (selectedPair1Asset?.assetHash === asset.assetHash) {
                setSelectedPair1Asset(undefined);
              }
              setSelectedPair2Asset(asset);
              setShowPair2AssetListModal(false);
            }}
            assetList={pair2AssetList}
          />
        </div>
      </Content>
    </div>
  );
};

import Decimal from 'decimal.js';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api, poolDeployment } from '@bitmatrix/lib';
import { Button, Content } from 'rsuite';
import { BackButton } from '../../components/base/BackButton/BackButton';
import LpIcon from '../../components/base/Svg/Icons/Lp';
import PriceIcon from '../../components/base/Svg/Icons/Price';
import TVLIcon from '../../components/base/Svg/Icons/TVL';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { useSettingsContext, useWalletContext, usePoolContext } from '../../context';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { getAssetPrecession } from '../../helper';
import plus from '../../images/plus.png';
import { notify } from '../../components/utils/utils';
import { Asset } from '../../model/Asset';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import './CreateNewPool.scss';

export const CreateNewPool: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pair1Amount, setPair1Amount] = useState<string>('');
  const [pair2Amount, setPair2Amount] = useState<string>('');
  const [selectedPair1Asset, setSelectedPair1Asset] = useState<Asset>();
  const [selectedPair2Asset, setSelectedPair2Asset] = useState<Asset>();
  const [pair1AssetList, setPair1AssetList] = useState<Asset[]>([]);
  const [pair2AssetList, setPair2AssetList] = useState<Asset[]>([]);
  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);
  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);

  const { settingsContext } = useSettingsContext();
  const { walletContext } = useWalletContext();
  const { poolsContext } = usePoolContext();

  const history = useHistory();

  useEffect(() => {
    if (walletContext) {
      const filteredPair1AssetList: Asset[] | undefined = walletContext?.balances
        .filter((balance) => balance.asset.ticker === 'L-BTC' || balance.asset.ticker === 'USDt')
        .map((balance) => balance.asset);

      const filteredPair2AssetList: Asset[] | undefined = walletContext?.balances
        .filter((balance) => balance.asset.ticker !== 'L-BTC' && balance.asset.precision === 8)
        .map((balance) => balance.asset);

      setPair1AssetList(filteredPair1AssetList);
      setPair2AssetList(filteredPair2AssetList);
    }
  }, []);

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
        const quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

        const tokenAssetId = selectedPair2Asset?.assetHash;
        const tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

        let quoteAmountWallet = 0;
        if (quoteAmountInWallet && quoteAmountInWallet > 0) {
          quoteAmountWallet = (quoteAmountInWallet - totalFee) / settingsContext.preferred_unit.value;
        }

        let tokenAmountWallet = '';
        if (tokenAmountInWallet && tokenAmountInWallet > 0) {
          tokenAmountWallet = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }

        if (Number(pair1Amount) <= quoteAmountWallet && quoteAmountWallet > 0) {
          pair1IsValid = true;
        } else {
          pair1IsValid = false;
        }

        if (Number(pair2Amount) <= Number(tokenAmountWallet) && Number(tokenAmountWallet) > 0) {
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

  const createNewPoolClick = async () => {
    if (walletContext?.marina && selectedPair1Asset && selectedPair2Asset) {
      const pair1IsLbtc = selectedPair1Asset.ticker === 'L-BTC' ? true : false;

      const pair1AmountN = new Decimal(Number(pair1Amount))
        .mul(pair1IsLbtc ? settingsContext.preferred_unit.value : PREFERRED_UNIT_VALUE.LBTC)
        .toNumber();

      const pair2AmountN = new Decimal(pair2Amount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();

      let fundingTxId;

      try {
        setLoading(true);

        const fundingTx = await walletContext.marina.sendTransaction([
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: 500,
            asset: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
          },
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: 500,
            asset: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
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
          pair1IsLbtc ? 20 : 1000000,
        );

        const poolTxId = await api.sendRawTransaction(newPool);

        console.log(poolTxId);

        setLoading(false);
      } else {
        notify('Pool could not be created.', 'Wallet Error : ', 'error');
        setLoading(false);
      }
    }
  };

  const calcLpValues = () => {
    const currentLBtcPrice = Number(poolsContext[0].token.value) / Number(poolsContext[0].quote.value);

    if (poolsContext && poolsContext.length > 0 && Number(pair1Amount) > 0 && Number(pair2Amount) > 0) {
      if (selectedPair1Asset?.ticker === 'L-BTC') {
        const initialLPCirculation = poolDeployment.calculateInitialLpCirculation(
          20,
          Number(pair1Amount) * settingsContext.preferred_unit.value,
        );

        const initialTVL = Number(pair1Amount) * currentLBtcPrice * 2;

        const initialAssetPrice =
          (Number(pair2Amount) * PREFERRED_UNIT_VALUE.LBTC) /
          (Number(pair1Amount) * settingsContext.preferred_unit.value);

        return {
          initialLPCirculation,
          initialTVL: initialTVL.toFixed(2),
          initialAssetPrice: initialAssetPrice.toFixed(2),
        };
      } else {
        const initialLPCirculation = poolDeployment.calculateInitialLpCirculation(
          1000000,
          Number(pair1Amount) * PREFERRED_UNIT_VALUE.LBTC,
        );

        const initialTVL = Number(pair1Amount) * 2;

        const initialAssetPrice =
          (Number(pair1Amount) * PREFERRED_UNIT_VALUE.LBTC) / (Number(pair2Amount) * PREFERRED_UNIT_VALUE.LBTC);

        return {
          initialLPCirculation,
          initialTVL: initialTVL.toFixed(2),
          initialAssetPrice: initialAssetPrice.toFixed(2),
        };
      }
    }

    return { initialLPCirculation: '-', initialTVL: '-', initialAssetPrice: '-' };
  };

  return (
    <div className="create-new-pool-page-main">
      <Content className="create-new-pool-page-content">
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
          <div className="create-new-pool-main">
            <div
              className={`create-new-pool-item ${
                !inputsIsValid()?.pair1IsValid ? 'create-new-pool-invalid-content' : ''
              }`}
            >
              <div className="create-new-pool-text">Pool Pair 1</div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={pair1Amount}
                    onChange={(inputValue) => {
                      onChangePair1Amount(inputValue);
                    }}
                    decimalLength={getAssetPrecession(SWAP_ASSET.LBTC, settingsContext.preferred_unit.text)}
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
                          asset={selectedPair1Asset}
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

                  {/* <Dropdown
                    className="create-new-pool-dropdown"
                    title={selectedPair1Asset ? selectedPair1Asset.ticker : 'Select an asset'}
                    activeKey={selectedPair1Asset?.ticker}
                  >
                    {pair1AssetList?.map((asset, i: number) => {
                      return (
                        <Dropdown.Item
                          key={i}
                          className="custom-dropdown-item"
                          eventKey={asset.ticker}
                          onSelect={(eventKey: any) => {
                            const selectedAsset = pair1AssetList.find((asl) => asl.ticker === eventKey);

                            setSelectedPair1Asset(selectedAsset);
                          }}
                        >
                          {asset.ticker}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown> */}
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
              <div className="create-new-pool-text">Pool Pair 2</div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={pair2Amount}
                    onChange={(inputValue) => {
                      onChangePair2Amount(inputValue);
                    }}
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
                          asset={selectedPair2Asset}
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
                <span className="create-new-pool-page-footer-line-item-texts">Initial asset price</span>
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
            selectedAsset={selectedPair1Asset}
            close={() => {
              setShowPair1AssetListModal(false);
            }}
            onSelectAsset={(asset) => {
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

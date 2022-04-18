import Decimal from 'decimal.js';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api, poolDeployment } from '@bitmatrix/lib';
import { Content, Dropdown } from 'rsuite';
import { BackButton } from '../../components/base/BackButton/BackButton';
import LbtcIcon from '../../components/base/Svg/Icons/Lbtc';
import LpIcon from '../../components/base/Svg/Icons/Lp';
import PriceIcon from '../../components/base/Svg/Icons/Price';
import TVLIcon from '../../components/base/Svg/Icons/TVL';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { usePoolConfigContext, usePoolContext, useSettingsContext, useWalletContext } from '../../context';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { getAssetPrecession, getPrimaryPoolConfig } from '../../helper';
import plus from '../../images/plus.png';
import { notify } from '../../components/utils/utils';
import './CreateNewPool.scss';

type Asset = {
  assetHash: string;
  ticker?: string | undefined;
  name?: string | undefined;
  precision: number;
};

export const CreateNewPool: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>();

  const { settingsContext } = useSettingsContext();
  const { walletContext } = useWalletContext();
  const { poolsContext } = usePoolContext();
  const { poolConfigContext } = usePoolConfigContext();

  const assetList: Asset[] | undefined = walletContext?.balances
    .filter((balance) => balance.asset.ticker !== 'L-BTC')
    .map((balance) => balance.asset);

  const history = useHistory();

  const onChangeQuoteAmount = (input: string) => {
    setQuoteAmount(input);
  };

  const onChangeTokenAmount = (input: string) => {
    setTokenAmount(input);
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

        const tokenAssetId = selectedAsset?.assetHash;
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

  const createNewPoolClick = async () => {
    if (walletContext?.marina) {
      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(settingsContext.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
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
            value: quoteAmountN,
            asset: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
          },
          {
            address: 'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
            value: tokenAmountN,
            asset: selectedAsset?.assetHash || '',
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
        setQuoteAmount('');
        setTokenAmount('');

        const newPool = poolDeployment.poolDeploy(
          fundingTxId,
          selectedAsset?.assetHash || '',
          quoteAmountN,
          tokenAmountN,
          addressInformation.publicKey,
        );

        await api.sendRawTransaction(newPool);

        setLoading(false);
      } else {
        notify('Pool could not be created.', 'Wallet Error : ', 'error');
        setLoading(false);
      }
    }
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
            <div className="create-new-pool-item">
              <div className="create-new-pool-text">Pool Pair 1</div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={quoteAmount}
                    onChange={(inputValue) => {
                      onChangeQuoteAmount(inputValue);
                    }}
                    decimalLength={getAssetPrecession(SWAP_ASSET.LBTC, settingsContext.preferred_unit.text)}
                  />
                </div>
                <div className="create-new-pool-lbtc-icon-content">
                  <div className="create-new-pool-img-content">
                    <LbtcIcon className="create-new-pool-lbtc-icon" width="1.5rem" height="1.5rem" />
                    L-BTC
                  </div>
                </div>
              </div>
            </div>
            <div className="create-new-pool-plus-icon">
              <img className="create-new-pool-page-icons" src={plus} alt="" />
            </div>
            <div className="create-new-pool-item">
              <div className="create-new-pool-text">Pool Pair 2</div>
              <div className="create-new-pool-item-content">
                <div>
                  <NumericalInput
                    className="create-new-pool-input"
                    inputValue={tokenAmount}
                    onChange={(inputValue) => {
                      onChangeTokenAmount(inputValue);
                    }}
                  />
                </div>
                <div>
                  <Dropdown
                    className="create-new-pool-dropdown"
                    title={selectedAsset ? selectedAsset.ticker : 'Select an asset'}
                    activeKey={selectedAsset?.ticker}
                  >
                    {assetList?.map((asset, i: number) => {
                      return (
                        <Dropdown.Item
                          key={i}
                          className="custom-dropdown-item"
                          eventKey={asset.ticker}
                          onSelect={(eventKey: any) => {
                            const selectedAsset = assetList.find((asl) => asl.ticker === eventKey);
                            setSelectedAsset(selectedAsset);
                          }}
                        >
                          {asset.name}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown>
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
              <div className="create-new-pool-page-footer-line-item-values">-</div>
            </div>
            <div className="create-new-pool-page-footer-line-item-second mobile-hidden">
              <div className="create-new-pool-text-icon-content">
                <span className="create-new-pool-page-footer-line-item-texts">Initial TVL</span>
                <TVLIcon className="create-new-pool-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="create-new-pool-page-footer-line-item-values">-</div>
            </div>
            <div className="create-new-pool-page-footer-line-item-third">
              <div className="create-new-pool-text-icon-content">
                <span className="create-new-pool-page-footer-line-item-texts">Initial asset price</span>
                <PriceIcon className="create-new-pool-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="create-new-pool-page-footer-line-item-values">-</div>
            </div>
          </div>
          <div className="create-new-pool-button-content">
            <WalletButton
              text=" Create New Liquidity Pool"
              loading={loading}
              onClick={() => {
                createNewPoolClick();
              }}
              disabled={
                Number(quoteAmount) <= 0 ||
                Number(tokenAmount) <= 0 ||
                !inputsIsValid()?.tokenIsValid ||
                !inputsIsValid()?.quoteIsValid ||
                !selectedAsset
              }
              className="create-new-pool-button"
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

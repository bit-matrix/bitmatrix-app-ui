import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Dropdown } from 'rsuite';
import { BackButton } from '../../components/base/BackButton/BackButton';
import LbtcIcon from '../../components/base/Svg/Icons/Lbtc';
import LpIcon from '../../components/base/Svg/Icons/Lp';
import PriceIcon from '../../components/base/Svg/Icons/Price';
import TVLIcon from '../../components/base/Svg/Icons/TVL';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import { useSettingsContext, useWalletContext } from '../../context';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { getAssetPrecession } from '../../helper';
import plus from '../../images/plus.png';
import './CreateNewPool.scss';

type Asset = {
  assetHash: string;
  ticker?: string | undefined;
  name?: string | undefined;
  precision: number;
};

export const CreateNewPool: React.FC = () => {
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<Asset>();

  const { settingsContext } = useSettingsContext();
  const { walletContext } = useWalletContext();

  const assetList: Asset[] | undefined = walletContext?.balances.map((balance) => balance.asset);

  const history = useHistory();

  const onChangeQuoteAmount = (input: string) => {
    setQuoteAmount(input);
  };

  const onChangeTokenAmount = (input: string) => {
    setTokenAmount(input);
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
            <Button onClick={() => console.log('created')} className="create-new-pool-button">
              Create New Liquidity Pool
            </Button>
          </div>
        </div>
      </Content>
    </div>
  );
};

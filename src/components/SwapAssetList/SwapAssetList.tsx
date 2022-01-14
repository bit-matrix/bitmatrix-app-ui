import React from 'react';
import { Dropdown } from 'rsuite';
import lbtcImage from '../../images/liquid_btc.png';
import usdtImage from '../../images/usdt.png';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import './SwapAssetList.scss';

type Props = {
  selectedAsset: SWAP_ASSET;
  setSelectedAsset: (asset: SWAP_ASSET) => void;
};

export const SwapAssetList: React.FC<Props> = ({ selectedAsset, setSelectedAsset }) => {
  const onSelectAsset = (eventKey: any) => {
    setSelectedAsset(eventKey as SWAP_ASSET);
  };

  const getActiveIcon = () => {
    switch (selectedAsset) {
      case SWAP_ASSET.LBTC:
        return lbtcImage;

      case SWAP_ASSET.USDT:
        return usdtImage;

      default:
        return '';
    }
  };

  return (
    <div className="from-selection">
      <Dropdown
        title={
          <div className="swap-dropdown-item">
            <img
              className={`${
                selectedAsset === SWAP_ASSET.LBTC ? 'swap-dropdown-item-img-lbtc' : 'swap-dropdown-item-img'
              }`}
              src={getActiveIcon()}
              alt={selectedAsset}
            />
            <span>{selectedAsset}</span>
          </div>
        }
        activeKey={selectedAsset}
      >
        <Dropdown.Item eventKey={SWAP_ASSET.LBTC} onSelect={onSelectAsset}>
          {
            <div className="swap-dropdown-item">
              <img className="swap-dropdown-item-img-lbtc" src={lbtcImage} alt={SWAP_ASSET.LBTC} />
              <span>{SWAP_ASSET.LBTC}</span>
            </div>
          }
        </Dropdown.Item>
        <Dropdown.Item eventKey={SWAP_ASSET.USDT} onSelect={onSelectAsset}>
          {
            <div className="swap-dropdown-item">
              <img className="swap-dropdown-item-img" src={usdtImage} alt={SWAP_ASSET.USDT} />
              <span>{SWAP_ASSET.USDT}</span>
            </div>
          }
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

import React from 'react';
import { Dropdown } from 'rsuite';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
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
        return <LbtcIcon className="swap-dropdown-item-img" width="1.75rem" height="1.75rem" />;

      case SWAP_ASSET.USDT:
        return <TetherIcon className="swap-dropdown-item-img" width="1.75rem" height="1.75rem" />;

      default:
        return <></>;
    }
  };

  return (
    <div className="from-selection">
      <Dropdown
        title={
          <div className="swap-dropdown-item">
            {getActiveIcon()}
            <span>{selectedAsset}</span>
          </div>
        }
        activeKey={selectedAsset}
      >
        <Dropdown.Item eventKey={SWAP_ASSET.LBTC} onSelect={onSelectAsset}>
          {
            <div className="swap-dropdown-item">
              <LbtcIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
              {/* <img className="swap-dropdown-item-img" src={lbtcImage} alt={SWAP_ASSET.LBTC} /> */}
              <span>{SWAP_ASSET.LBTC}</span>
            </div>
          }
        </Dropdown.Item>
        <Dropdown.Item eventKey={SWAP_ASSET.USDT} onSelect={onSelectAsset}>
          {
            <div className="swap-dropdown-item">
              <TetherIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
              {/* <img className="swap-dropdown-item-img" src={usdtImage} alt={SWAP_ASSET.USDT} /> */}
              <span>{SWAP_ASSET.USDT}</span>
            </div>
          }
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

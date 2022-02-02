import React from 'react';
import { Dropdown, IconButton } from 'rsuite';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import './SwapAssetList.scss';
import PlusIcon from '@rsuite/icons/Plus';

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
        <Dropdown.Item className="swap-dropdown-item" eventKey={SWAP_ASSET.LBTC} onSelect={onSelectAsset}>
          <LbtcIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
          {SWAP_ASSET.LBTC}
        </Dropdown.Item>
        <Dropdown.Item className="swap-dropdown-item" eventKey={SWAP_ASSET.USDT} onSelect={onSelectAsset}>
          <TetherIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
          {SWAP_ASSET.USDT}
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

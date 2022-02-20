import React, { useContext } from 'react';
import { Dropdown } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { setQuoteText } from '../../helper';
import LbtcIcon from '../base/Svg/Icons/Lbtc';
import TetherIcon from '../base/Svg/Icons/Tether';
import './SwapAssetList.scss';

type Props = {
  selectedAsset: SWAP_ASSET;
  setSelectedAsset: (asset: SWAP_ASSET) => void;
};

export const SwapAssetList: React.FC<Props> = ({ selectedAsset, setSelectedAsset }) => {
  const { payloadData } = useContext(SettingsContext);

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

  const assesText = () => {
    switch (selectedAsset) {
      case SWAP_ASSET.LBTC:
        return setQuoteText(payloadData.preferred_unit.text);
      default:
        return SWAP_ASSET.USDT;
    }
  };

  return (
    <div className="from-selection">
      <Dropdown
        title={
          <div className="swap-dropdown-item">
            {getActiveIcon()}
            <span>{assesText()}</span>
          </div>
        }
        activeKey={selectedAsset}
      >
        <Dropdown.Item className="swap-dropdown-item" eventKey={SWAP_ASSET.LBTC} onSelect={onSelectAsset}>
          <LbtcIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
          {setQuoteText(payloadData.preferred_unit.text)}
        </Dropdown.Item>
        <Dropdown.Item className="swap-dropdown-item" eventKey={SWAP_ASSET.USDT} onSelect={onSelectAsset}>
          <TetherIcon className="swap-dropdown-item-img" width="1.5rem" height="1.5rem" />
          {SWAP_ASSET.USDT}
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

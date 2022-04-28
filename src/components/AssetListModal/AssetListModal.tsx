import React from 'react';
import { Input, Modal } from 'rsuite';
import { Asset } from '../../model/Asset';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import './AssetListModal.scss';

type Props = {
  show: boolean;
  assetList: Asset[];
  selectedAsset?: Asset;
  close: () => void;
  onSelectAsset: (asset: Asset) => void;
};

export const AssetListModal: React.FC<Props> = ({ show, assetList, close, selectedAsset, onSelectAsset }) => {
  return (
    <Modal className="asset-list-modal" size="xs" backdrop={true} open={show} onClose={close}>
      <Modal.Header className="asset-list-header">
        <Modal.Title className="asset-list-title">Select an asset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Input className="asset-modal-input" placeholder="Search name,ticker symbol or paste assed ID" />
        <hr className="divider" />
        <ul className="asset-list-item-ul">
          {assetList.map((asset) => {
            return (
              <li
                key={asset.assetHash}
                onClick={() => {
                  onSelectAsset(asset);
                }}
                className={`asset-list-item ${selectedAsset?.assetHash === asset.assetHash && 'selected-asset-item'}`}
              >
                <div className="asset-list-ticker-div">
                  <AssetIcon asset={asset} width="2rem" height="2rem" />
                  <div className="asset-ticker">{asset.name}</div>
                </div>
                <div className="asset-list-hash">
                  {'0x' +
                    asset.assetHash.substring(0, 4) +
                    '..' +
                    asset.assetHash.substring(asset.assetHash.length - 4)}
                </div>
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

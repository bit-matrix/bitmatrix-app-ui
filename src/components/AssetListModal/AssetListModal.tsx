import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'rsuite';
import { PAsset } from '@bitmatrix/models';
import { AssetIcon } from '../AssetIcon/AssetIcon';
import { useHistory } from 'react-router';
import { ROUTE_PATH } from '../../enum/ROUTE_PATH';
import './AssetListModal.scss';

type Props = {
  show: boolean;
  assetList?: PAsset[];
  selectedAsset?: PAsset;
  close: () => void;
  onSelectAsset: (asset: PAsset) => void;
};

export const AssetListModal: React.FC<Props> = ({ show, assetList, close, selectedAsset, onSelectAsset }) => {
  const [filteredAssetList, setFilteredAssetLİst] = useState<PAsset[]>();

  const history = useHistory();

  useEffect(() => {
    setFilteredAssetLİst(assetList);
  }, [assetList]);

  const assetSearch = (input: string) => {
    if (assetList) {
      let currentAssetList = [...assetList];
      const searchName: PAsset[] = assetList.filter((asset) => {
        return asset.name?.toLowerCase().match(input.toLowerCase().trim())?.input;
      });
      const searchTicker: PAsset[] = assetList.filter((asset) => {
        return asset.ticker?.toLowerCase().match(input.toLowerCase().trim())?.input;
      });
      const searchAssetID: PAsset[] = assetList.filter((asset) => asset.assetHash === input.trim());
      if (searchTicker.length > 0) {
        currentAssetList = searchTicker;
      } else if (searchName.length > 0) {
        currentAssetList = searchName;
      } else if (searchAssetID.length > 0) {
        currentAssetList = searchAssetID;
      } else {
        currentAssetList = [];
      }
      setFilteredAssetLİst(currentAssetList);
    }
  };

  const onChange = (input: string) => {
    assetSearch(input);
  };

  return (
    <Modal className="asset-list-modal" size="xs" backdrop={true} open={show} onClose={close}>
      <Modal.Header className="asset-list-header">
        {assetList && assetList.length > 0 ? (
          <Modal.Title className="asset-list-title">Select an asset</Modal.Title>
        ) : (
          <Modal.Title className="asset-list-title">There are no pools.</Modal.Title>
        )}
      </Modal.Header>

      <Modal.Body>
        {assetList && assetList.length > 0 ? (
          <>
            <Input
              className="asset-modal-input"
              placeholder="Search name,ticker symbol or paste assed ID"
              onChange={(event) => onChange(event)}
            />

            <hr className="divider" />
            <ul className="asset-list-item-ul">
              {filteredAssetList?.map((asset) => {
                return (
                  <li
                    key={asset.assetHash}
                    onClick={() => {
                      onSelectAsset(asset);
                    }}
                    className={`asset-list-item ${
                      selectedAsset?.assetHash === asset.assetHash && 'selected-asset-item'
                    }`}
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
          </>
        ) : (
          <div className="no-pool-button-content">
            <Button
              appearance="default"
              className="pm-add-button"
              onClick={() => history.push(ROUTE_PATH.CREATE_NEW_POOL)}
            >
              Create New Pool
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Button, Modal } from 'rsuite';
import { CheckBoxGroup } from '../../../components/base/CheckBoxGroup/CheckBoxGroup';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { useWalletContext, useSettingsContext } from '../../../context';
import { EXPLORER } from '../../../enum/EXPLORER';
import { SELECTED_THEME } from '../../../enum/SELECTED_THEME';
import { explorerOptions, networkOptions } from '../General/utils';
import info from '../../../images/info2.png';
import './Advanced.scss';

export const Advanced = (): JSX.Element => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext, setExplorerContext } = useSettingsContext();

  const disconnectWallet = () => {
    const currentWallet = walletContext;

    if (currentWallet && currentWallet.marina) {
      currentWallet.marina.disable();

      setWalletContext({ marina: currentWallet.marina, isEnabled: false, balances: [], coins: [] });

      if (settingsContext.exclusiveThemes.length > 0 && settingsContext.theme === SELECTED_THEME.BANANA) {
        setThemeContext(SELECTED_THEME.NEON);
        setExclusiveThemesContext([]);
      }

      setShowConfirmModal(false);
    }
  };

  return (
    <div className="advanced-main">
      <div className="advance-item">
        <div className="advance-item-first-head">
          <span className="advance-title">Explorer</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Explorer"
            content="Your preferred explorer choice for viewing ongoing transaction status."
          >
            <img className="advance-icon" src={info} alt="info" />
          </CustomPopover>
        </div>

        <CheckBoxGroup
          className="explorer"
          options={explorerOptions}
          onChange={(checkedValue: EXPLORER | undefined) => {
            if (checkedValue) setExplorerContext(checkedValue);
          }}
          checkedValue={settingsContext.explorer}
        />
      </div>
      <div className="advance-item">
        <div className="advance-item-head">
          <span className="advance-title">Network</span>
          <CustomPopover placement="autoHorizontal" title="Explorer" content="Network environment.">
            <img className="advance-icon" src={info} alt="info" />
          </CustomPopover>
        </div>

        <CheckBoxGroup
          className="explorer"
          options={networkOptions}
          onChange={(checkedValue) => console.log(checkedValue)}
          checkedValue={settingsContext.network}
        />
      </div>
      <div className="advance-item">
        <div className="advance-item-head">
          <span className="advance-title">Wallet Connection</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Wallet Connection"
            content="Connect/Disconnect your Liquid wallet."
          >
            <img className="advance-icon" src={info} alt="info" />
          </CustomPopover>
        </div>
        <div className="modal-container">
          <Modal
            className="wallet-confirm-modal"
            open={showConfirmModal}
            keyboard={false}
            onClose={() => setShowConfirmModal(false)}
          >
            <Modal.Header>
              <Modal.Title>Disconnect Wallet Confirm</Modal.Title>
            </Modal.Header>

            <Modal.Body>Are you sure for disconnect marina wallet?</Modal.Body>
            <Modal.Footer>
              <Button onClick={disconnectWallet} color="red" appearance="ghost">
                Disconnect Wallet
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div>
          <WalletButton
            text="Disconnect Wallet"
            className="advanced-wallet-button"
            onClick={() => {
              setShowConfirmModal(true);
            }}
            isDisconnetWallet
          />
        </div>
      </div>
    </div>
  );
};

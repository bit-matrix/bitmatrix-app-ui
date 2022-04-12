import React, { useState } from 'react';
import { Button, Modal } from 'rsuite';
import { CheckBoxGroup } from '../../../components/base/CheckBoxGroup/CheckBoxGroup';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { useWalletContext, useSettingsContext } from '../../../context';
import { EXPLORER } from '../../../enum/EXPLORER';
import { SELECTED_THEME } from '../../../enum/SELECTED_THEME';
import info from '../../../images/info2.png';
import { explorerOptions } from '../General/utils';
import './Advanced.scss';

export const Advanced = (): JSX.Element => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { walletContext, setWalletContext } = useWalletContext();
  const { settingsContext, setThemeContext, setExclusiveThemesContext } = useSettingsContext();

  const disconnectWallet = () => {
    const currentWallet = walletContext;

    if (currentWallet && currentWallet.marina) {
      currentWallet.marina.disable();

      setWalletContext({ marina: currentWallet.marina, isEnabled: false, balances: [] });

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
          <CustomPopover placement="autoHorizontal" title="Explorer" content="Lorem ipsum">
            <img className="advance-icon" src={info} alt="info" />
          </CustomPopover>
        </div>

        <CheckBoxGroup
          className="explorer"
          options={explorerOptions}
          onChange={(checkedValue: EXPLORER | undefined) => {
            console.log(checkedValue);
          }}
          checkedValue={EXPLORER.BLOCK_STREAM}
        />
      </div>
      <div className="advance-item">
        <div className="advance-item-head">
          <span className="advance-title">Wallet Connection</span>
          <CustomPopover placement="autoHorizontal" title="Wallet Connection" content="Lorem ipsum">
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
          />
        </div>
      </div>
    </div>
  );
};

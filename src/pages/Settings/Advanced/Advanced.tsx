import React, { useContext, useState } from 'react';
import { Button, Modal } from 'rsuite';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import SettingsContext from '../../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../../context/SETTINGS_ACTION_TYPES';
import './Advanced.scss';

export const Advanced = (): JSX.Element => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { payloadData, dispatch } = useContext(SettingsContext);

  const disconnectWallet = () => {
    const currentWallet = payloadData.wallet;

    if (currentWallet) {
      currentWallet.marina.disable();

      dispatch({
        type: SETTINGS_ACTION_TYPES.SET_WALLET,
        payload: {
          ...payloadData,
          wallet: { marina: currentWallet.marina, isEnabled: false, balances: [] },
        },
      });

      setShowConfirmModal(false);
    }
  };

  return (
    <div className="advanced-main">
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
      <div style={{ textAlign: 'center' }}>
        <WalletButton
          text="Disconnect Wallet"
          onClick={() => {
            setShowConfirmModal(true);
          }}
        />
      </div>
    </div>
  );
};

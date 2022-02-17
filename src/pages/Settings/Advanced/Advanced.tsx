import React, { useState } from 'react';
import { Button, Modal } from 'rsuite';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { useWalletContext } from '../../../context/wallet';
import './Advanced.scss';

export const Advanced = (): JSX.Element => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { walletContext, setWalletContext } = useWalletContext();

  const disconnectWallet = () => {
    const currentWallet = walletContext;

    if (currentWallet && currentWallet.marina) {
      currentWallet.marina.disable();

      setWalletContext({ marina: currentWallet.marina, isEnabled: false, balances: [] });

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

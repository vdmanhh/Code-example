import React from 'react';
import { useTranslation } from 'react-i18next';

import MetamaskIcon from 'resources/images/metamask-logo.png';
import LoadingIcon from 'resources/svg/IconLoading';

import ModalComponent from 'components/Modal';
type ModalProcessMetaMaskProps={
  visible: boolean,
  toggleModal: any
}
export default function ModalProcessMetaMask({ visible, toggleModal }:ModalProcessMetaMaskProps) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={t('login.txt_connect_metamask')}
      visible={visible}
      wrapClassName="process-metamask-modal"
      // onClose={toggleModal}
      showCloseIcon={false}
    >
      <div className="body">
        <div className="body__img">
          <img src={MetamaskIcon} width={100} />
        </div>
        <div className="body__loading-icon">
          <LoadingIcon />
        </div>
      </div>
    </ModalComponent>
  );
}

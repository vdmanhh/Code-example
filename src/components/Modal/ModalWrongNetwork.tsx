import React from 'react';
import { useTranslation } from 'react-i18next';

import MetamaskIcon from 'resources/images/metamask-logo.png';
import LoadingIcon from 'resources/svg/IconLoading';

import ModalComponent from 'components/Modal';
import { METAMASK_DEEPLINK } from 'common/chainConstant';

export default function ModalWrongNetwork({ visible, toggleModal }: { visible: boolean; toggleModal?: any }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      showCloseIcon={false}
      title={null}
      visible={visible}
      wrapClassName="metamask-not-found-modal"
      onClose={toggleModal}
    >
      <div className="body">
        <div className="body__loading-icon">
          <LoadingIcon />
        </div>
        <div className="title">{t('login.txt_wrong_network')}</div>
        <div className="body__description">{t('login.txt_wrong_network_desc')}</div>
        <a className="body__link" href={METAMASK_DEEPLINK}>
          {t('login.txt_binance_smart_chain')}
        </a>
      </div>
    </ModalComponent>
  );
}

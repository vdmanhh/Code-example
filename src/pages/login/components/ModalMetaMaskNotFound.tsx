import React from 'react';
import { useTranslation } from 'react-i18next';

import MetamaskIcon from 'resources/images/metamask-logo.png';

import ModalComponent from 'components/Modal';
import { METAMASK_DEEPLINK } from 'common/chainConstant';

export default function ModalMetaMaskNotFound({ visible, toggleModal }: { visible: boolean; toggleModal: any }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={t('login.txt_metamask_not_found')}
      visible={visible}
      wrapClassName="metamask-not-found-modal"
      onClose={toggleModal}
      maskClosable
    >
      <div className="body">
        <div className="body__img">
          <img src={MetamaskIcon} width={100} />
        </div>
        <div className="body__description">{t('login.txt_dont_have_metamask')}</div>
        <a className="body__link" target="_blank" href={METAMASK_DEEPLINK}>
          {t('login.txt_download_metamask')}
        </a>
      </div>
    </ModalComponent>
  );
}

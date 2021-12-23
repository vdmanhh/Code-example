import React from 'react';
import { useTranslation } from 'react-i18next';

import MetamaskIcon from 'resources/images/metamask-logo.png';
import LoadingIcon from 'resources/svg/IconLoading';

import ModalComponent from 'components/Modal';
import { METAMASK_DEEPLINK } from 'common/chainConstant';
import ButtonComponent from 'components/Button';

export default function ModalUnsaveChange({
  visible,
  confirmModal,
  toggleModal,
}: {
  visible: boolean;
  confirmModal?: any;
  toggleModal?: any;
}) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      showCloseIcon={false}
      title={t('common.txt_unsave_change')}
      visible={visible}
      wrapClassName="unsave-change-modal"
      onClose={null}
    >
      <div className="body">
        <div className="body__description">{t('common.txt_unsave_change_desc')}</div>
        <div className="body__btn-group">
          <ButtonComponent onClick={toggleModal} variant="light" text={t('common.txt_discard')} />
          <ButtonComponent onClick={confirmModal} variant="secondary" text={t('common.txt_confirm')} />
        </div>
      </div>
    </ModalComponent>
  );
}

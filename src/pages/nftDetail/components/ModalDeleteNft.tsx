import React from 'react';
import { useTranslation } from 'react-i18next';

import ModalComponent from 'components/Modal';
import ButtonComponent from 'components/Button';

export default function ModalDeleteNft({ visible, toggleModal, confirmModal }: any) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={t('nft_detail.txt_delete_nft')}
      visible={visible}
      wrapClassName="delete-nft-modal"
      onClose={toggleModal}
    >
      <div className="body">
      <div className="body__description">{t('nft_detail.txt_delete_nft_desc')}</div>
        <div className="body__btn-group">
          <ButtonComponent onClick={toggleModal} variant="light" text={t('common.txt_cancel')} />
          <ButtonComponent onClick={confirmModal} variant="secondary" text={t('common.txt_delete')} />
        </div>
      </div>
    </ModalComponent>
  );
}

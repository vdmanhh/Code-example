import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingIcon from 'resources/svg/IconLoading';

import ModalComponent from 'components/Modal';

export default function ModalSigningRequest({ visible, nftImg }: { visible: boolean; nftImg: any }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={t('nft.txt_signing_nft_item')}
      visible={visible}
      wrapClassName="signing-sell-nft-modal"
      // onClose={toggleModal}
      showCloseIcon={false}
    >
      <div className="body">
        <div className="body__description">{t('nft.txt_signing_nft_item_desc')}</div>
        <div className="body__img">
          <img src={nftImg} width={100} />
        </div>
        <div className="body__loading-icon">
          <LoadingIcon />
        </div>
      </div>
    </ModalComponent>
  );
}

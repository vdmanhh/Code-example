import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingIcon from 'resources/svg/IconLoading';

import ModalComponent from 'components/Modal';

export default function ModalProcessCancel({ visible, nftImg }: { visible: boolean; nftImg: any }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      title={t('nft_detail.txt_process_cancel_sell_order')}
      visible={visible}
      wrapClassName="process-cancel-sell-order-modal"
      // onClose={toggleModal}
      showCloseIcon={false}
    >
      <div className="body">
        <div className="body__description">{t('nft_detail.txt_process_cancel_sell_order_desc')}</div>
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

import React from 'react';
import { useTranslation } from 'react-i18next';

import SuccessIcon from 'resources/svg/IconSuccess.svg';

import ModalComponent from 'components/Modal';

export default function ModalSuccess({ title, visible, toggleModal, description }: { title: string, visible: boolean; toggleModal?: any, description: string }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      showCloseIcon
      title={title}
      visible={visible}
      wrapClassName="success-modal"
      onClose={toggleModal}
    >
      <div className="body">
        <div className="body__loading-icon">
          <img className="body__img" src={SuccessIcon}/>
        </div>
        <div className="body__description">{description}</div>
      </div>
    </ModalComponent>
  );
}

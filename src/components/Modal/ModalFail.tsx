import React from 'react';
import { useTranslation } from 'react-i18next';

import FailIcon from 'resources/svg/IconFail.svg';

import ModalComponent from 'components/Modal';

export default function ModalFail({ title, visible, toggleModal, description }: { title: string, visible: boolean; toggleModal?: any, description: string }) {
  const { t } = useTranslation();

  return (
    <ModalComponent
      showCloseIcon
      title={title}
      visible={visible}
      wrapClassName="fail-modal"
      onClose={toggleModal}
    >
      <div className="body">
        <div className="body__loading-icon">
          <img src={FailIcon}/>
        </div>
        <div className="body__description">{description}</div>
      </div>
    </ModalComponent>
  );
}

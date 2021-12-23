import { Button, Space } from 'antd';
import ModalComponent from '../Modal';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const ActiveModal: FC<{
  isVisible: boolean;
  onClose: any;
  isSubmitting: boolean;
  onSubmit: any;
  width?: number;
  title: any;
  description: any;
  okText?: string;
  cancelText?: string;
  showCloseIcon?: boolean;
  className?: string;
}> = ({
  isVisible = false,
  onClose,
  isSubmitting,
  onSubmit,
  width,
  title = '',
  description = '',
  okText = '',
  showCloseIcon = true,
  className = '',
  cancelText = '',
}) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!onSubmit) {
      return;
    }

    onSubmit();
  };

  return (
    <ModalComponent
      visible={isVisible}
      title={title}
      width={width || 544}
      onClose={onClose}
      wrapClassName={`modal-update-status modal-active-user ${className}`}
      showCloseIcon={showCloseIcon && !isSubmitting}
    >
      <div
        className='description'
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
      <Space size='middle' className='action'>
        <Button
          className='button button-confirm'
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {okText || t('common.button_confirm')}
        </Button>
        <Button
          onClick={onClose}
          className='button button-cancel'
          disabled={isSubmitting}
        >
          {cancelText || t('common.button_cancel')}
        </Button>
      </Space>
    </ModalComponent>
  );
};

export default ActiveModal;

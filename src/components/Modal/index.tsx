import React, { Fragment, FC } from "react";
import { Button, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";

const ModalComponent: FC<{
  title?: any;
  onClose?: any;
  showCloseIcon?: boolean;
  visible: boolean;
  width?: number | string;
  maskClosable?: boolean;
  wrapClassName?: string;
  getContainer?: any;
  destroyOnClose?: boolean;
}> = ({ children, title, onClose, showCloseIcon = true, width, destroyOnClose = true, maskClosable, ...props }) => {
  return (
    <Modal
      footer={null}
      wrapClassName={"modal"}
      closable={false}
      width={width ?? 565}
      destroyOnClose={destroyOnClose}
      onCancel={onClose}
      maskClosable={maskClosable || !showCloseIcon}
      {...props}
    >
      <Fragment>
        {showCloseIcon && <Button onClick={onClose} className="ant-modal-close" icon={<CloseOutlined />} />}
        <div className="modal-wrap">
          <Title level={5} className="title">
            {title}
          </Title>
          {children}
        </div>
      </Fragment>
    </Modal>
  );
};

export default ModalComponent;

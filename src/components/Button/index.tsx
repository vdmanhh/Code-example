import React from 'react';
import { Button } from 'antd';

declare const ButtonVarients: ['default', 'primary', 'light', 'secondary', 'border-secondary'];
declare type ButtonVarient = typeof ButtonVarients[number];

type ButtonComponentProps = {
  variant?: ButtonVarient | undefined;
  prefixIcon?: any;
  afterIcon?: any;
  customClassName?: string | undefined;
  onClick?: any;
  onBlur?: any;
  text: any;
  disabled?: any;
  type?: any;
  loading?: boolean;
  href?: string;
};

function ButtonComponent({
  variant,
  prefixIcon,
  afterIcon,
  text,
  type,
  customClassName,
  loading,
  disabled,
  ...props
}: ButtonComponentProps) {
  return (
    <Button
      {...props}
      disabled={disabled}
      loading={loading}
      className={`button button--${variant} ${customClassName}`}
      htmlType={type}
    >
      {prefixIcon}
      <span>{text}</span>
      {afterIcon}
    </Button>
  );
}

export default ButtonComponent;

import React, { useState, FC } from 'react';
import { Tooltip, Typography } from 'antd';

const { Paragraph } = Typography;

type TooltipParagraph = {
  ellipsis?: any;
  overlayClassName?: string;
};

const TooltipParagraph: FC<TooltipParagraph> = ({
  children,
  ellipsis,
  overlayClassName,
  ...props
}) => {
  const [truncated, setTruncated] = useState(false);

  return (
    <Tooltip
      title={truncated ? children : undefined}
      getPopupContainer={(trigger: any) => trigger.parentElement}
      placement='topLeft'
      overlayClassName={overlayClassName}
    >
      <Paragraph
        {...props}
        ellipsis={{ ...ellipsis, onEllipsis: setTruncated }}
      >
        {children}
      </Paragraph>
    </Tooltip>
  );
};

export default TooltipParagraph;

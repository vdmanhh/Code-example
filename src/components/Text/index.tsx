import React, { FC } from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

import IconCopy from "resources/svg/IconCopy";

const { Text } = Typography;

const TextComponent: FC<any> = ({ copyable, children, className = "", ...props }) => {
  const { t } = useTranslation();
  return (
    <Text
      copyable={
        copyable && { tooltips: [t("common.txt_copy"), t("common.txt_copied")], icon: <IconCopy />, ...copyable }
      }
      className={classnames("text-component", className)}
      {...props}
    >
      {children}
    </Text>
  );
};

export default TextComponent;

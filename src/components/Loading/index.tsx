import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoadingComponent = () => {
  return (
    <div className="loading">
      <Spin indicator={loadingIcon} />
    </div>
  );
};

export default LoadingComponent;

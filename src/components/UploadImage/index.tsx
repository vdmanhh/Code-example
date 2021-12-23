import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import cx from 'classnames';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));

  img && reader.readAsDataURL(img);
}

const handleCustomRequest = (options: any) => {
  const { onSuccess } = options;
  onSuccess('Ok');
};

export const UploadImage = ({ currentImage, handleChange, beforeUpload, defaultImage, typeEdit, className }: any) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!typeEdit && defaultImage) {
      setImageUrl(defaultImage);
    } else if (typeof currentImage === 'object') {
      getBase64(currentImage, (imageUrl: any) => {
        setImageUrl(imageUrl);
      });
    }
  }, [currentImage, defaultImage, typeEdit]);

  const handleChangeUpload = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    handleChange(info);
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className={cx('avatar-uploader upload-image', className)}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChangeUpload}
      customRequest={handleCustomRequest}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

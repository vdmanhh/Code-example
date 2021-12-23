import { message } from 'antd';
import { getI18n } from 'react-i18next';

export default function showMessage(msgType, msgContent, objValue) {
  message.config({
    maxCount: 1
  });
  message[msgType]({
    content: getI18n().t(msgContent, objValue),
    className: 'event-message',
    duration: 3,
    maxCount: 1
  });
}

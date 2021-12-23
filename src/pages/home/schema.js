import * as Yup from 'yup';
import { getI18n } from 'react-i18next';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required(getI18n().t('message.E21', { fieldName: getI18n().t('common.fullName') })),
  email: Yup.string()
    .trim()
    .required(getI18n().t('message.E21', { fieldName: getI18n().t('common.email') }))
    .email(getI18n().t('message.E3')),
  message: Yup.string()
    .trim()
    .required(getI18n().t('message.E21', { fieldName: getI18n().t('common.message') })),
});

export { validationSchema };

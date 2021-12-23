import moment from 'moment';

import { FORMAT_DATE } from 'common/constant';

export const DATE_FORMAT = 'DD/MM/YYYY';

export function formatDate(date: moment.MomentInput, type = '') {
  return moment(date).format(type || FORMAT_DATE);
}

export const getAddedTime = (days: number) => {
  return moment().add(days, 'days').valueOf().toString();
};

export const getCurrentTime = () => {
  return moment().valueOf().toString();
};

export function getStartDateTimestamp(value: string) {
  if (!value) {
    return null;
  }

  return moment(value, DATE_FORMAT).clone().startOf('days').toISOString();
}

export function getEndDateTimestamp(value: string) {
  if (!value) {
    return null;
  }

  return moment(value, DATE_FORMAT).clone().endOf('days').toISOString();
}

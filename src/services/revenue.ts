import { api } from './api';

export const getListTransaction = (params: any) => {
  return api.get('admin/transactions', params);
};

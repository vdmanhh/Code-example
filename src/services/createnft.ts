import { api } from './api';

export const postNfts = (params: any) => {
  return api.post('admin/nfts', params);
};

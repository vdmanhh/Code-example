import { api } from './api';

export const getListNft = (params: any) => {
  return api.get('admin/nfts', params);
};

import { api } from './api';

export const getNftDetail = (params: any) => {
  return api.get(`admin/nfts/${params.id}/join-sell-orders`, params);
};

export const deleteNft = (params: any) => {
  return api.delete(`admin/nfts/${params.id}`);
};

export const getNftTransction = (id: string, params: any) => {
  return api.get(`admin/nfts/${id}/transactions`, params);
};

export const editNfts = (params: any, id: string) => {
  return api.put(`admin/nfts/${id}`, params);
};

export const postSellOrder = (params: any) => {
  return api.post('admin/sell-orders', params);
};

export const getSellOrderDetail = (id: any) => {
  return api.get(`admin/sell-orders/nftId/${id}`)
}

import { api } from './api';

export const cancelSellOrder = (id: string) => {
  return api.put(`sell-orders/${id}/cancel`);
};
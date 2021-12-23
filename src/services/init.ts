import { api } from './api';

export const getClans = () => {
  return api.get('clans');
};

export const getRarities = () => {
  return api.get('rarities');
};

export const getCurrencies = () => {
  return api.get('currencies');
};

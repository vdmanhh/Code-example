import { api } from './api';

export const postSignInApi = (params) => {
  return api.post('auth/login', params);
};

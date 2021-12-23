import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
  nftList: [],
  total: 0,
  loading: false,
  dortTotal: 0,
  itemTotal: 0,
};

export const nftListSlice = createSlice({
  name: 'nftList',
  initialState,
  reducers: {
    handleGetListNft: (state: any, action: any) => ({
      ...state,
      loading: true,
    }),
    handleGetListNftSuccess: (state: any, action: any) => {
      return {
        ...state,
        nftList: action.payload.data,
        total: action.payload.total,
        loading: false,
        dortTotal: action.payload.dortTotal,
        itemTotal: action.payload.itemTotal,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleGetListNft, handleGetListNftSuccess } = nftListSlice.actions;

export const namespace = 'nftList';

export default nftListSlice.reducer;

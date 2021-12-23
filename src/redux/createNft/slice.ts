import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { any } from 'prop-types';

const initialState = {
  loadingButton: false,
};

export const createNftSlice = createSlice({
  name: 'createNFT',
  initialState,
  reducers: {
    handleCreateNftAction: (state: any, action: any) => ({
      ...state,
    loadingButton: true,

    }),
    handleCreateNftActionSuccess: (state: any, action: any) => {
      return {
        ...state,
        loadingButton: false,
      };
    },
    handleCreateNftActionFail: (state: any, action: any) => {
      return {
        ...state,
        loadingButton: false
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const { handleCreateNftAction, handleCreateNftActionSuccess, handleCreateNftActionFail } = createNftSlice.actions;

export const namespace = 'createNFT';

export default createNftSlice.reducer;

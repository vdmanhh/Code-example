import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  nftDetail: {},
  sellOrderDetail: {},
  transactions: [],
  totalTransaction: 0,
  transactionLoading: false,
};

export const nftDetailSlice = createSlice({
  name: 'nftDetail',
  initialState,
  reducers: {
    handleGetNftDetailAction: (state: any, action: any) => ({
      ...state,
    }),
    handleGetNftDetailSuccessAction: (state: any, action: any) => ({
      ...state,
      nftDetail: action.payload.data,
    }),
    handleDeleteNftAction: (state: any, action: any) => ({
      ...state,
    }),
    handleDeleteNftSuccessAction: (state: any, action: any) => ({
      ...state,
    }),
    handleGetNftTransactionAction: (state: any, action: any) => ({
      ...state,
      transactionLoading: true,
    }),
    handleGetNftTransactionSuccessAction: (state: any, action: any) => ({
      ...state,
      transactions: action.payload.data,
      totalTransaction: action.payload.total,
    }),
    handleEditNftAction: (state: any, action: any) => {
      return {
        ...state,
      };
    },
    handleEditNftSuccessAction: (state: any, action: any) => {
      return {
        ...state,
      };
    },
    handleSellNftAction: (state: any, action: any) => {
      return {
        ...state,
      };
    },
    hadnleSellNftSuccessAction: (state: any, action: any) => {
      return {
        ...state,
      };
    },
    handleGetSellOrderDetailAction: (state: any, action: any) => {
      return {
        ...state,
      }
    },
    handleGetSellOrderDetailSuccessAction: (state: any, action: any) => {
      return {
        ...state,
        sellOrderDetail: action.payload.data
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  handleGetNftDetailAction,
  handleGetNftDetailSuccessAction,
  handleDeleteNftAction,
  handleDeleteNftSuccessAction,
  handleGetNftTransactionAction,
  handleGetNftTransactionSuccessAction,
  handleEditNftAction,
  handleEditNftSuccessAction,
  handleSellNftAction,
  hadnleSellNftSuccessAction,
  handleGetSellOrderDetailAction,
  handleGetSellOrderDetailSuccessAction
} = nftDetailSlice.actions;

export const namespace = 'nftDetail';

export default nftDetailSlice.reducer;

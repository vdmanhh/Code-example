import { createSlice } from '@reduxjs/toolkit';
import { any } from 'prop-types';

export interface Address {
  address: string;
  listAddress: any;
  isWrongNetwork: boolean;
}

const initialState : Address = {
  address: '',
  listAddress: {},
  isWrongNetwork: false,
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    handleSetAddressNetwork: (state: Address, action: any) => {
      const { address, chainId } = action.payload;
      return {
        ...state,
        address,
        chainId,
      };
    },
    handleAddAddressNetWork: (state: Address, action: any) => {
      const { address, signature, startTime, expiredTime } = action.payload;
      return {
        ...state,
        listAddress: {
          ...state.listAddress,
          [address]: {
            address,
            signature,
            startTime,
            expiredTime,
          },
        },
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleSetAddressNetwork, handleAddAddressNetWork } = addressSlice.actions;

export const namespace = 'address';

export default addressSlice.reducer;

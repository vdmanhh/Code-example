import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAdmin: false,
  visibleModalConnectWallet: false,
  visibleModalWrongNetwork: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction: (state, action) => ({
      ...state,
    }),
    loginSuccesccAction: (state, action) => ({
      ...state,
      isAdmin: action.payload?.isAdmin,
    }),
    handleSetIsAdminAction: (state, action) => ({
      ...state,
      isAdmin: action.payload?.isAdmin,
    }),
    handleVisibleModalConnectWallet: (state, action) => ({
      ...state,
      visibleModalConnectWallet: action.payload,
    }),
    handleVisibleModalWrongNetwork: (state, action) => ({
      ...state,
      visibleModalWrongNetwork: action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const {
  loginAction,
  loginSuccesccAction,
  handleSetIsAdminAction,
  handleVisibleModalConnectWallet,
  handleVisibleModalWrongNetwork,
} = authSlice.actions;

export const namespace = 'auth';

export default authSlice.reducer;

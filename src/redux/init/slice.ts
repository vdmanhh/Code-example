import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clans: [],
  rarities: [],
  currencies: [],
};

export const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
    handleGetClans: (state: any) => ({
      ...state,
    }),
    handleGetClansSuccess: (state: any, action: any) => ({
      ...state,
      clans: action.payload.clans,
    }),
    handleGetRarities: (state: any) => ({
      ...state,
    }),
    handleGetRaritiesSuccess: (state: any, action: any) => ({
      ...state,
      rarities: action.payload.rarities,
    }),
    handleGetCurrencies: (state: any) => ({
      ...state,
    }),
    handleGetCurrenciesSuccess: (state: any, action: any) => ({
      ...state,
      currencies: action.payload.currencies,
    }),
  },
});

// Action creators are generated for each case reducer function
export const {
  handleGetClans,
  handleGetClansSuccess,
  handleGetRarities,
  handleGetRaritiesSuccess,
  handleGetCurrencies,
  handleGetCurrenciesSuccess,
} = initSlice.actions;

export const namespace = 'intiSlice';

export default initSlice.reducer;

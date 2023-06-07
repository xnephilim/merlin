import { combineReducers } from '@reduxjs/toolkit'
import localforage from 'localforage'
import { persistReducer } from 'redux-persist'
import { swapperApi } from 'state/apis/swapper/swapperApi'

import { abiApi } from './apis/abi/abiApi'
import { covalentApi } from './apis/covalent/covalentApi'
import { fiatRampApi } from './apis/fiatRamps/fiatRamps'
import { merlinxApi } from './apis/merlinx/merlinxApi'
import { nft, nftApi } from './apis/nft/nftApi'
import { zapper, zapperApi } from './apis/zapper/zapperApi'
import { zerionApi } from './apis/zerion/zerionApi'
import { assetApi, assets } from './slices/assetsSlice/assetsSlice'
import { marketApi, marketData } from './slices/marketDataSlice/marketDataSlice'
import { opportunitiesApi } from './slices/opportunitiesSlice/opportunitiesApiSlice'
import { opportunities } from './slices/opportunitiesSlice/opportunitiesSlice'
import { portfolio, portfolioApi } from './slices/portfolioSlice/portfolioSlice'
import { preferences } from './slices/preferencesSlice/preferencesSlice'
import { swappers, swappersApi } from './slices/swappersSlice/swappersSlice'
import { txHistory, txHistoryApi } from './slices/txHistorySlice/txHistorySlice'

export const slices = {
  assets,
  marketData,
  txHistory,
  portfolio,
  preferences,
  opportunities,
  nft,
  swappers,
}

const preferencesPersistConfig = {
  key: 'preferences',
  storage: localforage,
  blacklist: ['featureFlags'],
}

export const sliceReducers = {
  assets: assets.reducer,
  marketData: marketData.reducer,
  txHistory: txHistory.reducer,
  portfolio: portfolio.reducer,
  preferences: persistReducer(preferencesPersistConfig, preferences.reducer),
  swapperApi: swapperApi.reducer,
  swappers: swappers.reducer,
  opportunities: opportunities.reducer,
  nft: nft.reducer,
}

export const apiSlices = {
  assetApi,
  portfolioApi,
  marketApi,
  txHistoryApi,
  swapperApi,
  swappersApi,
  merlinxApi,
  fiatRampApi,
  zapper,
  zapperApi,
  nftApi,
  covalentApi,
  opportunitiesApi,
  abiApi,
  zerionApi,
}

export const apiReducers = {
  [assetApi.reducerPath]: assetApi.reducer,
  [portfolioApi.reducerPath]: portfolioApi.reducer,
  [marketApi.reducerPath]: marketApi.reducer,
  [txHistoryApi.reducerPath]: txHistoryApi.reducer,
  [swapperApi.reducerPath]: swapperApi.reducer,
  [swappersApi.reducerPath]: swappersApi.reducer,
  [merlinxApi.reducerPath]: merlinxApi.reducer,
  [fiatRampApi.reducerPath]: fiatRampApi.reducer,
  [zapperApi.reducerPath]: zapperApi.reducer,
  [nftApi.reducerPath]: nftApi.reducer,
  [covalentApi.reducerPath]: covalentApi.reducer,
  [zapper.reducerPath]: zapper.reducer,
  [opportunitiesApi.reducerPath]: opportunitiesApi.reducer,
  [abiApi.reducerPath]: abiApi.reducer,
  [zerionApi.reducerPath]: zerionApi.reducer,
}

export const reducer = combineReducers({ ...sliceReducers, ...apiReducers })
export type ReduxState = ReturnType<typeof reducer>

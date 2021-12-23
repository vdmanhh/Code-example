import React from 'react';
import {
  HomeOutlined,
  FileImageOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Redirect } from 'react-router';

import HomePage from './pages/home';
import LoginPage from './pages/login';
import NFTList from 'pages/nftList';
import NFTCreatePage from 'pages/nftCreate';
import NFTDetailPage from 'pages/nftDetail';
import SellNft from 'pages/sellNft';
import Revenue from 'pages/revenue';

export const ROUTE_URL = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NFT_LIST: '/nft',
  NFT_DETAIL: '/nft-detail',
  CREATE_NFT: '/create-nft',
  REVENUE: '/revenue',
  EDIT_NFT: '/edit-nft',
  SELL_NFT: '/sell-nft',
};

const routes = [
  {
    name: 'Login',
    path: ROUTE_URL.LOGIN,
    component: LoginPage,
    exact: true,
  },
  {
    name: 'redireact',
    path: '/',
    component: () => <Redirect to='/login' />,
  },
];

const privateRoutes = [
  {
    name: 'DashBoard',
    path: ROUTE_URL.DASHBOARD,
    component: HomePage,
    exact: true,
    inMenu: true,
    icon: <HomeOutlined />,
  },
  {
    name: 'NFT',
    path: ROUTE_URL.NFT_LIST,
    component: NFTList,
    exact: true,
    inMenu: true,
    icon: <FileImageOutlined />,
  },
  {
    name: 'Revenue',
    path: ROUTE_URL.REVENUE,
    component: Revenue,
    exact: true,
    inMenu: true,
    icon: <FormOutlined />,
  },
  {
    name: 'Create-NFT',
    path: ROUTE_URL.CREATE_NFT,
    component: NFTCreatePage,
    exact: true,
    icon: null,
  },
  {
    name: 'NFT-Detail',
    path: `${ROUTE_URL.NFT_DETAIL}/:id`,
    component: NFTDetailPage,
    exact: false,
    icon: null,
  },
  {
    name: 'Edit-NFT',
    path: `${ROUTE_URL.EDIT_NFT}/:id`,
    component: NFTCreatePage,
    exact: true,
    icon: null,
  },
  {
    name: 'Sell-NFT',
    path: `${ROUTE_URL.SELL_NFT}/:id`,
    component: SellNft,
    exact: true,
    icon: null,
  },
  {
    name: 'redireact',
    path: '/',
    component: () => <Redirect to='/dashboard' />,
  },
];

export { routes, privateRoutes };

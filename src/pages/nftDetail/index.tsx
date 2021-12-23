import { useHistory, useLocation, useParams } from 'react-router';
import React, { useEffect, useMemo } from 'react';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

import IconArrowLeft from 'resources/svg/IconArrowLeft';

import TabsComponnent from 'components/Tabs';
import NFTProfile from './components/NftProfile';
import TransactionHistory from './components/TransactionHistory';

import { privateRoutes, ROUTE_URL } from 'Routes';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import {
  handleDeleteNftAction,
  handleGetNftDetailAction,
  handleGetNftTransactionAction,
  handleGetSellOrderDetailAction,
} from 'redux/nftDetail/slice';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function NFTDetailPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation() as any;
  const { id } = useParams() as any;

  const listtab = [
    {
      key: 'nft-profile',
      tab: t('nft_detail.txt_nft_profile'),
      content: <NFTProfile id={id} />,
      className: 'nft-profile',
    },
    {
      key: 'transaction-history',
      tab: t('nft_detail.txt_transaction_history'),
      content: <TransactionHistory id={id} />,
      className: 'trans-history',
    },
  ];

  useEffect(() => {
    dispatch(handleGetNftDetailAction({ data: { id } }));
    dispatch(handleGetSellOrderDetailAction({ id }));
  }, [id]);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search) as any;

    return {
      tab: params?.tab || 'nft-profile',
    } as any;
  }, [location.search]);

  const handleChangeTab = (value: string) => {
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({
        tab: value,
      }),
    });
  };

  const handleBackPage = () =>
    history.push({
      pathname: ROUTE_URL.NFT_LIST,
      search: location?.state?.search,
    });

  return (
    <div className='nft-detail-page'>
      <div className='title'>
        <IconArrowLeft onClick={handleBackPage} />
        <span className='title__text'>{t('nft_detail.txt_nft_detail')}</span>
      </div>
      <div className='body'>
        <div className='body__tabs'>
          <TabsComponnent
            handleChangeTab={handleChangeTab}
            activeKey={queryParams.tab}
            listTab={listtab}
          />
        </div>
      </div>
    </div>
  );
}
export default NFTDetailPage;

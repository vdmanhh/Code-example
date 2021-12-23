import React from 'react';
import { TFunction } from 'i18next';
import moment from 'moment';
import { useHistory } from 'react-router';

import { formatDate } from 'utils/time';
import { privateRoutes } from 'Routes';
import { FORMAT_DATE_FULL, NFT_SALE_STATUS, NFT_TYPE } from 'common/constant';
import _ from 'lodash';
import { convertId } from 'utils';

export const columns = (t: TFunction, history: any, location: any) => [
  {
    title: t('nft_list.txt_create_date'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 70,
    sorter: true,
    render: (value: any) => formatDate(value, FORMAT_DATE_FULL),
  },
  {
    title: t('nft_list.txt_nft_id'),
    dataIndex: 'nftCode',
    key: 'nftCode',
    align: "center",
    width: 70,
    render: (value: any) => convertId(value.toString())
  },
  {
    title: t('nft_list.txt_nft_name'),
    dataIndex: 'name',
    key: 'name',
    width: 70,
    ellipsis: true,
    render: (value: any, row: any) => (
      <div className="nft-name d-flex">
        <div>
          <img src={row?.avatarUrl} alt={'nft-name'} className="table-thumbnail" />
        </div>
        <span className="collection-name text-ellipsis-table" title={row?.name}>
          {row?.name}
        </span>
      </div>
    ),
  },
  {
    title: t('nft_list.txt_type'),
    dataIndex: 'type',
    key: 'type',
    width: 70,
    render: (value: any) => _.find(NFT_TYPE, (data) => data.value === value)?.name,
  },
  {
    title: t('nft_list.txt_total_copies'),
    dataIndex: 'totalCopies',
    key: 'totalCopies',
    width: 70,
  },
  {
    title: t('nft_list.txt_onsale_quantity'),
    dataIndex: 'onSaleQuantity',
    key: 'onSaleQuantity',
    width: 70,
  },
  {
    title: t('nft_list.txt_total_minted'),
    dataIndex: 'totalMinted',
    key: 'totalMinted',
    width: 70,
  },
  {
    title: t('nft_list.txt_status'),
    dataIndex: 'saleStatus',
    key: 'saleStatus',
    width: 70,
    render: (value: any) => (
      <div className={`status status--${_.find(NFT_SALE_STATUS, (data) => data.value === value)?.value}`}>
        {_.find(NFT_SALE_STATUS, (data) => data.value === value)?.name}
      </div>
    ),
  },
  {
    title: t('nft_list.txt_action'),
    dataIndex: 'no',
    key: 'no',
    width: 70,
    render: (value: any, row: any) => (
      <div className="view-detail" onClick={ () => history.push({pathname:`nft-detail/${row?._id}`, state:{search: location.search}})}>
        {t('common.txt_view_detail')}
      </div>
    ),
  },
];

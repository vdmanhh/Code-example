import React from 'react';
import { TFunction } from 'i18next';
import moment from 'moment';
import { convertAddress } from 'utils';

import { formatDate } from 'utils/time';
import { SELL_ORDER_TYPE, SELL_ORDER_TYPE_NAME } from 'common/constant';

export const columns = (t: TFunction) => [
  {
    title: t('common.txt_date'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 70,
    sorter: true,
    render: (value: any) => formatDate(value || moment()),
  },
  {
    title: t('common.txt_event'),
    dataIndex: 'sellOrderType',
    key: 'sellOrderType',
    width: 70,
    render: (value: any) => SELL_ORDER_TYPE_NAME[value],
  },
  {
    title: t('common.txt_from'),
    dataIndex: 'sellerAddress',
    key: 'sellerAddress',
    width: 70,
    render: (value: any) => convertAddress(value),
  },
  {
    title: t('common.txt_to'),
    dataIndex: 'buyerAddress',
    key: 'buyerAddress',
    width: 70,
    render: (value: any) => convertAddress(value),
  },
  {
    title: t('common.txt_quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
    width: 70,
  },
  {
    title: t('common.txt_unit_price'),
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 70,
    render: (value: any) => <div className=''>{`${value} BNB`}</div>,
  },
  {
    title: t('common.txt_revenue'),
    dataIndex: 'revenue',
    key: 'revenue',
    width: 70,
  },
];

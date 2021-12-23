import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TableComponent from 'components/Table';
import Search from './Search';

import { FORMAT_DATE_FULL, NFT_TYPE } from 'common/constant';
import { formatDate } from 'utils/time';
import TextComponent from 'components/Text';
import { convertAddress } from 'utils';
import { find } from 'lodash';
import { formatCurrency } from 'utils/number';
import DetailModal from './DetailModal';

type SecondarySaleProps = {
  onChangePagination?: any;
  onReset?: any;
  onDebounceParams?: any;
  onChangeTable?: any;
  loading?: boolean;
  secondary?: any;
  onChange?: any;
};

const SecondarySale = ({
  onReset,
  onDebounceParams,
  onChangePagination,
  onChangeTable,
  loading,
  secondary = {},
  onChange,
}: SecondarySaleProps) => {
  const { t } = useTranslation();

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    transaction: {},
  });

  const { list, total, totalRevenue, params } = secondary;

  const { page, perPage } = params;

  const columns: Array<any> = [
    {
      title: t('revenue.txt_no'),
      dataIndex: '',
      key: '',
      render: (_1: any, _2: any, index: number) => index + 1,
      width: 75,
    },
    {
      title: t('revenue.txt_date_time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (value: any) => formatDate(value, FORMAT_DATE_FULL),
      width: 150,
    },
    {
      title: t('revenue.txt_nft_name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (value: any, row: any) => (
        <div className='nft-name d-flex'>
          <div>
            <img
              src={row?.nft?.avatarUrl}
              alt={'nft-name'}
              className='table-thumbnail'
            />
          </div>
          <span
            className='collection-name text-ellipsis-table'
            title={row?.nft?.name}
          >
            {row?.nft?.name}
          </span>
        </div>
      ),
      width: 200,
    },
    {
      title: t('revenue.txt_unit_type'),
      dataIndex: 'nft.type',
      key: 'nft.type',
      render: (_: any, row: any) =>
        find(NFT_TYPE, (data) => data.value === row?.nft?.type)?.name,
      width: 100,
    },
    {
      title: t('revenue.txt_unit_price'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      sorter: true,
      render: (value: any) => (
        <div>{formatCurrency(value?.toString())} BNB</div>
      ),
      width: 150,
    },
    {
      title: t('revenue.txt_sold_quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: any) => <div>{formatCurrency(value?.toString())}</div>,
      width: 150,
    },
    {
      title: t('revenue.txt_seller'),
      dataIndex: 'sellerAddress',
      key: 'sellerAddress',
      render: (value: string) => {
        return (
          <TextComponent
            copyable={{ text: value }}
            className='d-flex gap-15-px justify-content-between'
          >
            {convertAddress(value, -4)}
          </TextComponent>
        );
      },
      width: 150,
    },
    {
      title: t('revenue.txt_buyer'),
      dataIndex: 'buyerAddress',
      key: 'buyerAddress',
      render: (value: string) => {
        return (
          <TextComponent
            copyable={{ text: value }}
            className='d-flex gap-15-px justify-content-between'
          >
            {convertAddress(value, -4)}
          </TextComponent>
        );
      },
      width: 150,
    },
    {
      title: t('revenue.txt_revenue'),
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: true,
      render: (value: any) => (
        <div>{formatCurrency(value?.toString(), 5)} BNB</div>
      ),
      width: 150,
    },
    {
      title: t('revenue.txt_actions'),
      dataIndex: 'no',
      key: 'no',
      render: (value: any, row: any) => (
        <div className='view-detail' onClick={handleSelectedTransaction(row)}>
          {t('common.txt_view_detail')}
        </div>
      ),
      width: 150,
    },
  ];

  const handleSelectedTransaction = (row: any) => () =>
    setModalInfo({
      visible: true,
      transaction: row,
    });

  const handleCloseModal = () =>
    setModalInfo({
      visible: false,
      transaction: {},
    });

  return (
    <div className='filter'>
      <Search
        onReset={onReset}
        onDebounceParams={onDebounceParams}
        onChange={onChange}
        params={secondary?.params}
      />
      <div className='info'>
        <p className='item'>
          <strong>{t('revenue.txt_secondary_sale_revenue')}: </strong>
          <span>{formatCurrency(totalRevenue?.toString())}</span>
        </p>
        <p className='item'>
          <strong>{t('revenue.txt_total_count')}: </strong>
          <span>{formatCurrency(total?.toString())}</span>
        </p>
      </div>
      <TableComponent
        dataSource={list}
        columns={columns}
        onChangePagination={onChangePagination}
        pageSize={perPage}
        current={page}
        total={total}
        loading={loading}
        showSizeChanger={true}
        onChangeTable={onChangeTable}
      />
      <DetailModal
        visible={modalInfo?.visible}
        onClose={handleCloseModal}
        transaction={modalInfo?.transaction}
      />
    </div>
  );
};

export default SecondarySale;

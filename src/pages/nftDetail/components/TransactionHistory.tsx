import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { useLocation } from 'react-router';

import TableComponent from 'components/Table';
import { columns } from './TransactionColumns';

import { INITIAL_LIMIT, INITIAL_OFFSET, SORT_BY_DEFAULT } from 'common/constant';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { handleGetNftTransactionAction } from 'redux/nftDetail/slice';

export default function TransactionHistory({ id }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { transactions, totalTransaction } = useAppSelector((state) => state.nftDetail);
  const [paramsSearch, setParamsSearch] = useState({
    perPage: INITIAL_LIMIT,
    page: INITIAL_OFFSET,
    sortBy: SORT_BY_DEFAULT,
  }) as any;

  useEffect(() => {
    dispatch(handleGetNftTransactionAction({ id, data: paramsSearch }));
  }, [paramsSearch]);

  const onChangePagination = (page: number, pageSize?: number) => {
    setParamsSearch({
      ...paramsSearch,
      page: pageSize !== paramsSearch.perPage ? INITIAL_OFFSET : page,
      perPage: pageSize,
    });
  };

  const onChangeTable = (pagination: any, filter: any, sorter: any, extra: any) => {
    const { order } = sorter;
    setParamsSearch({
      ...paramsSearch,
      sortBy: (order === 'ascend' && 1) || (order === 'descend' && -1) || ''
    })
  };

  return (
    <div className="transaction-history">
      <TableComponent
        dataSource={transactions}
        columns={columns(t)}
        onChangePagination={onChangePagination}
        pageSize={paramsSearch.perPage}
        current={paramsSearch.page}
        total={totalTransaction}
        // loading={loading}
        showSizeChanger={true}
        onChangeTable={onChangeTable}
      />
    </div>
  );
}

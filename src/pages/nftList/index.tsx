import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import {
  BarChartOutlined,
  UserOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { trim } from 'lodash';

import SearchBox from './components/searchBox';
import TableComponent from 'components/Table';
import { columns } from './components/column';
import { UploadImage } from 'components/UploadImage';
import ButtonComponent from 'components/Button';
import FormItem from 'components/FormItem';

import {
  INITIAL_LIMIT,
  INITIAL_OFFSET,
  NFT_LIST_SORT_FIELD,
  NFT_SALE_STATUS,
  SORT_BY_DEFAULT,
  TYPE_INPUT,
} from 'common/constant';
import { privateRoutes } from 'Routes';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { handleGetListNft } from 'redux/nftList/slice';
import _ from 'lodash';

function NFTList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const { nftList, total, loading, dortTotal, itemTotal } = useAppSelector(
    (state) => state.nftList
  );

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search) as any;
    return _.omitBy(
      {
        ...params,
        keySearch: params?.keySearch || null,
        type: params?.type || null,
        saleStatus: params?.saleStatus || null,
        page: params?.page || INITIAL_OFFSET,
        perPage: params?.perPage || INITIAL_LIMIT,
        sortBy: params?.sortBy || SORT_BY_DEFAULT,
        sortField: params?.sortField || NFT_LIST_SORT_FIELD.CREATED_TIME,
      } as any,
      _.isNull
    );
  }, [location.search]);

  useEffect(() => {
    dispatch(handleGetListNft({ data: queryParams }));
  }, [queryParams]);

  const createNft = () => {
    history.push(privateRoutes[3].path);
  };

  const onSearch = (value: string) => {
    const newValue = trim(value);
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({
        ...queryParams,
        keySearch: newValue,
        page: INITIAL_OFFSET,
        perPage: INITIAL_LIMIT,
      }),
    });
  };

  const onChangeTable = (
    pagination: any,
    filter: any,
    sorter: any,
    extra: any
  ) => {
    const { order } = sorter;
    const sortBy =
      (order === 'ascend' && 1) || (order === 'descend' && -1) || '';
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({
        ...queryParams,
        page: INITIAL_OFFSET,
        sortBy: sortBy || -1,
        sortField: NFT_LIST_SORT_FIELD.CREATED_TIME,
      }),
    });
  };

  const onChangeSelect = ({ field, form, val }: any) => {
    form.setFieldValue(field.name, val);
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({
        ...queryParams,
        page: INITIAL_OFFSET,
        [field.name]: val,
      }),
    });
  };

  const onChangePagination = (page: number, pageSize?: number) => {
    const newParams = {
      page: pageSize !== parseInt(queryParams?.perPage) ? INITIAL_OFFSET : page,
      perPage: pageSize,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({ ...queryParams, ...newParams }),
    });
  };

  const onReset = () => {
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({}),
    });
  };

  return (
    <div className='nft-list-page'>
      <div className='title'>
        <span className='title__text'>{t('nft_list.txt_title')}</span>
      </div>
      <div className='filter'>
        <SearchBox
          onReset={onReset}
          queryParams={queryParams}
          onSearch={onSearch}
          onSelect={onChangeSelect}
        />
        <ButtonComponent
          onClick={createNft}
          customClassName='filter__create-nft'
          variant='light'
          text={t('nft_list.txt_create_nft')}
        />
      </div>
      <div className='parameters'>
        <div className='parameters__total-nft'>
          <BarChartOutlined className='parameters__total-nft--icon' />
          <div className='parameters__total-nft--text'>
            <div className='label'>{t('nft_list.txt_total_nft')}</div>
            <div className='total'>{total}</div>
          </div>
        </div>
        <div className='parameters__dort'>
          <UserOutlined className='parameters__dort--icon' />
          <div className='parameters__dort--text'>
            <div className='label'>{t('nft_list.txt_dort')}</div>
            <div className='total'>{dortTotal}</div>
          </div>
        </div>
        <div className='parameters__item'>
          <RocketOutlined className='parameters__item--icon' />
          <div className='parameters__item--text'>
            <div className='label'>{t('nft_list.txt_items')}</div>
            <div className='total'>{itemTotal}</div>
          </div>
        </div>
      </div>
      <TableComponent
        dataSource={nftList}
        columns={columns(t, history, location) as any}
        onChangePagination={onChangePagination}
        pageSize={parseInt(queryParams?.perPage) || INITIAL_LIMIT}
        current={parseInt(queryParams?.page) || INITIAL_OFFSET}
        total={total}
        loading={loading}
        showSizeChanger={true}
        onChangeTable={onChangeTable}
      />
    </div>
  );
}
export default NFTList;

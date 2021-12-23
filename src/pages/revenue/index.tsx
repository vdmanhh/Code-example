import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TabsComponnent from 'components/Tabs';
import PrimarySale from './components/PrimarySale';
import SecondarySale from './components/SecondarySale';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAppSelector } from 'hooks/store';
import selectedAddress from 'redux/address/selector';
import { getListTransaction } from 'services/revenue';
import { debounce } from 'lodash';
import { getEndDateTimestamp, getStartDateTimestamp } from 'utils/time';

export const REVENUE_TABS = {
  PRIMARY_SALE: {
    key: 'PRIMARY_SALE',
    label: 'revenue.txt_primary_sale',
    type: 1,
  },
  SECONDARY_SALE: {
    key: 'SECONDARY_SALE',
    label: 'revenue.txt_secondary_sale',
    type: 2,
  },
};

const initParams = {
  keyword: '',
  nftType: null,
  from: null,
  until: null,
  page: 1,
  perPage: 10,
  sortField: '',
  sortBy: 1,
};

const Revenue = () => {
  const { t } = useTranslation();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const [loading, setLoading] = useState({
    [REVENUE_TABS.PRIMARY_SALE.key]: false,
    [REVENUE_TABS.SECONDARY_SALE.key]: false,
  });

  const [primary, setPrimary] = useState({
    params: { ...initParams },
    list: [],
    total: 0,
    totalRevenue: 0,
    searched: false,
  }) as any;

  const [secondary, setSecondary] = useState({
    params: { ...initParams },
    list: [],
    total: 0,
    totalRevenue: 0,
    searched: false,
  }) as any;

  const handleGetListTransaction = async (params: any, activeTab: string) => {
    const tab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key
        ? REVENUE_TABS.PRIMARY_SALE.key
        : REVENUE_TABS.SECONDARY_SALE.key;
    try {
      setLoading({
        ...loading,
        [tab]: true,
      });
      const response = await getListTransaction(params);
      if (response?.meta?.code === 0) {
        const data = response?.data?.transactions?.[0];
        const totalRevenue =
          activeTab === REVENUE_TABS.PRIMARY_SALE.key
            ? response?.data?.totalRevenuePrimarySale
            : response?.data?.totalRevenueSecondarySale;
        const { data: list, metadata } = data;
        const fncTab =
          activeTab === REVENUE_TABS.PRIMARY_SALE.key
            ? setPrimary
            : setSecondary;
        const objTab =
          activeTab === REVENUE_TABS.PRIMARY_SALE.key ? primary : secondary;

        fncTab({
          ...objTab,
          list,
          total: metadata?.[0]?.total || 0,
          totalRevenue,
        });
      }
    } catch (error) {
      console.log('transaction', error);
    } finally {
      setLoading({
        ...loading,
        [tab]: false,
      });
    }
  };

  useEffect(() => {
    if (address) {
      const params = primary?.params;
      const convertParams = {
        ...params,
        from: getStartDateTimestamp(params?.from),
        until: getEndDateTimestamp(params?.until),
        nftType: params?.nftType,
        sellOrderType: REVENUE_TABS.PRIMARY_SALE.type,
      };
      setTimeout(
        () =>
          handleGetListTransaction(
            convertParams,
            REVENUE_TABS.PRIMARY_SALE.key
          ),
        0
      );
    }
  }, [address, primary?.params]);

  useEffect(() => {
    if (address) {
      const params = secondary?.params;
      const convertParams = {
        ...params,
        from: getStartDateTimestamp(params?.from),
        until: getEndDateTimestamp(params?.until),
        nftType: params?.nftType,
        sellOrderType: REVENUE_TABS.SECONDARY_SALE.type,
      };
      setTimeout(
        () =>
          handleGetListTransaction(
            convertParams,
            REVENUE_TABS.SECONDARY_SALE.key
          ),
        0
      );
    }
  }, [address, secondary?.params]);

  const [activeTab, setActiveTab] = useState(REVENUE_TABS.PRIMARY_SALE.key);

  const handleReset = () => {
    const fncTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? setPrimary : setSecondary;
    const objTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? primary : secondary;
    fncTab({
      ...objTab,
      searched: true,
      params: {
        ...objTab?.params,
        ...initParams,
      },
    });
  };

  const handleSetInfoParams = (name: string, value: any) => {
    const fncTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? setPrimary : setSecondary;
    const objTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? primary : secondary;
    fncTab({
      ...objTab,
      searched: true,
      params: {
        ...objTab?.params,
        [name]: value,
      },
    });
  };

  const handleChangeField = (name: string, value: any) =>
    handleSetInfoParams(name, value);

  const handleDebounceParams = useCallback(
    debounce((name: string, value: string | number) => {
      handleSetInfoParams(name, value);
    }, 1000),
    [activeTab, primary?.params, secondary?.params]
  );

  const handleChangePagination = (page: number, pageSize: number) => {
    const fncTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? setPrimary : setSecondary;
    const objTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? primary : secondary;
    fncTab({
      ...objTab,
      searched: true,
      params: {
        ...objTab?.params,
        perPage: pageSize,
        page: pageSize !== objTab?.params?.perPage ? 1 : page,
      },
    });
  };

  const handleChangeTable = (_1: any, _2: any, sorter: any) => {
    const fncTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? setPrimary : setSecondary;
    const objTab =
      activeTab === REVENUE_TABS.PRIMARY_SALE.key ? primary : secondary;
    fncTab({
      ...objTab,
      searched: true,
      params: {
        ...objTab?.params,
        sortField: sorter?.field ?? 'name',
        sortBy:
          (sorter?.order === 'ascend' && 1) ||
          (sorter?.order === 'descend' && -1) ||
          '',
        page: 1,
      },
    });
  };

  const {
    [REVENUE_TABS.PRIMARY_SALE.key]: primaryLoading,
    [REVENUE_TABS.SECONDARY_SALE.key]: secondaryLoading,
  } = loading;

  const listTab = [
    {
      key: REVENUE_TABS.PRIMARY_SALE.key,
      tab: t(REVENUE_TABS.PRIMARY_SALE.label),
      content: (
        <PrimarySale
          primary={primary}
          onReset={handleReset}
          onChangePagination={handleChangePagination}
          onChangeTable={handleChangeTable}
          onDebounceParams={handleDebounceParams}
          onChange={handleChangeField}
          loading={primaryLoading}
        />
      ),
      className: 'primary-sale',
    },
    {
      key: REVENUE_TABS.SECONDARY_SALE.key,
      tab: t(REVENUE_TABS.SECONDARY_SALE.label),
      content: (
        <SecondarySale
          secondary={secondary}
          onReset={handleReset}
          onChangePagination={handleChangePagination}
          onChangeTable={handleChangeTable}
          onDebounceParams={handleDebounceParams}
          onChange={handleChangeField}
          loading={secondaryLoading}
        />
      ),
      className: 'secondary-sale',
    },
  ];

  const handleChangeTab = (value: string) => setActiveTab(value);

  return (
    <div className='revenue-page'>
      <div className='title'>
        <span className='title__text'>{t('revenue.txt_revenue')}</span>
      </div>
      <div className='body'>
        <div className='body__tabs'>
          <TabsComponnent
            handleChangeTab={handleChangeTab}
            activeKey={activeTab}
            listTab={listTab}
          />
        </div>
      </div>
    </div>
  );
};
export default Revenue;

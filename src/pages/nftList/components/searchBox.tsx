import { Formik, Form } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UndoOutlined } from '@ant-design/icons';

import FormItem from 'components/FormItem';
import { NFT_SALE_STATUS, NFT_TYPE, TYPE_INPUT } from 'common/constant';

const SearchBox = ({ queryParams, onSearch, onSelect, onReset }: any) => {
  const { t } = useTranslation();
  const formikRef = useRef() as any;

  const initialValues = {
    name: '',
    type: null,
    saleStatus: null,
  };

  useEffect(() => {
    formikRef?.current.setValues({
      name: queryParams?.keySearch,
      type: parseInt(queryParams?.type) || null,
      saleStatus: queryParams?.saleStatus
        ? parseInt(queryParams?.saleStatus)
        : null,
    });
  }, [queryParams, formikRef]);

  return (
    <div className='search-box'>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={onSearch}
      >
        {({ values }: any) => (
          <Form className='search-form'>
            <div className='search-form__name'>
              <FormItem
                name='name'
                onSearch={onSearch}
                className='search-form__name--input'
                placeholder={t('nft_list.txt_search_placeholder')}
                typeInput={TYPE_INPUT.SEARCH}
              />
              <UndoOutlined
                onClick={onReset}
                className='search-form__name--undo'
              />
            </div>
            <div className='search-form__filter'>
              <div className='search-form__filter--label'>{`${t(
                'nft_list.txt_filter_by'
              )}:`}</div>
              <div className='search-form__filter--type'>
                <FormItem
                  placeholder={t('nft_list.txt_type')}
                  options={NFT_TYPE}
                  name='type'
                  className='type'
                  typeInput={TYPE_INPUT.SELECT}
                  onChange={onSelect}
                />
              </div>
              <div className='search-form__filter--status'>
                <FormItem
                  placeholder={t('nft_list.txt_status')}
                  options={NFT_SALE_STATUS}
                  name='saleStatus'
                  className='select-status'
                  typeInput={TYPE_INPUT.SELECT}
                  onChange={onSelect}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchBox;

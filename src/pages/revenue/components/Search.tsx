import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UndoOutlined } from '@ant-design/icons';

import FormItem from 'components/FormItem';
import { NFT_TYPE, TYPE_INPUT } from 'common/constant';
import moment from 'moment';

type SearchProps = {
  onDebounceParams?: any;
  onChange?: any;
  onReset?: any;
  params?: any;
};

const Search = ({
  onDebounceParams,
  onChange,
  onReset,
  params,
}: SearchProps) => {
  const { t } = useTranslation();

  const { keyword: currentKeyword, from, until, nftType } = params;

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setKeyword(currentKeyword);
  }, [currentKeyword]);

  const handleInputChange = (event: any) => {
    setKeyword(event?.target?.value);
    onDebounceParams('keyword', event?.target?.value);
  };

  const handleSelectChange = ({ val }: { val: number }) =>
    onChange('nftType', val);

  const disabledFromDate = (current: moment.Moment) => {
    return (
      (until &&
        current?.clone()?.endOf('day') > until?.clone()?.endOf('day')) ||
      current > moment()
    );
  };

  const disabledToDate = (current: moment.Moment) => {
    return (
      (from &&
        current?.clone()?.startOf('day') < from?.clone()?.startOf('day')) ||
      current > moment()
    );
  };

  const handleChangeDate =
    (name: string) =>
    ({ value }: { value: moment.Moment }) => {
      onChange(name, value);
    };

  return (
    <div className='search-box'>
      <Formik initialValues={{}} onSubmit={() => console.log('')}>
        {({}: any) => (
          <Form className='search-form'>
            <div className='search-form__name'>
              <FormItem
                name='keyword'
                onChange={handleInputChange}
                className='search-form__name--input'
                placeholder={t('revenue.txt_search_placeholder')}
                value={keyword}
              />
              <UndoOutlined
                onClick={onReset}
                className='search-form__name--undo'
              />
            </div>
            <div className='search-form__filter'>
              <div className='search-form__filter--date'>
                <label>{t('revenue.txt_from')}:</label>
                <FormItem
                  placeholder={t('revenue.txt_select_date')}
                  name='from'
                  disabledDate={disabledFromDate}
                  typeInput={TYPE_INPUT.DATE}
                  value={from ? moment(from) : null}
                  onChange={handleChangeDate('from')}
                />
              </div>
              <div className='search-form__filter--date'>
                <label>{t('revenue.txt_to')}:</label>
                <FormItem
                  placeholder={t('revenue.txt_select_date')}
                  name='until'
                  disabledDate={disabledToDate}
                  typeInput={TYPE_INPUT.DATE}
                  value={until ? moment(until) : null}
                  onChange={handleChangeDate('until')}
                />
              </div>
              <div className='search-form__filter--type'>
                <FormItem
                  placeholder={t('revenue.txt_unit_type')}
                  options={NFT_TYPE}
                  name='nftType'
                  className='type'
                  typeInput={TYPE_INPUT.SELECT}
                  onChange={handleSelectChange}
                  value={nftType}
                  allowClear
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Search;

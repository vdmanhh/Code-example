import React, { useEffect, useRef, useState } from 'react';
import { Image, message, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';
import { ROUTE_URL } from 'Routes';
import { AddressZero } from '@ethersproject/constants';

import IconArrowLeft from 'resources/svg/IconArrowLeft';

import FormItem from 'components/FormItem';
import {
  DEFAULT_OWNER,
  NFT_INTERFACE,
  NFT_SALE_STATUS,
  TOKEN_SUPPORT,
  TYPE_INPUT,
} from 'common/constant';
import ButtonComponent from 'components/Button';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import selectedInit from 'redux/init/selector';
import {
  handleGetNftDetailAction,
  handleSellNftAction,
} from 'redux/nftDetail/slice';
import { convertId, filterType } from 'utils';
import ModalUnsaveChange from 'components/Modal/ModalUnsaveChange';
import ModalSigningRequest from './components/ModalSigningRequest';
import { getCurrentTime } from 'utils/time';
import MetamaskService from 'services/accounts/MetamaskService';

const { Paragraph } = Typography;

export default function SellNft({}: any) {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [visibleUnsaveModal, setVisibleUnsaveModal] = useState(false);
  const [visibleModalSigningItem, setVisibleModalSigningItem] = useState(false);
  const [formChange, setFormChange] = useState(false);
  const { currencies } = useAppSelector(selectedInit.getInit);
  const { nftDetail } = useAppSelector((state) => state.nftDetail);
  const { t } = useTranslation();
  const { chainId, account, library, active } = useWeb3React();
  const { id } = useParams() as any;
  const formRef = useRef<any>();

  const initialValues = {
    quantity: null,
    price: null,
  };

  const validationSchema = Yup.object().shape({
    quantity: Yup.number()
      .nullable()
      .moreThan(0, t('message.E10'))
      .required(t('message.E8', { fieldName: t('nft.txt_quantity_field') }))
      .max(
        nftDetail?.totalCopies - nftDetail?.totalMinted,
        t('message.E16', {
          availableCopyValue: nftDetail?.totalCopies - nftDetail?.totalMinted,
        })
      ),
    price: Yup.number()
      .nullable()
      .moreThan(0, t('message.E10'))
      .required(t('message.E8', { fieldName: t('nft.txt_price_field') })),
  });

  useEffect(() => {
    dispatch(handleGetNftDetailAction({ data: { id } }));
  }, [id]);

  useEffect(() => {
    if (nftDetail?.interface === NFT_INTERFACE[0].value)
      formRef.current.setFieldValue('quantity', 1);
  }, [nftDetail]);

  const handleBackPage = () => history.goBack();

  const handleSetMaxQuantity = (setFieldValue: any) => () =>
    setFieldValue('quantity', nftDetail?.totalCopies - nftDetail?.totalMinted);

  const handleSetQuantityFieldValue =
    (field: any, setFieldValue: any) => (value: any) => {
      if (parseInt(value.target.value) !== 0)
        setFieldValue(field, parseInt(value.target.value));
      else setFieldValue(field, '');
    };

  const handleVisisbleUnsaveChangeModal = () => {
    if (formChange) setVisibleUnsaveModal((prev) => !prev);
    else history.goBack();
  };

  const handleBlurTrimZero = (field: any, value: any) => () =>
    formRef.current.setFieldValue(field, parseFloat(value));

  const handleSubmit = async (data: any) => {
    let signature = null;
    const idForSignature = nftDetail?.idVerify
      ? nftDetail?.idVerify
      : getCurrentTime().toString() +
        Math.floor(Math.random() * 1000).toString();
    let priceBigNumber = new BigNumber(data?.price)
      .multipliedBy(new BigNumber(10).exponentiatedBy(18))
      .toString();
    const wallet = new MetamaskService().getInstance();
    const tokenType = nftDetail?.interface === NFT_INTERFACE[0].value ? 0 : 1;
    const saleOrderSalt = getCurrentTime().toString();
    setVisibleModalSigningItem(true);
    signature = await wallet.signNftItem({
      library,
      creator: account,
      tokenType,
      // quantity: nftDetail?.totalCopies - nftDetail?.totalMinted,
      quantity: nftDetail?.totalCopies,
      saleOrderSupply: data?.quantity,
      price: priceBigNumber,
      saleOrderSalt,
      owner: AddressZero,
      id: idForSignature,
    });
    console.log('phuong96', {
      library,
      creator: account,
      tokenType,
      quantity: nftDetail?.totalCopies - nftDetail?.totalMinted,
      saleOrderSupply: data?.quantity,
      price: priceBigNumber,
      saleOrderSalt,
      owner: AddressZero,
      id: idForSignature,
    });
    setVisibleModalSigningItem(false);
    let params: any = {
      nftId: id,
      saleOrderSalt,
      currency: currencies[0]?._id,
      quantity: parseInt(data?.quantity),
      unitPrice: parseFloat(data?.price) || null,
      signature,
      idVerify: idForSignature,
    };
    params = _.omitBy(params, _.isNil);
    if (signature)
      dispatch(
        handleSellNftAction({
          data: params,
          callback: (id: string) => {
            message.success(t('message.S5'));
            history.push({
              pathname: ROUTE_URL.NFT_LIST,
              search: `saleStatus=${NFT_SALE_STATUS[1].value}`,
            });
          },
        })
      );
  };

  return (
    <div className='sell-nft-page'>
      <div className='title'>
        <IconArrowLeft onClick={handleVisisbleUnsaveChangeModal} />
        <span className='title__text'>{t('nft_detail.txt_sell_nft')}</span>
      </div>
      <div className='body'>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldError, setFieldValue, errors, dirty }: any) => (
            <Form className='form'>
              {setFormChange(dirty)}
              <div className='body-box'>
                <div className='body__image'>
                  <Image src={nftDetail?.avatarUrl} />
                </div>
                <div className='body__content edit-form'>
                  <Paragraph
                    title={nftDetail?.name}
                    className='edit-form__name text-bold'
                    ellipsis={{ rows: 2 }}
                  >
                    {nftDetail?.name}
                  </Paragraph>
                  <div className='edit-form__id fs-18'>
                    {convertId(nftDetail?.nftCode?.toString())}
                  </div>
                  <div className='edit-form__type-rarity'>
                    <div className='edit-form__type-rarity--type'>
                      <span className='text-bold'>{`${t(
                        'common.txt_type'
                      )}`}</span>
                      {`: ${filterType(nftDetail?.type)}`}
                    </div>
                    <div className='edit-form__type-rarity--rarity'>
                      <span className='text-bold'>
                        {t('common.txt_trait_rarity')}
                      </span>
                      {`: ${nftDetail?.rarity?.name}`}
                    </div>
                  </div>
                  <div className='edit-form__sale-quantity'>
                    <div className='edit-form__sale-quantity--title text-bold fs-16 mt-20'>
                      {t('sell_nft.txt_on_sale_quantity')}
                    </div>
                    <div className='edit-form__sale-quantity--desc'>
                      {t('sell_nft.txt_on_sale_quantity_desc')}
                    </div>
                    <div className='edit-form__sale-quantity--input'>
                      <FormItem
                        containerClassName='quantity-input'
                        typeInput={TYPE_INPUT.NUMBER}
                        placeholder={t('nft.txt_enter_number_of_entities')}
                        decimalScale={0}
                        maxLength={8}
                        disabled={
                          nftDetail?.interface === NFT_INTERFACE[0].value
                        }
                        thousandSeparator
                        // onChange={handleSetQuantityFieldValue('quantity', setFieldValue)}
                        name='quantity'
                      />
                      <ButtonComponent
                        disabled={
                          nftDetail?.interface === NFT_INTERFACE[0].value
                        }
                        onClick={handleSetMaxQuantity(setFieldValue)}
                        customClassName='max-button'
                        variant='secondary'
                        text={t('common.txt_max')}
                      />
                    </div>
                  </div>
                  <div className='edit-form__sale-price'>
                    <div className='edit-form__sale-price--title fs-16 text-bold mt-20'>
                      {t('sell_nft.txt_instant_sale_price')}
                    </div>
                    <div className='edit-form__sale-price--description'>
                      {t('sell_nft.txt_instant_sale_price_desc')}
                    </div>
                    <div className='edit-form__sale-price--input'>
                      <FormItem
                        containerClassName='enter-price'
                        typeInput={TYPE_INPUT.NUMBER}
                        decimalScale={3}
                        maxLength={19}
                        thousandSeparator
                        placeholder={t('nft.txt_enter_price')}
                        name='price'
                        onBlur={handleBlurTrimZero('price', values.price)}
                      />
                      <div className='enter-price-usd text-bold'>
                        {`~ $ ${
                          Math.round(
                            currencies[0]?.exchangeRate * values.price * 1000
                          ) / 1000 || 0
                        }`}
                      </div>
                      <div className='option d-flex enter-price-icon'>
                        <div>
                          <img
                            src={TOKEN_SUPPORT[0]?.image}
                            alt={'token image'}
                            className='select-thumbnail'
                          />
                        </div>
                        <span
                          className='select-name text-bold'
                          title={'nft name'}
                        >
                          {currencies[0]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='group-button mt-20'>
                <ButtonComponent
                  customClassName='btn-discard'
                  text={t('common.txt_discard')}
                  variant='border-secondary'
                  onClick={handleVisisbleUnsaveChangeModal}
                />
                <ButtonComponent
                  type='submit'
                  customClassName='btn-create-item'
                  text={t('sell_nft.txt_put_on_sale')}
                  variant='secondary'
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ModalUnsaveChange
        visible={visibleUnsaveModal}
        confirmModal={handleBackPage}
        toggleModal={handleVisisbleUnsaveChangeModal}
      />
      <ModalSigningRequest
        visible={visibleModalSigningItem}
        nftImg={nftDetail?.avatarUrl}
      />
    </div>
  );
}

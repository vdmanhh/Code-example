import { Upload, Avatar, Slider as SliderAnt, Switch, message } from 'antd';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import BigNumber from 'bignumber.js';
import { useHistory, useLocation, useParams } from 'react-router';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import { AddressZero } from '@ethersproject/constants';
import {
  UploadOutlined,
  UnorderedListOutlined,
  StarOutlined,
  FileImageOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import _, { values } from 'lodash';
import { useWeb3React } from '@web3-react/core';

import IconArrowLeft from 'resources/svg/IconArrowLeft';

import { UploadImage } from 'components/UploadImage';
import ButtonComponent from 'components/Button';
import FormItem from 'components/FormItem';
import {
  BNB_ID,
  DEFAULT_OWNER,
  ERROR_FILE_URL,
  FILE_TYPE_IMAGE,
  NFT_GENDER,
  NFT_INTERFACE,
  NFT_SALE_STATUS,
  NFT_TYPE,
  TOKEN_SUPPORT,
  TYPE_INPUT,
} from 'common/constant';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import selectedInit from 'redux/init/selector';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ModalUnsaveChange from 'components/Modal/ModalUnsaveChange';
import { handleCreateNftAction } from 'redux/createNft/slice';
import MetamaskService from 'services/accounts/MetamaskService';
import { getCurrentTime } from 'utils/time';
import { ROUTE_URL } from 'Routes';
import ModalSigningRequest from './components/ModalSigningRequest';
import { handleEditNftAction, handleGetNftDetailAction, handleGetSellOrderDetailAction } from 'redux/nftDetail/slice';
import { checkStringFullSpace } from 'utils';

function NFTCreatePage() {
  const { t } = useTranslation();
  const [visibleUnsaveModal, setVisibleUnsaveModal] = useState(false);
  const [numberOfCopies, setNumberOfCopies] = useState(null);
  const [errorFileUrl, setErrorFileUrl] = useState<any>();
  const [formChange, setFormChange] = useState(false);
  const { chainId, account, library, active } = useWeb3React();
  const formRef = useRef<any>();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams() as any;

  const dispatch = useAppDispatch();
  const { clans, rarities, currencies } = useAppSelector(selectedInit.getInit);
  const { address } = useAppSelector((state) => state.address);
  const { nftDetail } = useAppSelector((state) => state.nftDetail);
  const { loadingButton } = useAppSelector((state) => state.createNft);

  const [filePreview, setFilePreview] = useState('');
  const [visibleModalSigningItem, setVisibleModalSigningItem] = useState(false);
  const [initialValue, setInitialValue] = useState({
    fileUrl: '',
    name: '',
    type: null,
    interface: null,
    royalties: null,
    numberOfCopies: null,
    description: '',
    traitRarity: null,
    genders: null,
    clans: null,
    levels: 1,
    strength: 1,
    speed: 1,
    luck: 1,
    putOnSale: false,
    signature1: '',
    signature2: '',
    currency: currencies[0]?._id || BNB_ID,
    quantity: null,
    price: null,
  });

  const validationSchema = Yup.object().shape({
    fileUrl: Yup.mixed()
      .test('limit size', t('message.E2', { size: 100 }), () => errorFileUrl !== ERROR_FILE_URL.LIMIT_SIZE)
      .test('invalid format', t('message.E15'), () => errorFileUrl !== ERROR_FILE_URL.INVALID_FORMAT)
      .required(t('message.E8', { fieldName: t('nft.txt_nft_content_field') })),
    name: Yup.string()
      .test(
        'string full space',
        t('message.E8', { fieldName: t('nft.txt_name_field') }),
        (value: any) => !checkStringFullSpace(value)
      )
      .required(t('message.E8', { fieldName: t('nft.txt_name_field') })),
    type: Yup.number()
      .nullable(true)
      .required(t('message.E8', { fieldName: t('nft.txt_type_field') })),
    interface: Yup.number()
      .nullable(true)
      .required(t('message.E8', { fieldName: t('nft.txt_interface_field') })),
    royalties: Yup.number()
      .nullable(true)
      .moreThan(0, t('message.E10'))
      .max(30, t('message.E6'))
      .required(t('message.E8', { fieldName: t('nft.txt_royalty_field') })),
    numberOfCopies: Yup.number()
      .nullable(true)
      .max(1000000, t('message.E7'))
      .min(1, t('message.E10'))
      .required(t('message.E8', { fieldName: t('nft.txt_number_of_copies_field') })),
    traitRarity: Yup.string()
      .nullable(true)
      .required(t('message.E8', { fieldName: t('nft.txt_trait_rarity_field') })),
    genders: Yup.number()
      .nullable(true)
      .when('type', {
        is: NFT_TYPE[0].value,
        then: Yup.number().required(t('message.E8', { fieldName: t('nft.txt_gender_field') })),
      })
      .when('type', {
        is: null,
        then: Yup.number().required(t('message.E8', { fieldName: t('nft.txt_gender_field') })),
      }),
    clans: Yup.string()
      .nullable(true)
      .required(t('message.E8', { fieldName: t('nft.txt_clan_field') })),
    quantity: Yup.number()
      .nullable(true)
      .when('putOnSale', {
        is: true,
        then: Yup.number()
          .moreThan(0, t('message.E10'))
          .required(t('message.E8', { fieldName: t('nft.txt_quantity_field') }))
          .test({
            name: 'max',
            message: t('message.E16', { availableCopyValue: numberOfCopies }),
            test: function (value: any) {
              if (this.parent.numberOfCopies) return value <= parseInt(this.parent.numberOfCopies);
              return true;
            },
          }),
      }),
    price: Yup.number()
      .nullable(true)
      .when('putOnSale', {
        is: true,
        then: Yup.number()
          .moreThan(0, t('message.E10'))
          .required(t('message.E8', { fieldName: t('nft.txt_price_field') })),
      }),
  });

  useEffect(() => {
    if (location.pathname !== ROUTE_URL.CREATE_NFT) {
      dispatch(handleGetNftDetailAction({ data: { id } }));
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== ROUTE_URL.CREATE_NFT) {
      setFilePreview(nftDetail?.avatarUrl);
      formRef.current.setValues({
        fileUrl: nftDetail?.avatarUrl,
        name: nftDetail?.name,
        type: nftDetail?.type,
        interface: nftDetail?.interface,
        royalties: nftDetail?.royaltyFee,
        numberOfCopies: nftDetail?.totalCopies,
        description: nftDetail?.description,
        traitRarity: nftDetail?.rarity?._id,
        genders: nftDetail?.gender,
        clans: nftDetail?.clan?._id,
        levels: nftDetail?.level,
        strength: nftDetail?.strength,
        speed: nftDetail?.speed,
        luck: nftDetail?.luck,
        putOnSale: false,
        signature1: '',
        signature2: '',
        currency: currencies[0]?._id || BNB_ID,
        quantity: nftDetail?.interface === NFT_INTERFACE[0].value ? 1 : null,
        price: null,
      });
    }
  }, [nftDetail]);

  const clansItem = (item: any) => (
    <div className="clan-item">
      <div className="clan-item__image">
        <Avatar size="large" src={item?.imgUrl} />
      </div>

      <div className="clan-item__name">{item?.name}</div>
    </div>
  );

  const renderOptionSelectToken = (item: any) => (
    <div className="option d-flex">
      <div>
        <img src={item.image} alt={'token image'} className="select-thumbnail" />
      </div>
      <span className="select-name" title={'nft name'}>
        {item.name}
      </span>
    </div>
  );

  const setLimitCommissionRate = (inputObj: any) => {
    const { value } = inputObj;
    if (value <= 100) return true;
    return false;
  };

  const renderOptionSelectWithImage = (item: any) => (
    <div className="option d-flex">
      <div>
        <img src={item.imgUrl} alt={'token image'} className="select-thumbnail" />
      </div>
      <span className="select-name" title={'nft name'}>
        {item.name}
      </span>
    </div>
  );

  const raritiesSelect = rarities.map((value: any) => ({
    ...value,
    value: value?._id,
  }));

  const clansSelect = clans.map((value: any) => ({
    ...value,
    value: value?._id,
  }));

  const handleBeforeUpload = (fileType: Array<any>, setFieldError: any) => (file: any) => {
    const isFileFormat = fileType.includes(file?.type?.toLowerCase());
    const isLt100M = file.size / 1024 / 1024 <= 100;

    if (!isLt100M) {
      setErrorFileUrl(ERROR_FILE_URL.LIMIT_SIZE);
      setFieldError('fileUrl', t('message.E2', { size: 100 }));
      return false;
    } else if (!isFileFormat) {
      setErrorFileUrl(ERROR_FILE_URL.INVALID_FORMAT);
      setFieldError('fileUrl', t('message.E15'));
      return false;
    } else setErrorFileUrl(null);

    return true;
  };

  const handleChangeFile =
    (setFieldValue: any) =>
    async ({ file }: any) => {
      URL.revokeObjectURL(filePreview);
      if (file.status === 'done') {
        setFieldValue('fileUrl', file.originFileObj);
        const imageUrl = await URL.createObjectURL(new Blob([file.originFileObj], { type: file.type || 'image/png' }));
        setFilePreview(imageUrl);
      }
    };

  const handleCustomRequest = ({ onSuccess }: any) => onSuccess('ok');

  const cancelImage = (setFieldValue: any) => (e: any) => {
    e.stopPropagation();
    setFieldValue('fileUrl', '');
    URL.revokeObjectURL(filePreview);
    setFilePreview('');
  };

  const changeStatsValue = (setFieldValue: any, type: any) => (value: any) => {
    if (!('levels' === type && value === 0)) setFieldValue(type, value);
  };

  const onChangePutOnSale = (setFieldValue: any) => (value: any) => {
    setFieldValue('putOnSale', value);
  };

  const onChangeSelectType = (setFieldValue: any) => (value: any) => {
    setFieldValue('type', value?.val);
    if (value?.val === NFT_TYPE[0].value) {
      setFieldValue('interface', NFT_INTERFACE[0].value);
      setFieldValue('numberOfCopies', 1);
      setFieldValue('quantity', 1);
    }
  };

  const onChangeInterface = (setFieldValue: any) => (value: any) => {
    setFieldValue('interface', value?.val);
    if (value?.val === NFT_INTERFACE[0].value) {
      setFieldValue('numberOfCopies', 1);
      setFieldValue('quantity', 1);
    } else {
      setFieldValue('numberOfCopies', '');
      setFieldValue('quantity', '');
    }
  };

  const handleVisisbleUnsaveChangeModal = () => {
    if (formChange) setVisibleUnsaveModal((prev) => !prev);
    else history.goBack();
  };

  const hadnleVisibleModalSigning = () => setVisibleModalSigningItem((prev) => !prev);

  const handleValidateOutFocus = (fieldName: string) => () => {
    formRef?.current?.setFieldTouched(fieldName);
    formRef?.current?.setFieldError(fieldName, t('message.E8', { fieldName: t('nft.txt_nft_content_field') }));
  };

  const handleFocusBack = (callback: any) => () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocusBack);
      callback();
    }
  };

  const clickedFileInput = (callback: any) => () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocusBack(callback));
    }
  };

  const handleBackPage = () => history.goBack();

  const handleSubmit = async (data: any) => {
    let signature = null;
    const idForSignature =
      location.pathname !== ROUTE_URL.CREATE_NFT && nftDetail?.idVerify
        ? nftDetail?.idVerify
        : getCurrentTime().toString() + Math.floor(Math.random() * 1000).toString();
    let priceBigNumber = null;
    const saleOrderSalt = data?.putOnSale ? getCurrentTime().toString() : null;
    if (data?.putOnSale) {
      priceBigNumber = new BigNumber(data?.price).multipliedBy(new BigNumber(10).exponentiatedBy(18)).toString();
      const wallet = new MetamaskService().getInstance();
      const tokenType = data?.interface === NFT_INTERFACE[0].value ? 0 : 1;
      setVisibleModalSigningItem(true);
      signature = await wallet.signNftItem({
        library,
        creator: account,
        tokenType,
        quantity: data?.numberOfCopies,
        saleOrderSupply: data?.quantity,
        price: priceBigNumber,
        saleOrderSalt,
        owner: AddressZero,
        id: idForSignature,
      });
    }
    if (signature === undefined) {
      setVisibleModalSigningItem(false);
    } else {
      let params: any = {
        saleOrderSalt: saleOrderSalt,
        avatarUrl: data?.fileUrl,
        name: data?.name?.trim(),
        description: data?.description?.trim(),
        totalCopies: data?.numberOfCopies,
        royaltyFee: data?.royalties,
        level: data?.levels,
        strength: data?.strength,
        speed: data?.speed,
        luck: data?.luck,
        type: data?.type,
        interface: data?.interface,
        gender: data?.type === NFT_TYPE[0].value ? data?.genders : null,
        traitRarity: data?.traitRarity,
        clan: data?.clans,
        isPutOnSale: data?.putOnSale,
        contractAddress: location.pathname === ROUTE_URL.CREATE_NFT ? address : null,
        ownerAddress: location.pathname === ROUTE_URL.CREATE_NFT ? address : null,
        onSaleQuantity: parseInt(data?.quantity) || null,
        unitPrice: parseFloat(data?.price) || null,
        currency: data?.putOnSale ? currencies[0]?._id : null,
        signature: signature,
        idVerify: data?.putOnSale ? idForSignature : null,
      };
      params = _.omitBy(params, _.isNil);
      if (location.pathname === ROUTE_URL.CREATE_NFT)
        dispatch(
          handleCreateNftAction({
            data: params,
            callback: (id: string) => {
              if (data?.putOnSale) message.success(t('message.S5'));
              else message.success(t('message.S2'));
              setVisibleModalSigningItem(false);
              history.push({
                pathname: ROUTE_URL.NFT_LIST,
              });
            },
          })
        );
      else
        dispatch(
          handleEditNftAction({
            data: params,
            id,
            callback: (id: string) => {
              message.success(t('message.S3'));
              setVisibleModalSigningItem(false);
              history.push({
                pathname: ROUTE_URL.NFT_LIST,
              });
            },
          })
        );
    }
  };

  const handleBlurTrim = (field: any, value: any, setFieldValue: any) => () => {
    setFieldValue(field, value.trim());
  };

  const showEdittionPreview = (values: any) => {
    if ((!values.putOnSale || !values?.quantity) && !!values?.numberOfCopies)
      return (
        <div className="preview-image__edition-of">
          {t('nft.txt_edition', {
            amount: values.numberOfCopies || 0,
          })}
        </div>
      );
    else if (values.putOnSale && !!values?.quantity && !!values?.numberOfCopies) {
      return (
        <div className="preview-image__edition-of">
          {t('nft.txt_edition_of', {
            quantity: values.quantity || 0,
            numberOfCopies: values.numberOfCopies || 0,
          })}
        </div>
      );
    }
  };

  const handleBlurTrimZero = (field: any, value: any) => () => formRef.current.setFieldValue(field, parseFloat(value));

  return (
    <div className="nft-page">
      <div className="title">
        <IconArrowLeft onClick={handleVisisbleUnsaveChangeModal} />
        <span className="title__text">
          {location.pathname !== ROUTE_URL.CREATE_NFT ? t('nft.txt_edit_nft') : t('nft.txt_create_nft')}
        </span>
      </div>
      <div className="body">
        <Formik
          innerRef={formRef}
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldError, setFieldValue, errors, dirty }: any) => (
            setFormChange(dirty),
            setNumberOfCopies(values.numberOfCopies),
            (
              <div className="form-box">
                <Form className="create-form">
                  <div className="upload">
                    <div className="upload__title">{t('nft.txt_nft_content')}</div>
                    <div className="upload__description">{t('nft.txt_warning_upload')}</div>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      className="upload__form"
                      beforeUpload={handleBeforeUpload(FILE_TYPE_IMAGE, setFieldError)}
                      onChange={handleChangeFile(setFieldValue)}
                      customRequest={handleCustomRequest}
                    >
                      {!filePreview ? (
                        <div onClick={clickedFileInput(handleValidateOutFocus('fileUrl'))}>
                          <UploadOutlined size={100} className="upload__form--icon" />
                          <div className="upload__form--drag-drop">{t('nft.txt_drag_drop')}</div>
                          <div className="upload__form--upload-device">{t('nft.txt_upload_from_device')}</div>
                        </div>
                      ) : (
                        <Fragment>
                          <CloseOutlined className="upload__form--close" onClick={cancelImage(setFieldValue)} />
                          <img className="upload__form--image" src={filePreview} />
                        </Fragment>
                      )}
                    </Upload>
                    <ErrorMessage name="fileUrl" component="div" className="error-text" />
                  </div>
                  <div className="name mt-20">
                    <FormItem
                      label={t('nft.txt_name')}
                      name="name"
                      className="name__input"
                      placeholder="Enter item name"
                      maxLength={256}
                      typeInput={TYPE_INPUT.TEXT}
                      // onPressEnter={handleOnPressEnterName}
                    />
                  </div>
                  <div className="type mt-20">
                    <FormItem
                      label={t('nft.txt_type')}
                      options={NFT_TYPE}
                      name="type"
                      className="type__input"
                      placeholder="Select Type"
                      typeInput={TYPE_INPUT.SELECT}
                      onChange={onChangeSelectType(setFieldValue)}
                    />
                  </div>
                  <div className="interface mt-20">
                    <FormItem
                      label={t('nft.txt_interface')}
                      options={NFT_INTERFACE}
                      name="interface"
                      className="interface__input"
                      placeholder="Select"
                      disabled={values.type === NFT_TYPE[0].value}
                      onChange={onChangeInterface(setFieldValue)}
                      typeInput={TYPE_INPUT.SELECT}
                    />
                  </div>
                  <div className="royalties-number-of-copies mt-20">
                    <div className="royalty">
                      <FormItem
                        label={t('nft.txt_royalty')}
                        className="royalty__input"
                        isAllowed={setLimitCommissionRate}
                        placeholder={t('nft.txt_enter_royalty')}
                        typeInput={TYPE_INPUT.NUMBER}
                        name="royalties"
                        decimalScale={2}
                        thousandSeparator
                        maxLength={5}
                      />
                      <div className="royalty__suffix">%</div>
                    </div>
                    <div className="number-of-copies">
                      <FormItem
                        label={t('nft.txt_number_of_copies')}
                        className="number-of-copies__input"
                        decimalScale={0}
                        maxLength={8}
                        disabled={values.interface === NFT_INTERFACE[0].value}
                        placeholder={t('nft.txt_enter_number_of_entities')}
                        typeInput={TYPE_INPUT.NUMBER}
                        thousandSeparator
                        name="numberOfCopies"
                      />
                    </div>
                  </div>
                  <div className="description mt-20">
                    <div className="description__title">{t('nft.txt_description')}</div>
                    <div className="description__desc">{t('nft.txt_description_desc')}</div>
                    <FormItem
                      onBlur={handleBlurTrim('description', values.description, setFieldValue)}
                      maxLength={3000}
                      typeInput={TYPE_INPUT.TEXTAREA}
                      name="description"
                      placeholder={t('nft.txt_provide_detail')}
                    />
                  </div>
                  <div className="trait-rarity mt-20">
                    <FormItem
                      placeholder={t('common.txt_select')}
                      label={t('nft.txt_trait_rarity')}
                      typeInput={TYPE_INPUT.SELECT}
                      name="traitRarity"
                      options={raritiesSelect}
                    />
                  </div>
                  {values.type !== NFT_TYPE[1].value && (
                    <div className="genders mt-20">
                      <FormItem
                        className="genders__input"
                        typeInput={TYPE_INPUT.SELECT}
                        label={t('nft.txt_gender')}
                        placeholder={t('common.txt_select')}
                        name="genders"
                        options={NFT_GENDER}
                      />
                    </div>
                  )}
                  <div className="clans mt-20">
                    <FormItem
                      className="clans__input"
                      typeInput={TYPE_INPUT.SELECT}
                      label={t('nft.txt_clan')}
                      placeholder={t('common.txt_select')}
                      name="clans"
                      renderOption={renderOptionSelectWithImage}
                      options={clansSelect}
                    />
                  </div>
                  <div className="level mt-20">
                    <div className="level__box-title">
                      <div className="level__box-title--icon">
                        <StarOutlined className="icon" />
                      </div>
                      <div className="level__box-title--text">
                        <div className="title">{t('nft.txt_levels')}</div>
                        <p className="description">{t('nft.txt_levels_description')}</p>
                      </div>
                    </div>
                    <div className="level__body">
                      <SliderAnt onChange={changeStatsValue(setFieldValue, 'levels')} value={values?.levels} max={10} />
                    </div>
                  </div>
                  <div className="strength mt-20">
                    <div className="strength__box-title">
                      <div className="strength__box-title--icon">
                        <BarChartOutlined className="icon" />
                      </div>
                      <div className="strength__box-title--text">
                        <div className="title">{t('nft.txt_strength')}</div>
                        <p className="description">{t('nft.txt_strength_description')}</p>
                      </div>
                    </div>
                    <div className="strength__body">
                      <SliderAnt
                        value={values?.strength}
                        onChange={changeStatsValue(setFieldValue, 'strength')}
                        max={10}
                      />
                    </div>
                  </div>
                  <div className="speed mt-20">
                    <div className="speed__box-title">
                      <div className="speed__box-title--icon">
                        <ThunderboltOutlined className="icon" />
                      </div>
                      <div className="speed__box-title--text">
                        <div className="title">{t('nft.txt_speed')}</div>
                        <p className="description">{t('nft.txt_speed_description')}</p>
                      </div>
                    </div>
                    <div className="speed__body">
                      <SliderAnt value={values?.speed} onChange={changeStatsValue(setFieldValue, 'speed')} max={10} />
                    </div>
                  </div>
                  <div className="luck mt-20">
                    <div className="luck__box-title">
                      <div className="luck__box-title--icon">
                        <SafetyOutlined className="icon" />
                      </div>
                      <div className="luck__box-title--text">
                        <div className="title">{t('nft.txt_luck')}</div>
                        <p className="description">{t('nft.txt_luck_description')}</p>
                      </div>
                    </div>
                    <div className="luck__body">
                      <SliderAnt value={values.luck} max={10} onChange={changeStatsValue(setFieldValue, 'luck')} />
                    </div>
                  </div>
                  <div className="put-on-sale mt-20">
                    <div className="put-on-sale__header">
                      <div className="put-on-sale__header--text">{t('common.txt_put_on_sale')}</div>
                      <Switch onChange={onChangePutOnSale(setFieldValue)} />
                    </div>
                    {values.putOnSale && (
                      <div className="put-on-sale__body">
                        <div className="put-on-sale__body--description">{t('nft.txt_put_on_sale_desc')}</div>
                        <div className="put-on-sale__body--input-box">
                          <FormItem
                            containerClassName="enter-entities"
                            typeInput={TYPE_INPUT.NUMBER}
                            placeholder={t('nft.txt_enter_number_of_entities')}
                            decimalScale={0}
                            maxLength={8}
                            thousandSeparator
                            disabled={values.interface === NFT_INTERFACE[0].value}
                            name="quantity"
                          />
                          <div className="enter-price-box">
                            <FormItem
                              containerClassName="enter-price"
                              typeInput={TYPE_INPUT.NUMBER}
                              decimalScale={3}
                              maxLength={19}
                              thousandSeparator
                              placeholder={t('nft.txt_enter_price')}
                              name="price"
                              onBlur={handleBlurTrimZero('price', values.price)}
                            />
                            <div className="enter-price-box__usd">
                              {`~ $ ${Math.round(currencies[0]?.exchangeRate * values.price * 1000) / 1000 || 0}`}
                            </div>
                            <div className="option d-flex enter-price-box__icon">
                              <div>
                                <img src={TOKEN_SUPPORT[0].image} alt={'token image'} className="select-thumbnail" />
                              </div>
                              <span className="select-name" title={'nft name'}>
                                {currencies[0]?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="btn-group mt-20">
                    <ButtonComponent
                      customClassName="btn-discard"
                      text={t('common.txt_discard')}
                      variant="border-secondary"
                      onClick={handleVisisbleUnsaveChangeModal}
                    />
                    <ButtonComponent
                      disabled={loadingButton}
                      loading={loadingButton}
                      type="submit"
                      customClassName="btn-create-item"
                      text={
                        location.pathname !== ROUTE_URL.CREATE_NFT ? t('common.txt_save') : t('common.txt_create_item')
                      }
                      variant="secondary"
                    />
                  </div>
                </Form>
                <div className="preview-image">
                  <div className="preview-image__text">{t('nft.txt_preview')}</div>
                  <div className="preview-image__content">
                    {!filePreview ? (
                      <Fragment>
                        <FileImageOutlined />
                        <div className="preview-image__content--text">{t('nft.txt_preview_title')}</div>
                      </Fragment>
                    ) : (
                      <img className="preview-image__content--image" src={filePreview} />
                    )}
                  </div>
                  {values?.name && <div className="preview-image__text-gruder">{values?.name}</div>}
                  {showEdittionPreview(values)}
                </div>
              </div>
            )
          )}
        </Formik>
      </div>
      <ModalUnsaveChange
        visible={visibleUnsaveModal}
        confirmModal={handleBackPage}
        toggleModal={handleVisisbleUnsaveChangeModal}
      />
      <ModalSigningRequest visible={visibleModalSigningItem} nftImg={filePreview} />
    </div>
  );
}
export default NFTCreatePage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, message, Tooltip, Typography } from 'antd';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { useHistory, useParams } from 'react-router';
import { AddressZero } from '@ethersproject/constants';
import { useSocket } from 'hooks';

import IconWhiteArrowDown from 'resources/svg/IconWhiteArrowDown ';
import IconDetail from 'resources/svg/IconDetail.svg';

import ButtonComponent from 'components/Button';
import ModalSuccess from 'components/Modal/ModalSuccess';
import ModalFail from 'components/Modal/ModalFail';

import { formatDate, getCurrentTime } from 'utils/time';
import TextComponent from 'components/Text';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import {
  DEFAULT_VALUE,
  FORMAT_DATE_FULL,
  NFT_INTERFACE,
  NFT_SALE_STATUS,
  NFT_TYPE,
  PE_MARKET_USER,
  SOCKET_EVENT,
} from 'common/constant';
import {
  convertAddress,
  convertId,
  filterInterface,
  filterSaleStatus,
  filterType,
} from 'utils';
import ModalDeleteNft from './ModalDeleteNft';
import {
  handleDeleteNftAction,
  handleGetNftDetailAction,
} from 'redux/nftDetail/slice';
import { ROUTE_URL } from 'Routes';
import ModalRemoveNft from './ModalRemoveNft';
import MetamaskService from 'services/accounts/MetamaskService';
import * as SellOrderService from 'services/sellOrder';
import { useWeb3React } from '@web3-react/core';
import ModalProcessCancel from './ModalProcessCancel';

const { Paragraph } = Typography;

export default function NFTProfile({ id }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { chainId, account, library, active } = useWeb3React();
  const history = useHistory();
  const [visibleMoreAction, setVisibleMoreAction] = useState(false);
  const [visibleModalDelete, setVisibleModalDelete] = useState(false);
  const [visibleRemoveNft, setVisibleModalRemoveNft] = useState(false);
  const [visibleProcessCancel, setVisibleProcessCancel] = useState(false);
  const [visibleRemoveSuccessModal, setVisibleRemoveSuccessModal] =
    useState(false);
  const [visibleRemoveUnsuccessModal, setVisibleRemoveUnsuccessModal] =
    useState(false);
  const { clans } = useAppSelector((state) => state.init);
  const { nftDetail, sellOrderDetail } = useAppSelector(
    (state) => state.nftDetail
  );

  // useSocket({
  //   event: SOCKET_EVENT.CANCEL_SELL_ORDER, handleEvent: (data: any) => {
  //     if (data?.status === true) {
  //       setVisibleProcessCancel(false)
  //       setVisibleRemoveSuccessModal(true)
  //       dispatch(handleGetNftDetailAction({ data: { id } }));
  //     } else {
  //       setVisibleProcessCancel(false)
  //       setVisibleRemoveUnsuccessModal(true)
  //     }
  //   }
  // });

  const handleVisibleMoreAction = () => setVisibleMoreAction((prev) => !prev);

  const handleVisibleModalDelete = () => setVisibleModalDelete((prev) => !prev);

  const handleVisibleModalRemoveNft = () =>
    setVisibleModalRemoveNft((prev) => !prev);

  const handleVisibleRemoveSuccessModal = () =>
    setVisibleRemoveSuccessModal((prev) => !prev);

  const handleVisibleRemoveUnsuccessModal = () =>
    setVisibleRemoveUnsuccessModal((prev) => !prev);

  const handleDeleteNft = () => {
    dispatch(
      handleDeleteNftAction({
        data: { id },
        callback: () => {
          message.success(t('message.S4'));
          history.push(ROUTE_URL.NFT_LIST);
        },
      })
    );
  };

  const handleEditNft = () => {
    history.push(`${ROUTE_URL.EDIT_NFT}/${id}`);
  };

  const handleSellNft = () => history.push(`${ROUTE_URL.SELL_NFT}/${id}`);

  const handleRemoveFromSale = async () => {
    const wallet = new MetamaskService().getInstance();
    let priceBigNumber = new BigNumber(
      sellOrderDetail?.sellOrderDetail?.unitPrice
    )
      .multipliedBy(new BigNumber(10).exponentiatedBy(18))
      .toString();
    setVisibleModalRemoveNft(false);
    setVisibleProcessCancel(true);
    const response = await wallet.removeFromSaleNft({
      account: account,
      library,
      tokenId: nftDetail?.idVerify,
      tokenType: nftDetail?.interface === NFT_INTERFACE[0].value ? 0 : 1,
      quantity: nftDetail?.totalCopies,
      saleOrderSupply: sellOrderDetail?.sellOrderDetail?.quantity,
      price: priceBigNumber || 0,
      saleOrderSalt:
        sellOrderDetail?.sellOrderDetail?.saleOrderSalt ||
        getCurrentTime().toString(),
      creator: sellOrderDetail?.sellOrderDetail?.sellerAddress,
      owner: AddressZero || '',
      uri: nftDetail?.uri || '',
      internalTxID: sellOrderDetail?.sellOrderDetail?._id,
      saleOrderSignature: sellOrderDetail?.sellOrderDetail?.signature,
      callback: {
        success: (id: any) => {
          SellOrderService.cancelSellOrder(id)
            .then(() => {
              setVisibleProcessCancel(false);
              setVisibleRemoveSuccessModal(true);
              dispatch(
                handleGetNftDetailAction({ data: { id: nftDetail?._id } })
              );
            })
            .catch(() => {
              setVisibleProcessCancel(false);
              setVisibleRemoveUnsuccessModal(true);
            });
        },
      },
    });
    if (!response) {
      setVisibleProcessCancel(false);
      setVisibleRemoveUnsuccessModal(true);
    }
  };

  return (
    <div className='nft-profile'>
      <div className='group-btn'>
        {nftDetail?.saleStatus === NFT_SALE_STATUS[0].value &&
          nftDetail?.totalCopies - nftDetail?.totalMinted && (
            <ButtonComponent
              customClassName='group-btn__sell-nft'
              variant='secondary'
              text={t('nft_detail.txt_sell_nft')}
              onClick={handleSellNft}
            />
          )}
        {nftDetail?.saleStatus === NFT_SALE_STATUS[1].value && (
          <ButtonComponent
            onClick={handleVisibleModalRemoveNft}
            customClassName='group-btn__remove-from-sale'
            variant='secondary'
            text={t('nft_detail.txt_remove_from_sale')}
          />
        )}
        <div className='group-btn__more-action'>
          <ButtonComponent
            onClick={handleVisibleMoreAction}
            customClassName='group-btn__more-action--btn'
            variant='secondary'
            text={t('nft_detail.txt_more_action')}
            afterIcon={<IconWhiteArrowDown />}
          />
          {visibleMoreAction && (
            <div className='group-btn__more-action--list'>
              {nftDetail?.saleStatus === NFT_SALE_STATUS[0].value &&
                !nftDetail?.totalMinted && (
                  <div className='action-item' onClick={handleEditNft}>
                    {t('nft_detail.txt_edit_nft')}
                  </div>
                )}
              {nftDetail?.saleStatus === NFT_SALE_STATUS[0].value &&
                !nftDetail?.totalMinted && (
                  <div
                    className='action-item'
                    onClick={handleVisibleModalDelete}
                  >
                    {t('nft_detail.txt_delete_nft')}
                  </div>
                )}
              <div className='action-item'>
                {t('nft_detail.txt_view_on_bsc')}
              </div>
              {nftDetail?.saleStatus !== NFT_SALE_STATUS[0].value && (
                <div className='action-item'>
                  <a
                    target='_blank'
                    href={`${PE_MARKET_USER}/nft/${nftDetail?._id}`}
                  >
                    {t('nft_detail.txt_view_on_market')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='nft-profile-body'>
        <div className='nft-profile-body__left-content'>
          <div className='nft-grid-content'>
            <div className='nft-grid-content__name'>
              <div className='nft-grid-content__name--title fs-16 text-bold'>
                {t('nft_detail.txt_name')}
              </div>
              <Tooltip title={nftDetail?.name}>
                <Paragraph
                  className='nft-grid-content__name--description'
                  ellipsis={{ rows: 2 }}
                >
                  {nftDetail?.name}
                </Paragraph>
              </Tooltip>
            </div>
            <div className='nft-grid-content__date'>
              <div className='nft-grid-content__date--title fs-16 text-bold'>
                {t('nft_detail.txt_create_date')}
              </div>
              <div className='nft-grid-content__date--description'>
                {formatDate(nftDetail?.createdAt, FORMAT_DATE_FULL)}
              </div>
            </div>

            <div className='nft-grid-content__id'>
              <div className='nft-grid-content__id--title fs-16 text-bold'>
                NFT ID
              </div>
              <div className='nft-grid-content__id--description'>
                {convertId(nftDetail?.nftCode?.toString())}
              </div>
            </div>

            <div className='nft-grid-content__fee'>
              <div className='nft-grid-content__fee--title fs-16 text-bold'>
                {t('nft_detail.txt_royalty_fee')}&nbsp;
                <Tooltip title={t('nft_detail.txt_royalty_fee_desc')}>
                  <img className='hover' src={IconDetail} />
                </Tooltip>
              </div>
              <div className='nft-grid-content__fee--description'>{`${nftDetail?.royaltyFee}%`}</div>
            </div>

            <div className='nft-grid-content__copies'>
              <div className='nft-grid-content__copies--title fs-16 text-bold'>
                {t('nft_detail.txt_total_copies')}
              </div>
              <div className='nft-grid-content__copies--description'>
                {nftDetail?.totalCopies}
              </div>
            </div>

            <div className='nft-grid-content__total-mint'>
              <div className='nft-grid-content__total-mint--title fs-16 text-bold'>
                {t('nft_detail.txt_total_minted')}&nbsp;
                <Tooltip title={t('nft_detail.txt_total_minted_desc')}>
                  <img className='hover' src={IconDetail} />
                </Tooltip>
              </div>
              <div className='nft-grid-content__total-mint--description'>
                {nftDetail?.totalMinted}
              </div>
            </div>

            <div className='nft-grid-content__type'>
              <div className='nft-grid-content__type--title fs-16 text-bold'>
                {t('nft_detail.txt_type')}
              </div>
              <div className='nft-grid-content__type--description'>
                {filterType(nftDetail?.type)}
              </div>
            </div>

            <div className='nft-grid-content__status'>
              <div className='nft-grid-content__status--title fs-16 text-bold'>
                {t('nft_detail.txt_status')}
              </div>
              <div
                className={`nft-grid-content__status--description status status--${nftDetail?.saleStatus}`}
              >
                {filterSaleStatus(nftDetail?.saleStatus)?.name}
              </div>
            </div>

            <div className='nft-grid-content__interface'>
              <div className='nft-grid-content__interface--title fs-16 text-bold'>
                {t('nft_detail.txt_interface')}
              </div>
              <div className='nft-grid-content__interface--description'>
                {filterInterface(nftDetail?.interface)?.name}
              </div>
            </div>
          </div>
          <div className='contract-address mt-20'>
            <div className='contract-address__title fs-16 text-bold'>
              {t('nft_detail.txt_contract_address')}
            </div>
            <TextComponent copyable={{ text: nftDetail?.contractAddress }}>
              {convertAddress(nftDetail?.contractAddress)}
            </TextComponent>
          </div>
          <div className='token-id mt-20'>
            <div className='token-id__title fs-16 text-bold'>Token ID</div>
            {nftDetail?.tokenId ? (
              <TextComponent copyable={true}>
                {nftDetail?.tokenId}
              </TextComponent>
            ) : (
              DEFAULT_VALUE
            )}
          </div>
          <div className='description mt-20'>
            <div className='description__title fs-16 text-bold'>
              {t('nft_detail.txt_description')}
            </div>
            <div className='description__content'>
              {nftDetail?.description || DEFAULT_VALUE}
            </div>
          </div>
        </div>
        <div className='nft-profile-body__right-content'>
          <div className='nft-profile-body__right-content--image'>
            <Image src={nftDetail?.avatarUrl} />
          </div>
          <div className='nft-profile-body__right-content--grid-content'>
            <div className='nft-profile-trait'>
              <Tooltip title={nftDetail?.name}>
                <Paragraph
                  className='nft-profile-trait__name fs-16 text-bold'
                  ellipsis={{ rows: 2 }}
                >
                  {nftDetail?.name}
                </Paragraph>
              </Tooltip>
              <div>{convertId(nftDetail?.nftCode?.toString())}</div>
            </div>
            <div className='nft-profile-clans'>
              <img src={nftDetail?.clan?.imgUrl} />
              <span className='text-bold fs-16'>{nftDetail?.clan?.name}</span>
            </div>
            <div className='nft-profile-level'>
              <span className='text-bold fs-16'>{`${t(
                'common.txt_level'
              )}: `}</span>
              {nftDetail?.level}
            </div>
            <div className='nft-profile-trait'>
              <span className='text-bold fs-16'>{`${t(
                'common.txt_trait_rarity'
              )}: `}</span>
              {nftDetail?.rarity?.name}
            </div>
            <div className='nft-profile-strength'>
              <span className='text-bold fs-16'>{`${t(
                'common.txt_strength'
              )}: `}</span>
              {nftDetail?.strength}
            </div>
            <div className='nft-profile-luck'>
              <span className='text-bold fs-16'>{`${t(
                'common.txt_luck'
              )}: `}</span>
              {nftDetail?.luck}
            </div>
            <div className='nft-profile-speed'>
              <span className='text-bold fs-16'>{`${t(
                'common.txt_speed'
              )}: `}</span>
              {nftDetail?.speed}
            </div>
          </div>
        </div>
      </div>
      <ModalDeleteNft
        visible={visibleModalDelete}
        toggleModal={handleVisibleModalDelete}
        confirmModal={handleDeleteNft}
      />
      <ModalRemoveNft
        visible={visibleRemoveNft}
        toggleModal={handleVisibleModalRemoveNft}
        confirmModal={handleRemoveFromSale}
      />
      <ModalProcessCancel
        visible={visibleProcessCancel}
        nftImg={nftDetail?.avatarUrl}
      />
      <ModalSuccess
        visible={visibleRemoveSuccessModal}
        title={t('nft_detail.txt_remove_success')}
        description={t('nft_detail.txt_remove_success_desc')}
        toggleModal={handleVisibleRemoveSuccessModal}
      />
      <ModalFail
        visible={visibleRemoveUnsuccessModal}
        title={t('nft_detail.txt_remove_unsuccess')}
        description={t('nft_detail.txt_remove_unsuccess_desc')}
        toggleModal={handleVisibleRemoveUnsuccessModal}
      />
    </div>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { find } from 'lodash';

import IconDetail from 'resources/svg/IconDetail.svg';

import ModalComponent from 'components/Modal';
import ButtonComponent from 'components/Button';
import TextComponent from 'components/Text';
import TooltipParagraph from 'components/TooltipParagraph';

import { convertAddress } from 'utils';
import { formatCurrency } from 'utils/number';
import { formatDate } from 'utils/time';
import { externalUrl, FORMAT_DATE_FULL, NFT_TYPE } from 'common/constant';

type DetailModalProps = {
  visible: any;
  onClose?: any;
  transaction?: any;
  isPrimary?: boolean;
};

const DetailModal = ({
  visible,
  onClose,
  transaction = {},
  isPrimary,
}: DetailModalProps) => {
  const { t } = useTranslation();

  const {
    nft = {},
    sellerAddress,
    buyerAddress,
    unitPrice,
    quantity,
    subTotal,
    royaltyFee,
    revenue,
    transactionHash,
    createdAt,
  } = transaction;
  const { avatarUrl, name, type } = nft;

  return (
    <ModalComponent
      //   title={t('nft_detail.txt_delete_nft')}
      visible={visible}
      wrapClassName='detail-transaction-modal'
      onClose={onClose}
    >
      <div className='body'>
        <div className='body__header'>
          <img src={avatarUrl} />
          <p>
            <TooltipParagraph>{name}</TooltipParagraph>
          </p>
        </div>
        <div className='body__content'>
          <div className='item'>
            <label>{t('revenue.txt_date_time')}:</label>
            <p>{formatDate(createdAt, FORMAT_DATE_FULL)}</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_unit_type')}:</label>
            <p>{find(NFT_TYPE, (data) => data.value === type)?.name}</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_seller')}:</label>
            {isPrimary ? (
              t('revenue.txt_admin')
            ) : (
              <TextComponent
                copyable={{ text: sellerAddress }}
                className='d-flex gap-15-px'
              >
                {convertAddress(sellerAddress, -4)}
              </TextComponent>
            )}
          </div>
          <div className='item'>
            <label>{t('revenue.txt_buyer')}:</label>
            <TextComponent
              copyable={{ text: buyerAddress }}
              className='d-flex gap-15-px'
            >
              {convertAddress(buyerAddress, -4)}
            </TextComponent>
          </div>
          <div className='br' />
          <div className='item'>
            <label>{t('revenue.txt_unit_price')}:</label>
            <p>{formatCurrency(unitPrice?.toString())} BNB</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_sold_quantity')}:</label>
            <p>{formatCurrency(quantity?.toString())}</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_sub_total')}:</label>
            <p>{formatCurrency(subTotal?.toString())} BNB</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_royalty')}:</label>
            <p>{formatCurrency(royaltyFee?.toString())} %</p>
          </div>
          <div className='item'>
            <label>{t('revenue.txt_royalty_fee')}:</label>
            <p>
              {formatCurrency(((royaltyFee / 100) * unitPrice)?.toString(), 5)}{' '}
              BNB
            </p>
          </div>
          <div className='br' />
          <div className='item'>
            <label>
              <strong>
                {t('revenue.txt_revenue')}{' '}
                <Tooltip
                  title={
                    isPrimary
                      ? t('revenue.txt_revenue_sub_total')
                      : t('revenue.txt_revenue_royalty_fee')
                  }
                >
                  <img className='hover' src={IconDetail} />
                </Tooltip>
              </strong>
            </label>
            <p>{formatCurrency(revenue?.toString())} BNB</p>
          </div>
        </div>
        <div className='body__footer'>
          <a
            href={externalUrl.BSC_SCAN(transactionHash)}
            rel='noreferrer'
            target='_blank'
          >
            <ButtonComponent
              variant='primary'
              text={t('revenue.txt_view_on_bscscan')}
            />
          </a>
        </div>
      </div>
    </ModalComponent>
  );
};

export default DetailModal;

import BigNumber from 'bignumber.js';
import _, { get } from 'lodash';

import {
  VERIFIED_STATUS,
  REGEX_NUMBER,
  REGEX_ONLY_DECIMAL_PART,
  COIN_TYPE,
  REGEX_ALL_CHARACTER_FROM_INDEX_8,
  REGEX_ALL_CHARACTER_FROM_INDEX_18,
  NFT_TYPE,
  NFT_SALE_STATUS,
  NFT_INTERFACE,
} from '../common/constant';

export function passwordStrength(pw) {
  return (
    /.{8,}/.test(pw) /* at least 8 characters */ *
    (/[a-z]/.test(pw) /* a lower letter */ +
      /[A-Z]/.test(pw) /* a upper letter */ +
      /\d/.test(pw) /* a digit */ +
      /[^A-Za-z0-9]/.test(pw)) /* a special character */
  );
}

export function preventLink(className, history) {
  const element = document.getElementById(className);
  if (element) {
    element.addEventListener('click', (e) => {
      history.push(element.getAttribute('href'));
      e.preventDefault();
    });
  }
  return element;
}

export function checkStatusKyc(t, statusKyc) {
  switch (statusKyc) {
    case VERIFIED_STATUS.UNVERIFIED:
      return t('userInfo.unverifiedKYC');
    case VERIFIED_STATUS.PENDING:
      return t('userInfo.inReview');
    case VERIFIED_STATUS.REJECTED:
      return t('userInfo.rejectKyc');
    case VERIFIED_STATUS.APPROVED:
      return t('userInfo.verifiedKYC');
    default:
      return t('userInfo.unverifiedKYC');
  }
}

export function dataURLtoFile(dataUrl, filename) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const formatNumber = (value, props = '') => {
  if (
    REGEX_NUMBER.test(value.toString().split(',').join('')) ||
    REGEX_ONLY_DECIMAL_PART.test(value.toString().split(',').join(''))
  ) {
    const valueArray = value.toString().split('.');
    if (value && !valueArray[0]) {
      valueArray[0] = '0';
    } else if (valueArray[0].toString().match(/^0\d/)) {
      valueArray[0] = `${valueArray[0]}`.replace(0, '');
    } else valueArray[0] = `${valueArray[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return valueArray.join('.');
  } else {
    return props ? props.values.amount : 0;
  }
};

export const banlanceText = (t, data) => {
  switch (data) {
    case COIN_TYPE.ETH:
      return t('myAssets.tabOneTokenType3');
    case COIN_TYPE.WBIV:
      return t('myAssets.tabOneTokenType2');
    default:
      return t('myAssets.tabOneTokenType1');
  }
};

export const sortDirection = (order, field) => {
  switch (order) {
    case 'descend':
      return `-${field}`;
    case 'ascend':
      return field;
    default:
      return '';
  }
};

export const parseNumber = (value, props, coinOption) => {
  const valueArray = value.split('.');
  if (
    REGEX_NUMBER.test(value.toString().split(',').join('')) ||
    REGEX_ONLY_DECIMAL_PART.test(value.toString().split(',').join(''))
  ) {
    if (value && (!valueArray[0] || valueArray[0] < 0)) {
      valueArray[0] = '0';
    } else valueArray[0] = valueArray[0].replace(/\$\s?|(,*)/g, '');

    if (valueArray[1]?.length > (coinOption === 'eth' ? 18 : 8)) {
      valueArray[1] = valueArray[1].replace(
        coinOption === 'eth' ? REGEX_ALL_CHARACTER_FROM_INDEX_18 : REGEX_ALL_CHARACTER_FROM_INDEX_8,
        ''
      );
    }
    return valueArray.join('.');
  } else {
    return props.values.value;
  }
};

export const formatNumbers = (value, props = '') => {
  if (
    REGEX_NUMBER.test(value.toString().split(',').join('')) ||
    REGEX_ONLY_DECIMAL_PART.test(value.toString().split(',').join(''))
  ) {
    const valueArray = value.toString().split('.');
    if (value && !valueArray[0]) {
      valueArray[0] = '0';
    } else if (valueArray[0].toString().match(/^0\d/)) {
      valueArray[0] = `${valueArray[0]}`.replace(0, '');
    } else valueArray[0] = `${valueArray[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return valueArray.join('.');
  } else {
    return props ? props.values.value : 0;
  }
};

export function formatCommaNumber(num, fix) {
  if (!num) return 0;
  let p = num.toString().split('.');
  p[0] = p[0]
    .split('')
    .reverse()
    .reduce(function (acc, num, i, orig) {
      return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
    }, '');

  if (fix && p[1]?.length > fix) {
    p[1] = `${new BigNumber(`0.${p[1]}`).toNumber().toFixed(fix)}`.replace('0.', '');
  }
  return p.join('.');
}

export const multipliedBy = (value, number = 8) => {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(number)).toNumber();
};

export const dividedBy = (value, number = 8) =>
  value ? formatCommaNumber(new BigNumber(value).dividedBy(new BigNumber(10).pow(number)).toNumber(), 8) : 0;

export const feeTransaction = (fee, size) => {
  return new BigNumber(size)
    .multipliedBy(new BigNumber(fee).dividedBy(size))
    .dividedBy(new BigNumber(10).pow(8))
    .toNumber();
};
export const setDecimalPoint = (value) => {
  if (value === 'eth') {
    return 18;
  } else if (value === 'wbiv') {
    return 8;
  } else return 8;
};
export const dividedTransaction = (value, coin) => {
  return value
    ? formatCommaNumber(new BigNumber(value).dividedBy(new BigNumber(10).pow(setDecimalPoint(coin))).toNumber(), 8)
    : 0;
};

export const trimObjValues = (obj) => {
  let objectResult = obj;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      objectResult = { ...objectResult, [key]: value.trim() };
    }
  }
  return objectResult;
};

export const convertEToNumber = (n) => {
  const sign = +n < 0 ? '-' : '',
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  const [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);
  return +pow < 0
    ? sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + '.' + decimal.slice(+pow));
};

export const convertAddress = (data, number = -5) => {
  if (data) {
    const first = data.slice(0, 6);
    const last = data.slice(number);
    return `${first}...${last}`;
  }

  return '--';
};

export const randomRPCTesnet = (listRPC) => {
  const lengthList = listRPC?.length;
  const randomNumber = Math.floor(Math.random() * 10) % lengthList;
  return get(listRPC, randomNumber);
};

export const filterType = (value) => _.find(NFT_TYPE, (data) => data.value === value)?.name;

export const filterSaleStatus = (value) => _.find(NFT_SALE_STATUS, (data) => data.value === value);

export const filterInterface = (value) => _.find(NFT_INTERFACE, (data) => data.value === value);

export const convertId = (value) => {
  return '#' + value;
};

export const checkStringFullSpace = (value) => !value?.replace(/\s/g, '').length;

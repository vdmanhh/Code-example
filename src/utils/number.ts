import BigNumber from 'bignumber.js';

export function formatNumber(value: string) {
  return value
    ? `${value}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';
}

export const formatCurrency = (value: any, numberDicimal: number = 3) => {
  if (!value) {
    return '';
  }
  if (value && value?.indexOf('.') >= 0) {
    const decimal_pos = value.indexOf('.');

    let left_side = value.substring(0, decimal_pos);
    let right_side = value.substring(decimal_pos + 1);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // // validate right side
    // right_side = formatNumber(right_side);

    // Limit decimal to only 3 digits
    right_side =
      right_side.length > 0 ? right_side.substring(0, numberDicimal) : 0;

    return right_side > 0 ? `${left_side}.${right_side}` : left_side;
  } else {
    return formatNumber(value);
  }
};

export const convertGasToNumber = (value?: any, demacial: number = 18) => {
  return value
    ? formatCurrency(
        new BigNumber(value)
          .dividedBy(new BigNumber(Math.pow(10, demacial)))
          .toFixed(2)
          .toString()
      )
    : '';
};

export const formatCurrencyToNumber = (value: string) => {
  if (!value) {
    return;
  }
  return value ? Number(value?.replace(/[^0-9.-]+/g, '')) : NaN;
};

export const convertPrice = (value: any, coinDecimal: number = 18) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(value)
    .multipliedBy(new BigNumber(Math.pow(10, coinDecimal)))
    .toString();
};

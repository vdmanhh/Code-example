export const LIMIT = 5;
export const TIME_REQUEST_API_STATUS_KYC = 30 * 1000;
export const FORMAT_DATE_DMY_HMS = 'DD-MM-YYYY HH:mm:ss';
export const FORMAT_DATE_DMY = 'DD/MM/YYYY';
export const LIMIT_UPLOAD_FILE = 10;
export const ACCEPT_TYPE = '.jpg, .jpeg, .png';
export const TIME_RESEND_CODE = 60;
export const REGEX_NUMBER = /^\d+\.?\d*$/;
export const REGEX_ONLY_DECIMAL_PART = /^[.]?\d*$/;
export const REGEX_ALL_CHARACTER_FROM_INDEX_8 = /(?<=^.{8}).*/g;
export const REGEX_ALL_CHARACTER_FROM_INDEX_18 = /(?<=^.{18}).*/g;
export const REGEX_INPUT_NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'ArrowLeft', 'ArrowRight'];
export const LENGTH_NUMBER = 12;

export const PAGE_SIZE_OPTIONS = ['10', '20', '50'];
export const PAGE_SIZE_DEFAULT = 10;

export const MAX_LENGTH_INPUT = 254;

export const FORMAT_DATE = 'DD/MM/YYYY';
export const FORMAT_DATE_Y_M_D = 'YYYY/MM/DD';
export const FORMAT_DATE_FULL = 'DD/MM/YYYY HH:mm:ss';
export const FORMAT_MINUTE_SECOND = ':mm:ss';

export const FILE_TYPE_IMAGE = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];

export const INITIAL_OFFSET = 1;
export const INITIAL_LIMIT = 10;

export const HTTP_RESPONSE = {
  OK: 200,
  ERROR_CODE_401: 401,
};

export const Language = {
  EN: 'en',
  JA: 'ja',
  KO: 'ko',
  CN: 'cn',
};

export const TYPE_EXTRA_INFO = {
  NAME: 'name',
  VALUE: 'value',
};

export const TYPE_OF_ANT_DESIGN = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  IMG_DONE: 'done',
};

export const VERIFIED_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
};

export const KYC_STATUS = {
  UNVERIFIED: 'unverified',
  VERIFYING: 'verifying',
  REJECTED: 'rejected',
  VERIFIED: 'verified',
};

export const KYC_DOCUMENT = {
  LICENSE: 'license',
  PASSPORT: 'passport',
  IDCARD: 'card',
};

export const RESET_PASSWORD_STATUS = {
  NEW_PASSWORD: 'new_password',
  SUCCESS: 'success',
};

export const COIN_TYPE = {
  BIV: 'biv',
  WBIV: 'wbiv',
  ETH: 'eth',
};

export const CONFIRM_MODAL = {
  VERIFIED_TRANSACTION: 'verified',
  SUBMIT_COMPLETED: 'completed',
  CONFIRM_SUBMIT: 'confirm',
  WITHDRAW_NOTICE: 'notice',
};

export const BALANCE_TABLE_TITLE = {
  TOKEN: 'token',
  DEPOSIT: 'deposit',
  BALANCE: 'balance',
  ACTIONS: 'actions',
};

export const NFT_SALE_STATUS = [
  {
    value: 0,
    name: 'Off sale',
  },
  {
    value: 1,
    name: 'On sale',
  },
  {
    value: 2,
    name: 'Sold out',
  },
  {
    value: 3,
    name: 'Processing',
  },
];

export const PAGE_SIZE_OPTION = [10, 20, 50];

export const HISTORY_TAB = {
  DEPOSIT: 'DEPOSIT',
  SWAP: 'SWAP',
  WITHDRAW: 'WITHDRAW',
};

export const KYC_DOCUMENT_SELECT = {
  card: 'ID Card',
  license: 'Driver’s License',
  passport: 'Passport',
};

export const COIN_TYPE_HISTORY = {
  biv: 'BIV',
  wbiv: 'WBIV',
  ether: 'ETH',
  eth: 'ETH',
};

export const TYPE_INPUT = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  PASSWORD: 'PASSWORD',
  SELECT: 'SELECT',
  CHECKBOX: 'CHECKBOX',
  NUMBER: 'NUMBER',
  SEARCH: 'SEARCH',
  SELECT_INFINITY_SCROLL: 'SELECT_INFINITY_SCROLL',
  SWITCH: 'SWITCH',
  DATE: 'DATE',
};

export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const COIN_TYPE_ADDRESS = {
  biv: 'myAssets.bivAddress',
  wbiv: 'myAssets.wbivAddress',
  eth: 'myAssets.ethAddress',
  ether: 'myAssets.ethAddress',
};

export const TOKEN_SUPPORT = [
  {
    value: 'BNB',
    name: 'BNB',
    image: 'https://image.binance.vision/uploads/temteDDYwoldaMDkkLdm.png',
  },
];

export const NFT_TYPE = [
  {
    value: 1,
    name: 'Dort',
  },
  {
    value: 2,
    name: 'Item',
  },
];

export const NFT_INTERFACE = [
  {
    value: 1,
    name: 'ERC 721',
  },
  {
    value: 2,
    name: 'ERC 1155',
  },
];

export const NFT_GENDER = [
  {
    value: 0,
    name: 'Male',
  },
  {
    value: 1,
    name: 'Female',
  },
];

export const BNB_ID = '61a45964d9e6d5182869f38f';

export const DEFAULT_OWNER = '0x0000000000000000000000000000000000000000';

export const ERROR_FILE_URL = {
  INVALID_FORMAT: 0,
  LIMIT_SIZE: 1,
};

export const NFT_LIST_SORT_FIELD = {
  PRICE: 1,
  NAME: 2,
  CREATED_TIME: 3,
};

export const SORT_BY_DEFAULT = -1;

export const DEFAULT_VALUE = 'N/A';

export const SOCKET_EVENT = {
  CANCEL_SELL_ORDER: 'cancelSellOrderSuccess',
};

export const SELL_ORDER_TYPE = {
  SELL: 1,
  RESELL: 2,
};

export const SELL_ORDER_TYPE_NAME = {
  [SELL_ORDER_TYPE.SELL]: 'Primary sale',
  [SELL_ORDER_TYPE.RESELL]: 'Secondary Sale',
};

export const externalUrl = {
  BSC_SCAN: (transaction: string) => `https://testnet.bscscan.com/tx/${transaction}`,
};
export const PE_MARKET_USER = 'https://pe-maketplace-test.ekoios.net';

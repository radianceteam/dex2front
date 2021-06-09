import {
  SET_WALLET,
  SET_PUBKEY,
  SET_TOKEN_LIST,
  SET_PAIRS_LIST,
  SET_TRANSACTIONS_LIST
} from '../actions/types';

const initialState = {
  wallet: {
    id: '',
    balance: 0
  },
  pubKey: {
    status: false,
    address: ''
  },
  tokenList: [],
  pairsList: [],
  transactionsList: []
};

const walletReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_WALLET:
      return {
        ...state,
        wallet: payload
      };
    case SET_PUBKEY:
      return {
        ...state,
        pubKey: {
          status: payload.status,
          address: payload.dexclient
        }
      };
    case SET_TOKEN_LIST:
      return {
        ...state,
        tokenList: payload
      };
    case SET_PAIRS_LIST:
      return {
        ...state,
        pairsList: payload
      };
    case SET_TRANSACTIONS_LIST:
      return {
        ...state,
        transactionsList: payload
      };
    default:
      return state;
  }
};

export default walletReducer;
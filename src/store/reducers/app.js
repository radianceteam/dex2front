import {
  CHANGE_THEME,
  SET_CUR_EXT,
  CONNECT_WALLET,
  SET_WALLET_IS_CONNECTED,
  CLOSE_CONNECTING,
  SHOW_ACCOUNT,
  HIDE_ACCOUNT,
  SHOW_POPUP,
  HIDE_POPUP,
} from '../actions/types';

const initialState = {
  appTheme: null,
  curExt: {},
  walletIsConnected: false,
  connectingWallet: false,
  accountIsVisible: false,
  popup: {isVisible: false, type: '', message: ''},
};

const appReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_THEME:
      return {
        ...state,
        appTheme: payload
      }
    case SET_CUR_EXT: 
      return {
        ...state,
        curExt: payload
      }
    case CONNECT_WALLET: 
      return {
        ...state,
        connectingWallet: true
      }
    case CLOSE_CONNECTING: 
      return {
        ...state,
        connectingWallet: false
      }
    case SET_WALLET_IS_CONNECTED: 
      return {
        ...state,
        walletIsConnected: payload
      }
    case SHOW_ACCOUNT: 
      return {
        ...state,
        accountIsVisible: true
      }
    case HIDE_ACCOUNT: 
      return {
        ...state,
        accountIsVisible: false
      }
    case SHOW_POPUP: 
      return {
        ...state,
        popup: {isVisible: true, type: payload.type, message: payload.message}
      }
    case HIDE_POPUP: 
      return {
        ...state,
        popup: {isVisible: false, type: '', message: ''}
      }
    default:
      return state;
  }
};

export default appReducer;
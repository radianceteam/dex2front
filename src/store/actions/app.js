import {
  CHANGE_THEME,
  SET_CUR_EXT,
  CONNECT_WALLET,
  CLOSE_CONNECTING,
  SET_WALLET_IS_CONNECTED,
  SHOW_ACCOUNT,
  HIDE_ACCOUNT,
  SHOW_POPUP,
  HIDE_POPUP,
 } from './types';

export function changeTheme(payload) {
  document.querySelector('html').setAttribute('data-theme', payload);
  localStorage.setItem('appTheme', payload);
  return { type: CHANGE_THEME, payload };
};

export function setCurExt(payload) {
  return { type: SET_CUR_EXT, payload }
}

export function connectWallet() {
  return { type: CONNECT_WALLET }
}

export function closeConnecting() {
  return { type: CLOSE_CONNECTING }
}

export function setWalletIsConnected(payload) {
  return { type: SET_WALLET_IS_CONNECTED, payload }
}

export function showAccount() {
  return { type: SHOW_ACCOUNT }
}

export function hideAccount() {
  return { type: HIDE_ACCOUNT }
}

export function showPopup(payload) {
  return { type: SHOW_POPUP, payload }
}

export function hidePopup() {
  return { type: HIDE_POPUP }
}
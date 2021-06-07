import TON from './images/tokens/TON.svg';
import fBTC from './images/tokens/wBTC.svg';
import fETH from './images/tokens/wETH.svg';
import USDT from './images/tokens/wUSDT.svg';
import USDC from './images/tokens/USDC.svg';

export function iconGenerator(icon) {
  switch (icon) {
    case 'TON':
      return TON;
    case 'fBTC':
      return fBTC;
    case 'fETH':
      return fETH;
    case 'USDT':
      return USDT;
    case 'USDC':
      return USDC;
    default:
      break;
  }
}
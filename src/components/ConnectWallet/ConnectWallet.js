import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeConnecting, setWalletIsConnected, showPopup } from '../../store/actions/app';
import { setTokenList, setWallet } from '../../store/actions/wallet';
import { setSwapFromToken, setSwapToToken } from '../../store/actions/swap';
import { setPoolFromToken, setPoolToToken } from '../../store/actions/pool';
import { checkPubKey, getAllClientWallets, setCreator } from '../../extensions/sdk/run';
import { getClientBalance } from '../../extensions/webhook/script';
import MainBlock from '../MainBlock/MainBlock';
import Loader from '../Loader/Loader';
import './ConnectWallet.scss';

function ConnectWallet() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [extIsAvailable, setExtIsAvailable] = useState(null);

  let curExt = useSelector(state => state.appReducer.curExt);

  let swapFromToken = useSelector(state => state.swapReducer.fromToken);
  let swapToToken = useSelector(state => state.swapReducer.toToken);
  
  let poolFromToken = useSelector(state => state.poolReducer.fromToken);
  let poolToToken = useSelector(state => state.poolReducer.toToken);

  useEffect(() => {
    (async function() {
      let pubkey = await checkPubKey();

      if(!pubkey.status) {
        try {
          await setCreator();
        } catch (err) {
          console.log(err);
          dispatch(closeConnecting());
          dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
        }
      }
      // try {
      //   const walletAddress = curExt._extLib.address;
      //   const clientBalance = await getClientBalance(walletAddress);
      //   let tokenList = await getAllClientWallets(curExt);
      //   tokenList = tokenList.filter(i => !i.symbol.includes('/')).map(i => (
      //     {
      //       ...i,
      //       symbol: i.symbol === 'WTON' ? 'TON' : i.symbol
      //     })
      //   );
        
      //   dispatch(setTokenList(tokenList));
      //   dispatch(setWallet({id: walletAddress, balance: clientBalance}));

      //   tokenList.forEach(i => {
      //     if(swapFromToken.symbol === i.symbol) {
      //       swapFromToken.balance = i.balance;
      //       swapFromToken.walletAddress = i.walletAddress;
      //       dispatch(setSwapFromToken(swapFromToken));
      //     } else if(swapToToken.symbol === i.symbol) {
      //       swapToToken.balance = i.balance;
      //       swapToToken.walletAddress = i.walletAddress;
      //       dispatch(setSwapToToken(swapToToken));
      //     } else if(poolFromToken.symbol === i.symbol) {
      //       poolFromToken.balance = i.balance;
      //       poolFromToken.walletAddress = i.walletAddress;
      //       dispatch(setPoolFromToken(poolFromToken));
      //     } else if(poolToToken.symbol === i.symbol) {
      //       poolToToken.balance = i.balance;
      //       poolToToken.walletAddress = i.walletAddress;
      //       dispatch(setPoolToToken(poolToToken));
      //     }
      //   })

      //   dispatch(setWalletIsConnected(true));
      //   dispatch(closeConnecting());
      // } catch (err) {
      //   console.log(err);
      //   dispatch(closeConnecting());
      //   dispatch(showPopup({type: 'error', message: 'Oops, something went wrong. Please try again.'}));
      // }      
    })()
  }, []);

  return (
    <MainBlock
      smallTitle={true}
      normalTitle={true}
      title={'Connecting wallet'}
      button={
        <svg onClick={() => history.goBack()} className="close" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.6" d="M21.7676 25.272L13 16.507L4.23239 25.272C4.00265 25.5027 3.7296 25.6858 3.42891 25.8108C3.12822 25.9357 2.80582 26 2.48021 26C2.15459 26 1.83219 25.9357 1.5315 25.8108C1.23081 25.6858 0.957759 25.5027 0.728021 25.272C0.497277 25.0422 0.314182 24.7692 0.189248 24.4685C0.0643133 24.1678 0 23.8454 0 23.5198C0 23.1942 0.0643133 22.8718 0.189248 22.5711C0.314182 22.2704 0.497277 21.9973 0.728021 21.7676L9.49296 13L0.728021 4.23239C0.497277 4.00265 0.314182 3.7296 0.189248 3.42891C0.0643133 3.12822 0 2.80582 0 2.48021C0 2.15459 0.0643133 1.83219 0.189248 1.5315C0.314182 1.23081 0.497277 0.957759 0.728021 0.728021C0.957759 0.497277 1.23081 0.314182 1.5315 0.189248C1.83219 0.0643133 2.15459 0 2.48021 0C2.80582 0 3.12822 0.0643133 3.42891 0.189248C3.7296 0.314182 4.00265 0.497277 4.23239 0.728021L13 9.49296L21.7676 0.728021C21.9973 0.497277 22.2704 0.314182 22.5711 0.189248C22.8718 0.0643133 23.1942 0 23.5198 0C23.8454 0 24.1678 0.0643133 24.4685 0.189248C24.7692 0.314182 25.0422 0.497277 25.272 0.728021C25.5027 0.957759 25.6858 1.23081 25.8108 1.5315C25.9357 1.83219 26 2.15459 26 2.48021C26 2.80582 25.9357 3.12822 25.8108 3.42891C25.6858 3.7296 25.5027 4.00265 25.272 4.23239L16.507 13L25.272 21.7676C25.5027 21.9973 25.6858 22.2704 25.8108 22.5711C25.9357 22.8718 26 23.1942 26 23.5198C26 23.8454 25.9357 24.1678 25.8108 24.4685C25.6858 24.7692 25.5027 25.0422 25.272 25.272C25.0422 25.5027 24.7692 25.6858 24.4685 25.8108C24.1678 25.9357 23.8454 26 23.5198 26C23.1942 26 22.8718 25.9357 22.5711 25.8108C22.2704 25.6858 21.9973 25.5027 21.7676 25.272Z" fill="white"/>
        </svg>
      }
      content={
        <div className="connect-wallet-center">
          {isLoading && (
            <>
              <Loader />
              <span className="connect-wallet-init-text">Initializing</span>
            </>
          )}

          {(!isLoading ) && (
            <a
              href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm"
              target="_blank"
              className="btn mainblock-btn"
            >
              <svg width="39" height="35" viewBox="0 0 39 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.8278 9.26675L30.435 1.21075C30.3129 1.07679 30.1371 1 29.9564 1H9.04421C8.86354 1 8.68775 1.07679 8.56568 1.21075L1.17283 9.26675C0.957979 9.50037 0.941703 9.85163 1.13377 10.1049L18.9827 33.7419C19.1048 33.9052 19.2969 34 19.5003 34C19.7038 34 19.8958 33.9036 20.0179 33.7419L37.8669 10.1032C38.0573 9.85163 38.0427 9.49874 37.8278 9.26675ZM22.5034 2.307L24.5689 9.05599H14.4334L16.4989 2.307H22.5034ZM24.6144 10.3614L19.5003 30.6802L14.3862 10.3614H24.6144ZM13.0434 10.3614L18.0859 30.3911L2.96163 10.3614H13.0434ZM25.9573 10.3614H36.039L20.9148 30.3911L25.9573 10.3614ZM35.8649 9.05599H25.9312L23.8657 2.307H29.6683L35.8649 9.05599ZM9.33068 2.307H15.1333L13.0678 9.05599H3.13579L9.33068 2.307Z" fill="white" stroke="white"/>
              </svg> &nbsp;Install Extraton
            </a>
          )}
        </div>
      }
    />
  )
}

export default ConnectWallet;
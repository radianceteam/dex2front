import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {showPopup} from '../../store/actions/app';
import MainBlock from './../../components/MainBlock/MainBlock';
import Input from './../../components/Input/Input';
import SwapBtn from '../../components/SwapBtn/SwapBtn';
import SwapConfirmPopup from '../../components/SwapConfirmPopup/SwapConfirmPopup';
import WaitingPopup from '../../components/WaitingPopup/WaitingPopup';
import './Swap.scss';

function Swap () {
  const history = useHistory();
  const dispatch = useDispatch();

  const connectingWallet = useSelector(state => state.appReducer.connectingWallet);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const accountIsVisible = useSelector(state => state.appReducer.accountIsVisible);

  const tokenList = useSelector(state => state.walletReducer.tokenList);
  const pairsList = useSelector(state => state.walletReducer.pairsList);

  const fromToken = useSelector(state => state.swapReducer.fromToken);
  const toToken = useSelector(state => state.swapReducer.toToken);

  const fromValue = useSelector(state => state.swapReducer.fromInputValue);
  const toValue = useSelector(state => state.swapReducer.toInputValue);

  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);
  const [swapConfirmPopupIsVisible, setSwapConfirmPopupIsVisible] = useState(false);

  const rate = useSelector(state => state.swapReducer.rate);

  function handleConfirm() {
    if(fromToken.symbol && toToken.symbol && fromValue) {
      // if(fromValue > fromToken.balance ) {
      //   dispatch(showPopup({type: 'error', message: 'Excess of balance'}));
      //   return;
      // }
      setSwapConfirmPopupIsVisible(true);
    } else {
      dispatch(showPopup({type: 'error', message: 'Fields should not be empty'}));
    }
  }

  return (
    <div className="container">
      { !swapAsyncIsWaiting && (
        <MainBlock
          smallTitle={false}
          title={'Swap'}
          button={
            <button className="btn action-btn">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M17.0001 10.4545C13.2605 10.4545 10.2296 13.3847 10.2296 17C10.2296 20.6153 13.2605 23.5455 17.0001 23.5455C20.7397 23.5455 23.7707 20.6153 23.7707 17C23.7707 13.3847 20.7397 10.4545 17.0001 10.4545ZM19.8222 1C19.9381 1 20.1043 1.01236 20.2932 1.07345C20.725 1.21164 20.9665 1.50982 21.0191 1.576C21.1402 1.73164 21.2102 1.888 21.2516 2.01455C21.4351 2.71564 21.6172 3.41745 21.8 4.11855C21.8218 4.19709 21.8526 4.28436 21.8963 4.37527C22.0385 4.66618 22.2483 4.85091 22.392 4.95491C22.7606 5.18836 23.1293 5.42182 23.4986 5.65527C23.9387 5.86545 24.3788 6.07636 24.8189 6.28727C24.9385 6.34327 25.1582 6.42764 25.4448 6.43418C25.4561 6.43418 25.4674 6.43418 25.4786 6.43418C25.7073 6.43418 25.8901 6.38327 26.003 6.34255C26.58 6.15418 27.1562 5.96582 27.7332 5.77673C27.8182 5.73964 28.0537 5.64655 28.3651 5.64655C28.4832 5.64655 28.6126 5.66036 28.7488 5.69527C29.3265 5.84364 29.6064 6.272 29.6643 6.36364C30.6611 7.98109 31.6579 9.59855 32.6546 11.2153C32.7148 11.3113 32.7915 11.4596 32.8359 11.6516C32.9337 12.0815 32.7923 12.4349 32.76 12.512C32.684 12.6924 32.5809 12.8305 32.4899 12.9295C31.9603 13.44 31.4307 13.9513 30.9011 14.4618C30.8424 14.52 30.7807 14.5905 30.722 14.6735C30.537 14.9396 30.4798 15.2095 30.461 15.3811C30.4347 15.9876 30.4083 16.5935 30.3812 17.2C30.4023 17.4924 30.4219 17.7847 30.4429 18.0771C30.452 18.2065 30.4873 18.4313 30.6257 18.6742C30.7446 18.8815 30.8898 19.0175 30.9883 19.096C31.4472 19.4822 31.9054 19.8691 32.3643 20.256C32.4688 20.3287 32.8126 20.5869 32.9473 21.064C33.1052 21.6211 32.863 22.0713 32.8096 22.1658C31.8647 23.8116 30.9199 25.4575 29.9758 27.104C29.9193 27.2022 29.8261 27.3411 29.6756 27.4742C29.3416 27.7724 28.9542 27.832 28.8692 27.8436C28.7969 27.8531 28.7277 27.8575 28.663 27.8575C28.5487 27.8575 28.4456 27.8444 28.3599 27.8276C27.6369 27.6422 26.9132 27.456 26.1903 27.2705C26.109 27.2502 26.015 27.2335 25.9119 27.2269C25.8773 27.2247 25.8442 27.224 25.8111 27.224C25.526 27.224 25.2936 27.3011 25.1476 27.3644C24.9242 27.4778 24.7015 27.5913 24.4781 27.7047L24.5014 27.728C23.7627 28.1716 23.0247 28.6153 22.2867 29.0589C22.1739 29.128 21.985 29.264 21.8278 29.496C21.6939 29.6945 21.639 29.8829 21.6134 30.0029L21.2004 31.7222C21.1831 31.8458 21.1086 32.2604 20.7363 32.6C20.3187 32.9804 19.8185 33 19.6816 33C19.6755 33 19.6703 33 19.6658 33C17.7196 32.9673 15.7727 32.9338 13.8251 32.9011C13.7092 32.8996 13.5384 32.8851 13.3466 32.8196C12.9171 32.6742 12.6808 32.3716 12.6297 32.304C12.5116 32.1469 12.4446 31.9898 12.4048 31.8625C12.2355 31.1578 12.0647 30.4538 11.8947 29.7491C11.8752 29.6698 11.8458 29.5825 11.8029 29.4909C11.6668 29.1978 11.4599 29.0095 11.3192 28.9033C10.8001 28.5622 10.2803 28.2211 9.76124 27.88C9.49343 27.7425 9.22637 27.6051 8.95856 27.4676C8.8397 27.408 8.62304 27.3178 8.33642 27.3033C8.3116 27.3025 8.28677 27.3018 8.26195 27.3018C8.05206 27.3018 7.8828 27.344 7.77522 27.3796C7.19371 27.5527 6.6122 27.7258 6.03069 27.8982C5.94794 27.9316 5.72752 28.0124 5.43714 28.0124C5.30775 28.0124 5.16406 27.9964 5.0121 27.9527C4.43961 27.7876 4.1718 27.352 4.11689 27.2589L1.26875 22.328C1.21158 22.2305 1.13936 22.08 1.10024 21.8865C1.01523 21.4545 1.16644 21.1062 1.2018 21.0291C1.28229 20.8509 1.38912 20.7156 1.48391 20.6189C2.0278 20.1229 2.5717 19.6269 3.11635 19.1302C3.17729 19.0742 3.24048 19.0058 3.30141 18.9244C3.49475 18.6625 3.55945 18.3949 3.58352 18.224L3.60609 17.9091C3.56622 17.0924 3.52635 16.2756 3.48723 15.4596C3.4797 15.3309 3.44961 15.1047 3.31646 14.8589C3.20211 14.6495 3.05843 14.5105 2.96289 14.4305C2.51227 14.0349 2.06241 13.6393 1.61179 13.2436C1.50873 13.1687 1.16945 12.904 1.04457 12.424C0.899384 11.864 1.15065 11.4189 1.20556 11.3258C2.18503 9.69891 3.16375 8.07127 4.14246 6.44436C4.20039 6.34691 4.29668 6.21018 4.44939 6.07927C4.79018 5.78836 5.17835 5.736 5.26411 5.72655C5.32505 5.71927 5.38448 5.71564 5.4409 5.71564C5.56728 5.71564 5.68012 5.73164 5.77265 5.752C6.49183 5.952 7.21101 6.15127 7.93019 6.35127C8.01144 6.37309 8.10397 6.39127 8.20779 6.39927C8.25367 6.40364 8.29731 6.40509 8.34019 6.40509C8.61101 6.40509 8.83293 6.336 8.97511 6.27709C9.53631 6.00582 10.0975 5.73382 10.6587 5.46182L11.4223 4.98473C11.5336 4.91345 11.7209 4.77455 11.8729 4.54036C12.003 4.33964 12.0557 4.14982 12.079 4.02982C12.2054 3.45455 12.3333 2.87855 12.4604 2.30327C12.4755 2.17964 12.5424 1.76364 12.9088 1.41818C13.3353 1.01455 13.8604 1 13.9718 1H19.8132C19.8162 1 19.8192 1 19.8222 1ZM17.0001 11.9091C19.9039 11.9091 22.2661 14.1927 22.2661 17C22.2661 19.8073 19.9039 22.0909 17.0001 22.0909C14.0963 22.0909 11.7342 19.8073 11.7342 17C11.7342 14.1927 14.0963 11.9091 17.0001 11.9091ZM19.8147 2.45455H13.9718L13.9627 2.52436L13.9319 2.608L13.5535 4.31782C13.4828 4.672 13.3459 5.00727 13.1473 5.31345C12.9171 5.66909 12.6146 5.96727 12.2505 6.19927L11.4749 6.68364L11.4057 6.72655L11.3328 6.76218L10.1991 7.31127L9.64915 7.57745L9.60627 7.59855L9.56264 7.61673C9.1692 7.77818 8.7577 7.85964 8.34019 7.85964C8.25518 7.85964 8.16716 7.856 8.07764 7.84873C7.89709 7.83345 7.71354 7.80218 7.53374 7.75491L6.45347 7.45455L5.44466 7.17382L3.59556 10.2465L2.50625 12.0575L2.56192 12.0975L2.62286 12.1673L3.25402 12.7215L3.96267 13.3433C4.24402 13.5811 4.47422 13.8633 4.648 14.1818C4.8481 14.5498 4.96546 14.9636 4.98953 15.3789L5.10914 17.84L5.1129 17.9258L5.10689 18.0109L5.08432 18.3258L5.08056 18.3724L5.07454 18.4196C5.00533 18.9105 4.815 19.3782 4.52537 19.7702C4.41629 19.9164 4.29442 20.0524 4.16127 20.1775L3.84155 20.4691L2.58223 21.616L5.43037 26.5491L5.49732 26.5229L5.58835 26.5084L7.31633 25.9942C7.62251 25.8967 7.94073 25.8473 8.26195 25.8473C8.31085 25.8473 8.3605 25.8487 8.41165 25.8509C8.84421 25.8727 9.27301 25.9855 9.65442 26.1789L10.0674 26.3905L10.4669 26.5956L10.5399 26.6327L10.6068 26.6771L11.0371 26.9593L12.164 27.6996L12.2046 27.7265L12.2423 27.7549C12.6477 28.0604 12.9705 28.4538 13.1758 28.8938C13.2518 29.0604 13.3128 29.2305 13.3564 29.4036L13.5821 30.3389L13.8491 31.4436L16.6521 31.4938L19.6928 31.5455L19.7019 31.4764L19.7342 31.3927L20.1442 29.6887C20.2217 29.3345 20.3646 29.0022 20.5677 28.7011C20.8055 28.3491 21.1124 28.0567 21.4818 27.8305L21.6134 27.728C21.6134 27.728 22.6179 27.224 23 27C23.3821 26.776 23.7785 26.4175 23.7785 26.4175L24.2953 26.1542L24.4465 26.0771L24.4894 26.0553L24.5338 26.0364C24.9445 25.8589 25.3741 25.7695 25.8111 25.7695C25.8766 25.7695 25.9428 25.7716 26.0105 25.7753C26.1993 25.7876 26.3851 25.8167 26.5664 25.8625L28.6585 26.3993L31.4946 21.4596L31.4359 21.4189L31.3743 21.352L30.0119 20.2022C29.7253 19.9695 29.4883 19.6916 29.3085 19.376C29.1001 19.0116 28.973 18.5985 28.9421 18.1818L28.9113 17.7345L28.8804 17.2996L28.8744 17.2189L28.8782 17.1382L28.8865 16.9455L28.9579 15.32L28.9594 15.2742L28.9647 15.2276C29.0189 14.7353 29.1949 14.2625 29.474 13.8618C29.5786 13.712 29.6959 13.5738 29.8238 13.4458L30.6047 12.6931L31.3637 11.9607L28.3719 7.10836L28.3065 7.13673L28.2162 7.15418L26.5025 7.71491C26.173 7.83055 25.8284 7.88873 25.4786 7.88873H25.4613L25.4109 7.888C24.9761 7.87855 24.5571 7.78036 24.1644 7.59709L22.8314 6.95855L22.7501 6.92L22.6749 6.87273L22.0753 6.49309L21.5675 6.17236L21.5277 6.14691L21.4885 6.11855C21.0785 5.82109 20.749 5.43273 20.5354 4.99564C20.4564 4.832 20.3917 4.66182 20.3451 4.488L20.0539 3.37091L19.8147 2.45455Z" fill="white" stroke="white" strokeWidth="1.5"/>
              </svg>
            </button>
          }
          content={
            <div>
              <Input
                type={'from'}
                text={'From'}
                token={fromToken}
                value={fromValue}
              />
              <SwapBtn
                fromToken={fromToken}
                toToken={toToken}
                page={'swap'}
              />
              <Input
                type={'to'}
                text={toValue > 0 ? <>To <span>(estimated)</span></> : 'To'}
                token={toToken}
                value={toValue}
              />
              { walletIsConnected ?
                <button className={(fromToken.symbol && toToken.symbol && fromValue && toValue) ? "btn mainblock-btn" : "btn mainblock-btn btn--disabled"} onClick={() => handleConfirm()}>Swap</button> :
                <button className="btn mainblock-btn" onClick={() => history.push('/account')}>Connect wallet</button>
              }
              { (fromToken.symbol && toToken.symbol) && <p className="swap-rate">Price <span>{rate} {toToken.symbol}</span> per <span>{fromToken.symbol}</span></p> }
              
            </div>
          }
          />
        )}

        { swapConfirmPopupIsVisible && <SwapConfirmPopup hideConfirmPopup={setSwapConfirmPopupIsVisible.bind(this, false)} /> }

        { swapAsyncIsWaiting && <WaitingPopup text={`Swapping ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}`} /> }
    </div>
  )
}

export default Swap;
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Switch, Route, Redirect, useLocation} from 'react-router-dom';
import {changeTheme, setExtensionsList} from './store/actions/app';
import {setPairsList} from './store/actions/wallet';
import { getAllPairsWoithoutProvider } from './extensions/webhook/script';
import { checkExtensions } from './extensions/extensions/checkExtensions';
import Account from './pages/Account/Account';
import Swap from './pages/Swap/Swap';
import Pool from './pages/Pool/Pool';
import Popup from './components/Popup/Popup';
import Header from './components/Header/Header'
import Manage from './pages/Manage/Manage';
import AddLiquidity from './pages/AddLiquidity/AddLiquidity';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const popup = useSelector(state => state.appReducer.popup);
  const walletIsConnected = useSelector(state => state.appReducer.walletIsConnected);
  const swapAsyncIsWaiting = useSelector(state => state.swapReducer.swapAsyncIsWaiting);

  useEffect(async () => {
    const theme = localStorage.getItem('appTheme') === null ? 'light' : localStorage.getItem('appTheme');
    dispatch(changeTheme(theme));

    const extensionsList = await checkExtensions();
    dispatch(setExtensionsList(extensionsList));

    const pairs = await getAllPairsWoithoutProvider();
    dispatch(setPairsList(pairs))

  }, []);


  useEffect(() => {
    window.addEventListener('beforeunload', function(e) {
      if(swapAsyncIsWaiting) e.returnValue = ''
    })
  }, [swapAsyncIsWaiting]);

  return (
    <>
      <Header />
      <Switch location={location}>
        <Route path="/account" component={Account} />
        <Route path="/swap" component={Swap} />
        <Route path="/pool"  component={Pool} />
        <Route path="/add-liquidity" component={AddLiquidity} />
        <Route path="/manage" render={() => !walletIsConnected ? <Redirect to="/pool" /> : <Manage />} />
        <Redirect from="" to="/swap" />
      </Switch>

      {popup.isVisible && <Popup type={popup.type} message={popup.message} link={popup.link} />}
    </>
  );
}

export default App;

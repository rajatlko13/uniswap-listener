import './App.css';
import Records from './components/Records';
import React, {useContext} from 'react';
import Wallet from './components/Wallet';
import { Web3Context } from './hooks/Web3ContextProvider';

function App() {

  const { connected, networkName } = useContext(Web3Context);

  return (
    <div className="App">
      <h1 style={{ paddingTop: '30px'}}>Uniswap Swap Transactions (Ropsten Network)</h1>
      <Wallet />
      { connected && networkName !== "Unsupported Network" && 
        <Records />
      }
    </div>
  );
}

export default App;

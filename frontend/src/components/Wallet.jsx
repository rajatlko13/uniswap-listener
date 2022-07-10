import React, {useContext} from 'react';
import { Web3Context } from '../hooks/Web3ContextProvider';
import '../assets/styles/Wallet.css';

const Wallet = () => {
    let bgColor = 'purple', textColor = 'black';
    const { connect, connected, disconnect, address, networkName } = useContext(Web3Context);
  
    return ( 
        <div className='wallet'>
            { connected ? 
                <span style={{ display: 'flex', flexDirection: 'column'}}>
                    <button className='wallet-button' onClick={disconnect}>
                        Disconnect<i className="fa-solid fa-wallet ms-2"></i>
                    </button>
                    <span style={{ display: 'flex', flexDirection: 'column'}}>
                        <span style={{ color: textColor}}>{networkName}</span>
                        { networkName === "Unsupported Network" ? 
                            <span style={{ color: textColor}}>Change to Ropsten</span> :
                            <span style={{ color: textColor}}>{address.substring(0,6)}...{address.substring(38)}</span>
                        }
                    </span>
                </span> :
                <button className='wallet-button' onClick={connect}>
                    Connect Wallet<i className="fa-solid fa-wallet ms-2"></i>
                </button>
            }
        </div>
    );
}
 
export default Wallet;
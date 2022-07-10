import React from 'react';
import {ethers} from 'ethers';
import '../assets/styles/Card.css';
import GreenArrow from '../assets/images/down-arrow-green.png';
import RedArrow from '../assets/images/up-arrow-red.png';

const Card = ({ index, record }) => {

    const token0 = 'DAI', token1 = 'WETH';

    const formatValue = (value, token) => {
        return Number(ethers.utils.formatUnits(value, 'ether')).toFixed(2) + " " + token;
        // return ethers.utils.formatUnits(value, 'ether') + token;
    }

    let {amount0In, amount1In, amount0Out, amount1Out} = record.returnValues;
    return ( 
        <div className='card' key={index} >
            <span className='card-address'>{record.transactionHash}</span>
            <span>
                {amount0Out !== "0" ? formatValue(amount0Out, token0) : formatValue(amount1Out, token1)}
                <img src={RedArrow} alt="out-arrow" />
            </span>
            <span>
                {amount0In !== "0" ? formatValue(amount0In, token0) : formatValue(amount1In, token1)}
                <img src={GreenArrow} alt="in-arrow" />
            </span>
            <button className='card-button' onClick={() => window.open(`https://ropsten.etherscan.io/tx/${record.transactionHash}`, "_blank")}>View Tx</button>
        </div>
    );
}
 
export default Card;
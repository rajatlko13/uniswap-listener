const Web3 = require("web3");
const abi = require('./abi/IUniswapV2Pair.json');
require('dotenv').config()
const { createClient } = require('redis');

const client = createClient();
client.connect();
client.on('connect', function() {
    console.log('Cache connected!');
});

// on ropsten network
const ROPSTEN_RPC = process.env.ROPSTEN_RPC;
const PAIR_ADDRESS = "0x1c5DEe94a34D795f9EEeF830B68B80e44868d316";
// const DAI_ADDRESS = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";
// const WETH_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

// UniswapV2Pair contract was deployed at this block no. (ropsten network)
const START_BLOCK = 7896249;
// 5 sec wait time
const WAIT_TIME = 5000;

const web3 = new Web3(ROPSTEN_RPC);

const startListening = async () => {
    const contract = new web3.eth.Contract(abi, PAIR_ADDRESS);
    let fromBlock = await getLastFetchedBlock() || START_BLOCK;
    // const END_BLOCK = await web3.eth.getBlockNumber();
    while (true) {
        const start = Date.now();

        let latestBlock, toBlock;
        try {
            latestBlock = await web3.eth.getBlockNumber();
        } catch (error) {
            console.log("Error in fetching latest block: ", error);
            console.log("Retrying...");
            continue;
        }
        
        let allLogs = await getSwapEventData() || [];
        while (fromBlock <= latestBlock) {
            toBlock = latestBlock - fromBlock > 200
                            ? fromBlock + 200
                            : latestBlock;

            try {
                let logs = await contract.getPastEvents('Swap', {
                    fromBlock,
                    toBlock
                });
                // console.log("LOGS: ", logs);

                if(logs && logs.length) {
                    console.log("Number of logs fetched: ", logs.length);
                    logs.forEach(log => {
                        allLogs.push(log);
                    });
                    await client.set('SWAP_EVENT_DATA', JSON.stringify(allLogs));
                    console.log("Data cached");
                }
                await setLastFetchedBlock(toBlock);
                fromBlock = toBlock + 1;
            } catch (err) {
                console.log("Error in fetching past logs: ", err);
                console.log("Retrying...");
                continue;
            }
        }

        const end = Date.now();
        const waitFor = end - start > WAIT_TIME ? 0 : WAIT_TIME - (end - start);

        console.log("Waiting for an extra", waitFor, "seconds");
        await sleep(waitFor);
    }
    
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const getLastFetchedBlock = async () => {
    try {
        const result = await client.get('LAST_FETCHED_BLOCK');
        if (result) {
            return Number(result);
        }
        return null;
    } catch (err) {
        console.log(err);
    }
};

const setLastFetchedBlock = async (blockNumber) => {
    try {
        await client.set('LAST_FETCHED_BLOCK', blockNumber.toString());
        console.log("Last fetched block updated to ", blockNumber);
    } catch (err) {
        console.log(err);
    }
};

const getSwapEventData = async () => {
    try {
        const result = await client.get('SWAP_EVENT_DATA');
        if (result) {
            return JSON.parse(result);
        }
        return null;
    } catch (err) {
        console.log(err);
    }
};

startListening();
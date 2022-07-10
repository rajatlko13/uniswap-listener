const { createClient } = require('redis');
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

const client = createClient();
client.connect();

client.on('connect', function() {
    console.log('Cache connected!');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

app.get('/api/records', async (req, res) => {
    console.log("GET API");
    const data = await client.get('SWAP_EVENT_DATA');
    if(data) {
        res.status(200).json({'data': JSON.parse(data)});
    }
    else
        res.status(404).json({'data': 'NO_DATA'});
});
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const MS_NAME = process.env.MS_NAME || 'Gateway';
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/customer', proxy('http://localhost:8001'));
//app.use('/products', proxy('http://localhost:8002'));
app.use('/shopping', proxy('http://localhost:8003'));
app.use('/', proxy('http://localhost:8002'));

app.listen(PORT, () => {
    console.log(`${MS_NAME} is listening to port ${PORT}`)
})
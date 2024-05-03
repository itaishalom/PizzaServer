import TokenVerifier from './middleware/TokenVerifier';
import config from "./config";

import express = require('express');
import RequestForwarder from "./middleware/requestForwarder";
import bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const tokenVerifier: TokenVerifier = new TokenVerifier();
const requestForwarder: RequestForwarder = new RequestForwarder();

app.use('/orders', tokenVerifier.verify, requestForwarder.forward.bind(requestForwarder));

app.use('/users', requestForwarder.forward.bind(requestForwarder));

app.listen(config.PORT, () => {
    console.log(`Gateway service listening at http://localhost:${config.PORT}`);
});

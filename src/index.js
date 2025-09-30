const express = require('express');
const { serverConfig } = require('../src/config');
const apiRoutes = require('./routes');

const { errors } = require('../src/utils');
const { globalErrorHandler } = errors;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.text());

app.use('/api', apiRoutes);

app.use(globalErrorHandler);

app.listen(serverConfig.PORT, () => {
    console.log(`Server running on http://localhost:${serverConfig.PORT}`)
})
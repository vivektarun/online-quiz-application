const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const { errors } = require('../src/utils');
const { globalErrorHandler } = errors;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.text());

app.use('/api', apiRoutes);

app.use(globalErrorHandler);

app.listen(ServerConfig.PORT, () => {
    console.log(`Server running on http://localhost:${ServerConfig.PORT}`)
})
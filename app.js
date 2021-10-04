'use strict'

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// SWAGGER
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

// Load Routes
var project_routes = require('./routes/routes');

// CORS
app.use((req, res, next) => // ALLOW CORS
{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// ROUTES

//THIS LINE TO LOCAL
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api',project_routes);

// Export
module.exports = app;
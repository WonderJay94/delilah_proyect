/**
 * Dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Routes  
 */
const routes = require('./Routes/routes');

/**
 * Constants
 */
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

/* Listen to port */
app.listen(PORT, (err) => {
    if(err) return console.log('cannot init server');
    console.log(`Iniciando server en http://${HOST}:${PORT}`);
});

/* generic middlewares */
app.use(bodyParser.json());

/* start routes */
routes(app);
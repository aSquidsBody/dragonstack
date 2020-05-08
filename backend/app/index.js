const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const GenerationEngine = require('./generation/engine.js');
const dragonRouter = require('./api/dragon.js');
const generationRouter = require('./api/generation.js')
const accountRouter = require('./api/account.js');

const app = express();
const engine = new GenerationEngine();

// pass the generation engine to the routers
app.locals.engine = engine;  

// Same Origin Policy. Allows localhost:5100 (frontend) so submit api requests
// when the frontend we trust asks for it, we want them to be able to send cookies, so credentials: true
app.use(cors({ origin: 'http://localhost:5100', credentials: true }));

// populates the body property of the request object (req.body)
app.use(bodyParser.json());

// gives a middleware function to allow us to work with cookies
// that are in request object that the backend recieves from the client
// populates the cookie property of the request object (req.cookie)
app.use(cookieParser());

// url routing
app.use('/account', accountRouter);
app.use('/dragon', dragonRouter);  
app.use('/generation', generationRouter);

// error handling (callback functions passed are called "express middleware")
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        type: 'error', message: err.message
    })
});

engine.start();

module.exports = app;
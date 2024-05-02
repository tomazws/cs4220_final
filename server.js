/*
CS4220 Final Project

API:
    AmiiboAPI

API Description:
    A RESTful API that contains the Amiibo Database that was created on the excel spreadsheet:
    https://docs.google.com/spreadsheets/d/19E7pMhKN6x583uB6bWVBeaTMyBPtEAC-Bk59Y6cfgxA/edit#gid=0

API documentations:
    https://amiiboapi.com/docs/

Authors:
    Thomas Yeung
    Isaac Mendoza
    Jason Schmidt
    Alberto Barboza
    Angel Penate
    Brian Mojica
*/

import express from 'express';

import mongo from './services/db.js';
import search from './routes/search.js';
import history from './routes/history.js';

const PORT = 8888;

// creating Express application instance
const app = express();

// GET route to handle requests to the root URL (localhost:8888)
app.get('/', (req, res) => {
    res.send('Welcome to the Deck of Cards App');
});

// mounting the 'poker' router to handle requests starting with '/poker'
app.use('/poker', poker);

// mounting the 'results' router to handle requests starting with '/results'
app.use('/results', results);

// starting the server and connecting to MongoDB
const server = app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connect();
});

// this event fires on ctrl+c (for mac)
process.on('SIGINT', async () => {
    console.log('SIGINT detected');
    await mongo.close();
    server.close(() => {
        console.log('Server closed.');
    });
});

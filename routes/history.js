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
import * as api from '../services/api.js';
import mongo from '../services/db.js';

const router = express.Router();

/**
 * Get search history
 *
 * @api {GET} /history
 * @apiQuery {string} [searchTerm]
 *  The name of the character to search for
 *
 * @apiExample localhost:8888/history?searchTerm=Yoshi
 * @apiExample localhost:8888/history?searchTerm=Mario
 *
 */
router.get('/', async (req, res) => {
    try {
        const { query } = req;
        const { searchTerm = '' } = query;

        let searchHistory;

        if (searchTerm) {
            searchHistory = await mongo.find("search_history", searchTerm);
        } else {
            searchHistory = await mongo.find("search_history");
        }

        res.json(searchHistory);

    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
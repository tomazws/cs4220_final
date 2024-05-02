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
 * Search characater by name
 *
 * @api {GET} /search
 * @apiQuery {string} [searchTerm]
 *  The name of the character to search for
 *
 * @apiExample localhost:8888/search?searchTerm=Yoshi
 * @apiExample localhost:8888/search?searchTerm=Mario
 *
 */
router.get('/', async (req, res) => {
    try {
        const { query } = req;
        const { searchTerm = '' } = query;

        if (!searchTerm) {
            res.status(500).json({ error: 'Missing character name' });
            return;
        }

        // RECORD TO SEARCH HISTORY
        // Query the MongoDB database 'search_history' for the searchTerm
        // If exists, update the lastSearched field to the current date
        // Else, create a new document in 'search_history'. the doc should look like:
        /*
        {
            "searchTerm"     // (String) the search term the user entered
            "searchCount":   // (Int) the matching result count from the API
            "lastSearched":  // (Date) the date/time the last search was performed for the given keyword
        }
        */

        // SEARCH FOR CHARACTER IN API
        // Search the API for the character using searchTerm (name)
        // Extract (character.head + character.tail) as the id
        // Extract `${character.name} ( ${character.gameSeries} )` as display text
        // res.json the extractions

        res.json('Test');

    } catch (error) {
        res.status(500).json(error);
    }
});

/**
 * Get character details by ID
 *
 * @api {GET} /search/:id/details
 * @apiQuery {boolean} [cache] (optional)
 *  Either to use cache or not. (default: false)
 *
 * @apiExample localhost:8888/search/1234567812345678/details
 * @apiExample localhost:8888/search/1234567812345678/details?cache=false
 * @apiExample localhost:8888/search/1234567812345678/details?cache=true
 *
 */
router.get('/:id/details', async (req, res) => {
    try {
        const { query, params } = req;

        const { id } = params;
        const { cache } = query;
        // Convert cache to boolean
        cache = (cache === 'true');

        if (!id) {
            res.status(500).json({ error: 'Missing character ID' });
            return;
        }

        let character;

        if (!cache) {
            // Get character details from the API
            // If query MongoDB database 'search_cache' for the character id doesn't pull anything
            // -- Save the character details to the 'search_cache' collection
        } else {
            // Get character details from the MongoDB database 'search_cache' with the character id
            // If not found
            // -- Get character details from the API
            // -- Save the character details to the 'search_cache' collection
        }

        res.json(character);

    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;
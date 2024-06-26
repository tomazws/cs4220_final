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
        const { searchTerm = '' }  = query;

        // Search API for character
        const characters = await api.searchByKeyword(searchTerm);

        // Obtain a total of the search result, and the current time
        const searchCount = characters.amiibo.length
        const dateTime = new Date();

        // Record search information into database
        await mongo.create('search_history', {
            searchTerm: searchTerm,
            searchCount: searchCount,
            lastSearched: dateTime.toLocaleString()
        });

        // Format JSON output
        const results = characters.amiibo.map((character) => {
            return {
                id: character.head + character.tail,
                displayText: `${character.name} ( ${character.gameSeries} )`};
        });

        res.json(results);

    } catch (error) {
        res.status(500).json(error.toString());
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
        const { id } = req.params;
        const { cache = "false" } = req.query;
        const useCache = cache.toLowerCase() === 'true';

        let details;

        if (useCache) {
            // If using cache, we pull character from database using its id
            console.log('Pulling details from cache...');
            details = await mongo.find('search_cache', {id: id});
            
            // If character is not found,
            // we will get character details using API and record details into database
            if (details.length === 0) {
                console.log('Cache not found, pulling details from API...');
                details = await api.getDetailsById(id);
                await mongo.create('search_cache', {...details, id});
            }
        } else {
            // If not using cache, we will obtain character details from API
            console.log('Pulling details from API...');
            details = await api.getDetailsById(id);

            // If character exists in database, update it, otherwise create new one
            if ((await mongo.find('search_cache', {id: id})).length === 0) {
                await mongo.create('search_cache', {...details, id});
            } else {
                await mongo.update('search_cache', id, {...details, id});
            }
        }

        res.json(details);

    } catch (error) {
        res.status(500).json(error.toString());
    }
});

export default router;

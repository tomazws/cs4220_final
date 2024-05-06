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

const _formatAmiibo = (amiibos) => {//Might need for second router.get
    return amiibos.amiibo.map((amiibo) =>{
        return {
            Character:   `${amiibo.name}`,
            Game_Series: `${amiibo.gameSeries}`,
            NA_Release:  (amiibo.release['na'] == null ? "Not released" :amiibo.release['na'].substring(0,4)),
            JP_Release:  (amiibo.release['jp'] == null ? "Not released" :amiibo.release['jp'].substring(0,4)),
            Image:       `${amiibo.image}`
        };
    });
};
const _selectionPrompt = async (amiibos) => {//We probably don't need this, but in case we do the select needs inquirer so it won't work
    const displayCharacters = amiibos.amiibo.map((character) => {
        return { name: `${character.name} ( ${character.gameSeries} )
         (NA) ${character.release['na'] == null ? "not released" :character.release['na'].substring(0,4)},
         (JP) ${character.release['jp'] == null ? "not released" :character.release['jp'].substring(0,4)}`,
         value: character.head + character.tail};
    });

    return await select({
        message: 'Select a character',
        choices: displayCharacters
    });
};

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
        const characters = await api.searchByKeyword(searchTerm);
        const amiibo = characters.amiibo.length
        const results = {searchTerm: searchTerm, searchCount: amiibo, lastSearched: Date.now()};

        res.json(results);
        await mongo.create('search_history', results);

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
        

        //if (!cache) {
            // Get character details from the API
            // If query MongoDB database 'search_cache' for the character id doesn't pull anything
            // -- Save the character details to the 'search_cache' collection
        //} else {
            // Get character details from the MongoDB database 'search_cache' with the character id
            // If not found
            // -- Get character details from the API
            // -- Save the character details to the 'search_cache' collection
        //}

    } catch (error) {
        res.status(500).json(error.toString());
    }
});

export default router;
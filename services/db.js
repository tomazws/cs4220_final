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

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

/**
 * ES6 module for interacting with MongoDB
 * @returns {Object} - Object containing functions to interact with MongoDB
 */
const mongo = () => {
    // Load the environment variables from the .env file
    dotenv.config();

    const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

    // If .env is missing
    if (!DB_USER) {
        console.error(`${'/'.repeat(61)}\n//${' '.repeat(57)}//`);
        console.error('//  ERROR: .env is ignored on git. Ask for the .env file.  //');
        console.error(`//${' '.repeat(57)}//\n${'/'.repeat(61)}`);
    }

    const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=Demo-Cluster`;

    let client;
    let db;

    /**
     * Opens a connection to the MongoDB database
     */
    async function connect() {
        try {
            client = new MongoClient(mongoURL);
            await client.connect();
            db = client.db();

            console.log('Opened connection to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Closes the connection to the MongoDB database
     */
    async function close() {
        try {
            await client.close();

            console.log('Closed connection to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Creates a new document in the specified collection
     * @param {string} collectionName - name of the collection
     * @param {Object} data - data to be inserted into the collection
     */
    async function create(collectionName, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.insertOne(data);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Finds documents in the specified collection
     * @param {string} collectionName - name of the collection
     * @param {string} query - identifier for filtering documents
     * @returns {Promise<Document>} - a document or an array of ducments
     */
    async function find(collectionName, query) {
        try {
            const collection = db.collection(collectionName);

            if (query) {
                return await collection
                    .find(query)
                    .sort({ _id: -1 })
                    .toArray();
            } else {
                return await collection
                    .find({})
                    .sort({ _id: -1 })
                    .toArray();
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Updates documents in the specified collection
     * @param {string} collectionName - name of the collection
     * @param {string} id - identifier for filtering documents
     * @param {Object} data - the data to be updated
     */
    async function update(collectionName, id, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.updateOne(
                { id: id },
                { $set: data }
            );
        } catch (err) {
            console.error(err);
        }
    }

    return {
        connect,
        close,
        create,
        find,
        update
    };
};

export default mongo();

const express = require('express');
const router = express.Router();
// const auth = require('./../middleware/auth'); // Currently not in use 
const nodeCache = require('node-cache');
const axios = require('axios');
const execPgQuery = require('../config/database');

// Constant file should go in .env file
const constants = require('../constants');

const cache = new nodeCache({ stdTTL: constants.cache_TTL }); // 30 minutes

// The Below API takes zipcode as parameter and uses third party API (openweathermap) to provide weather details
// And openweathermap API support US zip codes only - Ex: 90001, 90002, 90003 so on
router.get('/weather/:zipCode', async (req, res) => {
    console.log(req.params.zipCode)
    const zipCode = req.params.zipCode;

    // Check if the provided postal/Zip code's 'weather' data has already present in the cache
    const dataCached = cache.get(zipCode);

    if (dataCached) {
        res.json({ message: `Data fetched from Cache for Postal Code ${zipCode}, Updates every 30 minutes`, cache: true, data: dataCached })
    } else {
        try {
            const apiURL = `${constants.apiPath}/weather?zip=${zipCode}&appid=${constants?.apiKey}`;

            const response = await axios.get(apiURL);
            const weatherDetails = response?.data;

            // set 'weather' details in cache by postal code for 30 minutes
            cache.set(zipCode, weatherDetails, constants.cache_TTL);

            res.status(200).json({ message: 'Data fetched from API', cache: false, data: weatherDetails })
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error })
        }
    }
})

// This takes zipcode as parameter and connects Database to fetch weather details
router.get('/weather_db/:zipCode', async (req, res) => {
    const zipCode = req.params.zipCode;

    // Check if the provided postal/Zip code's 'weather' data has already present in the cache
    const dataCached = cache.get(zipCode);

    if (dataCached) {
        res.json({ message: `Data fetched from Cache for Postal Code ${zipCode}, Updates every 30 minutes`, cache: true, data: dataCached })
    } else {
        try {
            const weatherDetails = await execPgQuery(`SELECT temperature FROM weather WHERE zip_code = ${zipCode}`)

            if (weatherDetails) {
                // set 'weather' details in cache by postal code for 30 minutes
                cache.set(zipCode, weatherDetails, constants.cache_TTL);
                res.status(200).json({ message: 'Data fetched from DB / API', cache: false, data: weatherDetails })
            } else {
                res.status(400).send({ message: `No data found in the DB for zip code ${zipCode}`, data: [] });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error })
        }
    }
})

module.exports = router;
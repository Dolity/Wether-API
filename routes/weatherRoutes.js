const express = require('express');
const { param } = require('express-validator');

const { getWeather } = require('../controller/weatherController');

const router = express.Router();

router.get('/weather/:location?/:date?',
    [
        param('location').isString().notEmpty().withMessage('Location is required'),
        param('date').isString().notEmpty().withMessage('Date is required (yesterday, today, tomorrow, nextweekend)')
    ],
    getWeather);

module.exports = router;

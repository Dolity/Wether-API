const { validationResult } = require('express-validator');

const redisClient = require('../config/redisConfig');
const { getWeatherFromRedis } = require('../service/weatherService');

const getWeather = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { location, date } = req.params;

    try {
        const weatherData = await getWeatherFromRedis(location, date);
        res.status(200).json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Failed to get weather data' });
    }
  };

module.exports = { getWeather };

require('dotenv').config();
const axios = require('axios');


const redisClient = require('../config/redisConfig');

const WEATHER_API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// yesterday = yesterday
// today = today
// tomorrow = tomorrow
// next week = nextweekend

const getWeatherFromAPI = async (location, date) => {
    
    try {
        const response = await axios.get(`${WEATHER_API_URL}/${location}/${date}?key=${WEATHER_API_KEY}&contentType=json`);

        if (response.status !== 200) {
            throw new Error("Failed to get weather data from API");
        }

        return response.data;
    } catch (error) {
        console.error("Error getting weather data from API", error);
        throw new Error("Failed to get weather data from API");
    }
};

const getWeatherFromRedis = async (location, date) => {
    const cacheKey = `${location}:${date}`;

    try {
        const data = await redisClient.get(cacheKey);

        if (data) {
            return JSON.parse(data);
        }

        const weatherData = await getWeatherFromAPI(location, date);

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(weatherData));

        return weatherData;
    } catch (error) {
        console.error("Error accessing Redis", error);
        throw new Error("Failed to get weather data");
    }
};

module.exports = {getWeatherFromAPI, getWeatherFromRedis}
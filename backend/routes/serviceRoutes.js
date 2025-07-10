const express = require('express');
const router = express.Router();

router.get("/temperature", async (req, res) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=${process.env.API_KEY}`, {
            method: "GET",
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from OpenWeather API", details: await response.json() });
        }
        const data = await response.json();
        const temperatureInKelvin = data.main.temp;
        const temperatureInCelsius = temperatureInKelvin - 273.15;
        const temp = Math.round(temperatureInCelsius);
        res.status(200).json({ temp: temp });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/humidity", async (req, res) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=${process.env.API_KEY}`, {
            method: "GET",
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from OpenWeather API", details: await response.json() });
        }
        const data = await response.json();
        res.status(200).json({ humidity: data.main.humidity });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

const request = require("request");
const axios =require("axios")
const API_KEY = "38f9264b8e345e5059d64b5e08c19663";
const BASE_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=fr&q=`;

/*function getWeatherData(city, callback) {
    const url = BASE_URL + city;
    request(url, function (error, response, body) {
        if (error) {
            callback(error, null);
        } else {
            const weatherData = JSON.parse(body);
            callback(null, weatherData);
        }
    });
}*/

function getWeatherData(city, callback) {
    const url = BASE_URL + city;

    axios.get(url)
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error, null);
        });
}

getWeatherData("Sousse", function (error, data) {
    if (error) {
        console.log("Erreur :", error);
    } else {
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;

        console.log(`Météo à Sousse :`);
        console.log(`Description : ${description}`);
        console.log(`Température : ${temperature} °C`);
        console.log(`Humidité : ${humidity} %`);
    }
});

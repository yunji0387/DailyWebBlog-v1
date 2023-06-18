//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const weatherSchema = new mongoose.Schema({
  cityName: String,
  lastUpdate: Date,
  temp: Number,
  description: String,
  icon: String,
  iconURL: String
});

const Weather = mongoose.model("Weather", weatherSchema);

async function updateWeatherInfoDB(toAdd) {
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", { useNewUrlParser: true });

    const icon_URL = getWeatherIcon(toAdd.icon);
    const currWeather = new Weather({
      cityName: toAdd.cityName,
      lastUpdate: toAdd.lastUpdate,
      temp: toAdd.temp,
      description: toAdd.description,
      icon: toAdd.icon,
      iconURL: toAdd.iconURL
    });

    await currWeather.save();

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

async function getWeatherInfoRequest(date) {
    const weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid=" + process.env.WEATHER_API_KEY + "&units=metric";
  
    //using Promise will ensure the result will returned after the "https.get" request and the response is recieved.
    return new Promise((resolve, reject) => {
      https.get(weatherAPI_URL, async function(res) {
        let result = {};
  
        if (res.statusCode >= 200 && res.statusCode < 300) {
          let data = "";
  
          res.on("data", function(chunk) {
            data += chunk;
          });
  
          res.on("end", async function() {
            const weatherData = JSON.parse(data);
            result = {
              status: res.statusCode,
              cityName: weatherData.name,
              lastUpdate: date,
              temp: weatherData.main.temp,
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon,
              iconURL: getWeatherIcon(weatherData.weather[0].icon)
            };
            await updateWeatherInfoDB(result);
            resolve(result); // Resolve the promise with the result
          });
        } else {
          result = {
            status: res.statusCode
          };
          resolve(result); // Resolve the promise with the result
        }
      }).on("error", function(error) {
        reject(error); // Reject the promise if an error occurs
      });
    });
}

async function getWeatherInfoDB(date) {
  let currWeather;
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", {useNewURLParser: true});
    currWeather = await Weather.findOne({});
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
  return currWeather;
}

function getWeatherIcon(iconID){
    const result_URL = "https://openweathermap.org/img/wn/" + iconID + "@2x.png";
    return result_URL;
}

module.exports = {
    getWeatherInfoDB
};
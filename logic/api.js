//jshint esversion:6
const https = require("https");
require("dotenv").config();

// function getWeatherInfo(){
//     const weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid=" + process.env.WEATHER_API_KEY + "&units=metric";
//     let result = {};
//     //console.log(weatherAPI_URL);
//     https.get(weatherAPI_URL, function(res){
//         //console.log(res.statusCode);
//         if(res.statusCode >=200 && res.statusCode < 300){
//             res.on("data", function(data){
//                 const weatherData = JSON.parse(data);
//                 result = {
//                     status: res.statusCode,
//                     name: weatherData.name,
//                     temp: weatherData.main.temp,
//                     description: weatherData.weather[0].description,
//                     icon: weatherData.weather[0].icon
//                 };
//             });
//         }else{
//             result = {
//                 status: res.statusCode
//             }; 
//         }
//     });
//     console.log(result);
//     return result;
// }

function getWeatherInfo() {
    const weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid=" + process.env.WEATHER_API_KEY + "&units=metric";
  
    return new Promise((resolve, reject) => {
      https.get(weatherAPI_URL, function(res) {
        let result = {};
  
        if (res.statusCode >= 200 && res.statusCode < 300) {
          let data = "";
  
          res.on("data", function(chunk) {
            data += chunk;
          });
  
          res.on("end", function() {
            const weatherData = JSON.parse(data);
            result = {
              status: res.statusCode,
              name: weatherData.name,
              temp: weatherData.main.temp,
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon
            };
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

module.exports = {
    getWeatherInfo
};

getWeatherInfo();
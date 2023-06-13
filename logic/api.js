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

const stockCompanyList = [
  {name: "Tesla", symbol: "TSLA", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Apple", symbol: "AAPL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Microsoft", symbol: "MSFT", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Amazon", symbol: "AMZN", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Google", symbol: "GOOGL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"}
];

function getWeatherInfo() {
    const weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?q=Winnipeg&appid=" + process.env.WEATHER_API_KEY + "&units=metric";
  
    //using Promise will ensure the result will returned after the "https.get" request and the response is recieved.
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

function getWeatherIcon(iconID){
    const result_URL = "https://openweathermap.org/img/wn/" + iconID + "@2x.png";
    return result_URL;
}

function getStockInfo(stockSymbol){
  const stockAPI_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ stockSymbol +"&apikey=J09XOSAQI801O3WI";
  return new Promise((resolve, reject) => {
    https.get(stockAPI_URL, function(res) {
      let result = {};

      if (res.statusCode >= 200 && res.statusCode < 300) {
        let data = "";

        res.on("data", function(chunk) {
          data += chunk;
        });

        res.on("end", function() {
          const stockData = JSON.parse(data);
          //console.log(stockData);
          //console.log("-------------------------------");
          const stockLastUpdate = stockData['Meta Data']['3. Last Refreshed'];
          result = {
            symbol: stockData['Meta Data']['2. Symbol'],
            lastUpdate: stockLastUpdate,
            openPrice: stockData['Time Series (Daily)'][stockLastUpdate]['1. open'],
            closePrice: stockData['Time Series (Daily)'][stockLastUpdate]['4. close'],
            highPrice: stockData['Time Series (Daily)'][stockLastUpdate]['2. high'],
            lowPrice: stockData['Time Series (Daily)'][stockLastUpdate]['3. low']
          };
          console.log(result);
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
    getWeatherInfo,
    getWeatherIcon,
    getStockInfo
};
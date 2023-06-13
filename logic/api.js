//jshint esversion:6
const https = require("https");
require("dotenv").config();

const stockCompanyList = [
  {name: "Tesla", symbol: "TSLA", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Apple", symbol: "AAPL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Microsoft", symbol: "MSFT", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Amazon", symbol: "AMZN", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
  {name: "Google", symbol: "GOOGL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"}
];

async function updateStockInfo() {
  for (const stockCompany of stockCompanyList) {
    let currStock;
    let currStockSymbol, currStockLastUpdate, currStockOpenPrice, currStockClosePrice, currStockHighPrice, currStockLowPrice;

    try {
      currStock = await getStockInfo(stockCompany.symbol);
      stockCompany.symbol = currStock.symbol;
      stockCompany.lastUpdate = currStock.lastUpdate;
      stockCompany.openPrice = currStock.openPrice;
      stockCompany.closePrice = currStock.closePrice;
      stockCompany.highPrice = currStock.highPrice;
      stockCompany.lowPrice = currStock.lowPrice;
      
      //console.log(stockCompany.symbol, stockCompany.lastUpdate, stockCompany.openPrice, stockCompany.closePrice, stockCompany.highPrice, stockCompany.lowPrice);

    } catch (error) {
      console.error(error);
      currStock = "Error fetching weather";
    }
  }
  stockCompanyList.forEach(function(stockCompany){
    console.log(stockCompany);
  });
}

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
  const stockAPI_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ stockSymbol +"&apikey=" + process.env.STOCK_API_KEY;
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
          const stockLastUpdate = stockData["Meta Data"]["3. Last Refreshed"];
          result = {
            symbol: stockData["Meta Data"]["2. Symbol"],
            lastUpdate: stockLastUpdate,
            openPrice: stockData['Time Series (Daily)'][stockLastUpdate]['1. open'],
            closePrice: stockData['Time Series (Daily)'][stockLastUpdate]['4. close'],
            highPrice: stockData['Time Series (Daily)'][stockLastUpdate]['2. high'],
            lowPrice: stockData['Time Series (Daily)'][stockLastUpdate]['3. low']
          };
          //console.log(result);
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
    getStockInfo,
    updateStockInfo
};

updateStockInfo();
//console.log(stockCompanyList);
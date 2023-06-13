//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  lastUpdate: String,
  openPrice: String,
  closePrice: String,
  highPrice: String,
  lowPrice: String
});

const Stock = mongoose.model("Stock", stockSchema);

// const stockCompanyList = [
//   {name: "Tesla", symbol: "TSLA", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
//   {name: "Apple", symbol: "AAPL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
//   {name: "Microsoft", symbol: "MSFT", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
//   {name: "Amazon", symbol: "AMZN", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
//   {name: "Google", symbol: "GOOGL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"}
// ];

// async function updateStockInfo(date) {
//   for (const stockCompany of stockCompanyList) {
//     let currStock;
//     try {
//       currStock = await getStockInfo(stockCompany.symbol);
//       stockCompany.symbol = currStock.symbol;
//       stockCompany.lastUpdate = currStock.lastUpdate;
//       stockCompany.openPrice = currStock.openPrice;
//       stockCompany.closePrice = currStock.closePrice;
//       stockCompany.highPrice = currStock.highPrice;
//       stockCompany.lowPrice = currStock.lowPrice;
//     } catch (error) {
//       console.error(error);
//       currStock = "Error fetching weather";
//     }
//   }
//   stockCompanyList.forEach(function(stockCompany){
//     let curr = new Stock({
//       name: stockCompany.name,
//       symbol: stockCompany.symbol,
//       lastUpdate: stockCompany.lastUpdate,
//       openPrice: stockCompany.openPrice,
//       closePrice: stockCompany.closePrice,
//       highPrice: stockCompany.highPrice,
//       lowPrice: stockCompany.lowPrice
//     });
//     curr.save();
//   });
//   return stockCompanyList;
// }

async function updateStockInfo(date) {
  let stockCompanyList;
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", {useNewURLParser: true});
    stockCompanyList = await Stock.find({});
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
  //console.log(stockCompanyList);
  return stockCompanyList;
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
    //getStockInfo,
    updateStockInfo
};

//updateStockInfo("-");
//console.log(stockCompanyList);
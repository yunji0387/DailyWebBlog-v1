//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

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

const cryptoSchema = new mongoose.Schema({
  name: String,
  lastUpdate: String,
  price: Number,
  marketCap: Number
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

async function getStockInfoDB(currentTime) {
  let stockCompanyList;
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", {useNewURLParser: true});
    stockCompanyList = await Stock.find({});
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
  
  //console.log(stockCompanyList);
  return stockCompanyList;
}

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

async function updateCryptoInfoDB(toAdd) {
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", { useNewUrlParser: true });

    const currCrypto = new Crypto({
      name: toAdd.name,
      lastUpdate: toAdd.lastUpdate,
      price: toAdd.price,
      marketCap: toAdd.marketCap
    });

    await currCrypto.save();

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

async function getCryptoInfoRequest(date) {
  const coinName = "cronos";
  const cryptoAPI_URL = "https://api.coingecko.com/api/v3/simple/price?ids=" + coinName + "&vs_currencies=usd&include_market_cap=true&include_last_updated_at=false&precision=5";

  return new Promise((resolve, reject) => {
    const req = https.get(cryptoAPI_URL, function(res) {
      let result = {};
      //console.log(res.statusCode);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let data = "";

        res.on("data", function(chunk) {
          data += chunk;
        });

        res.on("end", function() {
          //console.log(data);
          if (data) {
            const cryptoData = JSON.parse(data);
            result = {
              name: coinName,
              lastUpdate: date,
              price: cryptoData[coinName]["usd"],
              marketCap: cryptoData[coinName]["usd_market_cap"]
            };
            //console.log(result);
            resolve(result); // Resolve the promise with the result
          } else {
            result = {};
            console.log("Error | status code : " + res.statusCode);
            resolve(result); // Resolve the promise with the result
          }
        });
      } else {
        result = {};
        console.log("Error | status code : " + res.statusCode);
        resolve(result); // Resolve the promise with the result
      }
    });

    req.on("error", function(error) {
      reject(error); // Reject the promise if an error occurs
    });
  });
}

async function getCryptoInfoDB(date) {
  let cryptoList;
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", {useNewURLParser: true});
    cryptoList = await Crypto.find({});
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
  //console.log(cryptoList);
  return cryptoList;
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

function updateSingleStockInfo(stockSymbol){
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
          const stockLastUpdate = stockData["Meta Data"]["3. Last Refreshed"];
          result = {
            symbol: stockData["Meta Data"]["2. Symbol"],
            lastUpdate: stockLastUpdate,
            openPrice: stockData['Time Series (Daily)'][stockLastUpdate]['1. open'],
            closePrice: stockData['Time Series (Daily)'][stockLastUpdate]['4. close'],
            highPrice: stockData['Time Series (Daily)'][stockLastUpdate]['2. high'],
            lowPrice: stockData['Time Series (Daily)'][stockLastUpdate]['3. low']
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
    getWeatherInfo,
    getWeatherIcon,
    getStockInfoDB,
    getCryptoInfoDB
};
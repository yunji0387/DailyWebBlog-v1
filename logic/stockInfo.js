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
    getStockInfoDB
};
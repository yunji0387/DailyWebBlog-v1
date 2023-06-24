//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

let stockSymbolList = ["tsla", "amzn", "googl", "msft", "aapl"];
let exceededAPIRequestMsg = "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.";

const stockSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  lastUpdate: String,
  date: Date,
  openPrice: String,
  closePrice: String,
  highPrice: String,
  lowPrice: String
});

const Stock = mongoose.model("Stock", stockSchema);

async function getStockInfoDB(currentTime) {
  await updateAllStocksInfoDB();
  let stockCompanyList;
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", { useNewURLParser: true });
    stockCompanyList = await Stock.find({});
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
  return stockCompanyList;
}

async function updateAllStocksInfoDB() {
  let curr = new Date();
  try {
    for (let i = 0; i < stockSymbolList.length; i++) {
      let stockSymbol = stockSymbolList[i];
      let newInfo = await getSingleStockInfoHTTP(stockSymbol, curr);
      await updateSingleStockInfoDB(newInfo);
    }
  } catch (error) {
    console.error("Error in code stockInfo.js function (updateAllStocksInfoDB):", error);
  }
}

async function updateSingleStockInfoDB(toUpdate) {
  try {
    await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", { useNewUrlParser: true });
    if (Object.keys(toUpdate).length > 0) {
      let toUpdateStockName = "-";
      const existingStock = await Stock.findOne({ symbol: toUpdate.symbol }); // Retrieve the existing document

      if (existingStock) {
        // Preserve the stock name from the existing document
        toUpdateStockName = existingStock.name;
      }else{
        console.log("Error, failed to get stock name from the MongoDB. please check documents in mongoDB and code in stockInfo.js function: updateSingleStockInfoDB.");
      }
      const updatedStock = await Stock.findOneAndUpdate(
        { symbol: toUpdate.symbol }, // Filter to find the document to update
        {
          lastUpdate: toUpdate.lastUpdate,
          date: toUpdate.date,
          openPrice: toUpdate.openPrice,
          closePrice: toUpdate.closePrice,
          highPrice: toUpdate.highPrice,
          lowPrice: toUpdate.lowPrice
        }, // Fields and values to update
        { upsert: true, new: true } // Return the modified document instead of the original
      );
      if (updatedStock) {
        console.log("Stock info in MongoDB updated successfully.");
        //console.log("Updated stock info:", updatedStock);
      } else {
        console.log("Error, Stock info in MongoDB failed to update or document not found. please check code in stockInfo.js function: updateSingleStockInfoDB.");
      }
    }
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    await mongoose.connection.close();
  }
}

function getSingleStockInfoHTTP(stockSymbol, updateTime) {
  const stockAPI_URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + stockSymbol + "&apikey=" + process.env.STOCK_API_KEY;

  return new Promise((resolve, reject) => {
    https.get(stockAPI_URL, function (res) {
      let result = {};

      if (res.statusCode >= 200 && res.statusCode < 300) {
        let data = "";

        res.on("data", function (chunk) {
          data += chunk;
        });

        res.on("end", function () {
          const stockData = JSON.parse(data);
          if (stockData["Meta Data"] && stockData["Meta Data"]["3. Last Refreshed"]) {
            const stockLastUpdate = stockData["Meta Data"]["3. Last Refreshed"];
            result = {
              symbol: stockData["Meta Data"]["2. Symbol"],
              lastUpdate: stockLastUpdate,
              date: updateTime,
              openPrice: Number(stockData['Time Series (Daily)'][stockLastUpdate]['1. open']),
              closePrice: Number(stockData['Time Series (Daily)'][stockLastUpdate]['4. close']),
              highPrice: Number(stockData['Time Series (Daily)'][stockLastUpdate]['2. high']),
              lowPrice: Number(stockData['Time Series (Daily)'][stockLastUpdate]['3. low'])
            };
            console.log("Stock information for " + stockSymbol + " successfully requested.");
          } else if (stockData["Note"] && stockData["Note"] === exceededAPIRequestMsg) {
            console.log("Stock information for " + stockSymbol + " failed to requested. Exceeded the API requested limits, stock info will update when the next API request is available.");
          } else {
            console.log("Error, Stock information for " + stockSymbol + " failed to requested. Reason unknown, please check your code in stockInfo.js function : getSingleStockInfoHTTP.");
          }
          resolve(result); // Resolve the promise with the result
        });
      } else {
        result = {};
        console.log("Error, Stock information for " + stockSymbol + " failed to requested. Error status code : " + res.statusCode);
        resolve(result); // Resolve the promise with the result
      }
    }).on("error", function (error) {
      reject(error); // Reject the promise if an error occurs
    });
  });
}

module.exports = {
  getStockInfoDB
};
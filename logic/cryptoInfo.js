//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const cryptoSchema = new mongoose.Schema({
    name: String,
    lastUpdate: String,
    price: Number,
    marketCap: Number
  });
  
const Crypto = mongoose.model("Crypto", cryptoSchema);

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

module.exports = {
    getCryptoInfoDB
};
//jshint esversion:6
const https = require("https");
require("dotenv").config();
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

let cryptoNameList = ["bitcoin", "ethereum", "tether", "dogecoin", "cronos"];

const cryptoSchema = new mongoose.Schema({
    name: String,
    lastUpdate: Date,
    price: Number,
    marketCap: Number
  });
  
const Crypto = mongoose.model("Crypto", cryptoSchema);

async function getCryptoInfoDB(date) {
  await updateAllCryptosInfoDB();
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

async function updateAllCryptosInfoDB(){
  let curr = new Date();
  try {
    for (let i = 0; i < cryptoNameList.length; i++) {
      let cryptoName = cryptoNameList[i];
      let newInfo = await getSingleCryptoInfoHTTP(cryptoName, curr);
      await updateSingleCryptoInfoDB(newInfo);
    }
  } catch (error) {
    console.error("Error in code cryptoInfo.js function (updateAllCryptosInfoDB):", error);
  }
}

async function updateSingleCryptoInfoDB(toUpdate) {
    try {
      await mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PS + "@cluster0.6gezmfg.mongodb.net/dailyWebDB", { useNewUrlParser: true });
      if (Object.keys(toUpdate).length > 0) {
        // let toUpdateCryptoSymbol = "-";
        // const existingCrypto = await Crypto.findOne({ name: toUpdate.name }); // Retrieve the existing document
  
        // if (existingCrypto) {
        //   // Preserve the crypto symbol from the existing document
        //   toUpdateCryptoSymbol = existingCrypto.symbol;
        // }else{
        //   console.log("Error, failed to get crypto symbol from the MongoDB. please check documents in mongoDB and code in cryptoInfo.js function: updateSingleCryptoInfoDB.");
        // }
        const updatedCrypto = await Crypto.findOneAndUpdate(
          { name: toUpdate.name }, // Filter to find the document to update
          {
            // symbol: toUpdateCryptoSymbol,
            lastUpdate: toUpdate.lastUpdate,
            price: toUpdate.price,
            marketCap: toUpdate.marketCap
          }, // Fields and values to update
          { upsert: true, new: true } // Return the modified document instead of the original
        );
        if (updatedCrypto) {
          console.log("Crypto info in MongoDB updated successfully.");
          //console.log("Updated stock info:", updatedStock);
        } else {
          console.log("Error, Crypto info in MongoDB failed to update or document not found. please check code in cryptoInfo.js function: updateSingleCryptoInfoDB.");
        }
      }
      await mongoose.connection.close();
    } catch (error) {
      console.error(error);
      await mongoose.connection.close();
    }
  }
  
  async function getSingleCryptoInfoHTTP(cryptoName, date) {
    const coinName = cryptoName;
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
              console.log("Crypto information for " + cryptoName + " successfully requested.");
              resolve(result); // Resolve the promise with the result
            } else {
              result = {};
              console.log("Error, Crypto information for " + cryptoName + " failed to requested. Reason unknown, please check your code in cryptoInfo.js function : getSingleCryptoInfoHTTP.");
              resolve(result); // Resolve the promise with the result
            }
          });
        } else {
          result = {};
          console.log("Error, Crypto information for " + cryptoName + " failed to requested. Error status code : " + res.statusCode);
          resolve(result); // Resolve the promise with the result
        }
      });
  
      req.on("error", function(error) {
        reject(error); // Reject the promise if an error occurs
      });
    });
  }

module.exports = {
    getCryptoInfoDB
};
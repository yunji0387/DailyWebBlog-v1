//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/logic/date.js");
const weatherInfo = require(__dirname + "/logic/weatherInfo.js");
const stockInfo = require(__dirname + "/logic/stockInfo.js");
const cryptoInfo = require(__dirname + "/logic/cryptoInfo.js");
const tool = require(__dirname + "/logic/tool.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const webPages = ["home", "about", "news", "comingsoon", "contact"];

app.get("/", async function (req, res) {
    res.redirect("/home");
});

// app.get("/home", async function(req, res){
//     const currentTime = date.getCurrentTime();
//     const currentTimeConverted = date.convertDate(currentTime);

//     let currWeather;    
//     //get weather info
//     try {
//         currWeather = await weatherInfo.getWeatherInfoDB(currentTime);
//     } catch (error) {
//       console.error(error);
//       currWeather = null;
//     }

    // let currStock;
    // //get stock info
    // try {
    //     currStock = await stockInfo.getStockInfoDB(currentTime);
    // } catch (error) {
    //   console.error(error);
    //   currStock = null;
    // }

//     let currCrypto;
//     //get crypto info
//     try {
//         currCrypto = await cryptoInfo.getCryptoInfoDB(currentTime);
//     } catch (error) {
//       console.error(error);
//       currCrypto = null;
//     }
//     res.render("home", { 
//         currentTime: currentTimeConverted, 
//         currWeatherInfo: currWeather,
//         currStockInfo: currStock,
//         currCryptoInfo: currCrypto,
//         convertLargeNumber: tool.convertLargeNumber, // Include the convertLargeNumber function
//         convertDate: date.convertDate
//     });
// });

app.get("/home", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    
    //let currWeather = null;    
    //let currStock = null;
    //let currCrypto = null;
    
    res.render("home", {
        currentTime: currentConvertTime,
        //currWeatherInfo: currWeather,
        //currStockInfo: currStock,
        //currCryptoInfo: currCrypto,
        convertLargeNumber: tool.convertLargeNumber, // Include the convertLargeNumber function
        convertDate: date.convertDate
    });
});

// Add routes to handle data fetching
app.get("/stockData", async function (req, res) {
    try {
        const currentTime = new Date();
        const stockData = await stockInfo.getStockInfoDB(currentTime);
        res.json(stockData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stock data." });
    }
});

app.get("/cryptoData", async function (req, res) {
    try {
        const currentTime = new Date();
        const cryptoData = await cryptoInfo.getCryptoInfoDB(currentTime);
        res.json(cryptoData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch crypto data." });
    }
});

app.get("/weatherData", async function (req, res) {
    try {
        const currentTime = new Date();
        const weatherData = await weatherInfo.getWeatherInfoDB(currentTime);
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});

app.get("/news", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/gallery", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("gallery", { currentTime: currentConvertTime });
});

app.get("/contact", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/about", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/test", async function (req, res) {
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("test", { currentTime: currentConvertTime });
});

app.post("/", function (req, res) {

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});
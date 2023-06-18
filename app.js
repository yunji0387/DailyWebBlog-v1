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
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const webPages = ["home", "about", "news", "comingsoon", "contact"];

app.get("/", async function(req, res) {
    res.redirect("/home");
});

app.get("/home", async function(req, res){
    const currentTime = date.getCurrentTime();
    const currentTimeConverted = date.convertDate(currentTime);
    
    let currWeather;    
    //get weather info
    try {
        currWeather = await weatherInfo.getWeatherInfoDB(currentTime);
    } catch (error) {
      console.error(error);
      currWeather = "Error fetching Weather info";
    }

    let currStock;
    //get stock info
    try {
        currStock = await stockInfo.getStockInfoDB(currentTime);
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Stock info";
    }

    let currCrypto;
    //get crypto info
    try {
        currCrypto = await cryptoInfo.getCryptoInfoDB(currentTime);
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Crypto info";
    }
    res.render("home", { 
        currentTime: currentTimeConverted, 
        currWeatherInfo: currWeather,
        currStockInfo: currStock,
        currCryptoInfo: currCrypto,
        convertLargeNumber: tool.convertLargeNumber, // Include the convertLargeNumber function
        convertDate: date.convertDate
    });
});

app.get("/news", async function(req, res){
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/gallery", async function(req, res){
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("gallery", { currentTime: currentConvertTime });
});

app.get("/contact", async function(req, res){
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/about", async function(req, res){
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("comingsoon", { currentTime: currentConvertTime });
});

app.get("/test", async function(req, res){
    const currentConvertTime = date.convertDate(date.getCurrentTime());
    res.render("test", { currentTime: currentConvertTime });
});

app.post("/", function(req, res){

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});
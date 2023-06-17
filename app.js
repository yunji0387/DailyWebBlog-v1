//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/logic/date.js");
const api = require(__dirname + "/logic/api.js");
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
    let currWeatherTemp, currWeatherCity, currWeatherDesc, currWeatherIcon;
    
    //get weather api
    try {
        currWeather = await api.getWeatherInfo();
        currWeatherTemp = currWeather.temp;
        currWeatherCity = currWeather.name;
        currWeatherDesc = currWeather.description;
        try {
            currWeatherIcon = await api.getWeatherIcon(currWeather.icon);
        }catch(error) {
            console.error(error);
            currWeatherIcon = "Error fetching weather icon";
        }
    } catch (error) {
      console.error(error);
      currWeather = "Error fetching Weather info";
    }

    let currStock;
    //get stock api
    try {
        currStock = await api.getStockInfoDB(currentTime);
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Stock info";
    }

    let currCrypto;
    //get crypto api
    try {
        currCrypto = await api.getCryptoInfoDB(currentTime);
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Crypto info";
    }

    res.render("home", { 
        currentTime: currentTimeConverted, 
        currentTemp: currWeather.temp, 
        currentWeather: currWeather.description, 
        currentCity: currWeather.name, 
        currentWeatherIcon: currWeatherIcon,
        currStockInfo: currStock,
        currCryptoInfo: currCrypto,
        convertLargeNumber: tool.convertLargeNumber // Include the convertLargeNumber function
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
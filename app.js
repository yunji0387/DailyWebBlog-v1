//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const date = require(__dirname + "/logic/date.js");
const api = require(__dirname + "/logic/api.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const webPages = ["home", "about", "news", "comingsoon", "contact"];

app.get("/", async function(req, res) {
    res.redirect("/home");
});

app.get("/home", async function(req, res){
    const currentTime = date.getFullDate();
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
        currStock = await api.getStockInfo(date.getFullDate_DB());
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Stock info";
    }

    let currCrypto;
    //get crypto api
    try {
        currCrypto = await api.getCryptoInfoDB(date.getFullDate_DB());
    } catch (error) {
      console.error(error);
      currStock = "Error fetching Crypto info";
    }

    res.render("home", { 
        currentTime: currentTime, 
        currentTemp: currWeather.temp, 
        currentWeather: currWeather.description, 
        currentCity: currWeather.name, 
        currentWeatherIcon: currWeatherIcon,
        currStockInfo: currStock,
        currCryptoInfo: currCrypto
    });
});

app.get("/news", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

app.get("/gallery", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("gallery", { currentTime: currentTime });
});

app.get("/contact", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

app.get("/about", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

app.post("/", function(req, res){

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});
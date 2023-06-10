//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/logic/date.js");
const api = require(__dirname + "/logic/api.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/dailyWebDB", { useNewUrlParser: true });

app.get("/", async function(req, res) {
    const currentTime = date.getFullDate();
    let currWeather, currStockInfo, currCryptoInfo;
    let currWeatherTemp, currWeatherCity, currWeatherDesc, currWeatherIcon;
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
        console.log(currWeatherIcon);
    } catch (error) {
      console.error(error);
      currWeather = "Error fetching weather";
    }
    res.render("home", { currentTime: currentTime, currentTemp: currWeather.temp, currentWeather: currWeather.description, currentCity: currWeather.name, currentWeatherIcon: currWeatherIcon });
  });

app.post("/", function(req, res){

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
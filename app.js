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

// app.get("/", function(req, res){
//     const currentTime = date.getFullDate(); 
//     const currWeather = api.getWeatherInfo()
//     .then(result => {
//         //console.log(result); // Log the result after it's resolved
//         return result;
//     })
//     .catch(error => {
//         console.error(error); // Handle any error that occurs
//     });
//     console.log(currWeather);
//     res.render("home", { currentTime: currentTime , currentWeather: currWeather});
// });

app.get("/", async function(req, res) {
    const currentTime = date.getFullDate();
    let currWeather, currStockInfo, currCryptoInfo;
    try {
        currWeather = await api.getWeatherInfo();
        console.log(currWeather);
    } catch (error) {
      console.error(error);
      currWeather = "Error fetching weather";
    }
    res.render("home", { currentTime: currentTime, currentTemp: currWeather.temp, currentWeather: currWeather.description, currentCity: currWeather.name });
  });

app.post("/", function(req, res){

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
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

const webPages = ["home", "about", "news", "comingsoon", "contact"];
const stockCompanyList = [
    {name: "Tesla", symbol: "TSLA", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
    {name: "Apple", symbol: "AAPL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
    {name: "Microsoft", symbol: "MSFT", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
    {name: "Amazon", symbol: "AMZN", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"},
    {name: "Google", symbol: "GOOGL", lastUpdate: "-", openPrice: "-", closePrice:"-", highPrice: "-", lowPrice: "-"}
];

mongoose.connect("mongodb://localhost:27017/dailyWebDB", { useNewUrlParser: true });

app.get("/", async function(req, res) {
    res.redirect("/home");
});

// app.get("/home", async function(req, res){
//     const currentTime = date.getFullDate();
//     let currWeather;
//     let currWeatherTemp, currWeatherCity, currWeatherDesc, currWeatherIcon;
    
//     //get weather api
//     try {
//         currWeather = await api.getWeatherInfo();
//         currWeatherTemp = currWeather.temp;
//         currWeatherCity = currWeather.name;
//         currWeatherDesc = currWeather.description;
//         try {
//             currWeatherIcon = await api.getWeatherIcon(currWeather.icon);
//         }catch(error) {
//             console.error(error);
//             currWeatherIcon = "Error fetching weather icon";
//         }
//     } catch (error) {
//       console.error(error);
//       currWeather = "Error fetching weather";
//     }

//     let currStock;
//     let currStockSymbol, currStockLastUpdate, currStockOpenPrice, currStockClosePrice, currStockHighPrice, currStockLowPrice;

//     //get stock api
//     try {
//         currStock = await api.getStockInfo('TSLA');
//         currStockSymbol = currStock.symbol;
//         currStockLastUpdate = currStock.lastUpdate;
//         currStockOpenPrice = currStock.openPrice;
//         currStockClosePrice = currStock.closePrice;
//         currStockHighPrice = currStock.highPrice;
//         currStockLowPrice = currStock.lowPrice;

//     } catch (error) {
//       console.error(error);
//       currStock = "Error fetching weather";
//     }

//     res.render("home", { 
//         currentTime: currentTime, 
//         currentTemp: currWeather.temp, 
//         currentWeather: currWeather.description, 
//         currentCity: currWeather.name, 
//         currentWeatherIcon: currWeatherIcon,
//         stockSymbol: currStockSymbol,
//         stockLastUpdate: currStockLastUpdate,
//         stockOpenPrice: currStockOpenPrice,
//         stockClosePrice: currStockClosePrice,
//         stockHighPrice: currStockHighPrice,
//         stockLowPrice:  currStockLowPrice
//     });
// });

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
      currWeather = "Error fetching weather";
    }

    let currStock;
    let currStockSymbol, currStockLastUpdate, currStockOpenPrice, currStockClosePrice, currStockHighPrice, currStockLowPrice;

    //get stock api
    try {
        currStock = await api.getStockInfo('TSLA');
        currStockSymbol = currStock.symbol;
        currStockLastUpdate = currStock.lastUpdate;
        currStockOpenPrice = currStock.openPrice;
        currStockClosePrice = currStock.closePrice;
        currStockHighPrice = currStock.highPrice;
        currStockLowPrice = currStock.lowPrice;

    } catch (error) {
      console.error(error);
      currStock = "Error fetching weather";
    }

    res.render("home", { 
        currentTime: currentTime, 
        currentTemp: currWeather.temp, 
        currentWeather: currWeather.description, 
        currentCity: currWeather.name, 
        currentWeatherIcon: currWeatherIcon,
    });
});

app.get("/news", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

app.get("/contact", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

app.get("/about", async function(req, res){
    const currentTime = date.getFullDate();
    res.render("comingsoon", { currentTime: currentTime });
});

// app.get("/:customName", function(req, res){
//     if(webPages.includes(req.params.customName)){
//         res.render(req.params.customName);
//     }else{
//         console.log("Invalid URL path!!! : " + req.params.customName);
//     }
// });

app.post("/", function(req, res){

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
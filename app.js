//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const https = require("https");
const date = require(__dirname + "/logic/date.js");

const app = express();

let currentTime = date.getFullDate(); 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/dailyWebDB", { useNewUrlParser: true });

const weatherInfoSchema = new mongoose.Schema({
    name: String,
    temp: Number,
    description: String
});

const weatherKeySchema = new mongoose.Schema({
    key: String
});

const WeatherKey = mongoose.model("WeatherKey", weatherKeySchema, 'weatherkeys');

app.get("/", function(req, res){
    let currentKey = "";
    WeatherKey.find({key: 1})
    .then(function(foundKey){
        if(foundKey){
            currentKey = foundKey[0].key.toString();
            console.log(foundKey);
        }else{
            currentKey = "No!!!";
        }
        // Render the EJS template inside the promise's then block
        res.render("home", { currentTime: currentTime, currKey: currentKey });
    })
    .catch(function(err){
        console.log(err);
    });
});

app.post("/", function(req, res){

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
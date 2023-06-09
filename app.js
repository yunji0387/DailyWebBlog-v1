//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("", {useNewURLParser: true});

app.get("/", function(req, res){
    res.render("home");
});

app.post("/", function(req, res){

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
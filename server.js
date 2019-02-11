"use strict"
const   express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose");

//import all local packages*********************************
const   route = require("./routes/route"),
        configs = require("./config/config");

let app = express(),
    DBlocation = configs.development;

mongoose.connect(DBlocation.dbLocation);
mongoose.connection.on("connected", () => console.log("Server connected to mongoDB"));

/* var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(8080); */

app .set("port", process.env.PORT || 2020)
    .use(express.static(`${__dirname}/paystack/insight`))
    .use(bodyParser.urlencoded({extended: true}));

route(express, app);

app.listen(app.get("port"), ()=>console.log(`Server listening on IP: 127.0.0.1 \+ PORT: ${app.get("port")}`));
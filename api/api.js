var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var queries = require("./queries.js")
const config = require('./config');
app.get('/',queries.getUsers);
app.post('/insert',queries.insertUser);
var server = app.listen(config.api.port,()=>{
    console.log("Run");
})
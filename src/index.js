const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const connection = require("./Sdb_connection/db");
const app = express();
require('dotenv').config();
const multer= require("multer");


app.use(bodyParser.json());
app.use( multer().any())
app.use(bodyParser.urlencoded({ extended: true }));


// database connection
connection();


app.use('/', route);

// app.use((req, res) =>{
//    res.status(400).send({ status: false, message: 'invalid URL' })
// })



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
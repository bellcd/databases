var express = require('express');
// var db = require('./db');

// // ORM refactor
// var db = require('../orm-refactor/db/index.js'); // not needed??


// Middleware
var morgan = require('morgan');
var parser = require('body-parser');
var cors = require('cors');

// Router
var router = require('./routes.js');

var app = express();

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(cors());
app.use(morgan('dev'));
app.use(parser.json());


// Set up our routes
app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

// db.dbConnection.connect(); // not needed because using ORM ??

module.exports.app = app;
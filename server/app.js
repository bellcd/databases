var express = require('express');
<<<<<<< HEAD
// var db = require('./db');

// // ORM refactor
// var db = require('../orm-refactor/db/index.js'); // not needed??

=======
var db = require('./db');
var Sequelize = require('sequelize');
>>>>>>> solution

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

<<<<<<< HEAD
=======
// Enables CORS
app.use(cors());
>>>>>>> solution

// Set up our routes
app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

<<<<<<< HEAD
// db.dbConnection.connect(); // not needed because using ORM ??

module.exports.app = app;
=======
>>>>>>> solution

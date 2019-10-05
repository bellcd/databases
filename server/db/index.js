var mysql = require('mysql');
var Sequelize = require('sequelize');
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".
// module.exports.dbConnection = mysql.createConnection({
//   user: 'root',
//   database: 'chat'
// });

var db = new Sequelize('chat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports.dbConnection = db;


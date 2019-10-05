var Sequelize = require('sequelize');
var db = require('./index.js');


module.exports.users = db.define('users', {
  username: Sequelize.STRING
});

module.exports.messages = db.define('messages', {
//   userid: Sequelize.INTEGER,
  text: Sequelize.STRING,
  sample: Sequelize.STRING
//   roomname: Sequelize.STRING
});

module.exports.rooms = db.define('rooms', {
    roomname: Sequelize.STRING
  });

module.exports.users.hasMany(module.exports.messages);
var Sequelize = require('sequelize');


var connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'chat'
});

connection.connect();

module.exports = connection;

var dbConnection = createConnection();

var users = dbConnection.define('users', {
  username: Sequelize.STRING
});

var messages = dbConnection.define('messages', {
  text: Sequelize.STRING,
  sample: Sequelize.STRING
});

var rooms = dbConnection.define('rooms', {
  roomname: Sequelize.STRING
});

users.hasMany(messages);
messages.belongsTo(users);

dbConnection.sync();

module.exports = {
  createConnection,
  dbConnection,
  users,
  rooms,
  messages
}
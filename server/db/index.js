var Sequelize = require('sequelize');

var createConnection = () => {
  return new Sequelize('chat', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false
    }
  });
}

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
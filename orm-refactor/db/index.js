var Sequelize = require('sequelize');

var db = new Sequelize('chat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

var User = db.define('user', {
  username: Sequelize.STRING,
});

var Room = db.define('room', {
  roomname: Sequelize.STRING
});

var Message = db.define('message', {
  text: Sequelize.STRING
});

User.hasMany(Message, { foreignKey: 'id_users', constraints: false } );
Room.hasMany(Message, { foreignKey: 'id_rooms', constraints: false });

User.sync(); // why does this not work when { force: true } is passed to each one ??
Room.sync();
Message.sync();

// db.sync(); // could alternatively call sync() on the connection as a whole, instead of individually on each model ...

module.exports = {
  db,
  User,
  Room,
  Message
};
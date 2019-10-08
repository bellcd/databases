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

User.hasMany(Message, { foreignKey: 'id_users'} );
Room.hasMany(Message, { foreignKey: 'id_rooms'} );

User.sync({ force: true});
Room.sync({ force: true });
Message.sync({ force: true });
var Sequelize = require('sequelize');
<<<<<<< HEAD

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
=======
var db = new Sequelize('chat', 'root', '', {
  dialect: 'mysql'
});

// we define the models we need using js--we don't need a schema file!
var User = db.define('User', {
  username: Sequelize.STRING
});

var Message = db.define('Message', {
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});

// puts a UserId column on each Message instance
// also gives us the `.setUser` method available
// after creating a new instance of Message
Message.belongsTo(User);
// enables bi-directional associations between Users and Messages
User.hasMany(Message);


User.sync();
Message.sync();
// creates these tables in MySQL if they don't already exist. Pass in {force: true}
// to drop any existing user and message tables and make new ones.

exports.User = User;
exports.Message = Message;
>>>>>>> solution

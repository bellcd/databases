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

// var Message = db.define('message', {
//   text: Sequelize.STRING
// });

class Message extends Sequelize.Model {}
Message.init({
  text: {
    type: Sequelize.STRING
  }
}, {
  sequelize: db,
  modelName: 'message' // setting up this Model using the alternate syntax so I can create this { modelName: 'message' }. Apparently that will provide access to a function that will allow me to remove the foreign keys from the tables ... is this accurate??
});

// Invoice.belongsTo(Subscription, { as: 'TheSubscription', foreignKey: 'subscription_id' })
// Subscription.hasMany(Invoice, { foreignKey: 'subscription_id' })

Message.belongsTo(User, { as: 'test_value', foreignKey: 'id_users'} );
User.hasMany(Message, { foreignKey: 'id_users'} ); // do I need this ??

Room.hasMany(Message, { foreignKey: 'id_rooms'} );

User.sync(); // why does this not work when { force: true } is passed to each one ??
Room.sync();
Message.sync();

module.exports = {
  db,
  User,
  Room,
  Message
};
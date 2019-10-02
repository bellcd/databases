var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      // a function which produces all the messages
      return db.dbConnection.query('SELECT text FROM messages', done);
    },
    post: function (message) {
      // a function which can be used to insert a message into the database
      var userN = db.dbConnection.query('SELECT id FROM users WHERE users.username = message.username', done);
      var roomN = db.dbConnection.query('SELECT id FROM rooms WHERE rooms.roomname = message.roomname', done);
      db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES (message.text, ${userN}, ${roomN})`, done);
    }
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

//PICK UP HERE: SET PRIMARY KEY FOR MESSAGE, FIND OUT DATA FORMAT FOR QUERY OF 'SELECT'

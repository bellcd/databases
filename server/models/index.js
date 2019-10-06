var db = require('../db/index.js');

module.exports = {
  messages: {
    get: function (callback) {
      db.messages.findAll({attributes: ['text']})
        .then(messages => {
          callback(null, messages);
        })
        .catch(err => {
          callback(err, null);
        })
    },
    post: function (message, callback) {
      var userN;
      var roomN;
      db.dbConnection.query(`INSERT INTO users (username) VALUES ('${message.username}')`, (err, results, fields) => {
        if (err) { throw err; }
        db.dbConnection.query(`SELECT id FROM users WHERE users.username = '${message.username}'`, (err, results, fields) => {
          if (err) { throw err; }
          userN = results[0].id;
          db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${message.roomname}')`, (err, results, fields) => {
            if (err) { throw err; }
            db.dbConnection.query(`SELECT id FROM rooms WHERE rooms.roomname = '${message.roomname}'`, (err, results, fields) => {
              if (err) { throw err; }
              roomN = results[0].id;
              // a function which can be used to insert a message into the database
              var placeholder = [userN, roomN];
              db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES ("${message.text}", ?, ?)`, placeholder, (err, results, fields) => { // using double quotes around the message seems really fragile here ...
                if (err) { throw err; }
                callback();
              });
            });
          });
        });
      });
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.user.findAll({attributes: ['username']})
        .then(users => {
          callback(null, users);
        })
        .catch(err => {
          callback(err, null);
        });
    },

    post: function (user, callback) {
      db.users.create({username: user.username});
    }
  },

  rooms: {
    // Ditto as above.
    get: function () {
      db.dbConnection.query(`SELECT roomname FROM rooms`, (err, results) => {
        if (err) { throw err; }
        callback(results);
      });
    },

    post: function (room, callback) {
      db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${room.roomname}')`, (err, results, fields) => {
        if (err) { throw err; }
        callback();
      });

      db.dbConnection.query(`SELECT * FROM rooms`, (err, results, fields) => {
        if (err) { throw err; }
      });
    }
  }
};
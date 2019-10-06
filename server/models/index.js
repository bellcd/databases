var db = require('../db/index.js');

module.exports = {

  messages: {
    get: function (callback) {
      // fetch all messages
      // text, username, roomname, id
      var queryStr = 'select messages.id, messages.text, messages.roomname, users.username \
                      from messages left outer join users on (messages.userid = users.id) \
                      order by messages.id desc';
      db.query(queryStr, function(err, results) {
        callback(err, results);
      });
    },
    post: function (params, callback) {
      // create a message for a user id based on the given username
      var queryStr = 'insert into messages(text, userid, roomname) \
                      value (?, (select id from users where username = ? limit 1), ?)';
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  },
  users: {
    get: function (callback) {
      // fetch all users
      var queryStr = 'select * from users';
      db.query(queryStr, function(err, results) {
        callback(err, results);
      });
    },
    post: function (params, callback) {
      // create a user
      var queryStr = 'insert into users(username) values (?)';
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  }
  };

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
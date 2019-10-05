var db = require('../db');
// var Promise = require('bluebird');
// Promise.promisifyAll(db.dbConnection);
// console.log(queryAsync);

module.exports = {
  messages: {
    get: function (callback) {
      // a function which produces all the messages
      db.dbConnection.query(`SELECT messages.text, rooms.roomname, users.username
      FROM messages
      INNER JOIN users ON messages.id_users = users.id
      INNER JOIN rooms ON messages.id_rooms = rooms.id`,
      (err, results) => {
        if (err) { throw err; }
        callback(null, results);
      });
    },
    post: function (message, callback) {


      // // check if username exists,
      // db.dbConnection.queryAsync(`SELECT id FROM users WHERE users.username = '${message.username}'`)
      // .then((results) => {
      //   console.log('queryAsync', results);
      //   if (!results.length) {
      //     module.exports.users.post(message.username, () => {
      //       // check if roomname exists,
      //         // NO, add it
      //     });
      //   }
      // })
      // .catch((err) => {
      //   throw err;
      // })

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
    get: function () {
      db.dbConnection.query(`SELECT username FROM users`, (err, results) => {
        if (err) { throw err; }
        callback(results);
      });
    },

    post: function (user, callback) {
      db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err, results, fields) => {
        if (err) { throw err; }
        callback();
      });

      db.dbConnection.query(`SELECT * FROM users`, (err, results, fields) => {
        if (err) { throw err; }
      });
    }
  }
};
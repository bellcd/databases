var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      db.dbConnection.query('SELECT text FROM messages', (err, messages) => {
        if (err) { callback(err, null); }
        callback(null, messages);
      });
    },
    post: function (message, callback) {
      // console.log('inside models.messages.post, message.roomname: ', message.roomname);
      let text = message.text;

      // getting the relevant ID from the users table for a particular username
      db.dbConnection.query(`SELECT id FROM users WHERE users.username = '${message.username}'`, (err, results) => {
        if (err) { throw err; }
        let userID = results[0].id;

        // adds a roomname record for this room
        // should we have logic that checks if the room exists already before adding it??
        db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${message.roomname}')`, (err, results, fields) => {
          if (err) { throw err; }
          // console.log('room insert results: ', results);

          // get the ID from the rooms table for a given room (this assumes there are values in the rooms table already)
          db.dbConnection.query(`SELECT id FROM rooms WHERE rooms.roomname = '${message.roomname}'`, (err, results, fields) => {
            if (err) { throw err; }
            // console.log('room select results: ', results);
            let roomnameID = results[0].id;

            let placeholders = [userID, roomnameID];
            // insert the message text and room / user IDs into the message table
            db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES ("${text}", ?, ?)`, placeholders, (err, results, fields) => {
              // console.log('userID: ', userID);
              if (err) { throw err; }
              // console.log('insert results: ', results);
              callback();
            });
          });
        });
      });
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.dbConnection.query('SELECT username FROM users', (err, results) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    },
    post: function (user, callback) {
      db.dbConnection.query(`SELECT username FROM users WHERE username = '${user.username}'`, (err, results) => {
        if (err) {
          callback(err, null);
        } else if (results.length === 1) {
          // that username already exists in the user table
          callback(new Error('Username unavailable. Please choose another.'), null);
        } else {
          db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err) => {
            if (err) { callback(err, null); }
            callback();
          });
        }
      });
    }
  },

  rooms: {
    // Ditto as above.
    get: function (callback) {
      db.dbConnection.query('SELECT roomname FROM rooms', (err, results) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      });
    },
    post: function (room, callback) {
      db.dbConnection.query(`SELECT roomname FROM rooms WHERE roomname = '${room.roomname}'`, (err, results) => {
        if (err) {
          callback(err, null);
        } else if (results.length === 1) {
          // that roomname already exists in the room table
          callback(new Error('Room already exists!'), null);
        } else {
          db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${room.roomname}')`, (err) => {
            if (err) { callback(err, null); }
            callback();
          });
        }
      });
    }
  }
};

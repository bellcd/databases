var db = require('../db');
var Promise = require('bluebird');

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

      // promises ?? for getting user_id & roomname_id ?? ... this seems a little WET ...
      const userID = db.dbConnection.queryAsync(`SELECT id FROM users WHERE users.username = ?`, [message.username])
        .then((users) => {
          // if the user table doesn't have a record for that username, create one
          if (users.length === 0) {
            // promise to add the user to the DB
            return module.exports.users.postAsync(message)
              .then((data) => {
                // promise to get that just added user's id
                return db.dbConnection.queryAsync(`SELECT id FROM users WHERE users.username = ?`, [message.username]);
              })
              .then((id) => {
                return id[0].id;
              })
              .catch((err) => err);
          } else {
            return users[0].id;
          }
        })
        .catch((err) => callback(err, null));

      const roomID = db.dbConnection.queryAsync(`SELECT id FROM rooms WHERE rooms.roomname = ?`, [message.roomname])
        .then((rooms) => {
          // if the room table doesn't have a record for that roomname, create one
          if (rooms.length === 0) {
            // promise to add the room to the DB
            return module.exports.rooms.postAsync(message)
              .then((data) => {
                // promise to get that just added room's id
                return db.dbConnection.queryAsync(`SELECT id FROM rooms WHERE rooms.roomname = ?`, [message.roomname]);
              })
              .then((id) => {
                return id[0].id;
              })
              .catch((err) => err);
          } else {
            return rooms[0].id;
          }
        })
        .catch((err) => callback(err, null));

      Promise.all([userID, roomID])
        .then((results) => {
          console.log(`results from promise.all: `, results);
          callback(); // TODO: move this!
        });



      // gets the relevant ID from the users table for a particular username
      // db.dbConnection.query(`SELECT id FROM users WHERE users.username = '${message.username}'`, (err, results) => {
      //   if (err) { throw err; }
      //   // adds a roomname record for this room
      //   // should we have logic that checks if the room exists already before adding it??
      //   db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${message.roomname}')`, (err, results, fields) => {
      //     if (err) { throw err; }
      //     // console.log('room insert results: ', results);

      //     // get the ID from the rooms table for a given room (this assumes there are values in the rooms table already)
      //     db.dbConnection.query(`SELECT id FROM rooms WHERE rooms.roomname = '${message.roomname}'`, (err, results, fields) => {
      //       if (err) { throw err; }
      //       // console.log('room select results: ', results);
      //       let roomnameID = results[0].id;

      //       let placeholders = [userID, roomnameID];
      //       // insert the message text and room / user IDs into the message table
      //       db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES ("${text}", ?, ?)`, placeholders, (err, results, fields) => {
      //         // console.log('userID: ', userID);
      //         if (err) { throw err; }
      //         // console.log('insert results: ', results);
      //         callback();
      //       });
      //     });
      //   });
      // });
    }
  },

  users: {
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
          console.log('1');
          callback(err, null);
        } else if (results.length === 1) {
          console.log('2');
          // that username already exists in the user table
          callback(new Error('Username unavailable. Please choose another.'), null);
        } else {
          console.log('3');
          // console.log('user.username: ', user.username);
          db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err, results) => {
            if (err) {
              callback(err, null);
            } else {
              // console.log('here');
              callback();
              // callback(results, err)  // TODO: why does the promisified version of this function not work with this setup?? ie, it doesn't invoke the next .then() call on the promise returned by this promisified function ...
            }
          });
        }
      });
    }
  },

  rooms: {
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
      // console.log('room.roomname: ', room.roomname);
      db.dbConnection.query(`SELECT roomname FROM rooms WHERE roomname = '${room.roomname}'`, (err, results) => {
        if (err) {
          callback(err, null);
        } else if (results.length === 1) {
          // that roomname already exists in the room table
          callback(new Error('Room already exists!'), null);
        } else {
          db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${room.roomname}')`, (err, results) => {
            if (err) { callback(err, null); }
            callback();
          });
        }
      });
    }
  }
};

Promise.promisifyAll(db.dbConnection);
Promise.promisifyAll(module.exports.messages);
Promise.promisifyAll(module.exports.users);
Promise.promisifyAll(module.exports.rooms);
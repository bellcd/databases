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
    post: function(user) {
      console.log('inside models users.post user: ', user);
      return db.User.sync()
        .then(() => {
          return db.User.create({ username: user.username })
        })
        .then((results) => {
          console.log('results: ', results);
        })
        .catch((err) => {
          return err;
        });
    },
    // post: function (user, callback) {
    //   db.dbConnection.query(`SELECT username FROM users WHERE username = '${user.username}'`, (err, results) => {
    //     if (err) {
    //       // console.log('1');
    //       callback(err, null);
    //     } else if (results.length === 1) {
    //       // console.log('2');
    //       // that username already exists in the user table
    //       callback(new Error('Username unavailable. Please choose another.'), null);
    //     } else {
    //       // console.log('3');
    //       db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err, results) => {
    //         if (err) {
    //           callback(err, null);
    //         } else {
    //           callback();
    //           // callback(results, err)  // TODO: why does the promisified version of this function not work with this setup?? ie, it doesn't invoke the next .then() call on the promise returned by this promisified function ...
    //         }
    //       });
    //     }
    //   });
    // }
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

// // not sure I'm going to use these with Sequelize ...
// Promise.promisifyAll(db.dbConnection);
// Promise.promisifyAll(module.exports.messages);
// Promise.promisifyAll(module.exports.users);
// Promise.promisifyAll(module.exports.rooms);

// // *********************************************************
// // *********************NON-ORM VERSION*********************
// // *********************************************************
// // TODO: there's probably a better way to handle using / not using an ORM ...
// var db = require('../db');
// var Promise = require('bluebird');

// module.exports = {
//   messages: {
//     get: function (callback) {
//       var queryString = "select messages.text, users.username, rooms.roomname from messages inner join users on messages.id_users = users.id inner join rooms on messages.id_rooms = rooms.id;";
//       db.dbConnection.query(queryString, (err, messages) => {
//         if (err) { callback(err, null); }
//         callback(null, messages);
//       });
//     },
//     post: function (message, callback) {
//       // console.log('inside models.messages.post, message.roomname: ', message.roomname);
//       let text = message.text;

//       // promises for getting user_id & roomname_id
//       // TODO: refactor so this is let wet ...
//       const userID = db.dbConnection.queryAsync(`SELECT id FROM users WHERE users.username = ?`, [message.username])
//         .then((users) => {
//           // if the user table doesn't have a record for that username, create one
//           if (users.length === 0) {
//             // promise to add the user to the DB
//             return module.exports.users.postAsync(message)
//               .then((data) => {
//                 // promise to get that just added user's id
//                 return db.dbConnection.queryAsync(`SELECT id FROM users WHERE users.username = ?`, [message.username]);
//               })
//               .then((id) => {
//                 return id[0].id;
//               })
//               .catch((err) => err);
//           } else {
//             return users[0].id;
//           }
//         })
//         .catch((err) => callback(err, null));

//       const roomID = db.dbConnection.queryAsync(`SELECT id FROM rooms WHERE rooms.roomname = ?`, [message.roomname])
//         .then((rooms) => {
//           // if the room table doesn't have a record for that roomname, create one
//           if (rooms.length === 0) {
//             // promise to add the room to the DB
//             return module.exports.rooms.postAsync(message)
//               .then((data) => {
//                 // promise to get that just added room's id
//                 return db.dbConnection.queryAsync(`SELECT id FROM rooms WHERE rooms.roomname = ?`, [message.roomname]);
//               })
//               .then((id) => {
//                 return id[0].id;
//               })
//               .catch((err) => err);
//           } else {
//             return rooms[0].id;
//           }
//         })
//         .catch((err) => callback(err, null));

//       Promise.all([userID, roomID])
//         .then((placeholder) => {
//           // insert the message text, roomID, and userID into the message table
//           db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES ("${text}", ?, ?)`, placeholder, (err, results, fields) => {
//             if (err) { throw err; }
//             callback();
//           });
//         });
//     }
//   },

//   users: {
//     get: function (callback) {
//       db.dbConnection.query('SELECT username FROM users', (err, results) => {
//         if (err) {
//           callback(err, null);
//         } else {
//           callback(null, results);
//         }
//       });
//     },
//     post: function (user, callback) {
//       db.dbConnection.query(`SELECT username FROM users WHERE username = '${user.username}'`, (err, results) => {
//         if (err) {
//           // console.log('1');
//           callback(err, null);
//         } else if (results.length === 1) {
//           // console.log('2');
//           // that username already exists in the user table
//           callback(new Error('Username unavailable. Please choose another.'), null);
//         } else {
//           // console.log('3');
//           db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err, results) => {
//             if (err) {
//               callback(err, null);
//             } else {
//               callback();
//               // callback(results, err)  // TODO: why does the promisified version of this function not work with this setup?? ie, it doesn't invoke the next .then() call on the promise returned by this promisified function ...
//             }
//           });
//         }
//       });
//     }
//   },

//   rooms: {
//     get: function (callback) {
//       db.dbConnection.query('SELECT roomname FROM rooms', (err, results) => {
//         if (err) {
//           callback(err, null);
//         } else {
//           callback(null, results);
//         }
//       });
//     },
//     post: function (room, callback) {
//       // console.log('inside models rooms.post room: ', room);
//       db.dbConnection.query(`SELECT roomname FROM rooms WHERE roomname = '${room.roomname}'`, (err, results) => {
//         if (err) {
//           // console.log('1');
//           callback(err, null);
//         } else if (results.length === 1) {
//           // console.log('2');
//           // that roomname already exists in the room table
//           callback();
//           // callback(new Error(`roomname ${room.roomname} already exists. No room created`), null); // In a case like this, s it better to send back some sort of error, or take no action?
//         } else {
//           // console.log('3');
//           db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${room.roomname}')`, (err, results) => {
//             if (err) { callback(err, null); }
//             callback();
//           });
//         }
//       });
//     }
//   }
// };

// Promise.promisifyAll(db.dbConnection);
// Promise.promisifyAll(module.exports.messages);
// Promise.promisifyAll(module.exports.users);
// Promise.promisifyAll(module.exports.rooms);

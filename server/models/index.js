var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      // a function which produces all the messages
      return db.dbConnection.query('SELECT text FROM messages', done);
    },
    post: function (message) {
      var userN;
      var roomN;

      db.dbConnection.query(`SELECT id FROM users WHERE users.username = '${message.username}'`, (err, results, fields) => {
        if (err) { throw err; }
        userN = results[0].id;
        // console.log('results in messages.post: ', results);
        console.log('userN: ', userN);

        db.dbConnection.query(`INSERT INTO rooms (roomname) VALUES ('${message.roomname}')`, (err, results, fields) => {
          if (err) { throw err; }

          db.dbConnection.query(`SELECT id FROM rooms WHERE rooms.roomname = '${message.roomname}'`, (err, results, fields) => {
            if (err) { throw err; }
            roomN = results[0].id;
            console.log('roomN: ', roomN);

            // a function which can be used to insert a message into the database
            var placeholder = [userN, roomN];
            db.dbConnection.query(`INSERT INTO messages (text, id_users, id_rooms) VALUES ("${message.text}", ?, ?)`, placeholder, (err, results, fields) => { // using double quotes around the message seems really fragile here ...
              if (err) { throw err; }
            });
          });
        });
      });





      // db.dbConnection.query(`
    }
  },

  users: {
    // Ditto as above.
    get: function () {
      // let userN;
      // userN = results;
      // console.log('userN: ', userN);
    },
    post: function (user) {
      db.dbConnection.query(`INSERT INTO users (username) VALUES ('${user.username}')`, (err, results, fields) => {
        if (err) { throw err; }
      });

      db.dbConnection.query(`SELECT * FROM users`, (err, results, fields) => {
        if (err) { throw err; }
        // console.log('results in users.post: ', results);
        // console.log('results[0].ID in users.post: ', results[0].ID);
      });
    }
  }
};

//PICK UP HERE: SET PRIMARY KEY FOR MESSAGE, FIND OUT DATA FORMAT FOR QUERY OF 'SELECT'

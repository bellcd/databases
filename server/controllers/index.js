var models = require('../models');
var db = require('../db/index.js');

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      db.messages.findAll({include: [db.users]}) // why is a left outer join necessary??
      .then(users => {
        res.status(200).send(users);
      })
      .catch(err => {
        res.status(400).send(err);
      });
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      db.users.findOrCreate({ username: req.body[username]})
        .then(user => {
          var params = {
            text: req.body[text],
            username: user.id,
            roomname: req.body[roomname]
          }
          db.messages.create(params)
            .then(() => {
               res.sendStatus(201);
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      db.users.findAll() // why is a left outer join necessary??
        .then(users => {
          res.status(200).send(users);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    },
    post: function (req, res) {
      db.users.create({ username: req.body[username]})
        .then(user => {
          res.sendStatus(201);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  },

  // rooms: {
  //   // Ditto as above
  //   get: function (req, res) {
  //     models.rooms.get((err) => {
  //       if (err) { throw err; }
  //       res.sendStatus(200);
  //     });
  //   },
  //   post: function (req, res) {
  //     models.rooms.post(req.body, (err) => {
  //       if (err) { throw err; }
  //       res.sendStatus(200);
  //     });
  //   }
  // }
};


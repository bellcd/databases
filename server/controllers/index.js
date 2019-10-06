var models = require('../models');

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      //get all the messages
      models.messages.get((err, messages) => {
        if (err) { throw err; }
        res.status(200).send(messages);
      });
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      // console.log('req.body: ', req.body);
      models.messages.post(req.body, (err, data) => {
        if (err) { throw err; }
        res.sendStatus(400);
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get((err, users) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(users);
        }
      });
    },
    post: function (req, res) {
      models.users.post(req.body, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send();
        }
      });
    }
  },

  rooms: {
    // Ditto as above
    get: function (req, res) {
      models.rooms.get((err, rooms) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(rooms);
        }
      });
    },
    post: function (req, res) {
      models.rooms.post(req.body, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send();
        }
      });
    }
  }
};


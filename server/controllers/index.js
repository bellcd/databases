var models = require('../models');

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      models.messages.get((err, results) => {
        if (err) { throw err; }
        res.status(400).send(results);
      });
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      models.messages.post(req.body, (err) => {
        if (err) { throw err; }
        res.sendStatus(400);
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get((err) => {
        if (err) { throw err; }
        res.sendStatus(400);
      });
    },
    post: function (req, res) {
      models.users.post(req.body, (err) => {
        if (err) { throw err; }
        res.sendStatus(400);
      });

    }
  }
};


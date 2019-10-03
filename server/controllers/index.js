var models = require('../models');

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      //get all the messages
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
    get: function (req, res) {},
    post: function (req, res) {
      models.users.post(req.body, (err) => {
        if (err) { throw err; }
        res.sendStatus(400);
      });
    }
  }
};


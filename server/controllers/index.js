var models = require('../models');

module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      //get all the messages
      res.send(XX);
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      models.post();
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};


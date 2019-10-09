var models = require('../models');

// need to handle case where the GET request also has a roomname in the request
module.exports = {
  messages: {
    // a function which handles a get request for all messages
    get: function (req, res) {
      // console.log('inside controllers messages.get req.body: ', req.body);
      //get all the messages
      models.messages.get((err, messages) => {
        if (err) {
          res.status(400).send(err);
        } else {
          // console.log('inside controllers messages.get messages: ', messages);
          res.status(200).send(messages);
        }
      });
    },
    // a function which handles posting a message to the database
    post: function (req, res) {
      models.messages.post(req.body, (err, data) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send();
        }
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
      // console.log('controllers rooms.post req: ', req);
      // console.log('controllers rooms.post req.body: ', req.body);
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


var db = require('../db');

// need to handle case where the GET request also has a roomname in the request
module.exports = {
  messages: {
    get: function (req, res) {
      db.Message.findAll({ include: [{ model: db.User }, { model: db.Room }] })
        .then(function(messages) {
          console.log('messages: ', messages)
          res.json(messages);
        })
        .catch(err => {
          console.log(err);
        })
    },
    post: function (req, res) {
      db.User.findOrCreate({where: {username: req.body.username}})
        // findOrCreate returns multiple resutls in an array
        // use spread to assign the array to function arguments
        .spread(function(user, created) {
          db.Room.findOrCreate({where: {roomname: req.body.roomname}})
            .spread(function(room, created) {
              console.log('room: ', room);
              console.log('user: ', user);

              console.log('req.body: ', req.body);

              db.Message.create({
                UserId: user.get('id'),
                text: req.body.text,
                RoomId: room.get('id')
              }).then(function(message) {
                res.sendStatus(201);
              });
            })
        });
    }
  },

  users: {
    get: function (req, res) {
      db.User.findAll()
        .then(function(users) {
          res.json(users);
        });
    },
    post: function (req, res) {
      db.User.findOrCreate({where: {username: req.body.username}})
        // findOrCreate returns multiple resutls in an array
        // use spread to assign the array to function arguments
        .spread(function(user, created) {
          res.sendStatus(created ? 201 : 200);
        });
    }
  },
  rooms: {
    get: function (req, res) {
      db.Room.findAll()
        .then(function(rooms) {
          res.json(rooms);
        })
    },
    post: function (req, res) {
      console.log(req.body);

      db.Room.findOrCreate({ where: {roomname: req.body.roomname }})
        .spread(function(room, created) {
          res.sendStatus(created ? 201 : 200);
        });
    }
  }
};

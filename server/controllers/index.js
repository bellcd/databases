var db = require('../db');

// need to handle case where the GET request also has a roomname in the request
module.exports = {
  messages: {
    get: function (req, res) {
<<<<<<< HEAD
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
=======
      db.Message.findAll({ include: [{ model: db.User }, { model: db.Room }] })
        .then(function(messages) {
          console.log('messages: ', messages)
          res.json(messages);
        })
        .catch(err => {
          console.log(err);
        })
>>>>>>> solution
    },
    post: function (req, res) {
<<<<<<< HEAD
      models.messages.post(req.body, (err, data) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send();
        }
      });
=======
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
>>>>>>> solution
    }
  },

  users: {
    get: function (req, res) {
<<<<<<< HEAD
      models.users.get((err, users) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(users);
        }
      });
    },
    post: function (req, res) {
      models.users.post(req.body)
        .then(() => {
          res.status(200).send();
        })
        .catch((err) => {
          res.status(400).send(err);
        })
    }
    // post: function (req, res) {
    //   console.log('inside controllers users.post req.body: ', req.body);
    //   models.users.post(req.body, (err) => {
    //     if (err) {
    //       res.status(400).send(err);
    //     } else {
    //       res.status(200).send();
    //     }
    //   });
    // }
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
=======
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
>>>>>>> solution
    }
  }
};

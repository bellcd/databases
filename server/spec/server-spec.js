var request = require('request');
var expect = require('chai').expect;

// environment variable to signal whether to test using an ORM (Sequelize) or not
const useORM = process.env.npm_config_orm === 'orm' ? true : false;
console.log('Uses ORM: ', useORM);

var dbConnection;
var beforeFn;
var beforeEachFn;
var afterFn;
var afterEachFn;
var User;
var Room;
var Message;


if (useORM) {
  var dbExports = require('../../orm-refactor/db/index.js');
  dbConnection = dbExports.db;

  beforeFn = function(done) {
    dbConnection.authenticate()
      .then(() => {
        console.log('Connection using the ORM has been established successfully.');
        done();
      })
      .catch(err => {
        console.error('Unable to connect to the database using the ORM:', err);
        done();
      });

    ({User, Room, Message} = dbExports);
    // console.log('User: ', User, 'Room: ', Room, 'Message: ', Message);

  };
  beforeEachFn = function(done) {
    // // this seems very inefficient to drop and recreate all the tables after each test ...
    // User = dbConnection.define('user', {
    //   username: Sequelize.STRING,
    // });

    // Room = dbConnection.define('room', {
    //   roomname: Sequelize.STRING
    // });

    // Message = dbConnection.define('message', {
    //   text: Sequelize.STRING
    // });

    // User.hasMany(Message, { foreignKey: 'id_users'} );
    // Room.hasMany(Message, { foreignKey: 'id_rooms'} );

    dbConnection.sync()
      .then(() => {
        done(); // remember to invoke done, and move on to the next test, only AFTER each table has been synced!
      })
      .catch((err) => {
        throw err;
      });
  };

  afterEachFn = function(done) {


    // messages.setTasks([])
    //   .then(associatedTasks => {
    //     // you will get an empty array
    //   });

    dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_rooms`)
      .then(() => {
        return dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_users`);
      })
      .then(() => {
        return Message.truncate({ cascade: true });
      })
      .then(() => {
        return User.truncate({ cascade: true });
      })
      .then(() => {
        return Room.truncate({ cascade: true });
      })
      .then(() => {
        return dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(id)`); // confirm syntax // maybe without ADD CONSTRAINT id_rooms
      })
      .then(() => {
        return dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(id)`);
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log('err: ', err);
        done();
      });

    // User.findAll().then(users => {
    //   console.log("All users:", JSON.stringify(users, null, 4));
    //   done();
    // });

    // Message.truncate()
    //   .then(() => {
    //     return User.truncate(() => {});
    //   })
    //   .then(() => {
    //     return Room.truncate(() => {});
    //   })
    //   .then(() => {
    //     done();
    //   })
    //   .catch((err) => {
    //     console.log('err: ', err);
    //   });
    // dbConnection.truncate()
    //   .then(() => {
    //     done();
    //   })
  };

  afterFn = function(done) {
    dbConnection.close()
      .then(() => {
        console.log('Connection to the database using the ORM has been closed successfully.');
        done();
      })
      .catch((err) => {
        console.log('Unable to close the connection to the database using the ORM: ', err);
        done();
      });
  };
} else {
  var mysql = require('mysql');

  beforeFn = (done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      database: 'chat'
    });
    dbConnection.connect();
    done();
  };

  beforeEachFn = function(done) {
    // Empty the db table before each test so that multiple tests (or repeated runs of the tests) won't screw each other up:

    // drop the foreign key constraints from the messages table
    dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_rooms`, (err, results, fields) => {
      if (err) { throw err; }
      dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_users`, (err, results, fields) => {
        if (err) { throw err; }
        // truncate messages, rooms, and users tables
        dbConnection.query(`TRUNCATE TABLE messages`, (err, results, fields) => {
          if (err) { throw err; }
          dbConnection.query(`TRUNCATE TABLE users`, (err, results, fields)  => {
            if (err) { throw err; }
            dbConnection.query(`TRUNCATE TABLE rooms`, (err, results, fields) => {
              if (err) { throw err; }
              // add the foreign key constraints back
              // added constraints here because otherwise, it *appears* that mysql auto generates a value we would have to find / use
              // https://dev.mysql.com/doc/refman/5.7/en/create-table-foreign-keys.html#foreign-keys-dropping
              dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(id)`, (err, results, fields) => {
                if (err) { throw err; }
                dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(id)`, (err, results, fields) => {
                  if (err) { throw err; }
                  done();
                });
              });
            });
          });
        });
      });
    });

    // adds the foreign key constraints to the messages table



    // cleanTables(dbConnection); // alternate approach
  };

  afterFn = (done) => {
    // drop the foreign key constraints from the messages table
    dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_rooms`, (err, results, fields) => {
      if (err) { throw err; }
      dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_users`, (err, results, fields) => {
        if (err) { throw err; }
        // truncate messages, rooms, and users tables
        dbConnection.query(`TRUNCATE TABLE messages`, (err, results, fields) => {
          if (err) { throw err; }
          dbConnection.query(`TRUNCATE TABLE users`, (err, results, fields)  => {
            if (err) { throw err; }
            dbConnection.query(`TRUNCATE TABLE rooms`, (err, results, fields) => {
              if (err) { throw err; }
              // add the foreign key constraints back
              // added constraints here because otherwise, it *appears* that mysql auto generates a value we would have to find / use
              // https://dev.mysql.com/doc/refman/5.7/en/create-table-foreign-keys.html#foreign-keys-dropping
              dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(id)`, (err, results, fields) => {
                if (err) { throw err; }
                dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(id)`, (err, results, fields) => {
                  if (err) { throw err; }
                  dbConnection.end();
                  done();
                });
              });
            });
          });
        });
      });
    });

  };
  afterEachFn = function(done) {
    done();
    // cleanTables(dbConnection); // alternate approach
  };
}


describe(`Persistent Node Chat Server${useORM ? ' with Sequelize' : ''}`, function() {
  // TODO: change truncating tables logic to use this function, instead of repeating same logic in beforeEach / afterEach
  // TODO: change one of beforeEach / afterEach to only run before the whole test suite, or after the whole test suite
  // be aware, truncating the tables means we're deleting all the records from the database every time we run the test suite
  function cleanTables(dbConnection) {
    // Empty the db table before each test so that multiple tests (or repeated runs of the tests) won't screw each other up:

    // drop the foreign key constraints from the messages table
    dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_rooms`);
    dbConnection.query(`ALTER TABLE messages DROP FOREIGN KEY fk_users`);

    // truncate messages, rooms, and users tables
    dbConnection.query(`TRUNCATE TABLE messages`);
    dbConnection.query(`TRUNCATE TABLE rooms`);
    dbConnection.query(`TRUNCATE TABLE users`);

    // adds the foreign key constraints to the messages table
    // added constraints here because otherwise, it *appears* that mysql auto generates a value we would have to find / use
    // https://dev.mysql.com/doc/refman/5.7/en/create-table-foreign-keys.html#foreign-keys-dropping
    dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(id)`);
    dbConnection.query(`ALTER TABLE messages ADD CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(id)`);
  }

  // cleanTables(dbConnection); // alternate approach

  before(beforeFn);
  beforeEach(beforeEachFn);
  afterEach(afterEachFn);
  after(afterFn);

  describe('users table', function() {
    it('Should add a user to the DB', function(done) {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Santa Claus' }
      }, function() {
        dbConnection.query('SELECT username FROM users', (err, results) => {
          expect(results).to.have.lengthOf(1);
          const username = results[0].username;
          expect(username).to.equal('Santa Claus');
          done();
        });
      });

      // User.create({ username: 'Santa Claus' })
      //   .then(() => {
      //     return User.findAll({ where: { username: 'Santa Claus' } });
      //   })
      //   .then((user) => {
      //     done();
      //   })
      //   .catch((err) => {
      //     throw err;
      //   });
    });

    it(`Should only add a user to the DB if that user doesn't already exist`, function(done) {
      // add a user to the DB
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Christian' }
      }, function() {
        // attempt to add the same user to the DB
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/users',
          json: { username: 'Christian' }
        }, function() {
          // the users table in the database, filtering by username = 'Christian', should only return 1 record
          dbConnection.query(`SELECT username FROM users where username = "Christian"`, (err, results) => {
            expect(results).to.have.lengthOf(1);
            expect(results[0].username).to.equal('Christian');
            done();
          });
        });
      });
    });

    it('Should get all users from the DB', function(done) {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Krusty' }
      }, function() {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/users',
          json: { username: 'Mozart' }
        }, function() {
          request({
            method: 'POST',
            uri: 'http://127.0.0.1:3000/classes/users',
            json: { username: 'Aladdin' }
          }, function() {
            request({
              method: 'GET',
              uri: 'http://127.0.0.1:3000/classes/users',
            }, function (err, response, body) {
              const names = [ 'Krusty', 'Mozart', 'Aladdin' ];
              body = JSON.parse(body);
              usernames = body.map((user) => user.username);
              usernames.forEach((username, i) => {
                expect(username).to.equal(names[i]);
              });
              done();
            });
          });
        });
      });
    });
  });

  describe('rooms table', function() {
    it('Should add a room to the DB', function(done) {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/rooms',
        json: { roomname: 'Christmas' }
      }, function() {
        dbConnection.query('SELECT roomname FROM rooms', (err, results) => {
          expect(results).to.have.lengthOf(1);
          const roomname = results[0].roomname;
          expect(roomname).to.equal('Christmas');
          done();
        });
      });
    });

    it(`Should only add a room to the DB if that room doesn't already exist`, function(done) {
      // add a room to the DB
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/rooms',
        json: { roomname: 'Kitchen' }
      }, function() {
        // attempt to add the same room to the DB
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/rooms',
          json: { roomname: 'Kitchen' }
        }, function() {
          // the rooms table in the database, filtering by roomname = 'Kitchen', should only return 1 record
          dbConnection.query(`SELECT roomname FROM rooms where roomname = "Kitchen"`, (err, results) => {
            expect(results).to.have.lengthOf(1);
            expect(results[0].roomname).to.equal('Kitchen');
            done();
          });
        });
      });
    });

    it('Should get all rooms from the DB', function(done) {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/rooms',
        json: { roomname: 'Kitchen' }
      }, function() {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/rooms',
          json: { roomname: 'closet' }
        }, function() {
          request({
            method: 'POST',
            uri: 'http://127.0.0.1:3000/classes/rooms',
            json: { roomname: 'bedroom' }
          }, function() {
            request({
              method: 'GET',
              uri: 'http://127.0.0.1:3000/classes/rooms',
            }, function (err, response, body) {
              const rooms = [ 'Kitchen', 'closet', 'bedroom' ];
              body = JSON.parse(body);
              const roomnames = body.map((room) => room.roomname);
              roomnames.forEach((roomname, i) => {
                expect(roomname).to.equal(rooms[i]);
              });
              done();
            });
          });
        });
      });
    });
  });

  describe('messages table', function() {

    // TODO: should this be multiple tests?
    it('Should insert messages to the DB, and create username & roomname values in respective tables if needed', function(done) {
      // post a message to the chat server, without having posted a user previously
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function() {
        // Now if we look in the database, we should find the posted message there.
        dbConnection.query('SELECT * FROM messages', function(err, results) {
          if (err) { throw err; }
          expect(results.length).to.equal(1);
          expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');
        });

        dbConnection.query('SELECT * FROM users', function(err, results) {
          if (err) { throw err; }
          expect(results.length).to.equal(1);
          expect(results[0].username).to.equal('Valjean');
        });

        dbConnection.query('SELECT * FROM rooms', function(err, results) {
          if (err) { throw err; }
          expect(results.length).to.equal(1);
          expect(results[0].roomname).to.equal('Hello');
          done(); // I *believe* these calls to query are queued, so they'll run synchronously ...
        });
      });
    });

    it('Should output all messages from the DB', function(done) {
      // Let's insert two messages into the db
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Les Mis'
        }
      }, function() {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/messages',
          json: {
            username: 'Gandalf',
            text: 'You shall not pass!',
            roomname: 'LOTR'
          }
        }, function() {
          // now running a GET request for all messages, we should see all the data we just inserted
          request({
            method: 'GET',
            uri: 'http://127.0.0.1:3000/classes/messages'
          }, (err, res, body) => {
            const data = [{
              roomname: 'Les Mis',
              text: 'In mercy\'s name, three days is all I need.',
              username: 'Valjean'
            }, {
              roomname: 'LOTR',
              text: 'You shall not pass!',
              username: 'Gandalf'
            }];
            const results = JSON.parse(body);
            expect(data).to.deep.equal(results);
            done();
          });
        });
      });
    });
  });
});

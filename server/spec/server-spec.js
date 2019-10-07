/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename1 = "messages";
    var tablename2 = "rooms";
    var tablename3 = "users";

    // Empty the db table before each test so that multiple tests (or repeated runs of the tests) won't screw each other up:

    // drop the foreign key constraints from the messages table
    dbConnection.query(`ALTER TABLE ${tablename1} DROP FOREIGN KEY fk_rooms`);
    dbConnection.query(`ALTER TABLE ${tablename1} DROP FOREIGN KEY fk_users`);

    // truncate messages, rooms, and users tables
    dbConnection.query(`TRUNCATE TABLE ${tablename1}`);
    dbConnection.query(`TRUNCATE TABLE ${tablename2}`);
    dbConnection.query(`TRUNCATE TABLE ${tablename3}`);

    // adds the foreign key constraints to the messages table
    // added constraints here because otherwise, it *appears* that mysql auto generates a value we would have to find / use
    // https://dev.mysql.com/doc/refman/5.7/en/create-table-foreign-keys.html#foreign-keys-dropping
    dbConnection.query(`ALTER TABLE ${tablename1} ADD CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(id)`);
    dbConnection.query(`ALTER TABLE ${tablename1} ADD CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(id)`, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

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
    xit('Should insert POSTed messages to the DB', function(done) {
      // Post the user to the chat server.
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Valjean' }
      }, function() {
        // Post a message to the node chat server:
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
          var queryString = 'SELECT * FROM messages';
          var queryArgs = [];

          dbConnection.query(queryString, queryArgs, function(err, results) {
            if (err) { throw err; }
            // Should have one result:
            expect(results.length).to.equal(1);
            expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');
            done();
          });
        });
      });
    });

    // TODO: should this be multiple tests?
    it('Should insert POSTed messages to the DB, and create username & roomname if needed', function(done) {
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

    // TODO: finish writing test
    xit('Should GET messages from the DB', function(done) {
      // POST the user to the chat server
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: { username: 'Christian' }
      }, function() {
        done();
      });
    });

    xit('Should output all messages from the DB', function(done) {
      // Let's insert a message into the db
      var queryString = "select messages.text, users.username, rooms.roomname from messages inner join users on messages.id = users.id inner join rooms on messages.id_rooms = rooms.id;";
      var queryArgs = [];

      dbConnection.query(queryString, queryArgs, function(err) {
        if (err) { throw err; }

        // Now query the Node chat server and see if it returns
        // the message we just inserted:
        request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
          // var messageLog = JSON.parse(body);
          // expect(messageLog[0].text).to.equal('Men like you can never change!');
          // expect(messageLog[0].roomname).to.equal('main');
          done();
        });
      });
    });
  });
});

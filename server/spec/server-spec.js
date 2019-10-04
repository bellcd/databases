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

    var tablename1 = "messages"; // TODO: fill this out
    var tablename2 = "rooms";
    var tablename3 = "users";

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */

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

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].text).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {

    // Let's insert a message into the db
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'lastTest' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'lastTest',
          text: 'Men like you can never change!',
          roomname: 'main'
        }
      }, function () {
        var queryString = "select messages.text, users.username, rooms.roomname from messages inner join users on messages.id = users.id inner join rooms on messages.id_rooms = rooms.id;";
        var queryArgs = [];
        // TODO - The exact query string and query args to use
        // here depend on the schema you design, so I'll leave
        // them up to you. */


        dbConnection.query(queryString, queryArgs, function(err) {
          if (err) { throw err; }

          // Now query the Node chat server and see if it returns
          // the message we just inserted:
          request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
            var messageLog = JSON.parse(body);
            expect(messageLog[0].text).to.equal('Men like you can never change!');
            expect(messageLog[0].roomname).to.equal('main');
            done();
          });
        });
      });
    });
  });
});

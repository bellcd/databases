DROP DATABASE chat;

CREATE DATABASE chat;

USE chat;


CREATE TABLE rooms (
  ID int,
  name varchar(255),
  PRIMARY KEY (ID)
);

CREATE TABLE users (
  ID int,
  name varchar(255),
  PRIMARY KEY (ID)
);

CREATE TABLE messages (
  ID int,
  text varchar(255),
  id_users int,
  id_rooms int,
  PRIMARY KEY (ID),
  FOREIGN KEY (id_rooms) REFERENCES rooms(ID),
  FOREIGN KEY (id_users) REFERENCES users(ID)
);
/* Create other tables and define schemas for them here! */



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/


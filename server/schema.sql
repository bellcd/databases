CREATE DATABASE IF NOT EXISTS chat;
USE chat;
DROP TABLE IF EXISTS messages, users, rooms;

CREATE TABLE rooms (
  ID int AUTO_INCREMENT,
  roomname varchar(255),
  PRIMARY KEY (ID)
);

CREATE TABLE users (
  ID int AUTO_INCREMENT,
  username varchar(255),
  PRIMARY KEY (ID)
);


CREATE TABLE messages (
  ID int AUTO_INCREMENT,
  text varchar(255),
  id_users int,
  id_rooms int,
  PRIMARY KEY (ID),
  CONSTRAINT fk_rooms FOREIGN KEY (id_rooms) REFERENCES rooms(ID),
  CONSTRAINT fk_users FOREIGN KEY (id_users) REFERENCES users(ID)
);
/* Create other tables and define schemas for them here! */



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/


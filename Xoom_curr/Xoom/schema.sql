DROP DATABASE IF EXISTS t_dist_users;
CREATE DATABASE t_dist_users;
USE t_dist_users;

CREATE TABLE `users` (
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR (255) NOT NULL,
  `fname` VARCHAR(255) NOT NULL,
  `lname` VARCHAR(255) NOT NULL,
    PRIMARY KEY ( `username` ) 
);

CREATE TABLE `rooms` (
  `name` VARCHAR(255) NOT NULL,
  `owner` VARCHAR (255) NOT NULL,
  `handle` VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY ( `name` ),
    FOREIGN KEY (`owner`) REFERENCES `users`(`username`) 
);
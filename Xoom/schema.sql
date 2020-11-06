CREATE DATABASE t_dist_users;
USE t_dist_users;

CREATE TABLE `users` (
  `username` VARCHAR(255) NOT NULL,
  `fname` VARCHAR(255) NOT NULL,
  `Lname` VARCHAR(255) NOT NULL,
    PRIMARY KEY ( `username` ) 
);
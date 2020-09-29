DROP DATABASE IF EXISTS empTracker_DB;
CREATE DATABASE empTracker_DB;

USE empTracker_DB;
CREATE TABLE employee(
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL;
    last_name VARCHAR(30) NOT NULL;
    role_id INT;
    manager_id INT;
    PRIMARY KEY (id);
    FOREIGN KEY (role_id,manager_id);

);
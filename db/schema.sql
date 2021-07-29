/* Schema for SQL database/tables */
DROP DATABASE IF EXISTS employees_DB;

/* Create database */
CREATE DATABASE employees_DB;
USE employees_DB;

/* Create new table with a primary key that auto-increments, and a text field */
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,3) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
DROP DATABASE IF EXISTS employee_trakerDB;

CREATE DATABASE employee_trakerDB;

USE employee_trakerDB;

CREATE TABLE department (

  id INT AUTO_INCREMENT NOT NULL, 
  name VARCHAR(30),
  PRIMARY KEY(id)

);

CREATE TABLE role (

  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INT,
  PRIMARY KEY(id)  

);


CREATE TABLE employee (

  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY(id)

);

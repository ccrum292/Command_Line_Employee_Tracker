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


SELECT * FROM department;

SELECT * FROM employee;

INSERT INTO employee (first_name, last_name, role_id, manger_id) VALUES ("Caleb", "CRUM", 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manger_id) VALUES ("Belac", "Murc", 11, 1);
INSERT INTO employee (first_name, last_name, role_id, manger_id) VALUES ("Me", "Me", 22, 1);

SELECT * FROM role;

INSERT INTO role (title, salary, department_id) VALUES ("Cool Guy", 50000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Bad Guy", 50000, 11);
INSERT INTO role (title, salary, department_id) VALUES ("Fly Guy", 50000, 0);
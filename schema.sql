DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30),
  PRIMARY KEY(id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL, 
  department_id INT,
  PRIMARY KEY(id)
);

CREATE TABLE employees (
   id INT NOT NULL AUTO_INCREMENT,
   first_name VARCHAR(30), 
   last_name VARCHAR(30), 
   role_id INT, 
   manager_id INT,
   PRIMARY KEY(id)
);

INSERT into roles (title, salary, department_id)
VALUES ("Musician", 25000, 1), ("Producer", 88000, 2), ("Singer", 90000, 3);

INSERT into employees (first_name, last_name, role_id, manager_id)
VALUES ("Steven", "Strange", 1, 15), ("Tony", "Bulme", 2, 11), ("Anne", "Jacobs", 3, 17);

INSERT into departments (dept_name)
VALUES ("Sales"), ("Marketing"), ("Party");

SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees; 

SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name FROM employees INNER JOIN roles ON employees.role_id=roles.id INNER JOIN departments ON roles.department_id=departments.id
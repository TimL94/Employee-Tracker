DROP DATABASE IF EXISTS uno_db;

CREATE DATABASE uno_db;

USE uno_db;

CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    hourly_wage DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id int DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);

CREATE DATABASE IF NOT EXISTS companydb;

USE companydb;

CREATE TABLE
    employee(
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(45) DEFAULT NULL,
        salary INT(5) DEFAULT NULL,
        PRIMARY KEY (id)
    );

DESCRIBE employee;

INSERT INTO
    employee (name, salary)
VALUES ('Joel', 1000), ('Eli', 2000), ('Tess', 2500), ('Sam', 1000);

SELECT * FROM employee;
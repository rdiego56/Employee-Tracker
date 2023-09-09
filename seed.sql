USE employee_db;

INSERT INTO department (name) VALUES
("sales"),
("HR"),
("GM"),
("Finance");

INSERT INTO role (title, salary, department_id) VALUES
("Web Developer", 100000, 1),
("Accountant", 80000, 2),
("General Manager", 100000, 3),
("Financial manager", 250000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
("Diego", "Ramos", 4, 1),
("Jerry", "Rice", 2, 1);
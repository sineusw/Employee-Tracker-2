USE employees_DB;

INSERT INTO department (department)
VALUES ("Production"), ("Research and Development"), ("Marketing"), ("Human Resource");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 80000, 1), ("Assistant Manager", 70000, 1), ("Editor-in-Chief", 65000, 2), ("Sales Director", 55000, 3), ("Talent Management", 60000, 4), ("Training and Development", 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Tiger", 1, 1), ("Stephen", "Keller", 2, 1), ("Whittney", "Peters", 3, 1), ("Josh", "Fernan", 3, 3), ("Chelsea", "Flower", 4, 1), ("Charels", "Barkley", 2, 2);
USE employee_db;

INSERT into department(name) values("Accounting"),("Legal"),("Engineering"),("Sales");

INSERT into role(title,salary,department_id) values ("SoftwareEngineer",1000000.00,3), ("Accountant",90000.00,1),("Lawyer",85000.00,2),("Sales Manager",60000.00,4);

INSERT into employee(first_name,last_name,role_id)values("suganya","somu",1),("Raghav","Endran",2),("Jason","Pandey",3),("Shreya","Goshal",4);

update employee set manager_id = 1 where first_name="Jason";
update employee set manager_id = 1 where first_name="Raghav";

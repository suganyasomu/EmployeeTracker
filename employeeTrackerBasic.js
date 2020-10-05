var mysql = require("mysql");
var inquirer = require("inquirer");

//CreateConnection
var connection = mysql.createConnection({
  host: "localhost",

  //your port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Shreya12!@",
  database: "employee_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log(`
    ================================================================
    ===      ______                 _                            ===
    ===     |   __/ _ __ ___  _ __ | | ___  _   _  ___  ___      ===
    ===     |   _| |  _ '  _ \\  _ \\| |/ _ \\| | | |/ _ \\/ _ \\     ===
    ===     |  |___  | | | | | |_) | | (_) | |_| |  __/  __/     ===
    ===     |______|_| |_| |_|  __/|_|\\___/\\___, |\\___|\\___|     ===
    ===                      |__|           |___/                ===
    ===                                                          ===
    ===      __  __                                              ===
    ===     |  \\/  | __ _ _ __   __ _  __ _  ___ _ __            ===
    ===     | |\\/| |/ _' | '_ \\ / _' |/ _' |/ _ \\ '__|   (\\_/)   ===
    ===     | |  | | (_| | | | | (_| | (_| |  __/ |      (O.o)   ===
    ===     |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|      (> <)   ===
    ===                               |___/                      ===
    ================================================================
      `);
  start();
});

function start() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Employee",
        "View Employee",
        "View Employee by departments",
        "View Employee by Managers",
        "View Employee by Roles",
        "Update Employee Manager",
        "Update Employee Roles",
        "Remove Employee",
        "Remove Department",
        "Remove Roles",
        "View Dept Budget",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.option) {
        case "Add Employee":
          addEmployee();
          break;

        case "View Employee":
          viewEmployee();
          break;

        case "View Employee by departments":
          viewEmployeeByDept();
          break;

        case "View Employee by Managers":
          viewEmployeeByManagers();
          break;
        case "View Employee by Roles":
          viewEmployeeByRoles();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "Update Employee Roles":
          updateEmployeeRoles();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Remove Department":
          removeDepartment();
          break;

        case "Remove Roles":
          removeRoles();
          break;
        case "View Dept Budget":
          getDeptBudget();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
}

async function addEmployee() {
  var roles = await getRoles();
  var roleTitle = roles.map((role) => role.title);
  var roleIds = roles.map((role) => role.id);
  var empManager = await getManager();
  var managerName = empManager.map((manName) => manName.ManagerName);

  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is employee's role?",
        choices: roleTitle,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is employee's manager?",
        choices: managerName,
      },
    ])
    .then((answer) => {
      connection.query(
        `select id from role where ?`,
        { title: answer.role },
        function (err, res) {
          if (err) throw err;
          connection.query(
            `select id from employee where concat(first_name," ",last_name) = ?`,
            [answer.manager],
            function (err, results) {
              if (err) throw err;
              console.log(results);
              connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: answer.firstname,
                  last_name: answer.lastname,
                  role_id: res[0].id,
                  manager_id: results[0].id,
                },
                function (err) {
                  if (err) throw err;
                  console.log("Added the employee successfully!");
                  start();
                }
              );
            }
          );
        }
      );
    });
}
async function removeEmployee() {
  var emp = await getEmployee();
  var empList = emp.map((name) => name.Fullname);
  inquirer
    .prompt([
      {
        name: "remove",
        type: "list",
        message: "which employee do you want to remove from the list ?",
        choices: empList,
      },
    ])
    .then((answer) => {
      connection.query(
        `delete from employee where concat(first_name," ",last_name)=?`,
        [answer.remove],
        function (err, results) {
          if (err) throw err;
          console.log("Employee removed successfully");
          start();
        }
      );
    });
}
async function removeDepartment() {
  var dept = await getDepartment();
  console.log(dept);
  var empDept = dept.map((department) => department.name);
  inquirer
    .prompt([
      {
        name: "removeDept",
        type: "list",
        message: "which department do you want to remove from the list ?",
        choices: empDept,
      },
    ])
    .then((answer) => {
      connection.query(
        `delete from department where name = ?`,
        [answer.removeDept],
        function (err, results) {
          if (err) throw err;
          console.log("Employee removed successfully");
          start();
        }
      );
    });
}

async function removeRoles() {
  var roles = await getRoles();
  var roleTitle = roles.map((role) => role.title);
  var roleIds = roles.map((role) => role.id);
  var dept = await getDepartment();
  console.log(dept);
  var empDept = dept.map((department) => department.name);
  inquirer
    .prompt([
      {
        name: "removeRoles",
        type: "list",
        message: "which roles  do you want to remove from the list ?",
        choices: roleTitle,
      },
    ])
    .then((answer) => {
      connection.query(
        `delete from role where title = ?`,
        [answer.removeRoles],
        function (err, results) {
          if (err) throw err;
          console.log("Employee roles removed successfully");
          start();
        }
      );
    });
}

async function viewEmployeeByDept() {
  var dept = await getDepartment();
  var empDept = dept.map((department) => department.name);
  inquirer
    .prompt([
      {
        name: "departments",
        type: "list",
        message: "Which department would like to view ?",
        choices: empDept,
      },
    ])
    .then((answer) => {
      connection.query(
        `SELECT emp.id,emp.first_name,emp.last_name, CONCAT(empMan.first_name, " ", empMan.last_name) "manager",ro.title,ro.salary,dept.name "department" FROM employee emp left join role ro 
      on emp.role_id=ro.id
      left join department dept
      on ro.department_id=dept.id
      left join employee empMan on empMan.id=emp.manager_id where dept.name = ?`,
        [answer.departments],
        function (err, results) {
          if (err) throw err;
          console.table(results);
          console.log("Viewed the employee by department successfully");
          start();
        }
      );
    });
}
async function viewEmployeeByRoles() {
  var roles = await getRoles();
  var roleTitle = roles.map((role) => role.title);
  var roleIds = roles.map((role) => role.id);
  inquirer
    .prompt([
      {
        name: "roles",
        type: "list",
        message: "Which roles would you like to view ?",
        choices: roleTitle,
      },
    ])
    .then((answer) => {
      connection.query(
        `SELECT emp.id,emp.first_name,emp.last_name, CONCAT(empMan.first_name, " ", empMan.last_name) "manager",ro.salary,dept.name "department",ro.title FROM employee emp left join role ro 
      on emp.role_id=ro.id
      left join department dept
      on ro.department_id=dept.id
      left join employee empMan on empMan.id=emp.manager_id where ro.title = ?`,
        [answer.roles],
        function (err, results) {
          if (err) throw err;
          console.table(results);
          console.log("Viewed the employee by roles successfully");
          start();
        }
      );
    });
}
function viewEmployee() {
  connection.query(
    `SELECT emp.id,emp.first_name,emp.last_name, CONCAT(empMan.first_name, " ", empMan.last_name) "manager",ro.title,ro.salary,dept.name "department" FROM employee emp left join role ro 
    on emp.role_id=ro.id
    left join department dept
    on ro.department_id=dept.id
    left join employee empMan on empMan.id=emp.manager_id`,
    function (err, results) {
      if (err) throw err;

      console.table(results);
      console.log("Viewed the employee successfully");
      start();
    }
  );
}
async function viewEmployeeByManagers() {
  var name = await getManager();
  console.log(name);
  var managerName = name.map((manName) => manName.ManagerName);
  inquirer
    .prompt([
      {
        name: "Managers",
        type: "list",
        message: "View employee details by manager?",
        choices: managerName,
      },
    ])
    .then((answer) => {
      connection.query(
        `SELECT emp.id,emp.first_name,emp.last_name, ro.title,ro.salary,dept.name "department",CONCAT(empMan.first_name, " ", empMan.last_name) "manager" FROM employee emp left join role ro 
      on emp.role_id=ro.id
      left join department dept
      on ro.department_id=dept.id
      left join employee empMan on empMan.id=emp.manager_id where CONCAT(empMan.first_name," ",empMan.last_name)=?`,
        [answer.Managers],
        function (err, results) {
          if (err) throw err;

          console.table(results);
          console.log("Viewed the employee by Managers successfully");
          start();
        }
      );
    });
}

async function updateEmployeeManager() {
  var emp = await getEmployee();
  var empList = emp.map((name) => name.Fullname);
  var managerId = emp.map((id) => id.manager_id);
  inquirer
    .prompt([
      {
        name: "updateEmployee",
        type: "list",
        message: "Which employee's manager would you like to update?",
        choices: empList,
      },
      {
        name: "selectManager",
        type: "list",
        message:
          "Which employee do you want to set as manager for the selected employee?",
        choices: empList,
      },
    ])
    .then((answer) => {
      connection.query(
        `select id from employee where concat(first_name," ",last_name) = ?`,
        [answer.selectManager],
        function (err, res) {
          if (err) throw err;
          connection.query(
            `update employee SET ? WHERE concat(first_name," ",last_name) = ? `,
            [
              {
                manager_id: res[0].id,
              },
              answer.updateEmployee,
            ],
            function (err, results) {
              if (err) throw err;
              console.log("Updated the employee's manager sucessfully");
            }
          );
          start();
        }
      );
    });
}

async function updateEmployeeRoles() {
  var emp = await getEmployee();
  var empList = emp.map((name) => name.Fullname);
  var roles = await getRoles();
  var roleTitle = roles.map((role) => role.title);
  var roleIds = roles.map((role) => role.id);
  inquirer
    .prompt([
      {
        name: "selectEmployee",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: empList,
      },
      {
        name: "updateEmployeeRoles",
        type: "list",
        message:
          "Which role title do you want to assign for selected employee?",
        choices: roleTitle,
      },
    ])
    .then((answer) => {
      connection.query(
        `select id from role where title = ?`,
        [answer.updateEmployeeRoles],
        function (err, res) {
          if (err) throw err;
          connection.query(
            `update employee SET ? WHERE concat(first_name," ",last_name) = ? `,
            [
              {
                role_id: res[0].id,
              },
              answer.selectEmployee,
            ],
            function (err, results) {
              if (err) throw err;
              console.log("Updated the employee's role sucessfully");
            }
          );
          start();
        }
      );
    });
}

async function getDeptBudget() {
  var dept = await getDepartment();
  var empDept = dept.map((department) => department.name);
  inquirer
    .prompt([
      {
        name: "deptBudget",
        type: "list",
        message: "Which department would you like to view the budget?",
        choices: empDept
      },
    ])
    .then((answer) => {
      console.log(answer.deptBudget);
      connection.query(
        `SELECT dept.name "department",sum(ro.salary) as "Dept_Budget" from employee emp left join role ro 
  on emp.role_id=ro.id
  left join department dept
  on ro.department_id=dept.id
  left join employee empMan on empMan.id=emp.manager_id where dept.name = ?`,
        [answer.deptBudget],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          start();
        }
        
      );
      
    });
    
}

function getRoles() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT id, title FROM role", function (err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

function getManager() {
  return new Promise((resolve, reject) => {
    connection.query(
      `select concat(first_name ," ", last_name) as "ManagerName" from employee`,
      function (err, res) {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

function getDepartment() {
  return new Promise((resolve, reject) => {
    connection.query(`select distinct(name) from department`, function (
      err,
      results
    ) {
      if (err) reject(err);
      resolve(results);
    });
  });
}

function getEmployee() {
  return new Promise((resolve, reject) => {
    connection.query(
      `select concat(first_name," ",last_name) as "Fullname" ,manager_id from employee`,
      function (err, results) {
        if (err) reject(err);
        resolve(results);
      }
    );
  });
}

// To view the employees by department
// select emp.id,emp.first_name,emp.last_name,dept.name "department" from department dept join employee emp on dept.id=emp.id order by dept.name;

//To view the employees by manager
// select emp.id,emp.first_name,emp.last_name,emp.manager_id from  employee emp  join employee man on emp.id=man.id;

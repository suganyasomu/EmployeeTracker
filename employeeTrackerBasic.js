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
      choices: ["Add Employee", "View Employee", "Update Employee", "exit"],
    })
    .then((answer) => {
      switch (answer.option) {
        case "Add Employee":
          addEmployee();
          break;

        case "View Employee":
          viewEmployee();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

async function addEmployee() {
  var roles = await getRoles();
 
   var roleTitle = roles.map(role => role.title);
  var roleIds = roles.map(role => role.id);
 

 
  var empManager=await getManager();
 
  var managerName= empManager.map(manName => manName.ManagerName);

 
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
        choices: roleTitle
      },
      {
        name: "manager",
        type: "list",
        message: "Who is employee's manager?",
        choices: managerName,
      },
    ])
    .then((answer) => {
      connection.query(`select id from role where ?`,{title:answer.role},function(err,res){
        if (err) throw err;
        connection.query(`select id from employee where concat(first_name," ",last_name) = ?`,[answer.manager],function(err,results){
          if (err) throw err;
          console.log(results);
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstname,
              last_name: answer.lastname,
              role_id: res[0].id,
              manager_id:results[0].id
            },
            function (err) {
              if (err) throw err;
              console.log("Added the employee successfully!");
              start();
            }
          );
        })
       
      });
     
      // var getManagerId=connection.query(`select id from employee where  ?`,[answer.manager]);
      // console.log(getRoleID);
      // console.log(getManagerId);
     
    });
}

function viewEmployee() {
  connection.query(
    `SELECT emp.id,emp.first_name,emp.last_name, CONCAT(empMan.first_name, " ", empMan.last_name) "manager",ro.title,ro.salary,dept.name "department" FROM employee emp left join role ro 
    on emp.id=ro.id
    left join department dept
    on emp.id=dept.id
    left join employee empMan on empMan.id=emp.manager_id`,
    function (err, results) {
      if (err) throw err;

      console.table(results);
      console.log("Viewed the employee successfully");
      start();
    }
  );
}

function updateEmployee() {
  inquirer
    .prompt([
      {
        name: "update",
        type: "input",
        message: "Which employee's manager would you like to update?",
      },
      {
        name: "empmanager",
        type: "list",
        message:
          "Which employee do you want to set as manager for the selected employee?",
        choices: ["david", "Jong", "Rani", "Jacob"],
      },
    ])
    .then((anwser) => {
      connection.query("update employee SET ? WHERE ? ", [
        {
          role_id: answer.role,
        },
        {
          manager_id: answer.manager,
        },
      ]);
      start();
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

function getManager(){
  return new Promise((resolve,reject)=>{
  connection.query(`select concat(first_name ," ", last_name) as "ManagerName" from employee`, function(err,res){
    if(err)reject(err);
    resolve(res);
  })
});
}

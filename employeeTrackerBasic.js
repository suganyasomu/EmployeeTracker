var mysql=require("mysql");
var inquirer=require("inquirer");

//CreateConnection
var connection=mysql.createConnection({
    host:"localhost",

  //your port
    port:3306,

  // Your username
  user: "root",

  // Your password
  password: "Shreya12!@",
  database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
     start();
  });

  function start(){
inquirer.prompt({
  name:"option",
  type:"list",
  message:"What would you like to do?",
  choices:[
    "Add Employee",
    "View Employee",
    "Update Employee",
    "exit"
  ]
}).then(answer=>{
  switch(answer.option){
    case "Add Employee":
      addEmployee();
      break;

    case "View Employee":
      viewEmployee();
      break;

    case "Update Employee":
      addEmployee();
      break;
  
      case "exit":
        connection.end();
        break;
  }
})
  }

  function addEmployee(){
inquirer.prompt([
  {
  name:"firstname",
  type:"input",
  message:"What is the employee's first name?"
},
{
  name:"lastname",
  type:"input",
  message:"What is the employee's last name?"
},
{
  name:"role",
  type:"list",
  message:"What is employee's role?",
  choices:[
    "Software Developer","Full stack developer","Quality Engineer","automation Engineer"
  ]
},
{
  name:"role",
  type:"list",
  message:"Who is employee's manager?",
  choices:[
    "Sergey","Suranjana","Vidhya","Anirudh"
  ]
},

]).then(answer=>{
  connection.query("INSERT INTO employee SET ?",
  {
    first_name:answer.firstname,
    last_name: answer.lastname
  },
  function(err){
    if(err) throw err;
    console.log("Added the employee successfully!");
    start();
  }
  )
})
  }

  function viewEmployee(){
    connection.query("select * from employee",function(err,results){
      if(err) throw err;
      
        console.table(results);
      console.log("Viewed the employee successfully");
    });
  }

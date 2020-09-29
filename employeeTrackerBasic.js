var mysql=require("mysql");
var inquirer=require("inquirer");

//CreateConnection
var connection=mysql.createConnection({
    host:"localhost",
    //your port
    port:3306,
    //username
     // Your username
  user: "root",

  // Your password
  password: "Shreya12!@",
  database: "empTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    // start();
  });
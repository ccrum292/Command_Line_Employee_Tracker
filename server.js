const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable= require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_trakerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});


function start(){

  inquirer.prompt(
    {
      type: "list",
      name: "name",
      message: "What would you like to do?",
      choices:[
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Roles",
        "Exit"
      ]
    }
  ).then(data=>{

    if(data.name === "View Departments"){

    }else if(data.name === "View Roles"){

    }else if(data.name === "View Employees"){

    }else if(data.name === "Update Employee Roles"){

    }else{
      connection.end();
    }
    
  });

};


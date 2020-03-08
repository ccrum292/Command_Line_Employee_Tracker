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
        "View All Employees",
        "Update Employee Roles",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Exit"
      ]
    }
  ).then(data=>{

    if(data.name === "View Departments"){
      viewDepartments();
    }else if(data.name === "View Roles"){
      viewRoles();
    }else if(data.name === "View All Employees"){
      viewAllEmployees();
    }else if(data.name === "Update Employee Roles"){
      updateEmployeeRoles();
    }else if(data.name === "Add Department"){
      addDepartment();
    }else if(data.name === "Add Role"){
      addRole();
    }else if(data.name === "Add Employee"){
      addEmployee();
    }else if(data.name === "Remove Employee"){
      deleteEmployee();
    }else if(data.name === "Remove Role"){
      deleteRole();
    }else if(data.name === "Remove Department"){
      deleteDepartment();
    }else{
      connection.end();
    }
    
  });

};

function viewDepartments(){

  connection.query("SELECT * FROM department", (err, res)=> {
    if (err) throw err;
    console.table(res);
    start();
  })

};

function viewRoles(){

  connection.query("SELECT title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id", (err, res)=> {
    if (err) throw err;
    console.table(res);
    start();
  })

};

function viewAllEmployees(){

  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", (err, res)=> {
    if (err) throw err;
    console.table(res);
    start();
  })

};

function updateEmployeeRoles(){

  connection.query("SELECT * FROM employee", (err, res2)=>{
    if (err) throw err;
    const employeeChoices = res2.map((res2)=>{
     return res2.first_name +" "+ res2.last_name
    })
    employeeChoices.push("Exit");

    inquirer.prompt(
    {
      type: "list",
      name: "employeeNames",
      message: "Please select any employee to update.",
      choices: employeeChoices
    }
    ).then(data2=>{
      
      if(data.employeeNames === "Exit"){
        return start();
      }
      
      connection.query("SELECT * FROM role", (err, res)=> {
        if(err) throw err;
        
        const roleIdChoices = res.map((res)=>{
            return res.title;
          })
    
        roleIdChoices.push("None");
    
        inquirer.prompt(
          {
            type: "list",
            name: "roleId",
            message: "Please enter employee's new role.",
            choices: roleIdChoices
          }
        ).then(data=>{

          var chosenItem;
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === data.roleId) {
              chosenItem = res[i];
            }
          }

          var chosenItem2;
          for (var i = 0; i < res2.length; i++) {
            if (res2[i].first_name + " " + res2[i].last_name === data2.employeeNames) {
              chosenItem2 = res2[i];
            }
          }

          connection.query("UPDATE employee SET ? WHERE ?", [
            {
              role_id: chosenItem.id
            },
            {
              id: chosenItem2.id
            }], err=> {
              if(err) throw err;
              console.log("Employee entered");
              start();
            })

        });
      
    })

  });

})}

function addDepartment(){

  inquirer.prompt(
    {
      type: "input",
      name: "name",
      message: "Name"
    }
    ).then(data=>{
      connection.query("INSERT INTO department SET ?", data, (err)=> {
        if (err) throw err;
        console.log("Department added")
        start();
      })
    })

};

function addRole(){
  
  connection.query("SELECT * FROM department", (err, res)=>{
    if (err) throw err;

    const departmentReturn = res.map((res)=>{
          return res.name;
        })
    departmentReturn.push("None");

    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the employee role title."
      },
      {
        type: "number",
        name: "salary",
        message: "Please enter the salary of this position."
      },
      {
        type: "list",
        name: "department_id",
        message: "Please select a department for this role.",
        choices: departmentReturn
      }
      ]).then(data=>{
       
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].name === data.department_id) {
            chosenItem = res[i];
          }
        }

        connection.query("INSERT INTO role SET ?", {
          title: data.title,
          salary: data.salary,
          department_id: chosenItem.id
        }, (err)=> {
          if (err) throw err;
          console.log("Role added")
          start();
        })
      })

  })

};

function addEmployee(){

  connection.query("SELECT * FROM role", (err, res)=> {
    if(err) throw err;
    
    const roleIdChoices = res.map((res)=>{
        return res.title;
      })

    roleIdChoices.push("None");

    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter employee's first name."
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter employee's last name."
      },
      {
        type: "list",
        name: "roleId",
        message: "Please enter employee's role.",
        choices: roleIdChoices
      }
    ]).then(data=>{
      
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].title === data.roleId) {
          chosenItem = res[i];
        }
      }
      
      connection.query("SELECT * FROM employee", (err, res2)=>{
        if (err) throw err;
        const employeeChoices = res2.map((res2)=>{
         return res2.first_name +" "+ res2.last_name
        })
        employeeChoices.push("None");

        inquirer.prompt(
        {
          type: "list",
          name: "mangerId",
          message: "Please enter emplyee's manager.",
          choices: employeeChoices
        }
        ).then(data2=>{

          var chosenItem2;
          for (var i = 0; i < res2.length; i++) {
            if (res2[i].first_name + " " + res2[i].last_name === data2.mangerId) {
              chosenItem2 = res2[i];
            }
          }

          connection.query("INSERT INTO employee SET ?", {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: chosenItem.id,
            manager_id: chosenItem2.id
          }, err=> {
            if(err) throw err;
            console.log("Employee entered");
            start();
          })

        })

      });
   
    })

  })

};

function deleteEmployee(){

  connection.query("SELECT * FROM employee", (err, res)=>{
    if (err) throw err;

    const employeeChoices = res.map((res)=>{
      return res.first_name +" "+ res.last_name
     })
     employeeChoices.push("Exit");
  
    inquirer.prompt({
      type: "list",
      name: "delete",
      message: "What Employee would you like to delete?",
      choices: employeeChoices
    }).then(data=>{

      if(data.delete === "Exit"){
        return start();
      }

      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].first_name + " " + res[i].last_name === data.delete) {
          chosenItem = res[i];
        }
      }

      connection.query("DELETE FROM employee WHERE ?",{
        id: chosenItem.id
      },(err)=>{
        if (err) throw err;
        console.log("deletion successful")
        start();
      })
      
    })

  })

};

function deleteRole(){

  connection.query("SELECT * FROM role", (err, res)=>{
    if (err) throw err;

    const employeeChoices = res.map((res)=>{
      return res.title;
     })
     employeeChoices.push("Exit");
     

    inquirer.prompt({
      type: "list",
      name: "delete",
      message: "What Role would you like to delete?",
      choices: employeeChoices
    }).then(data=>{

      if(data.delete === "Exit"){
        return start();
      }

      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].title === data.delete) {
          chosenItem = res[i];
        }
      }

      connection.query("DELETE FROM role WHERE ?",{
        id: chosenItem.id
      },(err)=>{
        if (err) throw err;
        console.log("deletion successful")
        start();
      })
      
    })

  })
  
};

function deleteDepartment(){

  connection.query("SELECT * FROM department", (err, res)=>{
    if (err) throw err;

    const employeeChoices = res.map((res)=>{
      return res.name;
     })
     employeeChoices.push("Exit");
     

    inquirer.prompt({
      type: "list",
      name: "delete",
      message: "What Role would you like to delete?",
      choices: employeeChoices
    }).then(data=>{

      if(data.delete === "Exit"){
        return start();
      }

      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].name === data.delete) {
          chosenItem = res[i];
        }
      }

      connection.query("DELETE FROM department WHERE ?",{
        id: chosenItem.id
      },(err)=>{
        if (err) throw err;
        console.log("deletion successful")
        start();
      })
      
    })

  })

};
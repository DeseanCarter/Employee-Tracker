// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// Database Connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: 'employee_trackerDB'
  });
// Connection Error Test
  connection.connect(err => {
    if (err) throw err;
});
// Function To Initialize App With Switch Cases
const startApp = () => {
  inquirer
  .prompt([
      {
          type: 'list',
          choices:[
              'View All Employees',
              'Add Employee',
              'View All Departments',
              'Add Department',
              'View All Roles',
              'Add Role',
              'Exit',
          ],
          message: 'What would you like to do? ',
          name: 'userChoice' 
      },
  ])
  .then((response) => {
    switch (response.userChoice) {
        case "View All Employees":
            seeEmployees()
        break;
        case "Add Employee":
            addEmployee()
        break;    
        case "View All Departments":
            seeDepartments()
        break;
        case "Add Department":
            addDepartment()
        break;
        case "View All Roles":
            seeRoles()
        break;
        case "Add Role":
            addRole()
        break;       
        case "Exit":
            console.log("Goodbye")
            connection.end();
            return; 
        break;   
    }
  })
}
// View All Employees
const seeEmployees = () => {
  connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name FROM employees INNER JOIN roles ON employees.role_id=roles.id INNER JOIN departments ON roles.department_id=departments.id', (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
}
// View All Departments
const seeDepartments = ()=>{
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      });
  }
// View All Roles
  const seeRoles = ()=>{
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.dept_name FROM roles INNER JOIN departments ON roles.department_id=departments.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
      });
}
// Add New Employee To Database
const addEmployee = () => {
    let newEmploy = []
    const query = 'SELECT roles.id, roles.title FROM roles'
    connection.query(query, (err, res) => {
        if (err) throw err
        for(i=0;i<res.length; i++){
            newEmploy.push(res[i].title)
        }
        inquirer
            .prompt([{
                type: "input",
                message: "What is the New Employee's First Name?",
                name: "addFirstName",
            },
            {
                type: "input",
                message: "What is the New Employee's Last Name?",
                name:"addLastName",   
            },
            {
                type: "list",
                message: "What is the New Employee's Title?",
                choices: newEmploy,
                name: "NewEmployeeRole",
            }
        ])
        .then ((answer) => {
            console.log("employee added")
            
            const query = 'SELECT roles.id, roles.title FROM roles'
            connection.query(query, {title: answer.NewEmployeeRole}, (err, roles) => {
                if (err) throw err
                let titleID = roles[0].id
                let query = 'INSERT INTO employees (first_name, last_name, role_id) VALUES (?)'
                const values = [answer.addFirstName, answer.addLastName, titleID]
                connection.query(query, [values], (err,res) => {
                    if (err) throw err
                console.table(res)
                startApp()
                 })
            })
         })
    })
}
// Add New Department To Database
const addDepartment = () => {
            inquirer
            .prompt([
            {
                type: "input",
                message: "What is the new department title?",
                name: "NewDepartmentSlot",
            }
        ]).then ((res) => {
            let query = 'INSERT INTO departments (dept_name) VALUES (?)'
            connection.query(query, [res.NewDepartmentSlot], (err,res) => {
                if (err) throw err
                console.log("Department added")
                seeDepartments(res)
             })
        })   
}
// Add New Role To Database
const addRole = () => {
    let newRole = []
    const query = 'SELECT dept_name FROM departments'
    connection.query(query, (err, res) => {
        if (err) throw err
        for(i=0;i<res.length; i++){
            newRole.push(res[i].dept_name)
        }
        inquirer
            .prompt([{
                type: "input",
                message: "What is the role title?",
                name: "addRoleTitle",
            },
            {
                type: "input",
                message: "What is the role's salary?",
                name:"addRoleSalary",   
            },
            {
                type: "list",
                message: "What is the roles department?",
                choices: newRole,
                name: "NewRoleDept",
            }
        ])
        .then ((answer) => {
            console.log("Role added")
            
            const query = 'SELECT departments.id FROM departments WHERE ?'
            connection.query(query, {dept_name: answer.NewRoleDept}, (err, res) => {
                if (err) throw err
                let deptId = res[0].id
                let query = 'INSERT INTO roles (title, salary, department_id) VALUES (?)'
                const values = [answer.addRoleTitle, answer.addRoleSalary, deptId]
                connection.query(query, [values], (err,res) => {
                    if (err) throw err
                console.table(res)
                startApp()
                 })
            })
         })
    })
}

// App Start
startApp(); 
    

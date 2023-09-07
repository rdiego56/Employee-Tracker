const mysql = require("mysql");
const inquirer = require("inquirer");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ninersnation49.$",
    database: "employees_db",
});

async function queryRole() {
    return new Promise((resolve, reject) => {
        db.query("select * from role", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function queryEmployee() {
    return new Promise((resolve, reject) => {
        db.query("select * from employee", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

function init() {
    inquirer
        .prompt({
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        })
        .then((answers) => {
            switch (answers.initialQuestion) {
                case "view all departments":
                    viewAllDepartments();
                    break;
                case "view all roles":
                    viewAllRoles();
                    break;
                case "view all employees":
                    viewAllEmployees();
                    break;
                case "add a department":
                    addDepartment();
                    break;
                case "add a role":
                    addRole();
                    break;
                case "add an employee":
                    addEmployee();
                    break;
                case "update an employee role":
                    updateEmployeeRole();
                    break;
                case "EXIT":
                    db.end();
                    break;
            }
        });
}

function viewAllDepartments() {
    db.query("select * from department", function (err, res) {
        console.log("Viewing all departments");
        console.log(res);
        init();
    });
}

function viewAllRoles() {
    db.query("select * from role", function (err, res) {

        console.log("Viewing all roles");
        console.log(res);
        init();
    });
}

function viewAllEmployees() {
    db.query("select e1.first_name, e1.last_name, CONCAT (e2.first_name, ' ' , e2.last_name) AS manager  from employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id", function (err, res) {
        console.log("Viewing all employees");
        console.log(res);
        init();
    });
}

function addDepartment() {
    // ask user the department name
    inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: " what will be the department name?"
    }).then((answers) => {
        console.log(answers.departmentName)
        db.query("INSERT INTO department SET ?",
        {
            name:answers.departmentName,
        },
            function (err) {
                if (err) throw err;
                init();
            }
        );

    });

}

function addRole() {
}

async function addEmployee() {
    const roles = await queryRole()
    const employee = await queryEmployee()
    console.log(roles);
    console.log(employee);
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: " What is your first name?"
        },
        {
            name: "lastname",
            type: "input",
            message: " What is your last name?"
        },
        {
            name: "roleId",
            type: "input",
            message: " What is the role you are in?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        },
        {
            name: "managerId",
            type: "input",
            message: " What is your manager id?"
        },
    ]).then((answers) => {
        db.query("INSERT INTO department SET? ",
        {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.roleId,
            manger_id: answers.managerId,
        },
            // [answer.departmentName],
            function (err) {
                if (err) throw err;
                init();
            }
        );

    });

}

async function updateEmployeeRole() {
    const employee = await queryEmployee();
    const roles = await queryEmployee();
    inquirer.prompt([
        {
            name: "employeeToUpdate",
            message: " Which employee would you want to update?",
            type: "list",
            choices: employee.map((employee) => ({ name: employee.first_name + "" + employee.last_name , value: employee.id})),

        },
        {
            name: "roleId",
            type: "list",
            message: " What will the role be updated too?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        },
    ]).then((answers) => {
        db.query("UPDATE employee SET ? WHERE ?",
        [
            {
            role_id: answers.roleId,
            },
            {
                id: answers.employeeToUpdate
            }
            
        ],
            // [answer.departmentName],
            function (err) {
                if (err) throw err;
                init();
            }
        );

    });
}

init();
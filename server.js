
const express = require('express');
const mysql2 = require('mysql2');
const inquirer = require('inquirer');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql2.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Freya',
        database: 'uno_db'
    },
    console.log('Connected to company_db databse')
    );

const queryOne = 'SELECT * FROM departments';
const queryTwo = ' SELECT r.title , r.id, d.department_name , r.hourly_wage FROM roles r JOIN departments d ON r.department_id = d.id'
const queryThree = 'SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.hourly_wage, m.last_name AS manager_last_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id'


function showEmployees() {
    db.query(queryThree, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\nID   | First Name | Last Name  | Role Title         | Department   | Hourly Wage | Manager |`);
        console.log(`-----|------------|------------|--------------------|--------------|-------------|---------|`);
        results.forEach(employee => {
            const employeeId = employee.id.toString().padEnd(4);
            const firstName = employee.first_name.padEnd(10);
            const lastName = employee.last_name.padEnd(10);
            const roleTitle = employee.title.padEnd(18);
            const department = employee.department_name.padEnd(12);
            const wage = employee.hourly_wage.padEnd(11);
            const manager = employee.manager_last_name.padEnd(7);
            console.log(`${employeeId} | ${firstName} | ${lastName} | ${roleTitle} | ${department} | ${wage} | ${manager} |`);
        });
        console.log(`-----|------------|------------|--------------------|--------------|-------------|---------|`);
    });
};

function showDepartments() {
    db.query(queryOne, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\nID   | Department   |`);
        console.log(`-----|--------------|`);
        results.forEach(department => {
            const departmentId = department.id.toString().padEnd(4);
            const departmentName = department.department_name.padEnd(12);
            console.log(`${departmentId} | ${departmentName} |`);
        });
        console.log(`-----|--------------|`);
        createSpace();
    });
};

function showRoles () {
    db.query(queryTwo, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\nID   | Hourly Wage | Role Title         | Department   |`);
        console.log(`-----|-------------|--------------------|--------------|`);
        results.forEach(role => {
            const roleId = role.id.toString().padEnd(4);
            const houlyWage = role.hourly_wage.padEnd(11);
            const roleTitle = role.title.padEnd(18);
            const department = role.department_name.padEnd(12);
            console.log(`${roleId} | ${houlyWage} | ${roleTitle} | ${department} |`);
        })
        console.log(`-----|-------------|--------------------|--------------|`);
    });
};

const addDepartment = async () => {
    createSpace();
    const departmentData = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter department name: '
        }
    ]);

    await db.promise().query('INSERT INTO departments (department_name) VALUES (?)', departmentData.department);
    createSpace();
    askUser();
}

const addEmployee = async () => {
    const [roles] = await db.promise().query('SELECT title FROM roles');
    const roleChoices = roles.map(role => role.title);

    const employeeData = await inquirer.prompt([
        {
            type: 'input',
            name:'first_name',
            message: 'Enter employee Frist Name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee Last Name:'
        },
        {
            type: 'list',
            name: 'role_title',
            message: 'choose a role',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager',
            choices: [
                'Norris',
                'Obama',
                'Hawkins',
                'None'
            ]
        }
    ]);
    var managerId = 0;

    if (employeeData.manager === 'Norris'){
        managerId = 2;
    } else if (employeeData.manager === 'Obama') {
        managerId = 3;
    } else if (employeeData.manager === 'Hawkins') {
        managerId = 4;
    } else {
        managerId = 1;
    };

    const roleIdQuery = await db.promise().query('SELECT id FROM roles WHERE title = ?', employeeData.role_title);
    const roleId = roleIdQuery[0][0].id;

    await db.promise().query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeData.first_name, employeeData.last_name, roleId, managerId]);

    console.log('Employee added successfully.');
    return askUser();
}


function disconnect() {
    db.end(err => {
        if (err) {
            console.error('Error closing mysql connection:', err.message);
        } else{
            console.log('Mysql connection closed.');
        }
    });
    process.exit();
};

function createSpace () {
    console.log('\n\n\n')
}

app.use((req,res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


const askUser = async () => {
    const selection = await inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'Select an option below',
            choices: [
                'View all departments',
                'Add department',
                'View all roles',
                'Add role',
                'View all Employees',
                'Add Employee',
                'Exit'
            ]
        }
    ])
    .then(answer => {
        switch (answer.selection){
            case 'View all departments':
                showDepartments();
                askUser();
                break;
            case 'Add department':
                addDepartment();
                askUser();
                break;
            case 'View all roles':
                showRoles();
                askUser();
                break;
            case 'View all Employees':
                showEmployees();
                askUser();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Exit':
                console.log('exiting program');
                disconnect();
                return;
        }
    })

}


askUser();


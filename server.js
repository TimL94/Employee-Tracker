
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
const queryTwo = ' SELECT r.title , r.id, d.department_name , r.hourly_wage FROM roles r JOIN departments d ON r.department_id = d.id;'
const queryThree = 'SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.hourly_wage, m.id FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id;'


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

function showEmployees() {
    db.query(queryThree, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\nID   | First Name | Last Name  |`);
        console.log(`-----|------------|------------|`);
        results.forEach(employee => {
            const employeeId = employee.id.toString().padEnd(4);
            const firstName = employee.first_name.padEnd(10);
            const lastName = employee.last_name.padEnd(10);
            console.log(`${employeeId} | ${firstName} | ${lastName} |`);
        });
        console.log(`-----|------------|------------|`);
    });
};





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
                'View all roles',
                'View all Employees',
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
            case 'View all roles':
                showRoles();
                askUser();
                break;
            case 'View all Employees':
                showEmployees();
                askUser();
                break;
            case 'Exit':
                console.log('exiting program');
                return;
        }
    })

}


askUser();
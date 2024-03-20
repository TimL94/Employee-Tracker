const express = require('express');
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const clear = require('clear');
const {showDepartments, addDepartment} = require('./assets/js/departments');
const {showRoles, addRole} = require('./assets/js/roles');
const { showEmployees, addEmployee, updateEmployeeRole } = require('./assets/js/employee');



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


function disconnect() {
    clear();
    db.end(err => {
        if (err) {
            console.error('Error closing mysql connection:', err.message);
        } else{
            console.log('Mysql connection closed.');
            console.log('exiting program');
        }
    });
    process.exit();
};

function bannerMessage () {
    console.log('\n------------------------------------------')
        console.log('### PRESS ARROW KEY TO BRING MENU BACK ###');
        console.log('------------------------------------------\n')
};

app.use((req,res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


const main = async () => {
    clear();
    console.log('------------------------');
    console.log('Employee Management System');
    console.log('------------------------');
    const selection = await inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: '\nSelect an option below',
            choices: [
                'View all departments',
                'Add department',
                'View all roles',
                'Add role',
                'View all Employees',
                'Add Employee',
                'Update employee role',
                'Exit'
            ]
        }
    ])
    .then(answer => {
        switch (answer.selection){
            case 'View all departments':
                showDepartments(db, main, clear, bannerMessage);
                break;
            case 'Add department':
                addDepartment(db, main, clear);
                break;
            case 'View all roles':
                showRoles(db, main, clear, bannerMessage);
                break;
            case 'Add role':
                addRole(db, main, clear);
                break;
            case 'View all Employees':
                showEmployees(db, main, clear, bannerMessage);
                break;
            case 'Add Employee':
                addEmployee(db, main, clear);
                break;
            case 'Update employee role':
                updateEmployeeRole(db, main, clear);
                break;
            case 'Exit':
                disconnect();
                return;
        }
    })

}


main();



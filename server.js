
const express = require('express');
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
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
                showDepartments(db, askUser);
                break;
            case 'Add department':
                addDepartment(db, askUser, createSpace);
                break;
            case 'View all roles':
                showRoles(db, askUser);
                break;
            case 'Add role':
                addRole(db, askUser);
                break;
            case 'View all Employees':
                showEmployees(db, askUser);
                break;
            case 'Add Employee':
                addEmployee(db, askUser);
                break;
            case 'Update employee role':
                updateEmployeeRole(db, askUser);
                break;
            case 'Exit':
                console.log('exiting program');
                disconnect();
                return;
        }
    })

}


askUser();



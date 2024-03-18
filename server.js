
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
const queryTwo = ' SELECT r.title AS role, r.id, d.department_name AS department, r.hourly_wage FROM roles r JOIN departments d ON r.department_id = d.id;'
const queryThree = 'SELECT e.id, e.first_name AS first, e.last_name AS last, r.title, d.department_name AS department, r.hourly_wage AS hourly, m.last_name AS manager_last_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id;'


function firstQuery() {
    db.query(queryOne, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(results);
    });
};

function secondQuery () {
    db.query(queryTwo, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(results);
    });
};

function thirdQuery () {
    db.query(queryThree, function (err, results) {
        if (err) {
            console.error('error in query', err);
        }
        console.log(results);
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
                firstQuery();
                askUser();
                break;
            case 'View all roles':
                secondQuery();
                askUser();
                break;
            case 'View all Employees':
                thirdQuery();
                askUser();
                break;
            case 'Exit':
                console.log('exiting program');
                return;
        }
    })

}


askUser();
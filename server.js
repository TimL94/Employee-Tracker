const express = require('express');
const mysql2 = require('mysql2');

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

const queryOne = 'SELECT * FROM roles';
const queryTwo = ' SELECT r.title AS role, r.id, d.department_name AS department, r.hourly_wage FROM roles r JOIN departments d ON r.department_id = d.id;'
const queryThree = 'SELECT e.id, e.first_name AS first, e.last_name AS last, r.title, d.department_name AS department, r.hourly_wage AS hourly, m.last_name AS manager_last_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id;'

db.query(queryOne, function (err, results) {
    if (err) {
        console.error('error in query', err);
    }
    console.log(results);
});

db.query(queryTwo, function (err, results) {
    if (err) {
        console.error('error in query', err);
    }
    console.log(results);
});

db.query(queryThree, function (err, results) {
    if (err) {
        console.error('error in query', err);
    }
    console.log(results);
});

app.use((req,res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
const inquirer = require('inquirer');


function showEmployees(db, main, clear, bannerMessage) {

    const employeeQuery = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.hourly_wage, m.last_name AS manager_last_name
    FROM employees e 
    LEFT JOIN employees m ON e.manager_id = m.id
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id`

    db.query(employeeQuery, function (err, results) {
        clear();
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\n+------+------------+------------+--------------------+--------------+-------------+---------+`);
        console.log(`| ID   | First Name | Last Name  | Role Title         | Department   | Hourly Wage | Manager |`);
        console.log(`+------+------------+------------+--------------------+--------------+-------------+---------+`);
        results.forEach(employee => {
            const employeeId = employee.id.toString().padEnd(4);
            const firstName = employee.first_name.padEnd(10);
            const lastName = employee.last_name.padEnd(10);
            const roleTitle = employee.title.padEnd(18);
            const department = employee.department_name.padEnd(12);
            const wage = employee.hourly_wage.padEnd(10);
            var manager = '';
            if (!employee.manager_last_name){
                manager = 'none'.padEnd(7);
            } else if (employee.manager_last_name){
                manager = employee.manager_last_name.padEnd(7);
            }
            
            console.log(`| ${employeeId} | ${firstName} | ${lastName} | ${roleTitle} | ${department} | $${wage} | ${manager} |`);
        });
        console.log(`+------+------------+------------+--------------------+--------------+-------------+---------+`);
        bannerMessage();
    });
    main();
};


const addEmployee = async (db, main, clear) => {
    const [roles] = await db.promise().query('SELECT title FROM roles');
    const roleChoices = roles.map(role => role.title);
    clear();

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
    var managerId = 1;

    if (employeeData.manager === 'Norris'){
        managerId = 2;
    } else if (employeeData.manager === 'Obama') {
        managerId = 3;
    } else if (employeeData.manager === 'Hawkins') {
        managerId = 4;
    } else if (employeeData.manager === 'None'){
        managerId = null;
    };

    const roleIdQuery = await db.promise().query('SELECT id FROM roles WHERE title = ?', employeeData.role_title);
    const roleId = roleIdQuery[0][0].id;

    await db.promise().query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeData.first_name, employeeData.last_name, roleId, managerId]);

    console.log('Employee added successfully.');
    return main();
}


const updateEmployeeRole = async (db, main, clear) => {
    const [employees] = await db.promise().query('SELECT first_name, last_name from employees');
    const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
    const [roles] = await db.promise().query('SELECT title FROM roles');
    const roleChoices = roles.map(role => role.title);
    clear();

    const employeeRoleData = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'choose an employee to update',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'new_role',
            message: 'Select new role',
            choices: roleChoices
        }

    ]);
    const roleIdQuery = await db.promise().query('SELECT id FROM roles WHERE title = ?', employeeRoleData.new_role);
    const roleId = roleIdQuery[0][0].id;
    const employeeFirstName = employeeRoleData.employee.split(' ')[0];
    const employeeLastName = employeeRoleData.employee.split(' ')[1];

    await db.promise().query('UPDATE employees SET role_id = ? where first_name = ? AND last_name = ?', [roleId, employeeFirstName, employeeLastName]);

    main();

};

const updateEmployeeManager = async (db, main, clear) => {
    const [employees] = await db.promise().query('SELECT first_name, last_name from employees');
    const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
    const employeeManagerChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
    employeeManagerChoices.push('None');
    clear();

    const newManagerData = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_name',
            message: 'select employee to update',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'managers',
            message:'select new manager',
            choices: employeeManagerChoices
        }
    ]);
 
    const employeeFirstName = newManagerData.employee_name.split(' ')[0];
    const employeeLastName = newManagerData.employee_name.split(' ')[1];

    if (newManagerData.managers === 'None'){
        await db.promise().query('UPDATE employees SET manager_id = NULL WHERE first_name = ? AND last_name = ?', [employeeFirstName, employeeLastName]);
    } else {
        const managerFirstName = newManagerData.managers.split(' ')[0];
        const managerLasttName = newManagerData.managers.split(' ')[1];

        const managerIdQuery = await db.promise().query('SELECT id FROM employees WHERE first_name = ? AND last_name = ?', [managerFirstName, managerLasttName]);
        const managerId = managerIdQuery[0][0].id;

        await db.promise().query('UPDATE employees SET manager_id = ? WHERE first_name = ? AND last_name = ?', [managerId, employeeFirstName, employeeLastName]);
    };

    main();
}


module.exports = {showEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager};
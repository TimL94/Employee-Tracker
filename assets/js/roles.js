const inquirer = require('inquirer');

function showRoles (db, main, clear, bannerMessage) {
    
    const roleQuery = `
    SELECT r.title , r.id, d.department_name , r.hourly_wage 
    FROM roles r 
    JOIN departments d ON r.department_id = d.id`;
    clear()

    db.query(roleQuery, function (err, results) {
        clear();
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
        bannerMessage();
        
    });
    main();
};

const addRole = async (db, main, clear) => {
    const [departments] = await db.promise().query('SELECT department_name FROM departments');
    const departmentChoices = departments.map(department => department.department_name);
    clear()

    const roleData = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter role title: ',
        },
        {
            type: 'input',
            name: 'hourly_wage',
            message: 'Enter houlry wage: ',
            validate: validateNumber
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose department',
            choices: departmentChoices
        }

    ]);

    const departmentIdQuery = await db.promise().query('SELECT id FROM departments WHERE department_name = ?', roleData.department);
    const departmentId = departmentIdQuery[0][0].id;

    await db.promise().query('INSERT INTO roles (title, hourly_wage, department_id) VALUES (?, ?,?)', [roleData.role_title, roleData.hourly_wage, departmentId]);
    main();

};

const validateNumber = input => {
    const number = Number(input);
    if(Number.isInteger(number)) {
        return true;
    }else {
        return "Please enter a valid number";
    }
}

module.exports = {showRoles, addRole};
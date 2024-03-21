const inquirer =  require('inquirer');

function showDepartments(db, main, clear, bannerMessage) {
    const departmentQuery = 'SELECT * FROM departments';
    db.query(departmentQuery, function (err, results) {
        clear();
        if (err) {
            console.error('error in query', err);
        }
        console.log(`\n|------|--------------|`);
        console.log(`| ID   | Department   |`);
        console.log(`|------|--------------|`);
        results.forEach(department => {
            const departmentId = department.id.toString().padEnd(4);
            const departmentName = department.department_name.padEnd(12);
            console.log(`| ${departmentId} | ${departmentName} |`);
        });
        console.log(`|------|--------------|`);
        bannerMessage();
    });
    
    main();
};

const addDepartment = async (db, main, clear, bannerMessage) => {
    clear();
    const departmentData = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter department name: '
        }
    ]);

    await db.promise().query('INSERT INTO departments (department_name) VALUES (?)', departmentData.department);
    main();
}

const showEmployeeByDepartment = async (db, main, clear, bannerMessage) => {
    const employeeDepartmentQuery = `
    SELECT e.first_name, e.last_name, d.department_name
    FROM employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d on r.department_id = d.id;`;
    
    db.query(employeeDepartmentQuery, function (err, results) {
        clear();
        if (err) {
            console.error('Error in query', err);
        }
        console.log('|------------|------------|--------------|');
        console.log('| First Name | Last Name  | Department   |');
        console.log('|------------|------------|--------------|');
        results.forEach(employee => {
            const firstName = employee.first_name.padEnd(10);
            const lastName = employee.last_name.padEnd(10);
            const department = employee.department_name.padEnd(12);
            console.log(`| ${firstName} | ${lastName} | ${department} |`);
        });
        console.log('|------------|------------|--------------|');
        bannerMessage();
    });
    main();
    

};

module.exports = {showDepartments, addDepartment, showEmployeeByDepartment};
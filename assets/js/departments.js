const inquirer =  require('inquirer');

function showDepartments(db, askUser) {
    const departmentQuery = 'SELECT * FROM departments';
    db.query(departmentQuery, function (err, results) {
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
    askUser();
};

const addDepartment = async (db, askUser, createSpace) => {
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


module.exports = {showDepartments, addDepartment};
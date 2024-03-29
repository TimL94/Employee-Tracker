
 SELECT * FROM departments;

 SELECT r.title AS role, r.id, d.department_name AS department, r.hourly_wage
 FROM roles r
JOIN departments d ON r.department_id = d.id;

SELECT e.id, e.first_name AS first, e.last_name AS last, r.title, d.department_name AS department, r.hourly_wage AS hourly, m.last_name AS manager_last_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
JOIN roles r ON e.role_id = r.id
JOIN departments d ON r.department_id = d.id;


SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN roles r ON e.role_id = r.id
JOIN departments d on r.department_id = d.id;


SELECT d.department_name, SUM(r.hourly_wage) AS total_hourly
FROM employees e
JOIN roles r ON e.role_id = r.id
JOIN departments d on r.department_id = d.id
GROUP BY d.department_name;
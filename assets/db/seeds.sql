INSERT INTO departments (department_name)
VALUES  ("Service"),
        ("Kitchen"),
        ("Bar"),
        ("Maintenance");

INSERT INTO roles (title, hourly_wage, department_id)
VALUES  ("Server", 3.25, 1),
        ("TOGO Server", 10, 1),
        ("Host", 12.50, 1),
        ("Service Manager", 32, 1),
        ("Fry Cook", 15.25, 2),
        ("Grill Cook", 17.25, 2),
        ("Prep Cook", 15.5, 2),
        ("Kitchen Manager", 32, 2),
        ("Bar Back", 10, 3),
        ("Bartender", 5, 3),
        ("Bar Manager", 32, 3),
        ("Dishwasher", 12, 4),
        ("General Manager", 40, 4);

INSERT INTO employees (first_name, last_name,role_id, manager_id)
VALUES  ("Bill","Nye",13, NULL),
        ("Chuck","Norris",4, 1),
        ("Barak","Obama",8, 1),
        ("Sadie","Hawkins",11, 1),
        ("Stan","Smith", 1, 2),
        ("Jannet","Michaels",1, 2),
        ("Joey","Juarez",1, 2),
        ("Candice","Candy",1, 2),
        ("Joel","Biggy",2, 2),
        ("Hanna","Semolie",2, 2),
        ("Jackie","Jones",3, 2),
        ("Mike","Asters",3, 2),
        ("Eduardo","Hernandez",5, 3),
        ("Ralf","Moody",5, 3),
        ("George","Georgina",6, 3),
        ("Kyle","Estell",6, 3),
        ("Chad","Chadwicks",7, 3),
        ("Kenedy","Smith",9, 4),
        ("Bob","Murray",10, 4),
        ("Ryan","Reynolds",10, 4),
        ("Jet","Lee",12, 3);




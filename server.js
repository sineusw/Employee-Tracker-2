const inquirer = require('inquirer');
const cTable = require('console.table');


const { connection } = require('./config/connection');


const roleOptions = () => {
  var rolesArray = [];
  connection.query(`SELECT * FROM role`,
  (err, res) => {
    if (err) throw err;
    res.forEach((role) => {
      rolesArray.push({
        value: role.id, 
        name: role.title
      })
    });
  })
  return rolesArray;
};


const departmentOptions = () => {
  var depArray = [];
  connection.query(`SELECT * FROM departments`,
  (err, res) => {
    if (err) throw err;
    res.forEach((dep) => {
      depArray.push({
        value: dep.id, 
        name: dep.department
      })
    })
  })
  return depArray;
};

const employeeOptions = () => {
  var employeeArray = [];
  connection.query(`SELECT * FROM employee`,
  (err, res) => {
    if (err) throw err;
    res.forEach((employee) => {
      employeeArray.push({
        value: employee.id, 
        name: `${employee.first_name} ${employee.last_name}`
      })
    });
  })
  return employeeArray;
};



const manageOffice = () => {
  inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Employees by Department',
        'View Employees by Roles',
        'Add Department',
        'Add Employee',
        'Add Roles',
        'Update Employee Role',
        'Delete Employee'
      ]
    }
  ])
  .then((res) => {
    if (res.action === 'View All Employees') {
      viewAll();
    } else if (res.action === 'View Employees by Department') {
      viewByDep();
    } else if (res.action === 'View Employees by Roles') {
      viewByRole();
    } else if (res.action === 'Add Department') {
      addDepartment();
    } else if (res.action === 'Add Employee') {
      addEmployee();
    } else if (res.action === 'Add Roles') {
      addRole();
    } else if (res.action === 'Update Employee Role') {
      updateEmployee();
    }else if (res.action === 'Delete Employee') {
      deleteEmployee();
    }
  })
};

const viewAll = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee
  LEFT JOIN employee as m
  ON m.id = employee.manager_id
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN departments
  ON role.department_id = departments.id`, 
  (err, res) => {
    if (err) throw err;
    console.table(res);
    manageOffice();
  }
  )
};

const viewByRole = () => {

  inquirer.prompt([
    {
      type: 'confirm',
      message: "You are searching employees based on role.",
      name: 'confirm'
    },
    {
      name: 'role',
      type: 'list',
      choices: roleOptions(),
      message: "What role do you want to search?"
    }
  ])
  .then((res) => {
    connection.query(`SELECT employee.first_name, employee.last_name, role.title
    FROM employee 
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN departments
    ON role.department_id = departments.id
    WHERE role_id = ?`,
    [`${res.role}`],
    (err, res) => {
      if (err) throw err;
      console.table(res);
      manageOffice();
    });
  });
};

const viewByDep = () => {
  inquirer.prompt([
    {
      type: 'confirm',
      message: "You are searching employees based on department.",
      name: 'confirm'
    },
    {
      name: 'department',
      type: 'list',
      choices: departmentOptions(),
      message: "What department do you want to search?"
    }
  ])
  .then((res) => {
    connection.query(`SELECT employee.first_name, employee.last_name, role.title
    FROM employee
    RIGHT JOIN role
    ON employee.role_id = role.id
    RIGHT JOIN departments
    ON role.department_id = departments.id
    WHERE department_id = ?`,
    [`${res.department}`],
    (err, res) => {
      if (err) throw err ;
      console.table(res);
      manageOffice();   
    });
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'departmentName',
      type: 'input',
      message: 'What is the department called?'
    }
  ])
  .then((resAddDep) => {
    connection.query(
      'INSERT INTO departments SET ?',
      {
        department: resAddDep.departmentName,
      },
      (err) => {
        if (err) throw err;
        console.log(`The ${resAddDep.departmentName} department has been added.`)
        manageOffice();
      }
    );
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      name: 'firstName',
      type: 'input',
      message: "What is the employee's first name?"
    },
    {
      name: 'lastName',
      type: 'input',
      message: "What is the employee's last name?"
    },
    {
      name: 'role',
      type: 'list',
      choices: roleOptions(),
      message: "What is the employee's title?"
    },

  ])
  .then((resAddEmp) => {
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: resAddEmp.firstName,
        last_name: resAddEmp.lastName,
        role_id: resAddEmp.role,
      },
      (err) => {
        if (err) throw err;
        console.log(`${resAddEmp.firstName} ${resAddEmp.lastName} has been added.`)
        manageOffice();
      }
    );
  });
};


const addRole = () => {
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What role would you like to add?'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the starting salary for this position?'
    },
    {
      name: 'department',
      type: 'list',
      choices: departmentOptions(),
      message: 'In what department is this position?'
    }
  ])
  .then((resAddRole) => {
    connection.query(
      'INSERT INTO role SET ?',
      {
        title: resAddRole.title,
        salary: resAddRole.salary,
        department_id: resAddRole.department
      },
      (err) => {
        if (err) throw err;
        console.log(`Position ${resAddRole.title} has been added.`)
        manageOffice();
      }
    );
  });
};


const updateEmployee = () => {
  inquirer.prompt([
    {
      type: 'confirm',
      message: "Would you like to change an employees role?",
      name: 'confirm'
    },
    {
      name: 'employee',
      type: 'list',
      choices: employeeOptions(),
      message: 'Which employee do you want to update?'
    },
    {
      name: 'update',
      type: 'list',
      choices: roleOptions(),
      message: 'What is their new role?'
    }
  ])
  .then((res) => {
    connection.query(`UPDATE employee SET role_id = ${res.update} WHERE id = ${res.employee}`,
    (err) => {
      if (err) throw err;
      connection.query(`SELECT first_name, last_name
      FROM employee
      WHERE id = ${res.employee}`,
      (err, response) => {
        if(err) throw err;
        console.log(`${response[0].first_name} ${response[0].last_name} has been updated.`);
        manageOffice();
      })
    })
  });
};

const deleteEmployee = () => {
  inquirer.prompt([
    {
      type: 'confirm',
      message: "Do you want to delete an employee?",
      name: 'confirm'
    },
    {
      name: 'employee',
      type: 'list',
      choices: employeeOptions(),
      message: "Which employee do you want to delete?"
    }
  ])
  .then((res) => {
    connection.query(`DELETE FROM employee WHERE id = ${res.employee}`,
    (err) => {
      if (err) throw err;
      console.log("Employee deleted.")
      manageOffice();
    })
  })
}

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  manageOffice();
});


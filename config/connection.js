require('dotenv').config();
// const mysql = require('mysql')


// const connection = mysql.createConnection({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
// }

// );

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: "employees_db"
});

// let connection = mysql.createConnection(configuration);

module.exports = { connection };
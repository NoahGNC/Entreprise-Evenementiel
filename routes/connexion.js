const mysql = require('mysql');
const connection = mysql.createConnection({
   host: 'localhost',
   port: '3306',
   user: 'info6',
   password: '2uF',
   database: 'info6'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});


module.exports = connection;

const mysql= require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'amil',
    database: 'com_db'
  });
  connection.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected!");
});

module.exports = connection;
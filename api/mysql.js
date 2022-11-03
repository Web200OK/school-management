const mysql = require('mysql');
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'school',
    multipleStatements: true, //允许多条语句
    timezone: "SYSTEM", //优化时间格式

});
module.exports = connection
var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "383838",
  database: "mblog"
});
db.connect();
module.exports = db;

const mysql = require('mysql');
const { connect } = require('mongodb');
// Set up the connection to the local db
const mongoclient = connect("mongodb://mongodb:27017/Benchmark", { useNewUrlParser: true })
const mysqlClient = mysql.createConnection({
  host: "mysql",
  user: "tester",
  password: "testerpass"
});
exports.mongoclient = mongoclient;
exports.mysqlClient = mysqlClient;


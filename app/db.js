const mysql = require('mysql');
const { connect } = require('mongodb');

// Set up the connection to the local db

const mongoclient = connect("mongodb://mongodb:27017/Benchmark", { useNewUrlParser: true })
  .then(res => {
    console.log("Mongodb Connected!");
  });

exports.mongoclient = mongoclient;


const mysqlClient = mysql.createConnection({
  host: "mysql",
  user: "tester",
  password: "testerpass"
});

mysqlClient.connect(function(err) {
  if (err) throw err;
  console.log("Mysql Connected!");
});

exports.mysqlClient = mysqlClient;


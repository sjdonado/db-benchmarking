<?php

require_once __DIR__ . "/vendor/autoload.php";

$mysqlserver = "mysql";
$username = "user";
$password = "test";
$dbname = "Sales100K";
$uri = 'mongodb://mongodb:27017/taller5';

require_once 'connect_mongo.php';
require_once 'connect_mysql.php';

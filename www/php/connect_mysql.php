<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Sales100K";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$countSec=0;
$idSales=1;
while ($countSec < 1) {
	 $start = microtime(true);

  	$sql="SELECT * FROM Sales100K_alt WHERE SalesID=". $idSales;
	$result = $conn->query($sql);

  $time_elapsed_secs = microtime(true) - $start;
  $idSales++;
  $countSec = $countSec + $time_elapsed_secs;
  if ($idSales % 1000 == 0)
    echo "<br/>Tiempo: " . $countSec . ", IdSales: " . $idSales;
  if ($idSales > 100000)
    $countSec = 1;

		flush();  
		ob_flush();  
}

echo "<br/>total time:".$countSec.", Ids:".$idSales;
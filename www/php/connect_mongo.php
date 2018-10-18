<?php

$collection = (new MongoDB\Client($uri))->Sales100K->Employees;

echo $collection;

$cursor = $collection->find([]);

foreach ($cursor as $document) {
    echo $document['_id'], "\n";
}
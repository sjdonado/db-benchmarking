# Setup

* Requirements: Docker
* Execute inside root folder
```
    docker-compose up
    docker exec www composer install -d /www/php
    docker exec www php /www/php/index.php
```

## Import Sales100k
```
    docker exec mongo mongoimport --host mongodb --db taller5 --collection Sales100K --type json --file /dump/Sales100K.json --jsonArray
```
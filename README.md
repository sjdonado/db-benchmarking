# Setup
* Requirements: Docker
* Execute inside root folder
```
    docker-compose up
```

## Import Sales100k
```
    mongoimport --db taller5 --collection Sales100k --file Sales100K.json --jsonArray
```
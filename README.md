# Setup (Windows 10)

## Import Sales100k
```
    mongoimport --db taller5 --collection Sales100k --file Sales100K.json --jsonArray
```

## PHP
```
    composer install
    docker run --name taller5 -p 41061:22 -p 41062:80 -d -v ./php:/www tomsik68/xampp
```
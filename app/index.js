const { mongoClient, mysqlClient } = require('./db');
Promise.all([mongoClient, mysqlClient])
  .then(res => {
    console.log("Mongodb Connected!");
    console.log("Mysql Connected!");    
    mongoQueriesHandler(res[0].db('test'));
    mysqlQueriesHandler(res[1]);
  })
  .catch( err => console.error(err));

function mysqlQueriesHandler(connection) {
  console.log('-- EXECUTING MYSQL QUERIES --');

  // Joins authors with their posts
  const query = 'SELECT authors.*, posts.* FROM authors JOIN posts ON authors.id = posts.author_id';
  mysqlQueryToPromise(connection, query)
    .then( res => console.log('MYSQL: QUERY 1 ', res));
  
  // Joins authors with their posts and excludes those who have less than 100 posts
  const query2 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id) SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont<100 and a.id=pc.id'
  mysqlQueryToPromise(connection, query2)
    .then( res => console.log('MYSQL: QUERY 2', res));
  // Joins authors with their posts and exludes those who have less than 40 posts 
  // and more than 80 posts
  const query3 = 'with PostCounter(cont,id) as(SELECT Count(p.author_id), p.author_id FROM posts p Group by p.author_id) SELECT a.*, p.* FROM authors a , posts p, PostCounter pc where a.id = p.author_id and pc.cont<40 and pc.cont>80 and a.id=pc.id'
  mysqlQueryToPromise(connection, query3)
  .then( res => console.log('MYSQL: QUERY 3', res));
}

function mongoQueriesHandler(db) {
  console.log('-- EXECUTING MONGO QUERIES --');
  
  // Joins authors with their posts
  db.collection('authors').aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    }
  ]).toArray().then(res => console.log('MONGO: QUERY 1 ', res));

  // Joins authors with their posts and excludes those who have less than 100 posts
  db.collection('authors').aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gte: [ {$size: '$posts'}, 100]
        }
      }
    }
  ]).toArray().then(res => console.log('MONGO: QUERY 2 ', res));

  // Joins authors with their posts and exludes those who have less than 40 posts 
  // and more than 80 posts
  db.collection('authors').aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author_id',
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [ {$size: '$posts'}, 40]
            },
            {
              $lte: [ {$size: '$posts'}, 80]
            }
          ] 
        }
      }
    }
  ]).toArray().then(res => console.log('MONGO: QUERY 3 ', res));

  // Joins authors with their posts and exludes those who have less than 50 posts 
  // and all of them was published before 2000/01/01
  db.collection('authors').aggregate([
    {
      $lookup: {
        from: 'posts',
        let: {
          id: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [ '$date', new Date(2000, 0, 1)]
                  },
                  {
                    $eq: [ '$$id','$author_id' ]
                  }
                ]
              }
            }
          }
        ],
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gte: [ {$size: '$posts'}, 50]
        }
      }
    }
  ]).toArray().then(res => console.log('MONGO: QUERY 4 ', res));

  // Joins authors with their posts and exludes those who: 
  // - were born before 1999/01/01
  // - their email match the regex
  // - have less than 30 posts and all of them was published before 1995/03/15
  db.collection('authors').aggregate([
    {
      $match: {
        $expr: {
          $gte: [ '$birthdate', new Date(1999, 0, 1)]
        },
        email: /^.*(\d+).*\.com$/ig
      }
    },
    {
      $lookup: {
        from: 'posts',
        let: {
          id: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [ '$date', new Date(1995, 3, 15)]
                  },
                  {
                    $eq: [ '$$id','$author_id' ]
                  }
                ]
              }
            }
          }
        ],
        as: 'posts'
      }
    },
    {
      $match: {
        $expr: {
          $gt: [ {$size: '$posts'}, 30],
        }
      }
    }
  ]).toArray().then(res => console.log('MONGO: QUERY 5 ', res));
}

function mysqlQueryToPromise(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query,(err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }     
    })
  })
}

const { mongoclient, mysqlClient } = require('./db');

mongoclient.then(client => {
  console.log("Mongodb Connected!");
  const db = client.db('test');
  mongoQueriesHandler(db);
});


mysqlClient.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Mysql Connected!");
});

function mysqlQueriesHandler(db) {
  console.log('-- EXECUTING MYSQL QUERIES --');

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
  ]).toArray().then(res => console.log('QUERY 1: ', res));

  // Joins authors with their posts and exludes those who have less than 100 posts
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
  ]).toArray().then(res => console.log('QUERY 2: ', res));

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
  ]).toArray().then(res => console.log('QUERY 3: ', res));

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
  ]).toArray().then(res => console.log('QUERY 4: ', res));

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
  ]).toArray().then(res => console.log('QUERY 5: ', res));
}


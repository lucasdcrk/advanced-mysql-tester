import initDb from './mysql.js';
import fs from 'fs';
import 'dotenv/config';

const compare = process.argv[2] === 'compare';

const db1 = initDb({
  name: 'DB1',
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

let db2;
if (compare) {
  db2 = initDb({
    name: 'DB2',
    host: process.env.ODB_HOSTNAME,
    port: process.env.ODB_PORT || 3306,
    database: process.env.ODB_DATABASE,
    user: process.env.ODB_USERNAME,
    password: process.env.ODB_PASSWORD,
  });
}

const queries = {};

fs.readdirSync('./src/queries').forEach((file) => {
  const queryName = file.split('.')[0];
  queries[queryName] = fs.readFileSync(`./src/queries/${file}`, 'utf8');
});

function getPromises(db, name) {
  if (!db) {
    return [];
  }

  return Object.keys(queries).map((queryName) => {
    return new Promise((resolve, reject) => {
      const query = queries[queryName];
      const start = new Date().getTime();

      db.query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const end = new Date().getTime();

          console.log(`[${name}] Completed ${queryName} in ${end - start}ms`);

          resolve({
            query: queryName,
            time: end - start,
          });
        }
      });
    });
  });
}

async function runQueries() {
  const db1Promises = getPromises(db1, 'DB1');
  const db2Promises = getPromises(db2, 'DB2');

  try {
    const db1Results = await Promise.all(db1Promises);
    const db2Results = await Promise.all(db2Promises);

    console.log('All queries executed.');
    console.log('-----------------');
    console.log('DB1 Results:');
    db1Results?.map((result) => {
      console.log(`${result.query}: ${result.time}ms`);
    });
    if (compare) {
      console.log('-----------------');
      console.log('DB2 Results:');
      db2Results?.map((result) => {
        console.log(`${result.query}: ${result.time}ms`);
      });
    }
  } catch (error) {
    console.error('Error executing queries:', error);
  }
}

runQueries().then(results => {
  process.exit();
});

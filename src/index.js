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

async function runQueries(db) {
  const queryPromises = Object.keys(queries).map((queryName) => {
    return new Promise((resolve, reject) => {
      const query = queries[queryName];
      const start = new Date().getTime();

      db.query(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const end = new Date().getTime();
          console.log(`${queryName}: ${end - start}ms`);
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(queryPromises);
    console.log('All queries completed.');
  } catch (error) {
    console.error('Error executing queries:', error);
  }
}

if (compare) {
  console.log('Running queries on multiple databases...');
}

runQueries(db1).then(() => {
  if (compare) {
    runQueries(db2).then(() => {
      process.exit();
    });
  } else {
    process.exit();
  }
});

import mysql from 'mysql2';

export default function initDb(config) {
  const connection = mysql.createConnection({
    host: config.host,
    port: config.port || 3306,
    database: config.database,
    user: config.user,
    password: config.password,
  });

  console.log(`Connecting to ${config.name} with config`, {
    ...config,
    password: config.password.replace(/./g, '*'),
  });

  connection.connect((err) => {
    if (err) {
      console.log(`Error connecting to ${config.name}`, err);
      return;
    }
    console.log(`Connection established with ${config.name}`);
  });

  return connection;
}

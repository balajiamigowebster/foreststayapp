const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const main = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foreststay_db'
  });

  const hash = bcrypt.hashSync('password123', 10);
  console.log('Generated hash:', hash);

  await connection.query('UPDATE users SET password = ?', [hash]);
  console.log('Database passwords successfully updated in MySQL!');
  await connection.end();
};

main().catch(console.error);

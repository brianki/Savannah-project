const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('database.db');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');

app.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('index', { users: rows });
    }
  });
});

app.post('/users', (req, res) => {
  const userName = req.body.name;

  if (userName) {
    db.run('INSERT INTO users (name) VALUES (?)', [userName], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.status(400).send('Bad Request: User name cannot be empty');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


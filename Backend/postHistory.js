const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const port = 3060;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'users',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Define an endpoint to insert URLs into the history table
app.post('/insert-url', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const { username, url } = req.body;

    // console.log(req.body);

    // Get the user_id for the given username
    pool.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user_id = parseInt(results[0].id);

        // Insert the URL into the history table
        pool.query('INSERT INTO history (user_id, url) VALUES (?, ?)', [user_id, url], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            return res.status(201).json({ message: 'URL inserted successfully' });
        });
    });
});


app.get('/history', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  
    const username = req.query.username;
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'users',
    });
  
    // Wrap the entire try-catch-finally block in an async function
    (async () => {
      try {
        await new Promise((resolve, reject) => {
          // Get user ID based on the provided username
          connection.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
              console.error(err);
              reject({ status: 500, error: 'Internal Server Error' });
            }
  
            if (results.length === 0) {
              reject({ status: 404, error: 'User not found' });
            }
  
            const user_id = parseInt(results[0].id);
  
            // Retrieve history for the user based on user_id
            connection.query('SELECT url FROM history WHERE user_id = ?', [user_id], (err, results) => {
              if (err) {
                console.error(err);
                reject({ status: 500, error: 'Internal Server Error' });
              }
  
              // Extract URLs from the results and concatenate into a single list
              const allUrls = results.map((item) => item.url);

  
              res.json({ results: allUrls });
              resolve(); // Resolve the promise to signal the completion of the query
            });
          });
        });
      } finally {
        // Close the database connection after executing queries
        connection.end();
      }
    })();
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

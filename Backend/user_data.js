const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(bodyParser.json());

// Replace with your actual MySQL connection details
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'users',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.post('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const { username, password } = req.body;

    console.log(username, password);

    // Check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUserQuery, [username], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                // User not found, add the user to the database
                const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
                connection.query(insertUserQuery, [username, password], (error, insertResult) => {
                    if (error) {
                        console.error('Error inserting new user:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        console.log('User added to the database:', insertResult);
                        res.status(200).json({ success: true });
                    }
                });
            } else {
                // User found, check password
                const storedPassword = results[0].password;
                if (password === storedPassword) {
                    // Passwords match, login successful
                    res.status(200).json({ success: true });
                } else {
                    // Passwords don't match
                    res.status(401).json({ error: 'Incorrect password' });
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

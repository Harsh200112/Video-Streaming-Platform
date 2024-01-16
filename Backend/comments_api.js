const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const port = 3070;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'users',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Unable to connect to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Route to add a comment
app.post('/add-comment', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const { videoId, username, comment } = req.body;

    console.log(videoId, username, comment);

    const sql = 'INSERT INTO comments (video_id, username, comment) VALUES (?, ?, ?)';
    db.query(sql, [videoId, username, comment], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Comment added:', result);
            res.status(200).json({ success: true });
        }
    });
});

// Route to get comments for a specific video
app.get('/get-comments', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    const videoId  = req.query.q;

    const sql = 'SELECT * FROM comments WHERE video_id = ?';
    db.query(sql, [videoId], (err, results) => {
        if (err) {
            console.error('Error getting comments:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Comments retrieved:', results);
            res.status(200).json({ comments: results });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

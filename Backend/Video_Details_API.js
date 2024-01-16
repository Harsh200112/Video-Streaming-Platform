// index.js

const express = require('express');
const { MongoClient} = require('mongodb');
const app = express();
const port = 3020;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/Youtube';

// Route for fetching video details by IDs
app.get('/videos', async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    let videoIds = req.query.ids;

    if (!videoIds) {
        return res.status(400).json({ error: 'Video IDs are required.' });
    }

    // If video IDs are provided as a single string, split them into an array
    if (!Array.isArray(videoIds)) {
        videoIds = videoIds.split(',');
    }

    if (videoIds.length === 0) {
        return res.status(400).json({ error: 'Video IDs are required and should be provided as an array.' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db();

        const videoDetails = [];

        for (const videoId of videoIds) {
            const videoData = await db.collection('Videos').findOne({ 'videoInfo.id': videoId });
    
            if (videoData) {
                videoDetails.push(videoData);
            }
        }

        res.json({ results: videoDetails });
    } catch (error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const {MongoClient} = require('mongodb');

const app = express();
const port = 3010;

app.get('/search', async (req, res)=>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const search_query = req.query.q;

    if (!search_query){
        return res.status(400).json({error : 'Search Query is Required'});
    }
    
    const client = new MongoClient('mongodb+srv://root:root@cluster0.otpm4ji.mongodb.net/');

    try{
        await client.connect();

        const db = client.db('Youtube');
        const collection = db.collection('Videos');

        const result = await collection.aggregate([
            {
                $search: {
                index: "search",
                text: {
                    query: search_query,
                    path: ["videoInfo.snippet.title", "videoInfo.snippet.description"],
                },
                },
            },
            {
                $limit:
                8,
            }
        ])
        const resultArray = await result.toArray();

        console.log(resultArray);
        res.json({ results: resultArray });
    }
    catch(error) {
        console.error('MongoDB error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
    finally {
        client.close();
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
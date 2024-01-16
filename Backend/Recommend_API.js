const express = require('express');
const neo4j = require('neo4j-driver');

const app = express();
const port = 3030;

const driver = neo4j.driver('neo4j+s://61d6341d.databases.neo4j.io', neo4j.auth.basic('neo4j', 'MgDyvNHTN6MpPBPzKEnKT9Dp8_RDfAtnMH7crplAkkc'));

app.get('/recommend', async(req, res)=>{
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const content_type = parseInt(req.query.q);

    if (!content_type) { 
        res.status(400).json({error: "Content Type Required."})
    }
    const session = driver.session();

    try{
        const result = await session.run(
            'MATCH (c:Category)-[:Contains]->(v:Video) WHERE c.category_id=$content_type RETURN v LIMIT 10;',
            {content_type}
        )

        const video_ids = result.records.map(record => record.get('v').properties.video_id);
        res.json({results: video_ids});
    }
    catch (error){
        console.error('Neo4j error:', error);
        res.status(500).json({error:"Internal Server Error."})
    }
    finally{
        await session.close();
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
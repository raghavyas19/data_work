const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const data = JSON.parse(fs.readFileSync('data.json'));

async function run() {
    try {
        await client.connect();
        const database = client.db('transactions');
        const collection = database.collection('table');

        await collection.insertMany(data);
        console.log('Data inserted successfully');
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

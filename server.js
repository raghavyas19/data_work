const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/data', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    await client.connect();
    const database = client.db('transactions');
    const collection = database.collection('table');

    const data = await collection.find().skip(skip).limit(limit).toArray();
    const total = await collection.countDocuments();

    res.json({
        data,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    });

    await client.close();
});

app.listen(3000);

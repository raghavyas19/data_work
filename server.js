const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/data', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';
    await client.connect();
    const database = client.db('transactions');
    const collection = database.collection('table');
    const pipeline = [
        {
            $match: {
                $or: [
                    { transactionId: { $regex: searchTerm, $options: 'i' } },
                    { serviceName: { $regex: searchTerm, $options: 'i' } }
                ]
            }
        },
        {
            $facet: {
                metadata: [{ $count: 'total' }, { $addFields: { page: page } }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        }
    ];
    const result = await collection.aggregate(pipeline).toArray();
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
        data: result[0].data,
        totalPages: totalPages,
        currentPage: page
    });
    await client.close();
});

app.listen(3000);

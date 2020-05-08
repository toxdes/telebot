require('dotenv').config();
const { Client } = require('pg');

const { q } = require("../src/queries");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

test('connect to database', async () => {
    let data = await client.connect();
    expect(data).toBeUndefined();
});


test('disconnect from database', async () => {
    const data = await client.end();
    expect(data).toBeUndefined();
})

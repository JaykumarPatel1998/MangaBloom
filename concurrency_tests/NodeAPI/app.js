// import express from 'express'
// import pg from 'pg'

const express = require('express')
const pg = require('pg')

const CONNECTION_STRING = `postgres://postgres:password@localhost:5432/postgres`

const pool = new pg.Pool({
    connectionString : CONNECTION_STRING,
    max: 20, // max number of connections in the pool
    idleTimeoutMillis: 30000, //close after 30 sec of idle time
    connectionTimeoutMillis: 2000 //timeout error after 2sec of connection not available
})

const app = express()

app.get('/', async (req, res) => {
    // const DATABASE_TIMEOUT = 5000 //5 sec

    try {
        const client = await pool.connect()
        let mangas = [] 
        try {
            const queryPromise = await client.query("SELECT * from manga")

            // const timeoutPromise = new Promise((_, reject) => {
            //     setTimeout(() => {
            //         reject(new Error(`Database Timed Out`))
            //     }, DATABASE_TIMEOUT);
            // })

            // mangas = await Promise.race([queryPromise, timeoutPromise])

            // mangas = await queryPromise
            mangas = [...queryPromise.rows.entries()];
        } finally {
            client.release()
        }

        return res.json(mangas)
    } catch (error) {
        console.error(`Error Detected : ${error}`)
        res.status(500).json({
            "Health" : "NOT OK 🔴",
        })
    }
});

app.get('/health', (req, res) => {
    return res.json({
        'status' : 200,
        'message' : "Health OK 🟢"
    })
})

app.listen(5000, () => {
    console.log("listening on port : ", 5000)
})
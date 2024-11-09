const express = require('express')
const {Pool} = require('pg')

const CONNECTION_STRING = `postgres://postgres:password@localhost:5432/postgres`

const pool = new Pool({
    connectionString : CONNECTION_STRING,
    max: 20, // max number of connections in the pool
    idleTimeoutMillis: 30000, //close after 30 sec of idle time
    connectionTimeoutMillis: 2000 //timeout error after 2sec of connection not available
})

const app = express()

app.post('/api/register',express.raw({ type: '*/*' }), async (req, res) => {
    const reqBody = JSON.parse(req.body)
    const DATABASE_TIMEOUT = 5000 //5 sec

    try {
        const client = await pool.connect()

        try {
            const queryPromise = client.query("INSERT INTO user_detail(name, address) values($1, $2)", [reqBody.name, reqBody.address])

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Database Timed Out`))
                }, DATABASE_TIMEOUT);
            })

            await Promise.race([queryPromise, timeoutPromise])
        } finally {
            client.release()
        }

        return res.status(200).json({
            "Health" : "OK 🟢"
        })
    } catch (error) {
        console.error(`Error Detected : ${error}`)
        res.status(500).json({
            "Health" : "NOT OK 🔴",
        })
    }
})

app.get('/', (req, res) => {
    return res.json({
        'status' : 200,
        'message' : "Health OK 🟢"
    })
})

pool.connect().then((client) => {
    const create_statement = 
    `
    CREATE TABLE IF NOT EXISTS "user_detail" ( 
        "id" SERIAL,
        "name" TEXT NOT NULL,
        "address" TEXT NULL,
         PRIMARY KEY ("id")
    );
    `

    return client.query(create_statement).then(() => {
        console.log("Database connected")
        app.listen(5000, () => {
            console.log("listening on port : ", 5000)
        })
        client.release()
    }).catch((error) => {
        console.error(error)
        client.release()
    })

}).catch((err) => {
    console.error(err)
})

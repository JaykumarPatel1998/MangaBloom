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

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

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

app.get('/', async (req, res) => {
    const DATABASE_TIMEOUT = 5000 //5 sec

    try {
        const client = await pool.connect()
        let mangas = [] 
        try {
            const queryPromise = await client.query("SELECT (id, title) from manga")

            // const timeoutPromise = new Promise((_, reject) => {
            //     setTimeout(() => {
            //         reject(new Error(`Database Timed Out`))
            //     }, DATABASE_TIMEOUT);
            // })

            // mangas = await Promise.race([queryPromise, timeoutPromise])

            // mangas = await queryPromise
            mangas = [...queryPromise.rows.entries()];
            console.log(mangas)
        } finally {
            client.release()
        }

        return res.render('pages/home', { mangas });
    } catch (error) {
        console.error(`Error Detected : ${error}`)
        res.status(500).json({
            "Health" : "NOT OK 🔴",
        })
    }

    // res.render('pages/home', { mangas }); // Pass mangas data to EJS template
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
const cluster = require('node:cluster')
const os = require('os')

const CPUs = os.cpus().length

console.log(`The total number of CPUs is ${CPUs}`)
console.log(`Primary Process : ${process.pid}`)
cluster.setupPrimary({
    exec: __dirname + "/app.js"
})

for (let i = 0; i < CPUs; i++) {
    cluster.fork()
}

cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker with PID ${worker.process.pid} has been killed`)
    console.log(`starting another worker`)
    cluster.fork()
})
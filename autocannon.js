const autocannon = require('autocannon')

const instance = autocannon({
  url: 'http://localhost:5000',
  connections: 1000, //default
  duration : 10,
  headers:  {
    'content-type' : 'application/json'
  },
  requests : [
    {
        method : 'POST',
        path: '/api/register',
        body : JSON.stringify({
            name : "Jay",
            address: "62 Lonborough Avenue"
        })
    }
  ]
}, (err, res) => {
    console.log("finished benchmarking", res)
})

autocannon.track(instance)
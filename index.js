const express = require('express')
const app = express()
require('dotenv').config()
const winston = require('winston')

require('./startup/logging')()
require("./startup/cors")(app);
require("./startup/uploads")(app);
require('./startup/prod')(app)

const port = process.env.PORT
app.listen(port, () => {
  winston.info(`Listening on port ${port}`)
})

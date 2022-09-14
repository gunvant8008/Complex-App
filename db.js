const dotenv = require("dotenv")
dotenv.config() // using environment variables for sensitive data
const { MongoClient } = require("mongodb")

const client = new MongoClient(process.env.CONNECTIONSTRING)

async function start() {
  await client.connect()
  module.exports = client // this line wll return the database object we are interested in
  const app = require("./app")
  app.listen(process.env.PORT) // now app is running after database connection, so we can use db
}
start()

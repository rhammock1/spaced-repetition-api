require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  "host": process.env.DATABASE_HOST,
  "port": process.env.DATABASE_PORT,
  "database": process.env.DATABASE_NAME,
  "username": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASS
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at Port:${PORT}`)
})

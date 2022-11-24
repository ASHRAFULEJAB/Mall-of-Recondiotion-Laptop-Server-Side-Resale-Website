
const express = require('express')
const cors = require('cors')
require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const stripe = require('stripe')(process.env.STRIPE_KEY)

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (re, res) => {
  res.send('Mall of Recondition Laptops  is running')
})
app.listen(port, () => {
  console.log(`Recondition laptops is running on ${port}`)
})
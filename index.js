const { MongoClient, ServerApiVersion } = require('mongodb');
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


//db


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnw37y6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const usersCollection = client.db('ResaleDB').collection('users')
    const categoryNameCollection = client.db('ResaleDB').collection('categoryName')



    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })
    app.get('/categoryName', async (req, res) => {
      const query = {}
      const result = await categoryNameCollection.find(query).toArray()
      res.send(result)
    })

  }
  finally {
    
  }
}
run().catch(console.dir)
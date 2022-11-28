const { MongoClient, ServerApiVersion } = require('mongodb')
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dnw37y6.mongodb.net/?retryWrites=true&w=majority`
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const usersCollection = client.db('ResaleDB').collection('users')
    const categoryNameCollection = client
      .db('ResaleDB')
      .collection('categoryName')
    const categoriesCollection = client.db('ResaleDB').collection('categories')
    const ordersCollection = client.db('ResaleDB').collection('orders')

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
    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id
      const filter = {category_id:id}
      // if (id === '06') {
      //   res.send(categoriesCollection)
      // } else {
      //   const selectedCategory = categoriesCollection.filter((nn) => nn.category_id === id)
      //   res.send(selectedCategory)
      // }

      // const id = req.params.category_id
      // console.log(id);
      // const query = { id }
      // console.log(query)
      const result = await categoriesCollection.find(filter).toArray()
      console.log(result)
      res.send(result)
    })
    app.get('/categories', async (req, res) => {
      const query = {}
      const result = await categoriesCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders)
      res.send(result)
    })
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query={ email: email }
      const result = await ordersCollection.find(query).toArray()
      res.send(result)
    })

    // admin role checking
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const user = await usersCollection.findOne(query)
      // console.log(user)
      res.send({ isAdmin: user?.role === 'admin' })
    })
    app.get('/users/seller/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const user = await usersCollection.findOne(query)
      // console.log(user)
      res.send({ isSeller: user?.role === 'Seller' })
    })
  } finally {
  }
}
run().catch(console.dir)

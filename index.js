const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_KEYY)

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

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

//jwt

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization
//   console.log(req.headers.authorization)
//   if (!authHeader) {
//     return res.status(401).send('Unauhtorized Access')
//   }
//   const token = authHeader.split(' ')[1]
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       return req.status(403).send('Forbidden access')
//     }
//     req.decoded = decoded
//     next()
//   })
// }

async function run() {
  try {
    const usersCollection = client.db('ResaleDB').collection('users')
    const categoryNameCollection = client
      .db('ResaleDB')
      .collection('categoryName')
    const categoriesCollection = client.db('ResaleDB').collection('categories')
    const ordersCollection = client.db('ResaleDB').collection('orders')
    const advertiseCollection = client.db('ResaleDB').collection('advertise')
    const paymentCollection = client.db('ResaleDB').collection('payment')
    const reportedCollection = client.db('ResaleDB').collection('reported')

    app.post('/users',  async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })
    app.put('/users/admin/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          verfiy: 'Veryfied',
        },
      }
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      )
      res.send(result)
    })

 

    //users section
    app.get('/users', async (req, res) => {
      const query = {}
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email }
      const user = await usersCollection.findOne(query)
      // console.log(user)
      res.send({ isVerfy: user?.verfiy === 'Veryfied' })
    })
      //jwt token
      function verifyJWT(req, res, next) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
          return res.status(401).send('Unauthorized Access')
        }
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN , function (err, decoded) {
          if (err) {
            return res.status(403).send('Forbidden Access')
          }
          req.decoded = decoded
          next()
        })
      }
  
       //jwt token
 
       app.post('/jwtToken', (req, res) => {
        const user = req.body
        console.log(user)
        const token = jwt.sign(user, process.env.ACCESS_TOKEN , {
          expiresIn: '10d',
        })
        res.send({ token })
      })

    //report admin
    app.post('/reportAdmin', async (req, res) => {
      const reported = req.body
      const result = await reportedCollection.insertOne(reported)
      res.send(result)
    })
    app.get('/reportAdmin', async (req, res) => {
      const query = {}
      const result = await reportedCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/reportAdmin/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const filter = { _id: id }
      // console.log(filter)
      const result = await reportedCollection.deleteOne(filter)
      // console.log(result)
      res.send(result)
    })

    //admin section
    app.post('/advertise', verifyJWT, async (req, res) => {
      const advertise = req.body
      const result = await advertiseCollection.insertOne(advertise)
      res.send(result)
    })
    app.get('/advertise', async (req, res) => {
      const query = {}
      const result = await advertiseCollection.find(query).toArray()
      res.send(result)
    })

    //category section
    app.get('/categoryName', async (req, res) => {
      const query = {}
      const result = await categoryNameCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/categories/:id', async (req, res) => {
      const product = req.body
      const result = await categoriesCollection.insertOne(product)
      console.log(result)
      res.send(result)
    })
    app.get('/categories', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const result = await categoriesCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/categories/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      console.log(filter)
      const result = await categoriesCollection.deleteOne(filter)
      res.send(result)
    })
    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id
      const filter = { category_id: id }
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

    //orders section
    app.post('/orders', async (req, res) => {
      const orders = req.body
      const result = await ordersCollection.insertOne(orders)
      res.send(result)
    })
    app.get('/orders', verifyJWT, async (req, res) => {
      const email = req.query.email
      const query = { email: email }
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
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const result = await usersCollection.deleteOne(filter)
      res.send(result)
    })

    //payment
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await ordersCollection.findOne(query)
      res.send(result)
    })

    app.post('/create-payment-intent', async (req, res) => {
      const order = req.body
      const price = parseInt(order.price)
      console.log(price)
      const amount = price * 100
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        payment_method_types: ['card'],
      })

      res.send({
        clientSecret: paymentIntent.client_secret,
      })
    })
    app.post('/payments', async (req, res) => {
      const payment = req.body
      const result = await paymentCollection.insertOne(payment)
      const id = payment.orderId
      const filter = { _id: ObjectId(id) }
      const updadtedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      }
      const updatedResult = await ordersCollection.updateOne(
        filter,
        updadtedDoc
      )
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir)

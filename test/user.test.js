const request = require('supertest')
const express = require('express')
const User = require('../models/user')
const mongoose = require('mongoose')

var logger = require('morgan')
var cookieParser = require('cookie-parser')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

var userController = require('../controllers/userController')

app.use('/user', userController)
const email = 'denisbpedroso@gmail.com'
var password = '1234'

describe('POST /user/', function() {
  beforeAll(async () => {
    // Removes the User collection
    await User.deleteMany() 
  })

  it('register user and responds with json of user', async done => {
    const res = await request(app)
      .post('/user/register')
      .send({ userEmail : email, userPassword : password})
    
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body).toMatchObject({ userEmail: email })

    const user = await User.findOne({ email })
    expect(user.email).toEqual(email)

    done()
  })

  it('User without check try logs in and receives error', async done => {
    const res = await request(app)
      .post('/user/login')
      .send({ email : email, password : password })
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body).toMatchObject({error: true})
    done()
  })


  it('Confirms the user', async done => {
    let user = await User.findOne({ email })
    const res = await request(app)
      .get(`/user/confirm/${user.link}`)
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body.user).toMatchObject({ checked: true})
    done()
  })


  it('logs in a user and responds user', async done => {
    const res = await request(app)
      .post('/user/login')
      .send({ email : email, password : password })
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body.data).toMatchObject({email})
    done()
  })

  it('logs in a user and wrong password', async done => {
    password = "0000"
    const res = await request(app)
      .post('/user/login')
      .send({ email : email, password : password })
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body).toContainAnyValues(["Invalid password"])
    done()
  })

  it('Tries to find an User by its email, and returns User', async done => {
    const res = await request(app)
      .get(`/user/find/${email}`)
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.header['content-type']).toMatch(/json/)
    expect(res.body).toMatchObject({email})
    done()
  })

  afterAll(async () => {
    // Removes the User collection
    await User.drop()
  })
})

const express = require('express')
const io = require('socket.io-client')

class Data {
  
  constructor (type, data) {
    this.type = type
    this.data = data
    this.date = Date.now()
  }

}

var logger = require('morgan')
var cookieParser = require('cookie-parser')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

let socket
let channel

const type = "message"

const email1 = 'denisbpedroso@gmail.com'
var password1 = '1234'

const email2 = 'rhulyanne@gmail.com'
var password2 = '1234'

channel = `${email1}-${email2}`

beforeEach((done) => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = io('http://localhost:3000/dynamic-1')

  socket.on('connect', () => {
    done()
  })


})

afterEach((done) => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect()
  }
  done()
})

describe('Socket on message', function() {
  it('expects type of message to be message', function (done) {
    let data = ''
    let messageData = {}
    messageData.name = 'Test'
    messageData.message = 'Message test'
    messageDataJson = JSON.stringify(messageData)

    let newData = new Data('message', messageDataJson)

    data = JSON.stringify(newData)

    setTimeout(() =>{
      socket.emit('*', data)
    }, 1000)

    socket.on('*', function(msg){
      console.log(msg)
      expect(message).toContain("error")
      expect(message).toMatchObject({type})
      done()
    })

    setTimeout(() =>{
      done()
    }, 15000)
    

  })
})

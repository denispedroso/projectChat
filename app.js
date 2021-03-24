var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var moment = require('moment')

var indexRouter = require('./routes/index')
var userController = require('./controllers/userController')
const MessageController = require('./controllers/messageController')
const Result = require('./models/Result')
const Data = require('./models/data')

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res, next){
  res.io = io;
  next();
});

// app.use('/', indexRouter)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html')
});
app.use('/user', userController)

io.on('connection', (socket) => {
  console.log("A user connected.");
})

const dynamicNsp = io.of(/\/.*$/).on('connect', (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
  let time = moment().format('LLL')
  // broadcast to all clients in the given sub-namespace
  // newNamespace.emit('*', `Connected at ${time} in ${newNamespace.name}`)
  console.log(`Connected at ${time} in ${newNamespace.name}`)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  });

  socket.on('checkUndelivered', async (data) => {
    incomingData = JSON.parse(data)
    let m = new  MessageController
    let messages = await m.checkUndelivered(incomingData)

    console.log(messages);

    messages.forEach(message => {
      let messageToExport = JSON.stringify(message)
      let dataToExport = new Data('message', messageToExport, message._id)
      let jsonToExport = JSON.stringify(dataToExport)
      socket.emit("*", jsonToExport)  
    })
  })

  socket.on('*', async (data) => {
    incomingData = JSON.parse(data)
    if (incomingData.hasOwnProperty('type')) {
      switch (incomingData.type) {
        case 'message':
          if (incomingData.hasOwnProperty('data')) {
            let incomingMessage = JSON.parse(incomingData.data)
            console.log(incomingMessage)
            let m = new MessageController
            result = await m.insert(incomingMessage)
            if (result instanceof Result) {
              console.error(result)
            } else {
              incomingData._id = result._id
              data = JSON.stringify(incomingData)
              socket.broadcast.emit('*', data)
              console.log(data)
            }
          }
          break;

        case 'delivered':
          if (incomingData.hasOwnProperty('_id')) {
            console.log(incomingData)
            let m = new MessageController
            let result = await m.delivered(incomingData._id)
            if (result instanceof Result) {
              console.log(result)
            }
            console.log(result)
          }
          break;
      
        default:
          io.emit('*', 'Error')
          break;
      }
    }
  })
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = {app: app, server: server};

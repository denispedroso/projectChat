var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/models/data.js', (req, res) => {
  res.sendFile(__dirname + '/models/data.js');
});

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  });

  socket.on('*', (data) => {
    incomingData = JSON.parse(data)
    if (incomingData.hasOwnProperty('type')) {
      switch (incomingData.type) {
        case 'register':
          
          break;
  
        case 'message':
          if (incomingData.hasOwnProperty('data')) {
            console.log(data)
            io.emit('*', data)
          }
          break;
      
        default:
          io.emit('*', 'Error')
          break;
      }
    }
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
})

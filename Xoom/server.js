const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs')
app.use(express.static('public'))

//This code will redirect the homepage to a random room, we want the room to be assigned by the user or renaomdlly generated. 
// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

app.get('/', (req, res) => {
  res.render('index')
})

// app.get('/userView', (req, res) => {
//   res.render('index', {username: req.params.username})
// })


app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(PORT)
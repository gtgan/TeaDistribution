const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// sets the engine to ejs and adds public folder to the server
app.set('view engine', 'ejs')
app.use(express.static('public'))

//This code will redirect the homepage to a random room, we want the room to be assigned by the user or renaomdlly generated. 
// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register')
})

// app.get('/userView', (req, res) => {
//   res.render('index', {username: req.params.username})
// })

//this adds the API routes
require("./app/routes/api-routes.js")(app);




// this is the code for the dynamic room routes
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
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var connection = require("./app/config/connection.js");
const e = require('express')

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

app.get('/userView/:user', (req, res) => {
  res.render('user', {username: req.params.user})
})

//this adds the API routes
require("./app/routes/api-routes.js")(app);
  //Add a Room

  app.post("/api/newRoom", function(req, res) {
  var dbQuery = "INSERT INTO rooms (name, owner, handle) VALUES (?,?,?)";
  var handle = req.body.handle;
  console.log(req.body.custom)
  if(!req.body.custom){
    //handle = uuidV4();
    handle = "fail";
    console.log(handle)
  } 
  connection.query(dbQuery, [req.body.name, req.body.owner,handle], function(err, result) {
    if(err){
      console.log(err)
    }
    res.end();
  });
});




// this is the code for the dynamic room routes
app.get('/room/:roomId', (req, res) => {
  res.render('room', { roomId: req.params.roomId })
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
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var connection = require("./app/config/connection.js");
const e = require('express')
const { verify } = require('crypto')

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
// sets the engine to ejs and adds public folder to the server
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cookieParser());

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/userView/:user', (req, res) => {
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'secretKey', (err, decodedToken) =>{
      if(err){
        res.redirect("/");
        console.log(err.message);
      }else {
        console.log(decodedToken);
        if(decodedToken.user.username == req.params.user){
          res.render('user', {username: req.params.user})
        } else {
          res.redirect('/');
        }
      }
    });
  }
})

//--------------------------------------------API ROUTES---------------------------------
//--------------------------------------------USERS--------------------------------------
// Get all users
app.get("/api/all", function(req, res) {

  var dbQuery = "SELECT * FROM users";

  connection.query(dbQuery, function(err, result) {
    res.json(result);
  });

});

// check a user
app.post("/api/login", function(req, res) {
  var dbQuery = "SELECT * FROM users WHERE username = ?";
  connection.query(dbQuery, req.body.username, function(err, result) {
    if(err){
      console.log(err);
    } else if(isEmpty(result)){
      console.log("NOT legit")
      res.send(false)
      res.end();
    }else{

      dbusr = result[0].username;
      dbpwd = result[0].password;

      const user = {
        username: dbusr,
        password: dbpwd
      }

      if(dbpwd == req.body.password){
        console.log("legit")
        var token = jwt.sign({user}, 'secretKey')
        res.cookie("jwt", token);
        res.send(true);
      } else{
        console.log("NOT legit")
        res.send(false)
      }
      res.end();
    } // end of else
  })// end of query
});//end of call

// Add a user
app.post("/api/new", function(req, res) {
  var dbQuery = "INSERT INTO users (username, password, fname, lname) VALUES (?,?,?,?)";
  connection.query(dbQuery, [req.body.username, req.body.password, req.body.fname, req.body.lname], function(err, result) {
    console.log("User Successfully Saved!");
    res.end();
  });

});

//TO-DO
//Delete a User
app.delete("/api/delete", function(req, res) {
    console.log("user to delete username");
    console.log(req.body);

    var dbQuery = "DELETE FROM users WHERE username = ?";

    connection.query(dbQuery, [rq.body.username], function (err, res) {
        console.log("User Deleted Successfully!");
        res.end();
    });
});
//TO-DO
//Update a user

//-------------------------------------------------ROOM ROUTES------------------------------------------------------------------------------


  // Get all Rooms
  app.get("/api/rooms", function(req, res) {
    var dbQuery = "SELECT * FROM rooms";
    connection.query(dbQuery, function(err, result) {
      res.json(result);
    });
  });

  //Delete a Room
  app.delete("/api/deleteRoom", function(req, res) {
    var dbQuery = "DELETE FROM rooms WHERE name = ?";
    connection.query(dbQuery, [rq.body.name], function (err, res) {
        console.log("Room Deleted Successfully!");
        res.end();
    });
});

  //Add a Room
  app.post("/api/newRoom", function(req, res) {
  var dbQuery = "INSERT INTO rooms (name, owner, handle) VALUES (?,?,?)";
  var handle = req.body.handle;
  console.log(typeof req.body.custom)
  console.log(req.body.custom)
  if(req.body.custom == "false"){
    handle = uuidV4();
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

//Verify Token
function requireAuth(req, res, next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, 'secretKey', (err, decodedToken) =>{
      if(err){
        res.redirect("/");
        console.log(err.message);
      }else {
        //console.log(decodedToken);
        next();
      }
    })
  } else {
    res.redirect('/');
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


server.listen(PORT)
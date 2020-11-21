// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

var connection = require("../config/connection.js");


// Routes
// =============================================================
module.exports = function(app) {

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
      console.log(req.body)
      console.log(req.body.username)
      if(err){
        throw err;
      }
      dbusr = result[0].username;
      dbpwd = result[0].password;

      const user = {
        username: dbusr,
        password: dbpwd
      }

      if(dbpwd == req.body.password){
        console.log("legit")
        jwt.sign({user: user}, 'secretKey', (err, token) => {
          res.json({
            token: token
          })
        })
      } else{
        console.log("NOT legit")
        res.send(false);
      }
      res.end();
    })

  });

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




};
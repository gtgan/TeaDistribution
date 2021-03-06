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

  // Add a user
  app.post("/api/new", function(req, res) {

    console.log("User Data:");
    console.log(req.body);

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



};
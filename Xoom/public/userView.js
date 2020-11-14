var mainView = document.getElementById("main");
var title = document.createElement("h1");
title.setAttribute("id", "banner");

var text = document.createTextNode("Welcome back " + USERNAME);
title.appendChild(text);

mainView.appendChild(title);

$.get("/api/rooms", function(data) {

    if (data.length !== 0) {
  
      for (var i = 0; i < data.length; i++) {
        var row = $("<tr>");
        row.addClass("roomRow");
  
        row.append("<td>" + data[i].name + "</td>");
        row.append("<td>" + data[i].owner + "</td>");
        row.append("<td> <a href='http://localhost:3000/room/" + data[i].handle + "' >" + data[i].handle +"</td>");
  
        $("#tableBody").prepend(row);
      }
    }
  });

var createRoomButton = document.getElementById("createRoom");
newRoom = {
    name: "roomName",
    owner: USERNAME,
    handle: "link",
    custom: false
}

createRoomButton.onclick = function(){
    var name = document.getElementById("name").value;
    handle = document.getElementById("link").value.trim();
    if (handle) {
        console.log("the value is custom")
        newRoom = {
            name: name,
            owner: USERNAME,
            handle: handle,
            custom: true
        }
    } else {
        console.log("the value is empty")
        newRoom = {
            name: name,
            owner: USERNAME,
            handle: "fail",
            custom: false
        }
    }
    // update the global user object with values from the form. 
    

    $.post("/api/newRoom", newRoom).done(function(data) {
        console.log("you have submitted the room values")
        console.log(data)
        //Route the user to the new view.
        window.location.href = '/userView/' + USERNAME;
    });
}







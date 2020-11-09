console.log(USERNAME); 
var mainView = document.getElementById("main");
var title = document.createElement("h1");
title.setAttribute("id", "banner");

var text = document.createTextNode("Welcome back " + USERNAME);
title.appendChild(text);

mainView.appendChild(title);

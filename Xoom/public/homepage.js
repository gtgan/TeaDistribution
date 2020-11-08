var loginButton = document.getElementById("loginMod");
var signUpButton = document.getElementById("signUp");

loginButton.onclick = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;

    console.log("Hey! you have logged in using the following credentials:");
    console.log(username)
    console.log(password)
}
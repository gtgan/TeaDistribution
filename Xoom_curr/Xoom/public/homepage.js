var loginButton = document.getElementById("loginMod");
var signUpButton = document.getElementById("signUp");

loginButton.onclick = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    var user = {
        username: username,
        password: password
    }

    $.post("/api/login", user).done(function(data) {
        if(data){
            window.location.href = '/userView/' + username;
        } else {
            window.location.href = '/';
        }
    });
}


signUpButton.onclick = function(){
    window.location.href = '/register';
}


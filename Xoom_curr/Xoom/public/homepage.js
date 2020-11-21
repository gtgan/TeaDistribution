var loginButton = document.getElementById("loginMod");
var signUpButton = document.getElementById("signUp");

loginButton.onclick = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    var user = {
        username: username,
        password: password
    }

    $.post("/api/login", user).done((data) => {
        if(data){
            window.location.href = '/userView/' + user.username;
        } else {
            window.location.href = '/';
            alert("you failed");
        }
      });
}


signUpButton.onclick = function(){
    window.location.href = '/register';
}


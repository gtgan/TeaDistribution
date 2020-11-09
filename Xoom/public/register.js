var signUpButton = document.getElementById("signUp");
newUser = {
    username: "username",
    password: "password",
    fname: "fname",
    lname: "lname"
}

signUpButton.onclick = function(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("pwd").value;
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    // update the global user object with values from the form. 
    newUser = {
        username: username,
        password: password,
        fname: fname,
        lname: lname
    }

    $.post("/api/new", newUser).done(function(data) {
        console.log("you have submitted the sign up values")
        console.log(data)
        //Route the user to the login view.
        window.location.href = '/';
    });
}







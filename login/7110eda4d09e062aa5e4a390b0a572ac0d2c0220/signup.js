function myFunction() {
var email = document.getElementById("email").value;
var password = document.getElementById("password").value;
// Returns successful data submission message when the entered information is stored in database.
if (email == '' || password == '') {
alert("Please fill all fields");
} else {
// AJAX code to submit form.
$.ajax({
type: "POST",
url: "http://justrun.nimadomain.com/php/login/signuptest.php",
data: jQuery.param({ email: email, password : password}) ,
cache: false,
success: function(html) {
alert("User Added!");
}
});
}
return false;
}
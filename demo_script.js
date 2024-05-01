let userna_me = document.getElementById("username");
let passw_ord = document.getElementById("userpassword");
let reQ = document.getElementById('req');
let ReQu = document.getElementById("requ");
let btn = document.getElementById("utton");

userna_me.addEventListener('blur', function(event){
    if (event.target.value === "") {
        reQ.textContent = "Required*";
      } else {
        reQ.textContent = "";
      }
});
passw_ord.addEventListener('blur', function(event){
    if (event.target.value === "") {
        ReQu.textContent = "Required*";
      } else {
        ReQu.textContent = "";
      }
});
btn.addEventListener('keydown',function(){
  console.log('hello')
})
  let data = {
    name: "kick",
    password: "passw_ord",
    gender: "male"
  };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",     
    },
    body: JSON.stringofy(data),
  };
fetch("http://localhost:3000/signup/",options)
 .then(function(response){
  return response.status;
 })
 .then(function(status) {
  console.log(status);
 })


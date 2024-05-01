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

btn.addEventListener('keyup',function(event){
  if(event.key === "Enter"){
    console.log('entered');
      let data = {
          name: userna_me.value,
          password: passw_ord.value,
      }
      let option = {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
           },
          body: JSON.stringify(data)
      };
      fetch('/signup/userdetails', option);
  }
})
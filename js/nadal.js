var play = document.querySelector("#continue");
var content = document.getElementById("home");

play.addEventListener('click',function () {
  content.style.transform="translateY(-100%)";
  content.style.opacity="0";
},false)


var play = document.querySelector("#continue");
var homeInner = document.querySelector("#home");
var mapInner = document.querySelector("#map_inner");


function heightHome (e){
  var heightDocument = document.querySelector(e);
  var intFrameHeight = window.innerHeight;
  heightDocument.style.height=intFrameHeight+'px';
}


window.addEventListener("load", function load(event){
  heightHome('#home');
  heightHome('#map_inner');
});

window.addEventListener("resize", function load(event){
  heightHome('#home');
  heightHome('#map_inner');
});


play.addEventListener('click',function () {
  heightHome('#map_inner');
  mapInner.style.top="0px";
  mapInner.style.opacity="1";
  homeInner.style.top="-100%";
  homeInner.style.opacity="0";
},false)
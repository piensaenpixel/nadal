var play = document.querySelector("#continue");
var content = document.getElementById("home");

play.addEventListener('click',function () {
  content.style.transform="translateY(-100%)";
  content.style.opacity="0";
},false)



 /* map */

/* map config */
if (screen.width <= 600) {
  var zoomLevel = 15;
} else {
  var zoomLevel = 14;
}


const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [3.1975198, 39.5699649],
  zoom: zoomLevel,
  dragRotate: false
});

carto.setDefaultAuth({
  user: 'piensaenpixel',
  apiKey: 'default_public'
});
const s = carto.expressions;
const source = new carto.source.Dataset('nadal_copy');
const viz = new carto.Viz(`
  width: 12
  color: #0ab6d1
  resolution: 0.2
  strokeWidth: 30;
  strokeColor: rgba(255, 255, 255, .2)
`);



const layer = new carto.Layer('layer', source, viz);
layer.addTo(map, 'watername_ocean');



/* vars */
var position = 1;
var data;
var elNext = document.getElementById("next");
var elPrev = document.getElementById("prev");
var showDescription = document.querySelector("#showDescription");
var showDescriptionContainer = document.querySelector(".scroll");
var showText = true
var showVideoText = true
var showMore =  document.querySelector("#video");
var media = document.querySelector("#video-container");




/* read json */
var request = new XMLHttpRequest();
request.open('GET', 'nadal.json', true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    data = JSON.parse(request.responseText);
    init();
  } else {
    // We reached our target server, but it returned an error
  }
};
request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

/* tooltip position */
function offset(el) {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}


function showScroll () {
  if (showText == true) {
    showDescriptionContainer.classList.add('is-active');
    showText = false;
    media.classList.remove('show-mobile');
    showVideoText = true;
  } else {
    showDescriptionContainer.classList.remove('is-active');
    showText = true;
    media.classList.remove('show-mobile');
    showVideoText = true;
  }

}

function showVideo() {
  if (showVideoText == true) {
    media.classList.add('show-mobile');
    showVideoText = false;
    showDescriptionContainer.classList.remove('is-active');
    showText = true;
  } else {
    media.classList.remove('show-mobile');
    showVideoText = true;
    showDescriptionContainer.classList.remove('is-active');
    showText = true;
  }
}


showDescription.addEventListener("click", function(){
   showScroll();
   showMore.classList.remove('is-active');
   this.classList.toggle('is-active');

}, false);

showMore.addEventListener("click", function(){
  showVideo();
  showDescription.classList.remove('is-active');
  this.classList.toggle('is-active');
}, false);


/* Functions change content */
function updateContent(value) {
    showMore.classList.remove('is-active');
    showDescription.classList.remove('is-active');

    checkPosition()
    showDescriptionContainer.classList.remove('is-active');
    showText = true;

    media.classList.remove('show-mobile');
    showVideoText = true;

    document.getElementById("media").src = "";
    document.getElementById("year").innerHTML = data[value].FIELD9;
    document.getElementById("place").innerHTML = data[value].FIELD10;
    document.getElementById("title").innerHTML = data[value].FIELD3;
    document.getElementById("description").innerHTML = data[value].FIELD4;
    if (data[value].FIELD8 != "") {

       showMore.classList.add('show');


       if (media.classList.contains('empty')) {
         media.classList.remove('empty');
        }

       document.getElementById("media").src = data[value].FIELD8;

    } else {
      showMore.classList.remove('show');
      media.classList.add('empty');
    }
    var coordinates = data[value].FIELD1.split(", ");
    map.flyTo({
          center: [coordinates[0], coordinates[1]]
    });

    var width =  document.querySelector('.map-info').offsetWidth;
    var step = (width / data.length) * (value + 1);
    if (value < data.length) {
      document.getElementById("bar").style.width = step + 'px';
    }
}

function checkPosition(){
  if (position <= 1) {
    elPrev.style.opacity=(".4");
  } else {
    elPrev.style.opacity=("1");
  }

  if (position == data.length || position == data.length-1) {
    elNext.style.opacity=(".4");
  } else {
    elNext.style.opacity=("1");
  }
}

function next(){
  if (position < data.length) {
    position = position +1;
    updateContent(position);
  }
}

function prev(){
  if (position > 1) {
    position = position - 1;
    updateContent(position);
  }
}

function init(){
    elNext.addEventListener("click", function(){
      next()
    }, false); 
    elPrev.addEventListener("click", function(){
      prev();
    }, false); 
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '37') {
      prev();
    }
    else if (e.keyCode == '39') {
      next();
    }
}


/* Change content */

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    updateContent(position)
  }, 500);
});

document.onkeydown = checkKey;

/* Change content */

var ps = new PerfectScrollbar('.scroll');


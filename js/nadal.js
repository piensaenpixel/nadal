var play = document.querySelector("#continue");
var content = document.getElementById("home");

play.addEventListener('click',function () {
  content.style.transform="translateY(-100%)";
  content.style.opacity="0";
},false)



 /* map */
const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [3.1975198, 39.5699649],
  zoom: 14,
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

var showDescription = document.querySelector("#showDescription");
var showDescriptionContainer = document.querySelector(".scroll");
var showText = true
var showVideoText = true
var showMore =  document.querySelector("#video");
var media = document.querySelector("#video-container");



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
}, false);


/* Functions change content */
function updateContent(value) {
    document.getElementById("media").src = "";
    showDescriptionContainer.classList.remove('is-active');
    showText = true;

    media.classList.remove('show-mobile');
    showVideoText = true;

    document.getElementById("year").innerHTML = data[value].FIELD9;
    document.getElementById("place").innerHTML = data[value].FIELD10;
    document.getElementById("title").innerHTML = data[value].FIELD3;
    document.getElementById("description").innerHTML = data[value].FIELD4;
    if (data[value].FIELD8 != "") {
       showMore.classList.add('show');
       showMore.addEventListener("click", function(){
          showVideo();
       }, false);
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

var ps = new PerfectScrollbar('.scroll');




/* Swipe */
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone = document.querySelector('body');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                next();
            } else {
                prev();
            }
        }
        if (xy <= limit) {
            if (y < 0) {
                console.log("top");
            } else {
                console.log("bottom");
            }
        }
    } else {
        console.log("tap");
    }
}

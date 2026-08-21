(function(){
'use strict';
var stage=document.getElementById('filmStage');
var frame=document.getElementById('filmFrame');
if(!stage||!frame)return;
var tx=0,ty=0,cx=0,cy=0;
function move(e){
  var r=stage.getBoundingClientRect();
  tx=((e.clientX-r.left)/r.width-.5)*10;
  ty=((e.clientY-r.top)/r.height-.5)*-8;
}
function leave(){tx=0;ty=0;}
function tick(){
  cx+=(tx-cx)*.08;
  cy+=(ty-cy)*.08;
  frame.style.transform='rotateX('+cy+'deg) rotateY('+cx+'deg) translateZ(0)';
  requestAnimationFrame(tick);
}
stage.addEventListener('pointermove',move);
stage.addEventListener('pointerleave',leave);
requestAnimationFrame(tick);
})();
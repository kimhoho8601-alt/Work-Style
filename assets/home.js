(function(){
'use strict';
var stage=document.getElementById('hero3d');
var ring=document.getElementById('collabRing');
if(!stage||!ring)return;
var targetX=0,targetY=0,currentX=0,currentY=0;
function move(e){var r=stage.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*14;targetY=((e.clientY-r.top)/r.height-.5)*-10;}
function leave(){targetX=0;targetY=0;}
function tick(){currentX+=(targetX-currentX)*.07;currentY+=(targetY-currentY)*.07;ring.style.transform='rotateX('+(currentY-7)+'deg) rotateY('+currentX+'deg)';requestAnimationFrame(tick);}
stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',leave);tick();
var cards=ring.querySelectorAll('.orbit-card');
for(var i=0;i<cards.length;i++){
  cards[i].addEventListener('mouseenter',function(){this.classList.add('is-focus');});
  cards[i].addEventListener('mouseleave',function(){this.classList.remove('is-focus');});
}
})();
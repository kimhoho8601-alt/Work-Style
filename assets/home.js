(function(){
'use strict';
var stage=document.getElementById('hero3d');
var ring=document.getElementById('collabRing');
if(!stage||!ring)return;

var targetX=0,targetY=0,currentX=0,currentY=0;
var spin=0,spinSpeed=0,hovering=false,last=performance.now();

function move(e){
  var r=stage.getBoundingClientRect();
  targetX=((e.clientX-r.left)/r.width-.5)*18;
  targetY=((e.clientY-r.top)/r.height-.5)*-12;
}

function enter(){hovering=true;}
function leave(){hovering=false;targetX=0;targetY=0;}

function tick(now){
  var dt=Math.min(40,now-last);last=now;
  var targetSpeed=hovering?0.022:0;
  spinSpeed+=(targetSpeed-spinSpeed)*(hovering?0.09:0.055);
  spin+=dt*spinSpeed;
  currentX+=(targetX-currentX)*.08;
  currentY+=(targetY-currentY)*.08;
  ring.style.transform='rotateX('+(currentY-7)+'deg) rotateY('+(spin+currentX)+'deg)';
  requestAnimationFrame(tick);
}

stage.addEventListener('pointerenter',enter);
stage.addEventListener('pointermove',move);
stage.addEventListener('pointerleave',leave);
requestAnimationFrame(tick);

var cards=ring.querySelectorAll('.orbit-card');
for(var i=0;i<cards.length;i++){
  cards[i].addEventListener('mouseenter',function(){this.classList.add('is-focus');});
  cards[i].addEventListener('mouseleave',function(){this.classList.remove('is-focus');});
}

var hero=document.querySelector('.hero');
if(hero){
  hero.addEventListener('pointermove',function(e){
    var x=(e.clientX/window.innerWidth-.5)*16;
    var y=(e.clientY/window.innerHeight-.5)*10;
    hero.style.setProperty('--mx',x+'px');
    hero.style.setProperty('--my',y+'px');
  });
}
})();
(function(){
'use strict';
var stage=document.getElementById('filmStage');
var frame=document.getElementById('filmFrame');
var video=document.getElementById('heroFilm');
if(stage&&frame){
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
}

function base64ToBlobUrl(base64){
  var binary=atob(base64.replace(/\s/g,''));
  var len=binary.length;
  var bytes=new Uint8Array(len);
  for(var i=0;i<len;i++){bytes[i]=binary.charCodeAt(i);}
  return URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));
}

if(video){
  fetch('./assets/video/micro00.txt?v=20260821-1')
    .then(function(r){if(!r.ok)throw new Error('video data unavailable');return r.text();})
    .then(function(data){
      var src=base64ToBlobUrl(data);
      video.src=src;
      video.addEventListener('canplay',function(){
        video.classList.add('is-ready');
        var p=video.play();
        if(p&&p.catch){p.catch(function(){});}
      },{once:true});
      video.load();
    })
    .catch(function(){});
}
})();
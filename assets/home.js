(function(){
'use strict';
var stage=document.getElementById('filmStage');
var frame=document.getElementById('filmFrame');
var video=document.getElementById('heroFilm');
var status=document.getElementById('filmStatus');
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(stage&&frame&&!reduce){
  function move(e){
    var r=stage.getBoundingClientRect();
    var x=((e.clientX-r.left)/r.width-.5)*7;
    var y=((e.clientY-r.top)/r.height-.5)*-5;
    frame.style.transform='rotateX('+y+'deg) rotateY('+x+'deg) translateZ(0)';
  }
  function leave(){frame.style.transform='rotateX(0deg) rotateY(0deg) translateZ(0)';}
  stage.addEventListener('pointermove',move);
  stage.addEventListener('pointerleave',leave);
}

function toBlobUrl(base64){
  var clean=base64.replace(/\s/g,'');
  var binary=atob(clean);
  var bytes=new Uint8Array(binary.length);
  for(var i=0;i<binary.length;i++){bytes[i]=binary.charCodeAt(i);}
  return URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));
}

if(video&&window.__KIMKIM_HERO_VIDEO){
  try{
    video.muted=true;
    video.loop=true;
    video.playsInline=true;
    video.autoplay=true;
    var url=toBlobUrl(window.__KIMKIM_HERO_VIDEO);
    video.src=url;
    var reveal=function(){
      video.classList.add('is-ready');
      if(status)status.textContent='브랜드 필름 재생 중';
      var p=video.play();
      if(p&&p.catch){p.catch(function(){if(status)status.textContent='브랜드 필름';});}
    };
    video.addEventListener('loadeddata',reveal,{once:true});
    video.addEventListener('error',function(){if(status)status.textContent='브랜드 필름';},{once:true});
    video.load();
    window.addEventListener('beforeunload',function(){URL.revokeObjectURL(url);},{once:true});
  }catch(err){
    if(status)status.textContent='브랜드 필름';
  }
}else if(status){status.textContent='브랜드 필름';}
})();
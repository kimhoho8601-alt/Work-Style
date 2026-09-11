(function(){
'use strict';

function moveLabel(group,x,y){
  const rect=group.querySelector('rect');
  const text=group.querySelector('text');
  if(!rect||!text)return;
  const width=112;
  const height=30;
  rect.setAttribute('x',String(x-width/2));
  rect.setAttribute('y',String(y-height/2));
  text.setAttribute('x',String(x));
  text.setAttribute('y',String(y+4));
}

function adjustRelationshipLabels(){
  const map=document.getElementById('relationshipMap');
  if(!map)return;

  map.querySelectorAll('svg .rel-label').forEach(group=>{
    const text=group.querySelector('text');
    if(!text)return;
    const label=text.textContent.trim();

    // 중앙 교차점에 겹치던 라벨은 중앙선과 각 노드 사이의 여백으로 이동한다.
    // 설계 + 정밀: 중앙 세로선과 완성도 집중형 노드 사이의 가로 구간 중앙.
    if(label==='설계 + 정밀')moveLabel(group,392,260);

    // 추진 + 연결: 중앙 교차점과 실행 주도형 노드 사이의 세로 구간 중앙.
    if(label==='추진 + 연결')moveLabel(group,300,173);
  });
}

function init(){
  const map=document.getElementById('relationshipMap');
  if(!map)return;
  adjustRelationshipLabels();
  const observer=new MutationObserver(adjustRelationshipLabels);
  observer.observe(map,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
(function(){
'use strict';

const NODE_SHIFT={
  execute:[130,0],
  plan:[30,-20],
  quality:[230,-20],
  people:[130,-65]
};

const LINK_LAYOUT={
  '속도 + 뼈대':{x1:450,y1:90,x2:140,y2:260,lx:295,ly:165},
  '돌파 + 완성':{x1:450,y1:90,x2:760,y2:260,lx:605,ly:165},
  '설계 + 정밀':{x1:140,y1:260,x2:760,y2:260,lx:605,ly:260},
  '추진 + 연결':{x1:450,y1:90,x2:450,y2:430,lx:450,ly:345},
  '흐름 + 조율':{x1:140,y1:260,x2:450,y2:430,lx:295,ly:345},
  '신뢰 + 협업':{x1:760,y1:260,x2:450,y2:430,lx:605,ly:345}
};

function moveLabel(group,x,y){
  const rect=group.querySelector('rect');
  const text=group.querySelector('text');
  if(!rect||!text)return;
  const width=132,height=34;
  rect.setAttribute('x',String(x-width/2));
  rect.setAttribute('y',String(y-height/2));
  rect.setAttribute('width',String(width));
  rect.setAttribute('height',String(height));
  rect.setAttribute('rx','17');
  text.setAttribute('x',String(x));
  text.setAttribute('y',String(y+5));
}

function applyWideLayout(){
  const map=document.getElementById('relationshipMap');
  const svg=map&&map.querySelector('svg.relationship-svg');
  if(!svg)return;

  svg.setAttribute('viewBox','0 0 900 520');
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');

  Object.entries(NODE_SHIFT).forEach(([type,[dx,dy]])=>{
    const node=svg.querySelector('.rel-node-'+type);
    if(node)node.setAttribute('transform','translate('+dx+' '+dy+')');
  });

  const labels=Array.from(svg.querySelectorAll('.rel-label'));
  const lines=Array.from(svg.querySelectorAll('.rel-link'));

  labels.forEach((label,index)=>{
    const text=label.querySelector('text');
    if(!text)return;
    const key=text.textContent.trim();
    const layout=LINK_LAYOUT[key];
    if(!layout)return;
    moveLabel(label,layout.lx,layout.ly);
    const line=lines[index];
    if(line){
      line.setAttribute('x1',layout.x1);
      line.setAttribute('y1',layout.y1);
      line.setAttribute('x2',layout.x2);
      line.setAttribute('y2',layout.y2);
    }
  });
}

function init(){
  const map=document.getElementById('relationshipMap');
  if(!map)return;
  applyWideLayout();
  new MutationObserver(applyWideLayout).observe(map,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
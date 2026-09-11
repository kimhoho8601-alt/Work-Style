(function(){
'use strict';

const TYPE_NAMES={execute:'실행 주도형',plan:'구조 설계형',quality:'완성도 집중형',people:'관계 조율형'};
const LABEL_TO_KEY={실행:'execute',설계:'plan',완성도:'quality',조율:'people'};

const TOP_COPY={
  execute:'논의를 길게 끌기보다 빠르게 결정하고 착수하는 힘이 강한 편입니다.',
  plan:'업무의 기준과 순서를 먼저 정리한 뒤 움직이는 경향이 강해, 복잡한 일을 체계화하는 데 강점이 있습니다.',
  quality:'결과물의 정확도와 완성 기준을 중요하게 보는 경향이 강해, 실수와 누락을 줄이는 데 강점이 있습니다.',
  people:'구성원과 이해관계자의 반응을 살피며 움직이는 경향이 강해, 협업과 수용성을 높이는 데 강점이 있습니다.'
};

const LOW_COPY={
  execute:'초기 의사결정과 빠른 시도를 맡을 역할을 의도적으로 세우는 것',
  plan:'우선순위·역할·진행 순서를 명확히 잡아주는 장치를 두는 것',
  quality:'중요 산출물에 검토 기준과 마감 전 체크포인트를 두는 것',
  people:'변화나 결정 전에 이해관계자 설명과 의견 확인 단계를 두는 것'
};

function getDistribution(){
  const counts={execute:0,plan:0,quality:0,people:0};
  document.querySelectorAll('#distribution .dist-row').forEach(row=>{
    const label=row.querySelector('span')?.textContent?.trim();
    const strong=row.querySelector('strong')?.textContent||'';
    const key=LABEL_TO_KEY[label];
    const count=parseInt(strong.replace(/\D/g,''),10);
    if(key&&Number.isFinite(count))counts[key]=count;
  });
  return counts;
}

function buildInsight(){
  const counts=getDistribution();
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const total=entries.reduce((sum,entry)=>sum+entry[1],0);
  if(!total)return null;

  const [topKey,topCount]=entries[0];
  const [lowKey,lowCount]=entries[entries.length-1];
  const max=topCount,min=lowCount;

  if(max-min<=1){
    return '네 가지 유형이 비슷한 비중으로 나타나 한 가지 일하는 방식이 조직 전체를 압도하지 않습니다. 상황에 따라 실행·설계·완성도·조율 역할을 유연하게 배치할 수 있는 대신, 과제마다 누가 어떤 역할을 맡을지 기준을 분명히 정하면 강점이 더 잘 살아납니다.';
  }

  const pct=Math.round(topCount/total*100);
  return TYPE_NAMES[topKey]+'이 '+topCount+'명('+pct+'%)으로 가장 많아, 이 조직은 '+TOP_COPY[topKey]+' 반면 '+TYPE_NAMES[lowKey]+'은 '+lowCount+'명으로 상대적으로 적어, '+LOW_COPY[lowKey]+'이 조직의 균형을 잡는 데 도움이 됩니다.';
}

function replaceVisibleTeamWording(root){
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
    const tag=node.parentElement?.tagName;
    if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT')return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    let next=node.nodeValue;
    next=next.replace(/팀/g,'조직');
    next=next.replace(/\bTEAM\b/g,'ORGANIZATION');
    if(next!==node.nodeValue)node.nodeValue=next;
  });
}

function updatePointOne(){
  const point=document.querySelector('#teamInsights > div:first-child p');
  const copy=buildInsight();
  if(point&&copy&&point.textContent!==copy)point.textContent=copy;
}

let scheduled=false;
function apply(){
  scheduled=false;
  replaceVisibleTeamWording(document.body);
  updatePointOne();
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(apply);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();

new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();

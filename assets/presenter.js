(function(){
'use strict';

const API='https://tedbkobhltarqibjhfhk.supabase.co/functions/v1/workstyle-workshop';
const SUPABASE_URL='https://tedbkobhltarqibjhfhk.supabase.co';
const SUPABASE_KEY='sb_publishable_CS5rpk5S1eYBFxyUzCQ63w_NzPpwOZ2';

const TYPES={execute:'실행 주도형',plan:'구조 설계형',quality:'완성도 집중형',people:'관계 조율형'};
const LABELS={execute:'실행',plan:'설계',quality:'완성도',people:'조율'};
const TYPE_ORDER=['execute','plan','quality','people'];
const TYPE_COPY={
  execute:['⚡','빠른 판단과 실행으로 변화를 이끄는 타입','일단 해보자!'],
  plan:['▣','전체를 설계하고 체계를 만드는 타입','먼저, 구조를 보자!'],
  quality:['★','높은 기준으로 결과의 완성도를 만드는 타입','끝까지, 제대로!'],
  people:['●●','사람을 연결하고 팀의 균형을 만드는 타입','함께 가면 더 멀리!']
};

const SYNERGIES=[
  {key:'execute-plan',a:'execute',b:'plan',title:'속도 + 뼈대',tagline:'빠른 실행이 좋은 구조를 만나는 조합',accent:'빠르게 시작하고, 흔들리지 않게 정리하는 케미'},
  {key:'execute-quality',a:'execute',b:'quality',title:'돌파 + 완성',tagline:'빠른 착수와 높은 완성도를 연결하는 조합',accent:'시작의 속도와 마무리의 밀도가 만나는 케미'},
  {key:'execute-people',a:'execute',b:'people',title:'추진 + 연결',tagline:'일을 밀고 가면서 사람과 맥락을 함께 챙기는 조합',accent:'속도를 잃지 않으면서 팀을 함께 움직이는 케미'},
  {key:'plan-quality',a:'plan',b:'quality',title:'설계 + 정밀',tagline:'구조와 기준을 함께 세워 결과의 신뢰도를 높이는 조합',accent:'큰 그림과 디테일이 서로를 보완하는 케미'},
  {key:'plan-people',a:'plan',b:'people',title:'흐름 + 조율',tagline:'전체 흐름과 관계 맥락을 함께 읽는 조합',accent:'계획이 사람과 만나 실제 협업으로 이어지는 케미'},
  {key:'quality-people',a:'quality',b:'people',title:'신뢰 + 협업',tagline:'품질 기준과 관계 감각이 균형을 만드는 조합',accent:'꼼꼼함이 사람을 만나 안정적인 협업으로 이어지는 케미'}
];

const BASE_ANALYSIS={
  'execute-plan':{
    strength:'실행 주도형의 빠른 판단과 구조 설계형의 우선순위·단계화 능력이 결합되면, 아이디어를 오래 붙잡기보다 빠르게 착수하면서도 방향을 잃지 않는 실행 구조를 만들기 쉽습니다.',
    work:'신규 프로젝트 착수, 일정이 촉박한 기획, 빠른 의사결정 뒤 실행계획을 구체화해야 하는 업무에 강점이 있습니다.',
    risk:'실행이 합의보다 앞서거나 설계가 길어져 착수가 늦어질 수 있습니다. 시작 시점과 ‘필수로 정리할 범위’를 먼저 합의하면 균형이 좋아집니다.'
  },
  'execute-quality':{
    strength:'실행 주도형이 초반 속도와 추진력을 만들고 완성도 집중형이 오류·누락·세부 기준을 보완하면, 빠른 시도와 안정적인 결과를 동시에 확보하기 좋습니다.',
    work:'짧은 일정의 산출물 제작, 시범 운영, 빠른 초안 뒤 품질 검수가 필요한 보고·콘텐츠·프로젝트에 잘 맞습니다.',
    risk:'한쪽은 “일단 내보자”, 다른 한쪽은 “조금 더 다듬자”에 머물 수 있습니다. 중간 검토 시점과 최종 완료 기준을 사전에 정하는 것이 중요합니다.'
  },
  'execute-people':{
    strength:'실행 주도형이 결정과 행동의 속도를 만들고 관계 조율형이 이해관계자 반응과 협업 맥락을 읽어주면, 추진력을 유지하면서도 사람을 놓치지 않는 조합이 됩니다.',
    work:'행사 운영, 변화 추진, 여러 부서가 동시에 움직이는 과제, 현장 대응처럼 속도와 커뮤니케이션이 함께 필요한 업무에 적합합니다.',
    risk:'속도를 내는 과정에서 충분한 설명이 생략되거나, 반대로 관계를 배려하느라 결정이 늦어질 수 있습니다. 누가 결정하고 누가 소통을 맡을지 역할을 선명하게 두면 좋습니다.'
  },
  'plan-quality':{
    strength:'구조 설계형이 전체 흐름과 논리를 세우고 완성도 집중형이 세부 기준과 정확도를 채우면, 복잡한 일을 체계적으로 정리하면서 결과의 신뢰도까지 높이기 좋습니다.',
    work:'정책·매뉴얼 정비, 평가자료, 보고서, 프로세스 설계, 오류 허용도가 낮은 문서 작업처럼 구조와 정밀도가 모두 필요한 업무에 강합니다.',
    risk:'두 사람 모두 충분히 정리된 뒤 움직이려 하면 속도가 떨어질 수 있습니다. 초안 완료 시점과 수정 횟수를 미리 제한하면 과도한 정교화가 줄어듭니다.'
  },
  'plan-people':{
    strength:'구조 설계형이 목표·순서·역할을 정리하고 관계 조율형이 사람들의 이해도와 수용성을 연결하면, 계획이 문서에 머물지 않고 실제 협업 행동으로 이어질 가능성이 높아집니다.',
    work:'워크숍 설계, 협업 프로세스 개선, 다부서 프로젝트, 이해관계자 협의, 회의 구조화처럼 흐름과 관계를 동시에 관리해야 하는 업무에 잘 맞습니다.',
    risk:'모든 사람의 의견과 상황을 반영하려다 구조가 복잡해질 수 있습니다. 핵심 의사결정 기준과 반드시 반영할 의견의 범위를 먼저 정하는 것이 효과적입니다.'
  },
  'quality-people':{
    strength:'완성도 집중형의 높은 기준과 관계 조율형의 세심한 맥락 파악이 만나면, 결과물의 품질뿐 아니라 상대가 받아들이고 활용하는 경험까지 안정적으로 관리할 수 있습니다.',
    work:'고객·직원 안내자료, 교육자료, 상담·지원 프로세스, 서비스 품질 관리처럼 정확성과 상대방 경험을 함께 고려해야 하는 업무에 적합합니다.',
    risk:'품질과 관계를 모두 놓치지 않으려다 결정이 늦거나 에너지 소모가 커질 수 있습니다. 중요도에 따라 품질 수준을 구분하고 의견 수렴 마감 시점을 정해두면 좋습니다.'
  }
};

const $=id=>document.getElementById(id);
let code='',responses=[];

function api(payload){
  return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(async r=>{
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||'요청 실패');
    return d;
  });
}

function esc(s){
  return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function pairKey(a,b){
  const ai=TYPE_ORDER.indexOf(a),bi=TYPE_ORDER.indexOf(b);
  return ai<=bi?a+'-'+b:b+'-'+a;
}

function scoreGap(person){
  return Math.abs(Number(person[person.top_type+'_score'])-Number(person[person.second_type+'_score']));
}

function synergyPairScore(a,b){
  let score=0;
  const aToB=a.second_type===b.top_type;
  const bToA=b.second_type===a.top_type;
  if(aToB&&bToA) score+=18;
  else {
    if(aToB) score+=8;
    if(bToA) score+=8;
  }

  const gapA=scoreGap(a),gapB=scoreGap(b);
  if(gapA<=1) score+=4;
  else if(gapA<=2) score+=3;
  else if(gapA<=3) score+=1;
  if(gapB<=1) score+=4;
  else if(gapB<=2) score+=3;
  else if(gapB<=3) score+=1;

  if(a.second_type===b.second_type)score+=2;
  else if(a.second_type!==a.top_type&&a.second_type!==b.top_type&&b.second_type!==a.top_type&&b.second_type!==b.top_type)score+=2;

  return score;
}

function getRecommendationsForSynergy(def){
  const groupA=responses.filter(r=>r.top_type===def.a);
  const groupB=responses.filter(r=>r.top_type===def.b);
  const candidates=[];

  groupA.forEach(a=>groupB.forEach(b=>{
    candidates.push({a,b,key:def.key,score:synergyPairScore(a,b)});
  }));

  candidates.sort((x,y)=>y.score-x.score||x.a.participant_name.localeCompare(y.a.participant_name,'ko')||x.b.participant_name.localeCompare(y.b.participant_name,'ko'));

  const picked=[];
  const used=new Set();
  for(const p of candidates){
    if(used.has(p.a.participant_name)||used.has(p.b.participant_name))continue;
    picked.push(p);
    used.add(p.a.participant_name);
    used.add(p.b.participant_name);
    if(picked.length===3)return picked;
  }

  for(const p of candidates){
    if(picked.includes(p))continue;
    picked.push(p);
    if(picked.length===3)break;
  }
  return picked;
}

function getAllSynergyGroups(){
  return SYNERGIES.map(def=>({def,recommendations:getRecommendationsForSynergy(def)}));
}

function renderMembers(){
  if(!responses.length){$('memberList').innerHTML='<p class="empty-state">아직 완료한 인원이 없습니다.</p>';return;}
  $('memberList').innerHTML=responses.map(r=>'<div class="member-row"><div class="member-avatar">'+esc(r.participant_name.slice(0,1))+'</div><div><strong>'+esc(r.participant_name)+'</strong><span>'+TYPES[r.top_type]+' · '+TYPES[r.second_type]+'</span></div><i>완료</i></div>').join('');
}

function renderDistribution(){
  const c={execute:0,plan:0,quality:0,people:0};
  responses.forEach(r=>c[r.top_type]++);
  const total=responses.length||1;
  $('distribution').innerHTML=Object.keys(c).map(k=>{
    const p=Math.round(c[k]/total*100);
    return '<div class="dist-row"><div><span>'+LABELS[k]+'</span><strong>'+c[k]+'명</strong></div><div class="dist-bar"><i class="type-'+k+'" style="width:'+p+'%"></i></div></div>';
  }).join('');
}

function teamHeadline(){
  if(!responses.length)return '아직 팀의 색이 모이지 않았습니다.';
  const c={execute:0,plan:0,quality:0,people:0};
  responses.forEach(r=>c[r.top_type]++);
  const sorted=Object.keys(c).sort((a,b)=>c[b]-c[a]);
  const max=c[sorted[0]],min=c[sorted[3]];
  if(max-min<=1)return '서로 다른 방식이 고르게 모인 팀이에요.';
  if(c[sorted[0]]===c[sorted[1]])return TYPES[sorted[0]]+'과 '+TYPES[sorted[1]]+'의 색이 함께 두드러져요.';
  return TYPES[sorted[0]]+'의 색이 가장 선명하고, '+TYPES[sorted[1]]+'이 자연스럽게 뒤를 받쳐요.';
}

function renderTypeRosters(){
  const grouped={execute:[],plan:[],quality:[],people:[]};
  responses.forEach(r=>grouped[r.top_type].push(r.participant_name));
  $('typeRosters').innerHTML=TYPE_ORDER.map(k=>{
    const copy=TYPE_COPY[k];
    const names=grouped[k].map(n=>'<span class="name-chip">'+esc(n)+'</span>').join('');
    return '<article class="type-roster type-roster-'+k+'"><div class="type-roster-title"><span class="type-symbol">'+copy[0]+'</span><div><strong>'+TYPES[k]+'</strong><p>'+copy[1]+'</p></div><em>'+copy[2]+'</em></div><div class="name-chip-wrap">'+(names||'<span class="name-chip muted">해당 없음</span>')+'</div></article>';
  }).join('');
}

function starPoints(cx,cy,outer,inner){
  const pts=[];
  for(let i=0;i<10;i++){
    const r=i%2===0?outer:inner;
    const angle=(-90+i*36)*Math.PI/180;
    pts.push((cx+Math.cos(angle)*r).toFixed(1)+','+(cy+Math.sin(angle)*r).toFixed(1));
  }
  return pts.join(' ');
}

function nodeIcon(type,cx,cy){
  const y=cy-30;
  if(type==='execute')return '<polygon class="rel-icon-shape" points="'+(cx-5)+','+(y-16)+' '+(cx+8)+','+(y-16)+' '+(cx+1)+','+(y-3)+' '+(cx+12)+','+(y-3)+' '+(cx-8)+','+(y+18)+' '+(cx-2)+','+(y+3)+' '+(cx-12)+','+(y+3)+'" />';
  if(type==='plan')return '<g class="rel-icon-stroke"><rect x="'+(cx-14)+'" y="'+(y-13)+'" width="28" height="26" rx="4"/><path d="M'+cx+' '+(y-13)+'V'+(y+13)+'M'+(cx-14)+' '+y+'H'+(cx+14)+'"/></g>';
  if(type==='quality')return '<polygon class="rel-icon-shape" points="'+starPoints(cx,y,15,7)+'" />';
  return '<g class="rel-icon-people"><circle cx="'+cx+'" cy="'+(y-8)+'" r="7"/><circle cx="'+(cx-13)+'" cy="'+(y-3)+'" r="5"/><circle cx="'+(cx+13)+'" cy="'+(y-3)+'" r="5"/><path d="M'+(cx-13)+' '+(y+15)+'Q'+cx+' '+(y+2)+' '+(cx+13)+' '+(y+15)+'"/></g>';
}

function relationshipNode(type,cx,cy){
  const sub={execute:'빠르게 움직이는 추진력',plan:'큰 그림을 만드는 설계력',quality:'끝까지 해내는 완성력',people:'사람을 연결하는 조율력'}[type];
  return '<g class="rel-node-svg rel-node-'+type+'"><circle class="rel-node-bg" cx="'+cx+'" cy="'+cy+'" r="68"/>'+nodeIcon(type,cx,cy)+'<text class="rel-node-title" x="'+cx+'" y="'+(cy+10)+'" text-anchor="middle">'+TYPES[type]+'</text><text class="rel-node-subtitle" x="'+cx+'" y="'+(cy+31)+'" text-anchor="middle">'+sub+'</text></g>';
}

function relationshipLink(link,active){return '<line class="rel-link'+(active?' is-hot':'')+'" x1="'+link.x1+'" y1="'+link.y1+'" x2="'+link.x2+'" y2="'+link.y2+'" />';}
function relationshipLabel(link,active){const w=112,h=30,x=link.lx-w/2,y=link.ly-h/2;return '<g class="rel-label'+(active?' is-hot':'')+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="15"/><text x="'+link.lx+'" y="'+(link.ly+4)+'" text-anchor="middle">'+link.label+'</text></g>';}

function renderRelationshipMap(groups){
  const active=new Set(groups.filter(g=>g.recommendations.length).map(g=>g.def.key));
  const links=[
    {a:'execute',b:'plan',label:'속도 + 뼈대',x1:300,y1:85,x2:115,y2:260,lx:203,ly:165},
    {a:'execute',b:'quality',label:'돌파 + 완성',x1:300,y1:85,x2:485,y2:260,lx:397,ly:165},
    {a:'execute',b:'people',label:'추진 + 연결',x1:300,y1:85,x2:300,y2:435,lx:300,ly:355},
    {a:'plan',b:'quality',label:'설계 + 정밀',x1:115,y1:260,x2:485,y2:260,lx:300,ly:260},
    {a:'plan',b:'people',label:'흐름 + 조율',x1:115,y1:260,x2:300,y2:435,lx:203,ly:355},
    {a:'quality',b:'people',label:'신뢰 + 협업',x1:485,y1:260,x2:300,y2:435,lx:397,ly:355}
  ];
  const lines=links.map(l=>relationshipLink(l,active.has(pairKey(l.a,l.b)))).join('');
  const labels=links.map(l=>relationshipLabel(l,active.has(pairKey(l.a,l.b)))).join('');
  const nodes=relationshipNode('execute',300,85)+relationshipNode('plan',115,260)+relationshipNode('quality',485,260)+relationshipNode('people',300,435);
  const mobileLegend=links.map(l=>'<div class="relationship-pair-chip'+(active.has(pairKey(l.a,l.b))?' is-hot':'')+'"><span>'+LABELS[l.a]+' × '+LABELS[l.b]+'</span><strong>'+l.label+'</strong></div>').join('');
  $('relationshipMap').innerHTML='<div class="relationship-graphic"><svg class="relationship-svg" viewBox="0 0 600 520" role="img" aria-label="네 가지 업무 스타일의 시너지 관계도">'+lines+labels+nodes+'</svg></div><div class="relationship-pair-list">'+mobileLegend+'</div>';
}

function profileNote(person){
  const gap=scoreGap(person);
  if(gap<=1)return '주성향과 보조성향의 차이가 작아 상황에 따라 두 방식을 비교적 유연하게 오갈 가능성이 있습니다.';
  if(gap<=3)return '주성향이 중심을 잡으면서도 보조성향이 실제 행동에 함께 나타날 가능성이 있는 프로필입니다.';
  return '주성향이 비교적 선명해 역할을 맡았을 때 해당 방식의 강점이 분명하게 드러날 가능성이 있습니다.';
}

function individualBridge(a,b){
  const aToB=a.second_type===b.top_type;
  const bToA=b.second_type===a.top_type;
  if(aToB&&bToA){
    return esc(a.participant_name)+'님의 보조성향이 '+TYPES[b.top_type]+', '+esc(b.participant_name)+'님의 보조성향이 '+TYPES[a.top_type]+'으로 서로의 주성향을 교차해서 갖고 있습니다. 상대가 중요하게 보는 기준을 비교적 빠르게 이해할 수 있는 상호보완형에 가깝습니다.';
  }
  if(aToB){
    return esc(a.participant_name)+'님이 '+TYPES[b.top_type]+'을 보조성향으로 함께 갖고 있어 '+esc(b.participant_name)+'님의 판단 기준을 이해하고 연결하는 데 유리합니다. 반대로 '+esc(b.participant_name)+'님은 '+TYPES[b.second_type]+'을 보조로 가져 조합에 다른 관점을 더합니다.';
  }
  if(bToA){
    return esc(b.participant_name)+'님이 '+TYPES[a.top_type]+'을 보조성향으로 함께 갖고 있어 '+esc(a.participant_name)+'님의 속도와 판단 방식을 따라가기 쉽습니다. '+esc(a.participant_name)+'님의 '+TYPES[a.second_type]+' 보조성향은 협업 과정에 추가적인 균형을 만들어줍니다.';
  }
  if(a.second_type===b.second_type){
    return '두 사람 모두 '+TYPES[a.second_type]+'을 보조성향으로 공유하고 있습니다. 주성향은 다르지만 문제를 바라보는 두 번째 렌즈가 같아, 의견 차이가 생겼을 때 공통 기준을 찾기 쉬운 편입니다.';
  }
  return esc(a.participant_name)+'님은 '+TYPES[a.second_type]+', '+esc(b.participant_name)+'님은 '+TYPES[b.second_type]+'을 보조성향으로 갖고 있습니다. 주성향 두 가지에 서로 다른 보조 관점까지 더해져 역할을 나눌 때 보완 범위가 넓은 조합입니다.';
}

function interpretationFor(def,pair){
  const base=BASE_ANALYSIS[def.key];
  const bridge=individualBridge(pair.a,pair.b);
  const nuanceA=profileNote(pair.a);
  const nuanceB=profileNote(pair.b);
  return {
    why:base.strength+' '+bridge,
    work:base.work+' 특히 '+esc(pair.a.participant_name)+'님과 '+esc(pair.b.participant_name)+'님은 각각 '+LABELS[pair.a.second_type]+'·'+LABELS[pair.b.second_type]+' 보조성향을 함께 갖고 있어 역할 분담을 구체화하면 강점이 더 선명해질 수 있습니다.',
    check:base.risk+' '+esc(pair.a.participant_name)+'님은 '+nuanceA+' '+esc(pair.b.participant_name)+'님은 '+nuanceB
  };
}

function memberMini(person){
  return '<div class="pair-person"><span class="pair-avatar">'+esc(person.participant_name.slice(0,1))+'</span><div><strong>'+esc(person.participant_name)+'</strong><small>'+TYPES[person.top_type]+' · 보조 '+TYPES[person.second_type]+'</small></div></div>';
}

function renderSynergyGroups(groups){
  const letters=['A','B','C'];
  $('topPairs').innerHTML=groups.map(group=>{
    const def=group.def;
    const cards=group.recommendations.length?group.recommendations.map((pair,i)=>{
      const analysis=interpretationFor(def,pair);
      return '<article class="pair-recommendation"><div class="pair-card-top"><span class="pair-pick">PAIR '+letters[i]+'</span><span class="pair-score-note">재미로 보는 추천 조합</span></div><div class="pair-people">'+memberMini(pair.a)+'<b class="pair-x">×</b>'+memberMini(pair.b)+'</div><div class="pair-analysis"><div><span>왜 잘 맞나</span><p>'+analysis.why+'</p></div><div><span>잘 맞는 업무</span><p>'+analysis.work+'</p></div><div><span>함께할 때 체크</span><p>'+analysis.check+'</p></div></div></article>';
    }).join(''):'<p class="empty-state">이 유형 조합을 만들 수 있는 참여자가 아직 충분하지 않습니다.</p>';

    return '<section class="synergy-family synergy-'+def.key+'"><header class="synergy-family-head"><div><span>'+TYPES[def.a]+' × '+TYPES[def.b]+'</span><h4>'+def.title+'</h4><p>'+def.tagline+'</p></div><em>'+def.accent+'</em></header><div class="synergy-pair-grid">'+cards+'</div></section>';
  }).join('');
}

function renderSummary(){
  const groups=getAllSynergyGroups();
  $('teamHeadline').textContent=teamHeadline();
  $('teamSummaryLead').textContent='네 가지 일하는 방식이 어떻게 연결되는지 보고, 각 시너지 유형에서 눈에 띄는 2인 페어를 살펴봅니다.';
  renderTypeRosters();
  renderRelationshipMap(groups);
  renderSynergyGroups(groups);

  const counts={execute:0,plan:0,quality:0,people:0};
  responses.forEach(r=>counts[r.top_type]++);
  const sorted=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
  const missing=sorted.filter(k=>counts[k]===0);
  const insight=[];
  if(missing.length)insight.push('현재 '+missing.map(k=>TYPES[k]).join(' · ')+' 구성원은 없어요. 필요한 순간에는 그 유형의 행동을 팀 안에서 의도적으로 빌려보는 것도 방법입니다.');
  else insight.push('네 가지 유형이 모두 있어 상황에 따라 서로 다른 방식으로 역할을 나눠볼 수 있는 팀이에요.');
  insight.push(TYPES[sorted[0]]+'의 색이 상대적으로 많이 보여요. 워크숍에서는 이 강점이 언제 빛나는지, 반대로 언제 과해질 수 있는지 가볍게 이야기해보세요.');
  $('teamInsights').innerHTML=insight.map((t,i)=>'<div><span>POINT '+(i+1)+'</span><p>'+t+'</p></div>').join('');
}

async function refresh(){
  const d=await api({action:'dashboard',slug:'team-workshop-01',presenter_code:code});
  responses=d.responses||[];
  $('sessionTitle').textContent=d.session.title;
  $('memberCount').textContent=responses.length+'명';
  $('completionBadge').textContent=responses.length;
  renderMembers();
  renderDistribution();
  return d;
}

function ensureSummaryVisible(){
  if($('teamSummary').hidden){$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();}
}

function downloadExcel(){
  if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}
  const rows=responses.map((r,i)=>({번호:i+1,이름:r.participant_name,'1순위 유형':TYPES[r.top_type],'2순위 유형':TYPES[r.second_type],'실행 점수':r.execute_score,'설계 점수':r.plan_score,'완성도 점수':r.quality_score,'조율 점수':r.people_score,'완료 시각':new Date(r.completed_at).toLocaleString('ko-KR')}));
  const ws=XLSX.utils.json_to_sheet(rows);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'워크스타일 결과');
  XLSX.writeFile(wb,'workstyle-results.xlsx');
}

async function downloadImage(){
  if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}
  ensureSummaryVisible();
  const area=$('exportArea');area.classList.add('exporting');
  try{
    const canvas=await html2canvas(area,{backgroundColor:'#f6f7f8',scale:2,useCORS:true});
    const link=document.createElement('a');
    link.download='workstyle-team-summary.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
  }catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}
  finally{area.classList.remove('exporting');}
}

async function resetData(){
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/reset_workstyle_session',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify({p_slug:'team-workshop-01',p_presenter_code:code})});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||d.error||'초기화 실패');}
    $('resetModal').hidden=true;await refresh();$('teamSummary').hidden=true;$('summaryIntro').hidden=false;alert('워크숍 데이터가 초기화되었습니다.');
  }catch(e){alert(e.message||'초기화 중 오류가 발생했습니다.');}
}

$('presenterForm').addEventListener('submit',async e=>{
  e.preventDefault();code=$('presenterCode').value;const status=$('presenterStatus');status.textContent='확인 중…';
  try{await refresh();$('presenterGate').hidden=true;$('dashboard').hidden=false;status.textContent='';window.scrollTo(0,0);}catch(err){status.textContent=err.message;}
});
$('refreshBtn').addEventListener('click',async()=>{try{await refresh();if(!$('teamSummary').hidden)renderSummary();}catch(e){alert(e.message);}});
$('summaryBtn').addEventListener('click',async()=>{try{await refresh();$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();setTimeout(()=>$('teamSummary').scrollIntoView({behavior:'smooth',block:'start'}),40);}catch(e){alert(e.message);}});
$('rerunBtn').addEventListener('click',()=>{renderSummary();$('summaryPage1').scrollIntoView({behavior:'smooth',block:'start'});});
$('excelBtn').addEventListener('click',downloadExcel);
$('imageBtn').addEventListener('click',downloadImage);
$('resetBtn').addEventListener('click',()=>{$('resetModal').hidden=false;});
$('resetCancelBtn').addEventListener('click',()=>{$('resetModal').hidden=true;});
$('resetConfirmBtn').addEventListener('click',resetData);
})();
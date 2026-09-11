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
const PAIRS={
  'execute-plan':['속도 + 뼈대','빠른 실행이 좋은 구조를 만나는 조합','속도와 구조가 만날 때'],
  'execute-quality':['돌파 + 완성','빠르게 시작하고 끝까지 완성하는 조합','시작과 마무리의 케미'],
  'execute-people':['추진 + 연결','일을 밀고 가면서 사람까지 함께 묶는 조합','사람을 놓치지 않는 추진력'],
  'plan-quality':['설계 + 정밀','아이디어를 구조화하고 결과의 완성도를 높이는 조합','구조에 디테일을 더하는 케미'],
  'plan-people':['흐름 + 조율','전체 흐름과 사람 사이의 맥락을 함께 읽는 조합','좋은 흐름을 만드는 케미'],
  'quality-people':['신뢰 + 협업','관계 감각과 품질 기준이 균형을 만드는 조합','꼼꼼함과 배려의 케미']
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

function pairScore(a,b){
  let score=0;
  const aToB=a.second_type===b.top_type;
  const bToA=b.second_type===a.top_type;

  // 가장 크게 보는 기준: 서로의 주성향과 보조성향이 양방향으로 맞물리는가.
  if(aToB&&bToA) score+=14;
  else {
    if(aToB) score+=6;
    if(bToA) score+=6;
  }

  // 그다음: 각 사람 안에서 주성향과 보조성향이 비교적 함께 나타나는가.
  const gapA=scoreGap(a),gapB=scoreGap(b);
  if(gapA<=1) score+=4;
  else if(gapA<=2) score+=3;
  else if(gapA<=3) score+=1;
  if(gapB<=1) score+=4;
  else if(gapB<=2) score+=3;
  else if(gapB<=3) score+=1;

  // 단순히 주성향이 다르다는 점은 마지막에만 가볍게 참고.
  if(a.top_type!==b.top_type) score+=2;

  return score;
}

function getAllPairs(){
  const all=[];
  for(let i=0;i<responses.length;i++){
    for(let j=i+1;j<responses.length;j++){
      const a=responses[i],b=responses[j],key=pairKey(a.top_type,b.top_type),meta=PAIRS[key];
      if(!meta)continue;
      all.push({a,b,key,meta,score:pairScore(a,b)});
    }
  }
  return all.sort((x,y)=>y.score-x.score||x.a.participant_name.localeCompare(y.a.participant_name,'ko'));
}

function getTopPairs(){
  const ranked=getAllPairs();
  const picked=[];
  const usedPeople=new Set();
  const usedChemistry=new Set();

  // 1차: 사람도 겹치지 않고, 케미 유형도 겹치지 않는 조합을 우선.
  for(const p of ranked){
    if(usedPeople.has(p.a.participant_name)||usedPeople.has(p.b.participant_name))continue;
    if(usedChemistry.has(p.key))continue;
    picked.push(p);
    usedPeople.add(p.a.participant_name);
    usedPeople.add(p.b.participant_name);
    usedChemistry.add(p.key);
    if(picked.length===3)return picked;
  }

  // 2차: 케미 유형 중복은 허용하되 사람 중복은 피함.
  for(const p of ranked){
    if(picked.includes(p))continue;
    if(usedPeople.has(p.a.participant_name)||usedPeople.has(p.b.participant_name))continue;
    picked.push(p);
    usedPeople.add(p.a.participant_name);
    usedPeople.add(p.b.participant_name);
    if(picked.length===3)return picked;
  }

  // 3차: 인원이 적은 경우에만 남은 상위 조합으로 채움.
  for(const p of ranked){
    if(picked.includes(p))continue;
    picked.push(p);
    if(picked.length===3)break;
  }
  return picked;
}

function renderMembers(){
  if(!responses.length){$('memberList').innerHTML='<p class="empty-state">아직 완료한 인원이 없습니다.</p>';return;}
  $('memberList').innerHTML=responses.map(r=>'<div class="member-row"><div class="member-avatar">'+esc(r.participant_name.slice(0,1))+'</div><div><strong>'+esc(r.participant_name)+'</strong><span>'+TYPES[r.top_type]+' · '+TYPES[r.second_type]+'</span></div><i>완료</i></div>').join('');
}

function renderDistribution(){
  const c={execute:0,plan:0,quality:0,people:0};
  responses.forEach(r=>c[r.top_type]++);
  const total=responses.length||1;
  $('distribution').innerHTML=Object.keys(c).map(k=>{const p=Math.round(c[k]/total*100);return '<div class="dist-row"><div><span>'+LABELS[k]+'</span><strong>'+c[k]+'명</strong></div><div class="dist-bar"><i class="type-'+k+'" style="width:'+p+'%"></i></div></div>';}).join('');
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

function relationshipLink(link,hot){return '<line class="rel-link'+(hot?' is-hot':'')+'" x1="'+link.x1+'" y1="'+link.y1+'" x2="'+link.x2+'" y2="'+link.y2+'" />';}
function relationshipLabel(link,hot){const w=112,h=30,x=link.lx-w/2,y=link.ly-h/2;return '<g class="rel-label'+(hot?' is-hot':'')+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="15"/><text x="'+link.lx+'" y="'+(link.ly+4)+'" text-anchor="middle">'+link.label+'</text></g>';}

function renderRelationshipMap(topPairs){
  const hot=new Set(topPairs.map(p=>p.key));
  const links=[
    {a:'execute',b:'plan',label:'속도 + 뼈대',x1:300,y1:85,x2:115,y2:260,lx:203,ly:165},
    {a:'execute',b:'quality',label:'돌파 + 완성',x1:300,y1:85,x2:485,y2:260,lx:397,ly:165},
    {a:'execute',b:'people',label:'추진 + 연결',x1:300,y1:85,x2:300,y2:435,lx:300,ly:355},
    {a:'plan',b:'quality',label:'설계 + 정밀',x1:115,y1:260,x2:485,y2:260,lx:300,ly:260},
    {a:'plan',b:'people',label:'흐름 + 조율',x1:115,y1:260,x2:300,y2:435,lx:203,ly:355},
    {a:'quality',b:'people',label:'신뢰 + 협업',x1:485,y1:260,x2:300,y2:435,lx:397,ly:355}
  ];
  const lines=links.map(l=>relationshipLink(l,hot.has(pairKey(l.a,l.b)))).join('');
  const labels=links.map(l=>relationshipLabel(l,hot.has(pairKey(l.a,l.b)))).join('');
  const nodes=relationshipNode('execute',300,85)+relationshipNode('plan',115,260)+relationshipNode('quality',485,260)+relationshipNode('people',300,435);
  const mobileLegend=links.map(l=>'<div class="relationship-pair-chip'+(hot.has(pairKey(l.a,l.b))?' is-hot':'')+'"><span>'+LABELS[l.a]+' × '+LABELS[l.b]+'</span><strong>'+l.label+'</strong></div>').join('');
  $('relationshipMap').innerHTML='<div class="relationship-graphic"><svg class="relationship-svg" viewBox="0 0 600 520" role="img" aria-label="네 가지 업무 스타일의 시너지 관계도">'+lines+labels+nodes+'</svg></div><div class="relationship-pair-list">'+mobileLegend+'</div>';
}

function renderTopPairs(topPairs){
  if(!topPairs.length){$('topPairs').innerHTML='<p class="empty-state">2명 이상 완료되면 재미로 보는 케미 PICK을 보여드려요.</p>';return;}
  const picks=['PICK A','PICK B','PICK C'];
  $('topPairs').innerHTML=topPairs.map((p,i)=>'<article class="top-pair pick-'+(i+1)+'"><div class="rank-badge">'+picks[i]+'</div><div class="pair-names"><span>'+esc(p.a.participant_name)+'</span><b>×</b><span>'+esc(p.b.participant_name)+'</span></div><div class="pair-copy"><em>'+p.meta[2]+'</em><strong>'+p.meta[0]+'</strong><p>'+p.meta[1]+'. 서로의 주성향과 보조성향이 맞물려, 워크숍에서 한번 이야기해보기 좋은 조합이에요.</p></div></article>').join('');
}

function renderSummary(){
  const topPairs=getTopPairs();
  $('teamHeadline').textContent=teamHeadline();
  $('teamSummaryLead').textContent='네 가지 일하는 방식이 서로 다른 역할을 맡을 때, 팀의 강점이 더 선명해집니다.';
  renderTypeRosters();
  renderRelationshipMap(topPairs);
  renderTopPairs(topPairs);

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

function ensureSummaryVisible(){if($('teamSummary').hidden){$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();}}

function downloadExcel(){
  if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}
  const rows=responses.map((r,i)=>({번호:i+1,이름:r.participant_name,'1순위 유형':TYPES[r.top_type],'2순위 유형':TYPES[r.second_type],'실행 점수':r.execute_score,'설계 점수':r.plan_score,'완성도 점수':r.quality_score,'조율 점수':r.people_score,'완료 시각':new Date(r.completed_at).toLocaleString('ko-KR')}));
  const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'워크스타일 결과');XLSX.writeFile(wb,'workstyle-results.xlsx');
}

async function downloadImage(){
  if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}
  ensureSummaryVisible();
  const area=$('exportArea');area.classList.add('exporting');
  try{const canvas=await html2canvas(area,{backgroundColor:'#f6f7f8',scale:2,useCORS:true});const link=document.createElement('a');link.download='workstyle-team-summary.png';link.href=canvas.toDataURL('image/png');link.click();}
  catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}
  finally{area.classList.remove('exporting');}
}

async function resetData(){
  try{
    const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/reset_workstyle_session',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify({p_slug:'team-workshop-01',p_presenter_code:code})});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||d.error||'초기화 실패');}
    $('resetModal').hidden=true;await refresh();$('teamSummary').hidden=true;$('summaryIntro').hidden=false;alert('워크숍 데이터가 초기화되었습니다.');
  }catch(e){alert(e.message||'초기화 중 오류가 발생했습니다.');}
}

$('presenterForm').addEventListener('submit',async e=>{e.preventDefault();code=$('presenterCode').value;const status=$('presenterStatus');status.textContent='확인 중…';try{await refresh();$('presenterGate').hidden=true;$('dashboard').hidden=false;status.textContent='';window.scrollTo(0,0);}catch(err){status.textContent=err.message;}});
$('refreshBtn').addEventListener('click',async()=>{try{await refresh();if(!$('teamSummary').hidden)renderSummary();}catch(e){alert(e.message);}});
$('summaryBtn').addEventListener('click',async()=>{try{await refresh();$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();setTimeout(()=>$('teamSummary').scrollIntoView({behavior:'smooth',block:'start'}),40);}catch(e){alert(e.message);}});
$('rerunBtn').addEventListener('click',()=>{renderSummary();$('summaryPage1').scrollIntoView({behavior:'smooth',block:'start'});});
$('excelBtn').addEventListener('click',downloadExcel);
$('imageBtn').addEventListener('click',downloadImage);
$('resetBtn').addEventListener('click',()=>{$('resetModal').hidden=false;});
$('resetCancelBtn').addEventListener('click',()=>{$('resetModal').hidden=true;});
$('resetConfirmBtn').addEventListener('click',resetData);
})();
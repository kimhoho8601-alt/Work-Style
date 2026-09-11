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
  'execute-plan':['속도 + 뼈대','빠른 실행이 좋은 구조를 만나 추진력을 잃지 않으면서 시행착오를 줄이는 조합','속도와 구조가 만날 때'],
  'execute-quality':['돌파 + 완성','착수 속도와 검수 기준이 함께 작동해 아이디어를 실제 결과물까지 끌고 가는 조합','시작과 마무리의 케미'],
  'execute-people':['추진 + 연결','일을 앞으로 밀면서 이해관계자와 팀의 반응까지 놓치지 않는 조합','사람을 놓치지 않는 추진력'],
  'plan-quality':['설계 + 정밀','우선순위와 구조를 세운 뒤 세부 기준으로 결과를 안정화하는 조합','구조에 디테일을 더하는 케미'],
  'plan-people':['흐름 + 조율','전체 일정과 역할을 보면서 사람 사이의 기대와 협업 맥락까지 연결하는 조합','좋은 흐름을 만드는 케미'],
  'quality-people':['신뢰 + 협업','품질 기준을 지키면서도 상대의 수용성과 협업 관계를 고려해 결과의 신뢰도를 높이는 조합','꼼꼼함과 배려의 케미']
};
const ROLE_COPY={
  execute:'빠르게 첫 행동을 만들고 의사결정을 앞으로 당기는 역할',
  plan:'복잡한 일을 구조화하고 우선순위·역할·순서를 정리하는 역할',
  quality:'완료 기준과 디테일을 점검해 결과의 신뢰도를 높이는 역할',
  people:'관계자 반응과 협업 흐름을 읽어 소통의 마찰을 줄이는 역할'
};
const $=id=>document.getElementById(id);
let code='',responses=[];

function api(payload){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'요청 실패');return d;});}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function pairKey(a,b){const ai=TYPE_ORDER.indexOf(a),bi=TYPE_ORDER.indexOf(b);return ai<=bi?a+'-'+b:b+'-'+a;}
function scoreGap(person){return Math.abs(Number(person[person.top_type+'_score'])-Number(person[person.second_type+'_score']));}

function pairScore(a,b){
  let score=0;
  const aToB=a.second_type===b.top_type;
  const bToA=b.second_type===a.top_type;
  if(aToB&&bToA)score+=14;else{if(aToB)score+=6;if(bToA)score+=6;}
  const gapA=scoreGap(a),gapB=scoreGap(b);
  if(gapA<=1)score+=4;else if(gapA<=2)score+=3;else if(gapA<=3)score+=1;
  if(gapB<=1)score+=4;else if(gapB<=2)score+=3;else if(gapB<=3)score+=1;
  if(a.top_type!==b.top_type)score+=2;
  return score;
}

function trioPairKeys(members){
  const keys=[];
  for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++)if(members[i].top_type!==members[j].top_type)keys.push(pairKey(members[i].top_type,members[j].top_type));
  return [...new Set(keys)];
}

function trioScore(members){
  let score=0;
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)score+=pairScore(members[i],members[j]);
  const primaryTypes=new Set(members.map(m=>m.top_type));
  const allTypes=new Set(members.flatMap(m=>[m.top_type,m.second_type]));
  score+=primaryTypes.size===3?10:primaryTypes.size===2?4:0;
  score+=allTypes.size===4?8:allTypes.size===3?4:0;
  let crossLinks=0;
  members.forEach((a,i)=>members.forEach((b,j)=>{if(i!==j&&a.second_type===b.top_type)crossLinks++;}));
  score+=crossLinks*2;
  return score;
}

function trioSignature(members){return [...new Set(members.map(m=>m.top_type))].sort((a,b)=>TYPE_ORDER.indexOf(a)-TYPE_ORDER.indexOf(b)).join('-');}

function getAllTrios(){
  const all=[];
  for(let i=0;i<responses.length-2;i++){
    for(let j=i+1;j<responses.length-1;j++){
      for(let k=j+1;k<responses.length;k++){
        const members=[responses[i],responses[j],responses[k]];
        all.push({members,score:trioScore(members),signature:trioSignature(members),keys:trioPairKeys(members)});
      }
    }
  }
  return all.sort((a,b)=>b.score-a.score||a.members.map(m=>m.participant_name).join('').localeCompare(b.members.map(m=>m.participant_name).join(''),'ko'));
}

function getTopTrios(){
  const ranked=getAllTrios(),picked=[],usedPeople=new Set(),usedSignatures=new Set();
  for(const trio of ranked){
    if(trio.members.some(m=>usedPeople.has(m.participant_name)))continue;
    if(usedSignatures.has(trio.signature))continue;
    picked.push(trio);trio.members.forEach(m=>usedPeople.add(m.participant_name));usedSignatures.add(trio.signature);
    if(picked.length===3)return picked;
  }
  for(const trio of ranked){
    if(picked.includes(trio)||trio.members.some(m=>usedPeople.has(m.participant_name)))continue;
    picked.push(trio);trio.members.forEach(m=>usedPeople.add(m.participant_name));
    if(picked.length===3)return picked;
  }
  for(const trio of ranked){if(!picked.includes(trio)){picked.push(trio);if(picked.length===3)break;}}
  return picked;
}

function renderMembers(){if(!responses.length){$('memberList').innerHTML='<p class="empty-state">아직 완료한 인원이 없습니다.</p>';return;}$('memberList').innerHTML=responses.map(r=>'<div class="member-row"><div class="member-avatar">'+esc(r.participant_name.slice(0,1))+'</div><div><strong>'+esc(r.participant_name)+'</strong><span>'+TYPES[r.top_type]+' · '+TYPES[r.second_type]+'</span></div><i>완료</i></div>').join('');}
function renderDistribution(){const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const total=responses.length||1;$('distribution').innerHTML=Object.keys(c).map(k=>{const p=Math.round(c[k]/total*100);return '<div class="dist-row"><div><span>'+LABELS[k]+'</span><strong>'+c[k]+'명</strong></div><div class="dist-bar"><i class="type-'+k+'" style="width:'+p+'%"></i></div></div>';}).join('');}
function teamHeadline(){if(!responses.length)return '아직 팀의 색이 모이지 않았습니다.';const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const sorted=Object.keys(c).sort((a,b)=>c[b]-c[a]);const max=c[sorted[0]],min=c[sorted[3]];if(max-min<=1)return '서로 다른 방식이 고르게 모인 팀이에요.';if(c[sorted[0]]===c[sorted[1]])return TYPES[sorted[0]]+'과 '+TYPES[sorted[1]]+'의 색이 함께 두드러져요.';return TYPES[sorted[0]]+'의 색이 가장 선명하고, '+TYPES[sorted[1]]+'이 자연스럽게 뒤를 받쳐요.';}
function renderTypeRosters(){const grouped={execute:[],plan:[],quality:[],people:[]};responses.forEach(r=>grouped[r.top_type].push(r.participant_name));$('typeRosters').innerHTML=TYPE_ORDER.map(k=>{const copy=TYPE_COPY[k];const names=grouped[k].map(n=>'<span class="name-chip">'+esc(n)+'</span>').join('');return '<article class="type-roster type-roster-'+k+'"><div class="type-roster-title"><span class="type-symbol">'+copy[0]+'</span><div><strong>'+TYPES[k]+'</strong><p>'+copy[1]+'</p></div><em>'+copy[2]+'</em></div><div class="name-chip-wrap">'+(names||'<span class="name-chip muted">해당 없음</span>')+'</div></article>';}).join('');}

function starPoints(cx,cy,outer,inner){const pts=[];for(let i=0;i<10;i++){const r=i%2===0?outer:inner;const angle=(-90+i*36)*Math.PI/180;pts.push((cx+Math.cos(angle)*r).toFixed(1)+','+(cy+Math.sin(angle)*r).toFixed(1));}return pts.join(' ');}
function nodeIcon(type,cx,cy){const y=cy-30;if(type==='execute')return '<polygon class="rel-icon-shape" points="'+(cx-5)+','+(y-16)+' '+(cx+8)+','+(y-16)+' '+(cx+1)+','+(y-3)+' '+(cx+12)+','+(y-3)+' '+(cx-8)+','+(y+18)+' '+(cx-2)+','+(y+3)+' '+(cx-12)+','+(y+3)+'" />';if(type==='plan')return '<g class="rel-icon-stroke"><rect x="'+(cx-14)+'" y="'+(y-13)+'" width="28" height="26" rx="4"/><path d="M'+cx+' '+(y-13)+'V'+(y+13)+'M'+(cx-14)+' '+y+'H'+(cx+14)+'"/></g>';if(type==='quality')return '<polygon class="rel-icon-shape" points="'+starPoints(cx,y,15,7)+'" />';return '<g class="rel-icon-people"><circle cx="'+cx+'" cy="'+(y-8)+'" r="7"/><circle cx="'+(cx-13)+'" cy="'+(y-3)+'" r="5"/><circle cx="'+(cx+13)+'" cy="'+(y-3)+'" r="5"/><path d="M'+(cx-13)+' '+(y+15)+'Q'+cx+' '+(y+2)+' '+(cx+13)+' '+(y+15)+'"/></g>';}
function relationshipNode(type,cx,cy){const sub={execute:'빠르게 움직이는 추진력',plan:'큰 그림을 만드는 설계력',quality:'끝까지 해내는 완성력',people:'사람을 연결하는 조율력'}[type];return '<g class="rel-node-svg rel-node-'+type+'"><circle class="rel-node-bg" cx="'+cx+'" cy="'+cy+'" r="68"/>'+nodeIcon(type,cx,cy)+'<text class="rel-node-title" x="'+cx+'" y="'+(cy+10)+'" text-anchor="middle">'+TYPES[type]+'</text><text class="rel-node-subtitle" x="'+cx+'" y="'+(cy+31)+'" text-anchor="middle">'+sub+'</text></g>';}
function relationshipLink(link,hot){return '<line class="rel-link'+(hot?' is-hot':'')+'" x1="'+link.x1+'" y1="'+link.y1+'" x2="'+link.x2+'" y2="'+link.y2+'" />';}
function relationshipLabel(link,hot){const w=112,h=30,x=link.lx-w/2,y=link.ly-h/2;return '<g class="rel-label'+(hot?' is-hot':'')+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="15"/><text x="'+link.lx+'" y="'+(link.ly+4)+'" text-anchor="middle">'+link.label+'</text></g>';}
function renderRelationshipMap(trios){const hot=new Set(trios.flatMap(t=>t.keys));const links=[{a:'execute',b:'plan',label:'속도 + 뼈대',x1:300,y1:85,x2:115,y2:260,lx:203,ly:165},{a:'execute',b:'quality',label:'돌파 + 완성',x1:300,y1:85,x2:485,y2:260,lx:397,ly:165},{a:'execute',b:'people',label:'추진 + 연결',x1:300,y1:85,x2:300,y2:435,lx:300,ly:355},{a:'plan',b:'quality',label:'설계 + 정밀',x1:115,y1:260,x2:485,y2:260,lx:300,ly:260},{a:'plan',b:'people',label:'흐름 + 조율',x1:115,y1:260,x2:300,y2:435,lx:203,ly:355},{a:'quality',b:'people',label:'신뢰 + 협업',x1:485,y1:260,x2:300,y2:435,lx:397,ly:355}];const lines=links.map(l=>relationshipLink(l,hot.has(pairKey(l.a,l.b)))).join('');const labels=links.map(l=>relationshipLabel(l,hot.has(pairKey(l.a,l.b)))).join('');const nodes=relationshipNode('execute',300,85)+relationshipNode('plan',115,260)+relationshipNode('quality',485,260)+relationshipNode('people',300,435);const legend=links.map(l=>'<div class="relationship-pair-chip'+(hot.has(pairKey(l.a,l.b))?' is-hot':'')+'"><span>'+LABELS[l.a]+' × '+LABELS[l.b]+'</span><strong>'+l.label+'</strong></div>').join('');$('relationshipMap').innerHTML='<div class="relationship-graphic"><svg class="relationship-svg" viewBox="0 0 600 520" role="img" aria-label="네 가지 업무 스타일의 시너지 관계도">'+lines+labels+nodes+'</svg></div><div class="relationship-pair-list">'+legend+'</div>';}

function trioInterpretation(trio){
  const members=trio.members;
  const types=[...new Set(members.map(m=>m.top_type))];
  const namesByType={};members.forEach(m=>{(namesByType[m.top_type]||(namesByType[m.top_type]=[])).push(m.participant_name);});
  const pairCandidates=[];for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){if(members[i].top_type!==members[j].top_type){const key=pairKey(members[i].top_type,members[j].top_type);pairCandidates.push({key,score:pairScore(members[i],members[j]),meta:PAIRS[key]});}}
  pairCandidates.sort((a,b)=>b.score-a.score);
  const lead=pairCandidates[0]?.meta||['역할 연결','서로 다른 업무 방식을 연결하는 조합','다양한 강점의 조합'];
  const roleText=members.map(m=>esc(m.participant_name)+'님은 '+ROLE_COPY[m.top_type]).join(', ')+'.';
  let bestWork='역할이 분명한 단기 프로젝트나 공동 산출물처럼 서로의 강점을 나눠 쓸 수 있는 업무';
  const set=new Set(types);
  if(set.has('execute')&&set.has('plan')&&set.has('quality'))bestWork='기획안을 빠르게 구조화해 실제 결과물까지 완성해야 하는 프로젝트, 보고서·제안서·신규 업무 런칭';
  else if(set.has('execute')&&set.has('plan')&&set.has('people'))bestWork='여러 관계자가 얽힌 행사 운영, 변화 추진, 부서 간 협업처럼 속도와 조율이 동시에 필요한 업무';
  else if(set.has('execute')&&set.has('quality')&&set.has('people'))bestWork='현장 실행과 이용자·고객 접점이 함께 있는 업무, 서비스 개선, 캠페인 운영처럼 실행력과 품질·관계 관리가 모두 필요한 과제';
  else if(set.has('plan')&&set.has('quality')&&set.has('people'))bestWork='정책·프로세스 개선, 복잡한 사례 검토, 기준 정비처럼 구조·정확성·이해관계 조율이 함께 필요한 업무';
  else if(types.length===2)bestWork=lead[1]+'이 특히 필요한 공동 과제';

  const missing=TYPE_ORDER.filter(t=>!set.has(t));
  let caution='역할을 시작 전에 한 문장씩 합의하면 강점이 겹치지 않고 더 선명하게 작동합니다.';
  if(missing.includes('people'))caution='세 사람 모두 과업 중심으로 몰입하기 쉬운 조합입니다. 중간에 이해관계자 반응과 합의 상태를 확인하는 시간을 의도적으로 넣는 것이 좋습니다.';
  else if(missing.includes('plan'))caution='실행과 반응은 빠를 수 있지만 우선순위가 흔들리면 재작업이 생길 수 있습니다. 시작 전에 역할·순서·완료 기준을 짧게 정리하면 안정적입니다.';
  else if(missing.includes('quality'))caution='진행 속도와 협업 흐름은 좋지만 마무리 기준이 느슨해질 수 있습니다. 최종 검수 기준과 확인자를 미리 정해두는 것이 좋습니다.';
  else if(missing.includes('execute'))caution='논의와 검토가 충분한 대신 착수가 늦어질 수 있습니다. 회의 끝에 첫 행동과 마감 시점을 바로 확정하면 이 조합의 장점이 살아납니다.';
  if(types.length<3)caution+=' 주성향이 일부 겹치므로, 같은 방식으로 문제를 보는 순간에는 의도적으로 다른 관점을 요청해보세요.';

  return {title:lead[0],tag:lead[2],summary:roleText+' 세 역할이 연결되면 한 사람이 모든 것을 책임지기보다 시작·구조·검수·조율 기능을 나눠 가질 수 있습니다.',bestWork,caution};
}

function renderTopPairs(trios){
  if(!trios.length){$('topPairs').innerHTML='<p class="empty-state">3명 이상 완료되면 재미로 보는 3인 케미 PICK을 보여드려요.</p>';return;}
  const labels=['PICK A','PICK B','PICK C'];
  $('topPairs').innerHTML=trios.map((trio,i)=>{const insight=trioInterpretation(trio);const members=trio.members.map(m=>'<div class="trio-member"><div class="trio-member-avatar">'+esc(m.participant_name.slice(0,1))+'</div><div><strong>'+esc(m.participant_name)+'</strong><span>'+TYPES[m.top_type]+' · 보조 '+TYPES[m.second_type]+'</span></div></div>').join('');return '<article class="trio-pick pick-'+String.fromCharCode(97+i)+'"><div class="trio-left"><span class="pick-label">'+labels[i]+'</span><div class="trio-members">'+members+'</div></div><div class="trio-copy"><em>'+insight.tag+'</em><strong>'+insight.title+'</strong><p class="trio-summary">'+insight.summary+'</p><div class="trio-analysis"><div><span>왜 잘 맞나</span><p>'+trio.keys.map(k=>PAIRS[k]?.[1]).filter(Boolean).slice(0,2).join(' 또한 ')+'</p></div><div><span>잘 맞는 업무</span><p>'+insight.bestWork+'</p></div><div><span>함께할 때 체크</span><p>'+insight.caution+'</p></div></div></div></article>';}).join('');
}

function renderSummary(){const trios=getTopTrios();$('teamHeadline').textContent=teamHeadline();$('teamSummaryLead').textContent='네 가지 일하는 방식이 서로 다른 역할을 맡을 때, 팀의 강점이 더 선명해집니다.';renderTypeRosters();renderRelationshipMap(trios);renderTopPairs(trios);const counts={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>counts[r.top_type]++);const sorted=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);const missing=sorted.filter(k=>counts[k]===0);const insight=[];if(missing.length)insight.push('현재 '+missing.map(k=>TYPES[k]).join(' · ')+' 구성원은 없어요. 필요한 순간에는 그 유형의 행동을 팀 안에서 의도적으로 빌려보는 것도 방법입니다.');else insight.push('네 가지 유형이 모두 있어 상황에 따라 서로 다른 방식으로 역할을 나눠볼 수 있는 팀이에요.');insight.push(TYPES[sorted[0]]+'의 색이 상대적으로 많이 보여요. 워크숍에서는 이 강점이 언제 빛나는지, 반대로 언제 과해질 수 있는지 가볍게 이야기해보세요.');$('teamInsights').innerHTML=insight.map((t,i)=>'<div><span>POINT '+(i+1)+'</span><p>'+t+'</p></div>').join('');}

async function refresh(){const d=await api({action:'dashboard',slug:'team-workshop-01',presenter_code:code});responses=d.responses||[];$('sessionTitle').textContent=d.session.title;$('memberCount').textContent=responses.length+'명';$('completionBadge').textContent=responses.length;renderMembers();renderDistribution();return d;}
function ensureSummaryVisible(){if($('teamSummary').hidden){$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();}}
function downloadExcel(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}const rows=responses.map((r,i)=>({번호:i+1,이름:r.participant_name,'1순위 유형':TYPES[r.top_type],'2순위 유형':TYPES[r.second_type],'실행 점수':r.execute_score,'설계 점수':r.plan_score,'완성도 점수':r.quality_score,'조율 점수':r.people_score,'완료 시각':new Date(r.completed_at).toLocaleString('ko-KR')}));const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'워크스타일 결과');XLSX.writeFile(wb,'workstyle-results.xlsx');}
async function downloadImage(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}ensureSummaryVisible();const area=$('exportArea');area.classList.add('exporting');try{const canvas=await html2canvas(area,{backgroundColor:'#f6f7f8',scale:2,useCORS:true});const link=document.createElement('a');link.download='workstyle-team-summary.png';link.href=canvas.toDataURL('image/png');link.click();}catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}finally{area.classList.remove('exporting');}}
async function resetData(){try{const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/reset_workstyle_session',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify({p_slug:'team-workshop-01',p_presenter_code:code})});if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||d.error||'초기화 실패');}$('resetModal').hidden=true;await refresh();$('teamSummary').hidden=true;$('summaryIntro').hidden=false;alert('워크숍 데이터가 초기화되었습니다.');}catch(e){alert(e.message||'초기화 중 오류가 발생했습니다.');}}

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
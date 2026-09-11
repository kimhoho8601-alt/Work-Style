(function(){
'use strict';
const API='https://tedbkobhltarqibjhfhk.supabase.co/functions/v1/workstyle-workshop';
const SUPABASE_URL='https://tedbkobhltarqibjhfhk.supabase.co';
const SUPABASE_KEY='sb_publishable_CS5rpk5S1eYBFxyUzCQ63w_NzPpwOZ2';
const TYPES={execute:'실행 주도형',plan:'구조 설계형',quality:'완성도 집중형',people:'관계 조율형'};
const LABELS={execute:'실행',plan:'설계',quality:'완성도',people:'조율'};
const TYPE_COPY={
 execute:['⚡','빠른 판단과 실행으로 변화를 이끄는 타입','일단 해보자!'],
 plan:['▣','전체를 설계하고 체계를 만드는 타입','먼저, 구조를 보자!'],
 quality:['★','높은 기준으로 결과의 완성도를 만드는 타입','끝까지, 제대로!'],
 people:['●●','사람을 연결하고 팀의 균형을 만드는 타입','함께 가면 더 멀리!']
};
const PAIRS={
 'execute-plan':['속도 + 뼈대','빠른 실행이 좋은 구조를 만나는 조합','완벽한 밸런스'],
 'execute-quality':['돌파 + 완성','빠르게 시작하고 끝까지 완성하는 조합','멈추지 않는 시너지'],
 'execute-people':['추진 + 연결','일을 밀고 가면서 사람까지 함께 묶는 조합','함께 가는 추진력'],
 'plan-quality':['설계 + 정밀','아이디어를 구조화하고 결과의 완성도를 높이는 조합','디테일이 살아나는 조합'],
 'plan-people':['흐름 + 조율','전체 흐름과 사람 사이의 맥락을 함께 읽는 조합','좋은 흐름을 만드는 조합'],
 'people-quality':['신뢰 + 협업','관계 감각과 품질 기준이 균형을 만드는 조합','든든한 협업 조합']
};
const $=id=>document.getElementById(id);
let code='',responses=[];
function api(payload){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'요청 실패');return d;});}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function pairKey(a,b){return [a,b].sort().join('-');}
function pairScore(a,b){let s=0;if(a.top_type!==b.top_type)s+=5;if(a.second_type===b.top_type)s+=3;if(b.second_type===a.top_type)s+=3;if(a.second_type===b.second_type)s+=1;const gapA=Math.abs(Number(a[a.top_type+'_score'])-Number(a[a.second_type+'_score']));const gapB=Math.abs(Number(b[b.top_type+'_score'])-Number(b[b.second_type+'_score']));if(gapA<=2)s+=1;if(gapB<=2)s+=1;return s;}
function getAllPairs(){const all=[];for(let i=0;i<responses.length;i++){for(let j=i+1;j<responses.length;j++){const a=responses[i],b=responses[j],key=pairKey(a.top_type,b.top_type),meta=PAIRS[key];if(!meta)continue;all.push({a,b,key,meta,score:pairScore(a,b)});}}return all.sort((x,y)=>y.score-x.score||x.a.participant_name.localeCompare(y.a.participant_name,'ko'));}
function getTopPairs(){const ranked=getAllPairs(),used=new Set(),picked=[];for(const p of ranked){if(used.has(p.a.participant_name)||used.has(p.b.participant_name))continue;picked.push(p);used.add(p.a.participant_name);used.add(p.b.participant_name);if(picked.length===3)break;}if(picked.length<3){for(const p of ranked){if(picked.includes(p))continue;picked.push(p);if(picked.length===3)break;}}return picked;}
function renderMembers(){if(!responses.length){$('memberList').innerHTML='<p class="empty-state">아직 완료한 인원이 없습니다.</p>';return;}$('memberList').innerHTML=responses.map(r=>'<div class="member-row"><div class="member-avatar">'+esc(r.participant_name.slice(0,1))+'</div><div><strong>'+esc(r.participant_name)+'</strong><span>'+TYPES[r.top_type]+' · '+TYPES[r.second_type]+'</span></div><i>완료</i></div>').join('');}
function renderDistribution(){const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const total=responses.length||1;$('distribution').innerHTML=Object.keys(c).map(k=>{const p=Math.round(c[k]/total*100);return '<div class="dist-row"><div><span>'+LABELS[k]+'</span><strong>'+c[k]+'명</strong></div><div class="dist-bar"><i class="type-'+k+'" style="width:'+p+'%"></i></div></div>';}).join('');}
function teamHeadline(){if(!responses.length)return '아직 팀의 색이 모이지 않았습니다.';const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const sorted=Object.keys(c).sort((a,b)=>c[b]-c[a]);const max=c[sorted[0]],min=c[sorted[3]];if(max-min<=1)return '서로의 다름이 고르게 모인, 균형 좋은 팀이에요.';if(c[sorted[0]]===c[sorted[1]])return TYPES[sorted[0]]+'과 '+TYPES[sorted[1]]+'의 힘이 함께 팀의 중심을 잡고 있어요.';return TYPES[sorted[0]]+'이 중심을 잡고, '+TYPES[sorted[1]]+'이 그 힘을 보완하는 팀이에요.';}
function renderTypeRosters(){const grouped={execute:[],plan:[],quality:[],people:[]};responses.forEach(r=>grouped[r.top_type].push(r.participant_name));$('typeRosters').innerHTML=Object.keys(grouped).map(k=>{const copy=TYPE_COPY[k];const names=grouped[k].map(n=>'<span class="name-chip">'+esc(n)+'</span>').join('');return '<article class="type-roster type-roster-'+k+'"><div class="type-roster-title"><span class="type-symbol">'+copy[0]+'</span><div><strong>'+TYPES[k]+'</strong><p>'+copy[1]+'</p></div><em>'+copy[2]+'</em></div><div class="name-chip-wrap">'+(names||'<span class="name-chip muted">해당 없음</span>')+'</div></article>';}).join('');}
function renderRelationshipMap(topPairs){const hot=new Set(topPairs.map(p=>p.key));const edge=(a,b,label,cls)=>'<div class="relationship-edge '+cls+(hot.has(pairKey(a,b))?' is-hot':'')+'"><span>'+label+'</span></div>';$('relationshipMap').innerHTML='<div class="relationship-canvas">'+
 '<div class="relation-node relation-execute"><span>⚡</span><strong>실행 주도형</strong><small>빠르게 움직이는 추진력</small></div>'+ 
 '<div class="relation-node relation-plan"><span>▣</span><strong>구조 설계형</strong><small>큰 그림을 만드는 설계력</small></div>'+ 
 '<div class="relation-node relation-quality"><span>★</span><strong>완성도 집중형</strong><small>끝까지 해내는 완성력</small></div>'+ 
 '<div class="relation-node relation-people"><span>●●</span><strong>관계 조율형</strong><small>사람을 연결하는 조율력</small></div>'+ 
 edge('execute','plan','속도 + 뼈대','edge-ep')+edge('execute','quality','돌파 + 완성','edge-eq')+edge('execute','people','추진 + 연결','edge-epeople')+edge('plan','quality','설계 + 정밀','edge-pq')+edge('plan','people','흐름 + 조율','edge-pp')+edge('quality','people','신뢰 + 협업','edge-qp')+'</div>';}
function renderTopPairs(topPairs){if(!topPairs.length){$('topPairs').innerHTML='<p class="empty-state">2명 이상 완료되면 베스트 조합을 보여드려요.</p>';return;}$('topPairs').innerHTML=topPairs.map((p,i)=>'<article class="top-pair rank-'+(i+1)+'"><div class="rank-badge">'+(i+1)+'위</div><div class="pair-names"><span>'+esc(p.a.participant_name)+'</span><b>×</b><span>'+esc(p.b.participant_name)+'</span></div><div class="pair-copy"><em>'+p.meta[2]+'</em><strong>'+p.meta[0]+'</strong><p>'+p.meta[1]+'. 서로의 1·2순위 성향이 맞물려 워크숍에서 이야기해보기 좋은 조합이에요.</p></div></article>').join('');}
function renderSummary(){const topPairs=getTopPairs();$('teamHeadline').textContent=teamHeadline();$('teamSummaryLead').textContent='4가지 일하는 방식이 서로 다른 역할을 맡을 때, 팀의 강점이 더 선명해집니다.';renderTypeRosters();renderRelationshipMap(topPairs);renderTopPairs(topPairs);const counts={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>counts[r.top_type]++);const sorted=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);const missing=sorted.filter(k=>counts[k]===0);const insight=[];if(missing.length)insight.push('현재 '+missing.map(k=>TYPES[k]).join(' · ')+' 구성원은 없습니다. 필요한 순간에는 그 유형의 행동을 의도적으로 빌려보세요.');else insight.push('네 가지 유형이 모두 있어 상황에 따라 역할을 바꿔가며 협업하기 좋은 팀입니다.');insight.push(TYPES[sorted[0]]+' 비중이 가장 높습니다. 강점이 커지는 만큼 그 유형의 리스크가 과해지지 않는지도 함께 이야기해보세요.');$('teamInsights').innerHTML=insight.map((t,i)=>'<div><span>0'+(i+1)+'</span><p>'+t+'</p></div>').join('');}
async function refresh(){const d=await api({action:'dashboard',slug:'team-workshop-01',presenter_code:code});responses=d.responses||[];$('sessionTitle').textContent=d.session.title;$('memberCount').textContent=responses.length+'명';$('completionBadge').textContent=responses.length;renderMembers();renderDistribution();return d;}
function ensureSummaryVisible(){if($('teamSummary').hidden){$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();}}
function downloadExcel(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}const rows=responses.map((r,i)=>({번호:i+1,이름:r.participant_name,'1순위 유형':TYPES[r.top_type],'2순위 유형':TYPES[r.second_type],'실행 점수':r.execute_score,'설계 점수':r.plan_score,'완성도 점수':r.quality_score,'조율 점수':r.people_score,'완료 시각':new Date(r.completed_at).toLocaleString('ko-KR')}));const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'워크스타일 결과');XLSX.writeFile(wb,'workstyle-results.xlsx');}
async function downloadImage(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}ensureSummaryVisible();const area=$('exportArea');area.classList.add('exporting');try{const canvas=await html2canvas(area,{backgroundColor:'#f6f7f8',scale:2,useCORS:true});const link=document.createElement('a');link.download='workstyle-team-summary.png';link.href=canvas.toDataURL('image/png');link.click();}catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}finally{area.classList.remove('exporting');}}
async function resetData(){try{const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/reset_workstyle_session',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify({p_slug:'team-workshop-01',p_presenter_code:code})});if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||d.error||'초기화 실패');}$('resetModal').hidden=true;await refresh();$('teamSummary').hidden=true;$('summaryIntro').hidden=false;alert('워크숍 데이터가 초기화되었습니다.');}catch(e){alert(e.message||'초기화 중 오류가 발생했습니다.');}}
$('presenterForm').addEventListener('submit',async e=>{e.preventDefault();code=$('presenterCode').value;const status=$('presenterStatus');status.textContent='확인 중…';try{await refresh();$('presenterGate').hidden=true;$('dashboard').hidden=false;status.textContent='';window.scrollTo(0,0);}catch(err){status.textContent=err.message;}});
$('refreshBtn').addEventListener('click',async()=>{try{await refresh();if(!$('teamSummary').hidden)renderSummary();}catch(e){alert(e.message);}});
$('summaryBtn').addEventListener('click',async()=>{try{await refresh();$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();setTimeout(()=>$('teamSummary').scrollIntoView({behavior:'smooth',block:'start'}),40);}catch(e){alert(e.message);}});
$('rerunBtn').addEventListener('click',()=>{renderSummary();document.querySelectorAll('.top-pair,.type-roster').forEach(el=>{el.style.animation='none';void el.offsetWidth;el.style.animation='summaryIn .45s ease both';});});
$('excelBtn').addEventListener('click',downloadExcel);
$('imageBtn').addEventListener('click',downloadImage);
$('resetBtn').addEventListener('click',()=>{$('resetModal').hidden=false;});
$('resetCancelBtn').addEventListener('click',()=>{$('resetModal').hidden=true;});
$('resetConfirmBtn').addEventListener('click',resetData);
})();
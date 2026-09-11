(function(){
'use strict';
const API='https://tedbkobhltarqibjhfhk.supabase.co/functions/v1/workstyle-workshop';
const SUPABASE_URL='https://tedbkobhltarqibjhfhk.supabase.co';
const SUPABASE_KEY='sb_publishable_CS5rpk5S1eYBFxyUzCQ63w_NzPpwOZ2';
const TYPES={execute:'실행 주도형',plan:'구조 설계형',quality:'완성도 집중형',people:'관계 조율형'};
const LABELS={execute:'실행',plan:'설계',quality:'완성도',people:'조율'};
const PAIRS={
 'execute-plan':['속도 + 뼈대','실행력과 구조화가 맞물리는 조합'],
 'execute-quality':['돌파 + 완성','빠른 착수와 높은 완성도를 연결하는 조합'],
 'execute-people':['추진 + 연결','일을 밀고 가면서 사람까지 함께 묶는 조합'],
 'plan-quality':['설계 + 정밀','구조와 기준을 함께 챙기는 조합'],
 'plan-people':['흐름 + 조율','전체 그림과 협업 맥락을 함께 보는 조합'],
 'people-quality':['신뢰 + 협업','관계 감각과 품질 기준이 균형을 만드는 조합']
};
const $=id=>document.getElementById(id);
let code='',responses=[];
function api(payload){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'요청 실패');return d;});}
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function pairKey(a,b){return [a,b].sort().join('-');}
function pairScore(a,b){let s=0;if(a.top_type!==b.top_type)s+=4;if(a.second_type===b.top_type)s+=2;if(b.second_type===a.top_type)s+=2;if(a.second_type!==b.second_type)s+=1;return s;}
function getPairs(){const all=[];for(let i=0;i<responses.length;i++){for(let j=i+1;j<responses.length;j++){const a=responses[i],b=responses[j],meta=PAIRS[pairKey(a.top_type,b.top_type)];if(!meta)continue;all.push({a,b,score:pairScore(a,b),meta});}}return all.sort((x,y)=>y.score-x.score).slice(0,Math.min(8,Math.max(4,responses.length)));}
function renderMembers(){if(!responses.length){$('memberList').innerHTML='<p class="empty-state">아직 완료한 인원이 없습니다.</p>';return;}$('memberList').innerHTML=responses.map(r=>'<div class="member-row"><div class="member-avatar">'+esc(r.participant_name.slice(0,1))+'</div><div><strong>'+esc(r.participant_name)+'</strong><span>'+TYPES[r.top_type]+' · '+TYPES[r.second_type]+'</span></div><i>완료</i></div>').join('');}
function renderDistribution(){const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const total=responses.length||1;$('distribution').innerHTML=Object.keys(c).map(k=>{const p=Math.round(c[k]/total*100);return '<div class="dist-row"><div><span>'+LABELS[k]+'</span><strong>'+c[k]+'명</strong></div><div class="dist-bar"><i class="type-'+k+'" style="width:'+p+'%"></i></div></div>';}).join('');}
function teamHeadline(){if(!responses.length)return '아직 팀의 색이 모이지 않았습니다.';const c={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>c[r.top_type]++);const sorted=Object.keys(c).sort((a,b)=>c[b]-c[a]);if(c[sorted[0]]===responses.length)return TYPES[sorted[0]]+' 에너지가 아주 강한 팀입니다.';if(c[sorted[0]]===c[sorted[1]])return LABELS[sorted[0]]+'과 '+LABELS[sorted[1]]+'의 힘이 균형을 이루는 팀입니다.';return LABELS[sorted[0]]+'이 팀의 중심을 잡고, '+LABELS[sorted[1]]+'이 그 힘을 보완합니다.';}
function renderSummary(){const pairs=getPairs();$('teamHeadline').textContent=teamHeadline();if(!pairs.length){$('chemistryMap').innerHTML='<div class="empty-state large">서로 다른 유형의 구성원이 2명 이상 모이면 시너지 페어가 나타납니다.</div>';}else{$('chemistryMap').innerHTML=pairs.map((p,i)=>'<article class="chem-card" style="--delay:'+(i*.07)+'s"><div class="chem-people"><span>'+esc(p.a.participant_name)+'</span><b>×</b><span>'+esc(p.b.participant_name)+'</span></div><strong>'+p.meta[0]+'</strong><p>'+p.meta[1]+'</p><div class="chem-tags"><i>'+LABELS[p.a.top_type]+'</i><i>'+LABELS[p.b.top_type]+'</i></div></article>').join('');}
 const counts={execute:0,plan:0,quality:0,people:0};responses.forEach(r=>counts[r.top_type]++);const missing=Object.keys(counts).filter(k=>counts[k]===0);const insight=[];if(missing.length) insight.push('현재 '+missing.map(k=>LABELS[k]).join(' · ')+' 성향이 1순위인 구성원은 없습니다. 이 역할이 필요한 순간에는 의도적으로 보완 행동을 정해보세요.');else insight.push('네 가지 성향이 모두 있어 상황에 따라 역할을 다르게 조합해볼 수 있는 팀입니다.');const strongest=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];insight.push(LABELS[strongest]+' 성향이 가장 많이 모였습니다. 이 강점이 과해지는 순간의 리스크도 함께 이야기해보면 좋습니다.');$('teamInsights').innerHTML=insight.map((t,i)=>'<div><span>0'+(i+1)+'</span><p>'+t+'</p></div>').join('');}
async function refresh(){const d=await api({action:'dashboard',slug:'team-workshop-01',presenter_code:code});responses=d.responses||[];$('sessionTitle').textContent=d.session.title;$('memberCount').textContent=responses.length+'명';$('completionBadge').textContent=responses.length;renderMembers();renderDistribution();return d;}
function ensureSummaryVisible(){if($('teamSummary').hidden){$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();}}
function downloadExcel(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}const rows=responses.map((r,i)=>({번호:i+1,이름:r.participant_name,'1순위 유형':TYPES[r.top_type],'2순위 유형':TYPES[r.second_type],'실행 점수':r.execute_score,'설계 점수':r.plan_score,'완성도 점수':r.quality_score,'조율 점수':r.people_score,'완료 시각':new Date(r.completed_at).toLocaleString('ko-KR')}));const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'워크스타일 결과');XLSX.writeFile(wb,'workstyle-results.xlsx');}
async function downloadImage(){if(!responses.length){alert('다운로드할 결과가 없습니다.');return;}ensureSummaryVisible();const area=$('exportArea');area.classList.add('exporting');try{const canvas=await html2canvas(area,{backgroundColor:'#f6f7f8',scale:2,useCORS:true});const link=document.createElement('a');link.download='workstyle-team-summary.png';link.href=canvas.toDataURL('image/png');link.click();}catch(e){alert('이미지 저장 중 오류가 발생했습니다.');}finally{area.classList.remove('exporting');}}
async function resetData(){try{const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/reset_workstyle_session',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},body:JSON.stringify({p_slug:'team-workshop-01',p_presenter_code:code})});if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d.message||d.error||'초기화 실패');}$('resetModal').hidden=true;await refresh();$('teamSummary').hidden=true;$('summaryIntro').hidden=false;alert('워크숍 데이터가 초기화되었습니다.');}catch(e){alert(e.message||'초기화 중 오류가 발생했습니다.');}}
$('presenterForm').addEventListener('submit',async e=>{e.preventDefault();code=$('presenterCode').value;const status=$('presenterStatus');status.textContent='확인 중…';try{await refresh();$('presenterGate').hidden=true;$('dashboard').hidden=false;status.textContent='';window.scrollTo(0,0);}catch(err){status.textContent=err.message;}});
$('refreshBtn').addEventListener('click',async()=>{try{await refresh();}catch(e){alert(e.message);}});
$('summaryBtn').addEventListener('click',async()=>{try{await refresh();$('summaryIntro').hidden=true;$('teamSummary').hidden=false;renderSummary();setTimeout(()=>$('teamSummary').scrollIntoView({behavior:'smooth',block:'start'}),40);}catch(e){alert(e.message);}});
$('rerunBtn').addEventListener('click',()=>{renderSummary();document.querySelectorAll('.chem-card').forEach(el=>{el.style.animation='none';void el.offsetWidth;el.style.animation='chemIn .5s var(--delay) both';});});
$('excelBtn').addEventListener('click',downloadExcel);
$('imageBtn').addEventListener('click',downloadImage);
$('resetBtn').addEventListener('click',()=>{$('resetModal').hidden=false;});
$('resetCancelBtn').addEventListener('click',()=>{$('resetModal').hidden=true;});
$('resetConfirmBtn').addEventListener('click',resetData);
})();
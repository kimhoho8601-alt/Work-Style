var KIMKIM = (function () {
  var TYPES = {
    execute:{name:'실행 주도형',desc:'빠르게 움직이며 답을 찾는 성향이 강합니다. 모호한 상황에서도 먼저 시도하고 결과를 보며 방향을 조정하는 능력이 뛰어납니다.',strength:'속도감 있는 실행과 빠른 의사결정',risk:'우선순위 확인 없이 시작하면 재작업이 늘어날 수 있음',priority:'착수 전 완료 기준을 한 줄로 정리하기',actions:['시작 전에 완료 기준을 한 줄로 적기','오늘 가장 중요한 일 하나를 먼저 끝내기','초안을 빠르게 만들고 조기 공유하기']},
    plan:{name:'구조 설계형',desc:'복잡한 일을 구조와 순서로 정리하는 능력이 강합니다. 업무의 맥락과 우선순위를 설계할 때 안정적인 성과를 냅니다.',strength:'복잡한 상황을 구조화하고 우선순위를 세우는 힘',risk:'계획이 길어지면 실행 시작 시점이 늦어질 수 있음',priority:'계획 시간을 제한하고 빠르게 첫 초안을 만들기',actions:['계획은 20분 안에 끝내고 초안 시작하기','하지 않을 일 하나 먼저 정하기','완성도 60%에서 한 번 중간 공유하기']},
    quality:{name:'완성도 집중형',desc:'기준과 디테일을 놓치지 않고 결과의 품질을 끌어올리는 성향이 강합니다. 중요한 산출물의 신뢰도를 높이는 데 강점이 있습니다.',strength:'높은 기준과 세밀한 품질 관리',risk:'모든 업무에 같은 완성도를 적용하면 에너지가 과도하게 소모될 수 있음',priority:'업무별로 필요한 완성도 수준을 먼저 구분하기',actions:['업무마다 완성도 등급 정하기','수정 횟수 최대 2회로 제한하기','충분히 잘한 일 하나 기록하기']},
    people:{name:'관계 조율형',desc:'사람과 상황의 흐름을 빠르게 읽고 협업을 원활하게 만드는 성향이 강합니다. 관계자 간 기대를 연결하고 조율하는 데 강점이 있습니다.',strength:'관계 맥락을 읽고 협업을 부드럽게 연결하는 힘',risk:'타인의 기대를 우선하면 자신의 핵심 업무가 뒤로 밀릴 수 있음',priority:'요청에 답하기 전에 내 우선순위를 먼저 확인하기',actions:['요청에 답하기 전 내 우선순위 확인하기','회의 초반에 내 의견 한 번 말하기','도움을 주기 전 오늘의 핵심 업무 확인하기']}
  };
  var Q = [
    ['새 업무가 도착했습니다. 첫 반응은?',[['일단 손부터 대고 흐름을 만든다','execute'],['전체 구조와 순서를 먼저 그린다','plan'],['좋은 결과의 기준부터 확인한다','quality'],['누가 무엇을 기대하는지 먼저 본다','people']]],
    ['마감이 갑자기 당겨졌습니다. 나는?',[['빠르게 초안을 만들고 수정한다','execute'],['남은 시간을 다시 쪼개 계획한다','plan'],['핵심 품질은 끝까지 지킨다','quality'],['관련자들과 역할과 일정을 바로 맞춘다','people']]],
    ['회의 중 가장 먼저 보이는 것은?',[['결론과 다음 행동','execute'],['논의의 구조와 흐름','plan'],['논리의 빈틈과 디테일','quality'],['사람들의 반응과 분위기','people']]],
    ['일이 막히는 순간, 나는?',[['다른 방법을 바로 시도한다','execute'],['문제를 다시 쪼개서 본다','plan'],['원인을 끝까지 파고든다','quality'],['누군가와 대화하며 풀어본다','people']]],
    ['오늘 일 잘했다는 느낌은 언제 오나요?',[['많은 일을 실제로 끝냈을 때','execute'],['계획한 흐름대로 진행됐을 때','plan'],['내 기준에 맞는 결과가 나왔을 때','quality'],['동료들과 일이 잘 맞물렸을 때','people']]],
    ['피드백을 받으면 가장 먼저?',[['바로 반영해본다','execute'],['수정 순서를 정리한다','plan'],['어떻게 더 좋아질지 본다','quality'],['왜 그렇게 느꼈는지 생각한다','people']]],
    ['일이 한꺼번에 몰리면?',[['급한 것부터 빠르게 처리한다','execute'],['우선순위를 다시 설계한다','plan'],['각 업무의 기준부터 정한다','quality'],['누구와 무엇을 맞출지 확인한다','people']]],
    ['가장 답답한 업무 상황은?',[['결정 없이 말만 길어질 때','execute'],['계획이 계속 바뀔 때','plan'],['대충 만든 결과가 통과될 때','quality'],['정보 공유 없이 각자 움직일 때','people']]],
    ['새 아이디어가 생기면?',[['바로 작은 실험을 해본다','execute'],['실현 방법을 구조화한다','plan'],['더 좋은 형태가 될 때까지 다듬는다','quality'],['누구와 같이 하면 좋을지 생각한다','people']]],
    ['마무리가 어려워지는 이유는?',[['다음 일로 너무 빨리 넘어가서','execute'],['계획을 계속 수정해서','plan'],['조금만 더 고치고 싶어서','quality'],['관계자 의견을 계속 신경 써서','people']]],
    ['팀에서 자연스럽게 맡는 역할은?',[['밀고 나가는 사람','execute'],['정리하고 설계하는 사람','plan'],['검토하고 완성도를 높이는 사람','quality'],['연결하고 조율하는 사람','people']]],
    ['지금 가장 키우고 싶은 업무 습관은?',[['중요한 일을 더 빠르게 끝내기','execute'],['복잡한 일을 더 명확히 정리하기','plan'],['힘을 덜 들이고도 좋은 결과 만들기','quality'],['내 의견과 경계를 더 분명히 말하기','people']]]
  ];
  var idx = 0;
  var scores = {execute:0,plan:0,quality:0,people:0};
  function g(id){return document.getElementById(id);}
  function render(){
    var item = Q[idx];
    g('count').textContent = (idx+1)+' / '+Q.length;
    g('kicker').textContent = '문항 '+('0'+(idx+1)).slice(-2);
    g('progress').style.width = Math.round((idx/Q.length)*100)+'%';
    g('question').textContent = item[0];
    var box = g('options'); box.innerHTML='';
    for(var i=0;i<item[1].length;i++){
      var op=item[1][i];
      var b=document.createElement('button'); b.type='button'; b.className='option'; b.setAttribute('data-key',op[1]);
      var s=document.createElement('span'); s.textContent='0'+(i+1);
      var strong=document.createElement('b'); strong.textContent=op[0];
      b.appendChild(s); b.appendChild(strong);
      b.onclick=function(){choose(this.getAttribute('data-key'));};
      box.appendChild(b);
    }
  }
  function choose(key){scores[key]+=1;idx+=1;if(idx<Q.length){render();}else{showResult();}}
  function showResult(){
    g('quiz').style.display='none'; g('result').style.display='block';
    var keys=['execute','plan','quality','people']; keys.sort(function(a,b){return scores[b]-scores[a];}); var top=keys[0];
    g('resultTitle').textContent=TYPES[top].name; g('resultDesc').textContent=TYPES[top].desc;
    g('strengthText').textContent=TYPES[top].strength; g('riskText').textContent=TYPES[top].risk; g('priorityText').textContent=TYPES[top].priority;
    var labels={execute:'실행',plan:'구조 설계',quality:'완성도',people:'관계 조율'}; var bars='';
    for(var i=0;i<keys.length;i++){var p=Math.round(scores[keys[i]]/Q.length*100);bars+='<div class="bar-row"><div class="bar-head"><span>'+labels[keys[i]]+'</span><strong>'+p+'%</strong></div><div class="bar"><i data-width="'+p+'%"></i></div></div>';}
    g('bars').innerHTML=bars; var acts='';
    for(var j=0;j<TYPES[top].actions.length;j++){acts+='<div class="action"><span>0'+(j+1)+'</span><div><strong>'+(j===0?'오늘 바로 적용':'이번 주 실험')+'</strong><p>'+TYPES[top].actions[j]+'</p></div></div>';}
    g('actions').innerHTML=acts;
    setTimeout(function(){var all=g('bars').getElementsByTagName('i');for(var n=0;n<all.length;n++){all[n].style.width=all[n].getAttribute('data-width');}},260);
    window.scrollTo(0,0);
  }
  function restart(){idx=0;scores={execute:0,plan:0,quality:0,people:0};g('result').style.display='none';g('quiz').style.display='block';render();window.scrollTo(0,0);}
  function init(){var r=g('restartBtn');if(r){r.onclick=restart;}var badge=g('jsStatus');if(badge){badge.textContent='진단 준비 완료';badge.className='status ready';}render();}
  return {init:init,choose:choose,restart:restart};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',KIMKIM.init);}else{KIMKIM.init();}
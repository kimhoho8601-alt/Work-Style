(function () {
  'use strict';

  var TYPES = {
    execute: {
      name: '실행 주도형',
      desc: '빠르게 움직이며 답을 찾는 경향이 강합니다. 불확실한 상황에서도 먼저 시도하고 결과를 보며 방향을 조정하는 능력이 돋보입니다.',
      strength: '속도감 있는 실행과 빠른 의사결정',
      risk: '우선순위 확인 없이 시작하면 재작업이 늘어날 수 있음',
      priority: '착수 전 완료 기준과 우선순위를 한 줄로 정리하기',
      habit: '작게 시작하고 빠르게 피드백 받는 방식이 잘 맞습니다.',
      actions: ['오늘 가장 중요한 일 하나를 먼저 끝내기', '시작 전에 완료 기준을 한 줄로 적기', '초안을 빠르게 만들고 1명에게 조기 공유하기']
    },
    plan: {
      name: '구조 설계형',
      desc: '복잡한 일을 구조와 순서로 정리하는 경향이 강합니다. 여러 업무가 얽혀 있을수록 전체 흐름과 우선순위를 설계하는 힘이 살아납니다.',
      strength: '복잡한 상황을 구조화하고 우선순위를 세우는 힘',
      risk: '계획이 길어지면 실제 실행 시작이 늦어질 수 있음',
      priority: '계획 시간을 제한하고 첫 초안을 빠르게 만들기',
      habit: '업무를 단계로 나누고 기준을 명확히 할 때 안정적인 성과를 냅니다.',
      actions: ['계획 시간을 20분으로 제한하기', '하지 않을 일 하나를 먼저 정하기', '완성도 60%에서 중간 공유하기']
    },
    quality: {
      name: '완성도 집중형',
      desc: '기준과 디테일을 놓치지 않고 결과의 품질을 끌어올리는 경향이 강합니다. 중요한 산출물의 신뢰도와 완성도를 높이는 데 강점이 있습니다.',
      strength: '높은 기준과 세밀한 품질 관리',
      risk: '모든 업무에 같은 수준의 완성도를 적용하면 에너지 소모가 커질 수 있음',
      priority: '업무별 필요한 완성도 수준을 먼저 구분하기',
      habit: '완료 기준이 분명할수록 집중력이 높아지고 결과의 밀도가 올라갑니다.',
      actions: ['업무마다 완성도 등급을 정하기', '수정 횟수를 최대 2회로 제한하기', '충분히 잘한 일 하나를 기록하기']
    },
    people: {
      name: '관계 조율형',
      desc: '사람과 상황의 흐름을 빠르게 읽고 협업을 원활하게 만드는 경향이 강합니다. 관계자 간 기대를 연결하고 조율하는 데 강점이 있습니다.',
      strength: '관계 맥락을 읽고 협업을 부드럽게 연결하는 힘',
      risk: '타인의 기대를 우선하면 자신의 핵심 업무가 뒤로 밀릴 수 있음',
      priority: '요청에 답하기 전에 내 우선순위를 먼저 확인하기',
      habit: '관계와 정보가 잘 연결될 때 높은 영향력을 발휘합니다.',
      actions: ['요청에 답하기 전 내 우선순위를 확인하기', '회의 초반에 내 의견을 한 번 말하기', '도움을 주기 전 오늘의 핵심 업무를 확인하기']
    }
  };

  var QUESTIONS = [
    ['새 업무가 도착했습니다. 가장 먼저 하는 행동은?', [['일단 손부터 대고 흐름을 만든다','execute'],['전체 구조와 순서를 먼저 그린다','plan'],['좋은 결과의 기준부터 확인한다','quality'],['누가 무엇을 기대하는지 먼저 본다','people']]],
    ['마감이 갑자기 당겨졌습니다. 나는?', [['빠르게 초안을 만들고 수정한다','execute'],['남은 시간을 다시 쪼개 계획한다','plan'],['핵심 품질은 끝까지 지킨다','quality'],['관련자들과 역할과 일정을 바로 맞춘다','people']]],
    ['회의 중 가장 먼저 보이는 것은?', [['결론과 다음 행동','execute'],['논의의 구조와 흐름','plan'],['논리의 빈틈과 디테일','quality'],['사람들의 반응과 분위기','people']]],
    ['일이 막히는 순간, 나는?', [['다른 방법을 바로 시도한다','execute'],['문제를 다시 쪼개서 본다','plan'],['원인을 끝까지 파고든다','quality'],['누군가와 대화하며 풀어본다','people']]],
    ['오늘 일을 잘했다는 느낌은 언제 오나요?', [['많은 일을 실제로 끝냈을 때','execute'],['계획한 흐름대로 진행됐을 때','plan'],['내 기준에 맞는 결과가 나왔을 때','quality'],['동료들과 일이 잘 맞물렸을 때','people']]],
    ['피드백을 받으면 가장 먼저?', [['바로 반영해본다','execute'],['수정 순서를 정리한다','plan'],['어떻게 더 좋아질지 본다','quality'],['왜 그렇게 느꼈는지 생각한다','people']]],
    ['일이 한꺼번에 몰리면?', [['급한 것부터 빠르게 처리한다','execute'],['우선순위를 다시 설계한다','plan'],['각 업무의 기준부터 정한다','quality'],['누구와 무엇을 맞출지 확인한다','people']]],
    ['가장 답답한 업무 상황은?', [['결정 없이 말만 길어질 때','execute'],['계획이 계속 바뀔 때','plan'],['대충 만든 결과가 통과될 때','quality'],['정보 공유 없이 각자 움직일 때','people']]],
    ['새 아이디어가 생기면?', [['바로 작은 실험을 해본다','execute'],['실현 방법을 구조화한다','plan'],['더 좋은 형태가 될 때까지 다듬는다','quality'],['누구와 같이 하면 좋을지 생각한다','people']]],
    ['마무리가 어려워지는 이유는?', [['다음 일로 너무 빨리 넘어가서','execute'],['계획을 계속 수정해서','plan'],['조금만 더 고치고 싶어서','quality'],['관계자 의견을 계속 신경 써서','people']]],
    ['팀에서 자연스럽게 맡는 역할은?', [['밀고 나가는 사람','execute'],['정리하고 설계하는 사람','plan'],['검토하고 완성도를 높이는 사람','quality'],['연결하고 조율하는 사람','people']]],
    ['업무를 맡길 때 가장 먼저 보는 것은?', [['바로 실행 가능한지','execute'],['역할과 단계가 명확한지','plan'],['결과 기준이 충분히 구체적인지','quality'],['상대가 맥락을 충분히 이해했는지','people']]],
    ['예상과 다른 문제가 생겼을 때?', [['일단 대안을 시도하며 수정한다','execute'],['영향 범위를 정리하고 순서를 다시 잡는다','plan'],['문제 원인을 확인한 뒤 정확히 고친다','quality'],['관련자에게 상황을 공유하고 조율한다','people']]],
    ['중요한 보고를 준비할 때 나는?', [['핵심 메시지부터 빠르게 잡는다','execute'],['전체 이야기 구조를 먼저 설계한다','plan'],['수치와 표현을 꼼꼼하게 점검한다','quality'],['받는 사람이 무엇을 궁금해할지 생각한다','people']]],
    ['업무 요청을 거절해야 하는 순간에는?', [['대안을 바로 제시하며 선을 긋는다','execute'],['우선순위 근거를 정리해 설명한다','plan'],['현재 업무 수준을 지키기 위해 거절한다','quality'],['관계를 해치지 않는 표현을 고민한다','people']]],
    ['지금 가장 키우고 싶은 업무 습관은?', [['중요한 일을 더 빠르게 끝내기','execute'],['복잡한 일을 더 명확히 정리하기','plan'],['힘을 덜 들이고도 좋은 결과 만들기','quality'],['내 의견과 경계를 더 분명히 말하기','people']]]
  ];

  var images = [
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  ];

  var index = 0;
  var scores = { execute:0, plan:0, quality:0, people:0 };

  function el(id) { return document.getElementById(id); }

  function renderQuestion() {
    var item = QUESTIONS[index];
    el('count').textContent = (index + 1) + ' / ' + QUESTIONS.length;
    el('kicker').textContent = '문항 ' + ('0' + (index + 1)).slice(-2);
    el('progress').style.width = Math.round((index / QUESTIONS.length) * 100) + '%';
    el('question').textContent = item[0];

    var box = el('options');
    box.innerHTML = '';

    for (var i = 0; i < item[1].length; i++) {
      (function (option, number) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';

        var num = document.createElement('span');
        num.textContent = '0' + (number + 1);

        var text = document.createElement('b');
        text.textContent = option[0];

        button.appendChild(num);
        button.appendChild(text);
        button.addEventListener('click', function () {
          choose(option[1]);
        });

        box.appendChild(button);
      })(item[1][i], i);
    }

    var card = el('questionCard');
    card.className = 'quiz-main question-in';
    setTimeout(function () { card.className = 'quiz-main'; }, 360);

    if (el('visualA')) el('visualA').src = images[index % images.length];
    if (el('visualB')) el('visualB').src = images[(index + 2) % images.length];
  }

  function choose(key) {
    scores[key] += 1;
    index += 1;
    if (index < QUESTIONS.length) renderQuestion();
    else showResult();
  }

  function showResult() {
    el('quiz').style.display = 'none';
    el('result').style.display = 'block';

    var keys = ['execute','plan','quality','people'];
    keys.sort(function (a,b) { return scores[b] - scores[a]; });
    var top = keys[0];
    var second = keys[1];

    el('resultTitle').textContent = TYPES[top].name;
    el('resultDesc').textContent = TYPES[top].desc;
    el('strengthText').textContent = TYPES[top].strength;
    el('riskText').textContent = TYPES[top].risk;
    el('priorityText').textContent = TYPES[top].priority;
    el('habitText').textContent = TYPES[top].habit;
    el('mixText').textContent = TYPES[top].name + '을 중심으로 ' + TYPES[second].name + '의 성향이 함께 나타납니다.';

    var labels = { execute:'실행 주도', plan:'구조 설계', quality:'완성도 집중', people:'관계 조율' };
    var bars = '';
    for (var i = 0; i < keys.length; i++) {
      var percent = Math.round((scores[keys[i]] / QUESTIONS.length) * 100);
      bars += '<div class="score-row"><div class="score-head"><span>' + labels[keys[i]] + '</span><strong>' + percent + '%</strong></div><div class="score-bar"><i data-width="' + percent + '%"></i></div></div>';
    }
    el('bars').innerHTML = bars;

    var actions = '';
    for (var j = 0; j < TYPES[top].actions.length; j++) {
      actions += '<div class="action-item"><div class="num">0' + (j + 1) + '</div><div><strong>' + (j === 0 ? '오늘 바로 적용' : '이번 주 실험') + '</strong><p>' + TYPES[top].actions[j] + '</p></div></div>';
    }
    el('actions').innerHTML = actions;

    setTimeout(function () {
      var barsEls = el('bars').getElementsByTagName('i');
      for (var n = 0; n < barsEls.length; n++) barsEls[n].style.width = barsEls[n].getAttribute('data-width');
    }, 320);

    window.scrollTo(0, 0);
  }

  function restart() {
    index = 0;
    scores = { execute:0, plan:0, quality:0, people:0 };
    el('result').style.display = 'none';
    el('quiz').style.display = 'block';
    renderQuestion();
    window.scrollTo(0, 0);
  }

  function init() {
    var restartButton = el('restartBtn');
    if (restartButton) restartButton.addEventListener('click', restart);
    renderQuestion();
  }

  window.KIMKIM = { init:init, restart:restart };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
(function(){
'use strict';

function simplifyPairCard(card){
  if(!card || card.dataset.compact==='1')return;
  const label=card.querySelector('.pair-pick')?.textContent?.trim()||'PAIR';
  const names=Array.from(card.querySelectorAll('.pair-person strong')).map(el=>el.textContent.trim()).filter(Boolean);
  if(names.length<2)return;

  card.dataset.compact='1';
  card.classList.add('compact-pair');
  card.innerHTML='\
    <div class="compact-pair-label">'+label+'</div>\
    <div class="compact-pair-names">\
      <strong>'+escapeHtml(names[0])+'</strong>\
      <span aria-hidden="true">×</span>\
      <strong>'+escapeHtml(names[1])+'</strong>\
    </div>';
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}

function simplifyAll(){
  document.querySelectorAll('#topPairs .pair-recommendation').forEach(simplifyPairCard);
}

function init(){
  const root=document.getElementById('topPairs');
  if(!root)return;
  simplifyAll();
  const observer=new MutationObserver(function(){simplifyAll();});
  observer.observe(root,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
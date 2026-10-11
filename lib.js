/* Shared library card rendering (index.html). Gating: books always free; first FREE non-book items per topic free. */
window.SBX_LIB=(function(){const E=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TY=[['Video','Videos'],['Book','Books'],['PDF / Standard','PDFs & standards'],['Course','Courses'],['Organization','Organizations']];
const lnk=(u,t)=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
function card(x){const loc='';
 if(x.type==='Video')return `<a class="item" href="${x.url}" target="_blank" rel="noopener"><div class="vrow"><img loading="lazy" src="https://i.ytimg.com/vi/${x.vid}/mqdefault.jpg" alt=""><div><b>${E(x.t)}</b><small>${E(x.by)}</small><em>${E(x.note)}</em></div></div></a>`;
 const ex=(x.jobs&&x.jobs!==x.url?' · '+lnk(x.jobs,'Referral / apply ↗'):'')+(x.phone?` · <a href="tel:${x.phone}">${x.phone}</a>`:'')+(x.email?` · <a href="mailto:${x.email}">${x.email}</a>`:'');
 if(x.type==='Book'&&x.isbn){const bu=bookshopUrl(x);return `<div class="item"><b>${E(x.t)}${loc}</b><small>${x.by?E(x.by):''}</small><em>${E(x.note)}</em><a class="btn bsb" href="${bu}" target="_blank" rel="noopener sponsored">📚 Buy on Bookshop.org${x.bookshop?'':' (search)'}</a><small class="sec">${lnk(x.url,'Other seller ↗')}</small></div>`}
 return `<div class="item"><b>${E(x.t)}${loc}</b><small>${x.by?E(x.by)+' · ':''}${lnk(x.url,'Open ↗')}${ex}</small><em>${E(x.note)}</em></div>`}
const FREE=3;
/* Soft gating: locked rows show only title shape, no link. resources.json is public, so this is a members perk, not security. */
function lockCard(x){return `<div class="lock" data-locked="1"><div class="blur" aria-hidden="true"><b style="color:var(--hi);font-size:14px;display:block">${E(x.t).replace(/[^ ]/g,'▇').slice(0,40)}</b><small>${E(x.type)}</small></div><span class="lk">🔒 Members</span></div>`}
function freeSet(ord,mem){const nb=ord.filter(x=>x.type!=='Book');return {nb,free:new Set(mem?ord:[...ord.filter(x=>x.type==='Book'),...nb.slice(0,FREE)])}}
const BSL='<p class="bsl">📖 Support local bookstores: buy through Bookshop.org. <span>ShoBlax may earn a commission from purchases made through these links.</span></p>';
return {E,TY,lnk,card,lockCard,FREE,freeSet,BSL}})();

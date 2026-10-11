/* ShoBlax members client. Token kept in localStorage ("remember this device"). */
(function(){
const API=()=>window.SBX_API,K='sbx_member';
const CONSENT='Yes, ShoBlax can text me updates. Msg &amp; data rates may apply. Reply STOP to opt out.';
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const M=window.SBX={E,
 get(){try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}},
 isMember(){const m=M.get();return !!(m&&m.token)},
 out(){localStorage.removeItem(K);location.reload()},
 post(o){return fetch(API(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o),redirect:'follow'}).then(r=>r.json()).catch(()=>({ok:false,error:'Network error. Try again.'}))},
 jsonp(o){return new Promise(res=>{const cb='sbxcb'+Date.now()+Math.floor(Math.random()*1e6),s=document.createElement('script');let done=0;
  window[cb]=d=>{done=1;res(d);cleanup()};const cleanup=()=>{delete window[cb];s.remove()};
  s.src=API()+(API().includes('?')?'&':'?')+new URLSearchParams({...o,callback:cb});s.onerror=()=>{if(!done){res({ok:false,error:'Network error.'});cleanup()}};
  setTimeout(()=>{if(!done){res({ok:false,error:'Timed out.'});cleanup()}},15000);document.head.appendChild(s)})},
 call(action,o={}){const m=M.get(),p={action,token:m&&m.token,...o};return (action==='listThreads'||action==='getThread'||action==='me'||action==='listAdditions')?M.jsonp(p):M.post(p)},
 toast(t){let d=document.querySelector('.toast');if(!d){d=document.createElement('div');d.className='toast';d.setAttribute('role','status');document.body.appendChild(d)}d.textContent=t;d.classList.add('on');clearTimeout(M._t);M._t=setTimeout(()=>d.classList.remove('on'),3500)},
 openSheet(){if(!document.getElementById('sbxSheet'))build();document.getElementById('sbxBg').classList.add('on');document.getElementById('sbxSheet').classList.add('on');setTimeout(()=>document.getElementById('sbxName').focus(),250)},
 closeSheet(){document.querySelectorAll('.sheet.on,.sheet-bg.on').forEach(e=>e.classList.remove('on'));if(document.activeElement)document.activeElement.blur()}
};
function save(r){localStorage.setItem(K,JSON.stringify({token:r.token,display:r.member.display,id:r.member.id}))}
function done(msg){M.closeSheet();try{M.toast(msg)}catch(e){}setTimeout(()=>document.dispatchEvent(new Event('sbx:member')),0)}
const digits=v=>v.replace(/\D/g,'').replace(/^1(?=\d{10}$)/,''),okPhone=d=>/^[2-9]\d{2}[2-9]\d{6}$/.test(d);
function build(){document.body.insertAdjacentHTML('beforeend',`<div class="sheet-bg" id="sbxBg"></div>
<form class="sheet" id="sbxSheet" role="dialog" aria-modal="true" aria-labelledby="sbxH" novalidate><div class="grab"></div>
<button type="button" class="swap" id="sbxSwap">Already a member? <u>Sign in with your code</u></button>
<div data-m="up"><h2 id="sbxH">Join the crew, free</h2><p class="s">Unlock the full library and the Crew Room. No password: you'll get a personal sign-in code.</p>
<label class="f">Name<input id="sbxName" autocomplete="name" maxlength="60" placeholder="First and last name"></label>
<label class="f">Mobile phone (US)<input id="sbxPhone" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="20" placeholder="(555) 555-5555"></label>
<label class="f">Email (for your sign-in code)<input id="sbxEmail" type="email" inputmode="email" autocomplete="email" maxlength="120" required placeholder="you@example.com"></label>
<label class="ck"><input type="checkbox" id="sbxSms"><span>${CONSENT}<small>Optional. Not required to join. <a href="privacy.html" target="_blank" style="color:#bbb">Privacy policy</a></small></span></label>
<label class="ck"><input type="checkbox" id="sbxMail"><span>Yes, email me ShoBlax updates.<small>Optional. Your sign-in code is emailed either way.</small></span></label>
<p class="fine">We store your name, phone, email and your choice above with a timestamp in our member list. We don't sell it. Sign-in is remembered on this device. We never send sign-in codes by text. <a href="privacy.html" style="color:#888">Privacy</a></p></div>
<div data-m="in" hidden><h2>Sign in</h2><p class="s">Use the phone number you joined with and your 6-character sign-in code.</p>
<label class="f">Mobile phone (US)<input id="sbxPhone2" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="20" placeholder="(555) 555-5555"></label>
<label class="f">Sign-in code<input id="sbxCode" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="7" placeholder="e.g. K7QM2X" style="letter-spacing:.3em;text-transform:uppercase;font-weight:700"></label>
<button type="button" class="swap" id="sbxForgot">Forgot code?</button><p class="fine" id="sbxFmsg"></p><p class="fine">Codes are emailed, never texted. Getting update texts? Reply STOP to opt out anytime. <a href="privacy.html" style="color:#888">Privacy</a></p></div>
<div data-m="done" hidden><h2>You're in. Save this code</h2><p class="s">This is your personal sign-in code. You'll need it with your phone number to sign in on another device. We only show it once<span id="sbxEm"></span>.</p>
<div class="code" id="sbxShow"></div><button type="button" class="btn" id="sbxCopy">📋 Copy code</button></div>
<p class="err" id="sbxErr" aria-live="polite"></p>
<div class="acts"><button type="button" class="btn" id="sbxX" style="flex:1">Not now</button><button class="btn pri" id="sbxGo" style="flex:2">Sign up free</button></div></form>`);
 const $=i=>document.getElementById(i),err=$('sbxErr');let mode='up',pending=null;
 function setMode(m){mode=m;err.textContent='';document.querySelectorAll('#sbxSheet [data-m]').forEach(d=>d.hidden=d.dataset.m!==m);
  $('sbxSwap').hidden=m==='done';$('sbxSwap').innerHTML=m==='up'?'Already a member? <u>Sign in with your code</u>':'New here? <u>Sign up free</u>';
  $('sbxX').hidden=m==='done';$('sbxGo').textContent={up:'Sign up free',in:'Sign in',done:'I saved it, continue'}[m]}
 M.mode=setMode;$('sbxSwap').onclick=()=>{if(mode==='up'&&$('sbxPhone').value)$('sbxPhone2').value=$('sbxPhone').value;setMode(mode==='up'?'in':'up')};
 $('sbxBg').onclick=()=>{if(mode!=='done')M.closeSheet()};$('sbxX').onclick=M.closeSheet;
 $('sbxCopy').onclick=async()=>{try{await navigator.clipboard.writeText($('sbxShow').textContent);$('sbxCopy').textContent='✓ Copied'}catch(e){const r=document.createRange();r.selectNode($('sbxShow'));getSelection().removeAllRanges();getSelection().addRange(r);$('sbxCopy').textContent='Selected, copy it'}};
 $('sbxForgot').onclick=async()=>{const d=digits($('sbxPhone2').value);if(!okPhone(d))return err.textContent='Enter your phone number first.';err.textContent='';
  const r=await M.post({action:'forgot',phone:d});$('sbxFmsg').textContent=r.ok?`We emailed a NEW code to ${r.to}. Your old code no longer works.`:r.error};
 $('sbxGo').addEventListener('click',e=>{if(mode==='done'){e.preventDefault();done('You\'re in. Everything is unlocked.')}});
 const busy=(b,t)=>{$('sbxGo').disabled=b;if(t)$('sbxGo').textContent=t};
 $('sbxSheet').onsubmit=async e=>{e.preventDefault();err.textContent='';
  if(mode==='done'){done('You\'re in. Everything is unlocked.');return}
  if(mode==='in'){const d=digits($('sbxPhone2').value),c=$('sbxCode').value.toUpperCase().replace(/[^A-Z0-9]/g,'');
   if(!okPhone(d))return err.textContent='Please enter a valid 10-digit US mobile number.';if(c.length!==6)return err.textContent='Codes are 6 characters.';
   busy(true,'Signing in…');const r=await M.post({action:'signin',phone:d,code:c});busy(false,'Sign in');
   if(!r.ok)return err.textContent=r.error;save(r);return done('Welcome back, '+r.member.display+'!')}
  const d=digits($('sbxPhone').value);
  if($('sbxName').value.trim().length<2)return err.textContent='Please enter your name.';
  if(!okPhone(d))return err.textContent='Please enter a valid 10-digit US mobile number.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('sbxEmail').value.trim()))return err.textContent='Please enter your email. We send your sign-in code there.';
  busy(true,'Signing up…');
  const r=await M.post({action:'signup',name:$('sbxName').value,phone:d,email:$('sbxEmail').value,smsConsent:$('sbxSms').checked,emailConsent:$('sbxMail').checked});
  busy(false,'Sign up free');
  if(!r.ok){if(r.exists){$('sbxPhone2').value=$('sbxPhone').value;setMode('in')}return err.textContent=r.error||'Something went wrong.'}
  save(r);$('sbxShow').textContent=r.code;$('sbxEm').textContent=r.emailed?' here, and we also emailed it to you':'';setMode('done')};
}
})();

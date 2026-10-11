/* Display-time hide (data in resources.json untouched): drops hidden topics + their items, rephrases notes neutrally. */
(function(){const H=['unions','companies','venues'],RE=/union|compan|venue|house labor/i;
const fix=s=>String(s||'').replace(/production compan(y|ies)/gi,'production team').replace(/\b(lighting|cable|staging|audio|rigging)\s+compan(y|ies)/gi,'$1 maker').replace(/\bCompany\b/g,'Co.').replace(/\bcompany\b/g,'team');
window.SBX_HIDE=R=>{R.topics=R.topics.filter(([k])=>!H.includes(k));
 R.items=R.items.filter(x=>!x.topics.some(t=>H.includes(t))).map(x=>({...x,t:fix(x.t),by:fix(x.by),note:fix(x.note)})).filter(x=>!RE.test([x.t,x.by,x.note,x.type].join(' ')));return R}})();

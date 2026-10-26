'use strict';

/* == Markdown == */
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const REPO='https://github.com/nmstudioo/HyperAudioo/blob/main/';
const XI='<svg class="i xs" aria-hidden="true"><use href="#i-ext"/></svg>';
const isUrl=u=>/^(https?|mailto):/i.test(u)||!/^[a-z][a-z0-9+.-]*:/i.test(u);
const docPath=(u,base)=>{
if(/^[a-z][a-z0-9+.-]*:|^#/i.test(u))return'';
const p=decodeURIComponent(new URL(u.split('#')[0],'http://x/'+base).pathname.slice(1));
return/\.md$/i.test(p)&&!/(^|\/)\.\.(\/|$)/.test(p)?p:'';
};

function inline(t,base){
const st=[],hold=h=>`\0${st.push(h)-1}\0`;
t=t.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g,(_,a,c)=>hold(`<code>${esc(c.trim())}</code>`));
t=t.replace(/\[([^\]]+)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g,(m,x,u)=>{
if(!isUrl(u))return x;
const d=docPath(u,base),ext=/^https?:/i.test(u);
const href=d?REPO+d:ext||/^(mailto:|#)/i.test(u)?u:REPO+docPath(u+'.md',base).replace(/\.md$/,'');
return hold(`<a href="${esc(href)}"${d?` data-doc="${esc(d)}"`:''}${ext?' rel="noopener" target="_blank"':''}>${inline(x,base)}${ext?XI:''}</a>`);
});
t=t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g,(m,a,u)=>a+hold(`<a href="${esc(u)}" rel="noopener" target="_blank">${esc(u)}${XI}</a>`));
t=esc(t);
t=t.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^\w])__([^_]+)__(?!\w)/g,'$1<strong>$2</strong>');
t=t.replace(/(^|[^\w*])\*([^*\s][^*]*?)\*(?![\w*])/g,'$1<em>$2</em>').replace(/(^|[^\w])_([^_\s][^_]*?)_(?![\w])/g,'$1<em>$2</em>');
t=t.replace(/~~([^~]+)~~/g,'<del>$1</del>');
return t.replace(/\0(\d+)\0/g,(_,i)=>st[i]);
}

function cells(r){
r=r.trim().replace(/^\|/,'').replace(/\|$/,'');
const o=[];
let c='',k=false;
for(let i=0;i<r.length;i++){
const ch=r[i];
if(ch=='`')k=!k;
if(ch=='\\'&&r[i+1]=='|'){
c+='|';
i++;
}else if(ch=='|'&&!k){
o.push(c.trim());
c='';
}else c+=ch;
}
o.push(c.trim());
return o;
}

function md(src,base=''){
const L=src.replace(/\r\n?/g,'\n').split('\n'),o=[];
const blank=l=>!l.trim(),
fence=/^\s*(```+|~~~+)\s*[\w-]*\s*$/,
head=/^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/,
hr=/^\s{0,3}([-*_])(\s*\1){2,}\s*$/,
li=/^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
sep=/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/,
ind=l=>l.match(/^\s*/)[0].replace(/\t/g,'    ').length;
const brk=(l,n)=>fence.test(l)||head.test(l)||hr.test(l)||/^\s{0,3}>/.test(l)||li.test(l)||(l.includes('|')&&n!=null&&sep.test(n));
function list(ls){
const i0=ind(ls[0]),gs=[];
for(const l of ls){
const m=li.exec(l);
if(m&&ind(l)<i0+2){
const ol=/\d/.test(m[2]);
if(!gs.length||gs[gs.length-1].ol!=ol)gs.push({ol,items:[]});
gs[gs.length-1].items.push({t:m[3],s:[]});
}else{
const its=gs[gs.length-1].items,it=its[its.length-1];
if(m||ind(l)>=i0+2||blank(l)||it.s.length)it.s.push(l);
else it.t+=' '+l.trim();
}
}
return gs.map(g=>{
const tag=g.ol?'ol':'ul';
return`<${tag}>${g.items.map(it=>{
const s=it.s.map(x=>x.slice(Math.min(i0+2,ind(x)))).filter((x,i,a)=>x.trim()||i<a.length-1);
const inner=s.length?(li.test(s[0])?list(s.filter(x=>x.trim())):md(s.join('\n'),base)):'';
return`<li>${inline(it.t,base)}${inner}</li>`;
}).join('')}</${tag}>`;
}).join('');
}
let i=0;
while(i<L.length){
const l=L[i];
let m;
if(blank(l)){
i++;
continue;
}
if(m=fence.exec(l)){
const c=[],q=m[1][0];
i++;
while(i<L.length&&!new RegExp('^\\s*'+q+'{3,}\\s*$').test(L[i]))c.push(L[i++]);
i++;
o.push(`<pre><code>${esc(c.join('\n'))}</code></pre>`);
continue;
}
if(m=head.exec(l)){
o.push(`<h${m[1].length}>${inline(m[2],base)}</h${m[1].length}>`);
i++;
continue;
}
if(hr.test(l)){
o.push('<hr>');
i++;
continue;
}
if(/^( {4}|\t)/.test(l)){
const c=[];
while(i<L.length&&(/^( {4}|\t)/.test(L[i])||(blank(L[i])&&/^( {4}|\t)/.test(L[i+1]||''))))c.push(L[i++].replace(/^( {4}|\t)/,''));
o.push(`<pre><code>${esc(c.join('\n'))}</code></pre>`);
continue;
}
if(/^\s{0,3}>/.test(l)){
const c=[];
while(i<L.length&&!blank(L[i]))c.push(L[i++].replace(/^\s{0,3}>\s?/,''));
const a=/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i.exec(c[0]);
if(a)c.shift();
const k=a?a[1].toLowerCase():'';
o.push(`<blockquote${k?` class="alert ${k}"`:''}>${k?`<p class="alert-t">${k}</p>`:''}${md(c.join('\n'),base)}</blockquote>`);
continue;
}
if(l.includes('|')&&i+1<L.length&&sep.test(L[i+1])&&L[i+1].includes('-')){
const h=cells(l),al=cells(L[i+1]).map(x=>/^:-+:$/.test(x)?' class="c"':/-:$/.test(x)?' class="r"':'');
i+=2;
const rows=[];
while(i<L.length&&!blank(L[i])&&L[i].includes('|'))rows.push(cells(L[i++]));
o.push(`<div class="tbl" tabindex="0"><table><thead><tr>${h.map((x,j)=>`<th${al[j]||''}>${inline(x,base)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${h.map((_,j)=>`<td${al[j]||''}>${inline(r[j]||'',base)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
continue;
}
if(li.test(l)){
const c=[];
while(i<L.length){
if(blank(L[i])){
let j=i;
while(j<L.length&&blank(L[j]))j++;
if(j<L.length&&(li.test(L[j])||ind(L[j])>=2)&&ind(L[j])>=ind(c[0]||'')){
c.push(L[i]);
i++;
continue;
}
break;
}
if(c.length&&!li.test(L[i])&&ind(L[i])<2&&brk(L[i],L[i+1]))break;
c.push(L[i++]);
}
o.push(list(c));
continue;
}
const p=[l];
i++;
while(i<L.length&&!blank(L[i])&&!brk(L[i],L[i+1]))p.push(L[i++]);
o.push(`<p>${p.map((x,j)=>inline(x.trim(),base)+(j<p.length-1&&/( {2,}|\\)$/.test(x)?'<br>':'')).join(' ')}</p>`);
}
return o.join('');
}

/* == Reader == */
const R=document.getElementById('reader');
if(R&&R.showModal){
const body=document.getElementById('readerBody'),pathEl=document.getElementById('readerPath'),gh=document.getElementById('readerGh'),cache={};
let cur='',depth=0;
const put=h=>{
body.innerHTML=h;
body.classList.remove('fade');
void body.offsetWidth;
body.classList.add('fade');
};
const hashDoc=()=>{
let h='';
try{h=decodeURIComponent(location.hash)}catch{}
const m=/^#read\/(.+)$/.exec(h);
return m?docPath(m[1],''):'';
};
async function show(p){
cur=p;
pathEl.textContent=p;
gh.href=REPO+p;
if(!R.open)R.showModal();
body.scrollTop=0;
body.innerHTML='<p class="lbl">Loading…</p>';
try{
if(!cache[p]){
const r=await fetch(p);
if(!r.ok)throw Error('HTTP '+r.status);
cache[p]=md(await r.text(),p);
}
if(cur==p)put(cache[p]);
}catch(e){
if(cur==p)put(`<p class="lbl">Could not load ${esc(p)} (${esc(e.message)})</p><p><a href="${REPO+esc(p)}" rel="noopener">Open on GitHub${XI}</a></p>`);
}
}
function open(p){
history.pushState(null,'','#read/'+p);
depth++;
show(p);
}
document.addEventListener('click',e=>{
const a=e.target.closest('a[data-doc]');
if(!a||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
e.preventDefault();
const p=docPath(a.dataset.doc,'');
if(p)open(p);
});
document.getElementById('readerClose').addEventListener('click',()=>R.close());
R.addEventListener('click',e=>{
if(e.target==R)R.close();
});
R.addEventListener('close',()=>{
const d=depth;
depth=0;
if(hashDoc()){
if(d)history.go(-d);
else history.replaceState(null,'',location.pathname+location.search);
}
});
addEventListener('popstate',()=>{
const p=hashDoc();
if(p)show(p);
else if(R.open){
depth=0;
R.close();
}
});
const p0=hashDoc();
if(p0)show(p0);
  }
  

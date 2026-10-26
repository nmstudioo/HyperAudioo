
'use strict';

/* == Constants == */
const FS=48000,FN=65536,L1MAX=1.25,TIMEOUT=12e3,PI=Math.PI,db=x=>20*Math.log10(Math.max(1e-30,x));

/* == Analysis == */
function fft(re,im){
const n=re.length;
for(let i=1,j=0;i<n;i++){
let b=n>>1;
for(;j&b;b>>=1)j^=b;
j^=b;
if(i<j){
[re[i],re[j]]=[re[j],re[i]];
[im[i],im[j]]=[im[j],im[i]];
}
}
for(let l=2;l<=n;l<<=1){
const an=-2*PI/l,wr=Math.cos(an),wi=Math.sin(an),h=l>>1;
for(let i=0;i<n;i+=l){
let cr=1,ci=0;
for(let k=0;k<h;k++){
const a=i+k,b=a+h,xr=re[b]*cr-im[b]*ci,xi=re[b]*ci+im[b]*cr;
re[b]=re[a]-xr;
im[b]=im[a]-xi;
re[a]+=xr;
im[a]+=xi;
const t=cr*wr-ci*wi;
ci=cr*wi+ci*wr;
cr=t;
}
}
}
}

function vdcIdentity(t){
const L=t.trim().split(/\r?\n/).map(l=>/^SR_(\d+):(.+)$/.exec(l.trim()));
if(!L.length||L.some(m=>!m))return 0;
const ok=L.every(m=>{
const a=m[2].split(',').map(Number);
return a.length%5==0&&a.every((v,i)=>v===(i%5?0:1));
});
return ok&&L.some(m=>m[1]=='48000')?L.length:0;
}

function eelInfo(t){
const cnt=r=>(t.match(r)||[]).length,def={},bad=[];
for(const l of t.split(/\r?\n/)){
const m=/^(\w+):(-?[\d.]+)<(-?[\d.]+),(-?[\d.]+),(-?[\d.]+)(?:\{[^}]*\})?>\s*\S/.exec(l);
if(m){
def[m[1]]=+m[2];
if(+m[2]<+m[3]||+m[2]>+m[4])bad.push(m[1]);
}
}
const names=Object.keys(def),init=/^@init\b([\s\S]*?)^@sample\b/m.exec(t),unset=init?names.filter(n=>!new RegExp('^\\s*'+n+'\\s*=','m').test(init[1])):names;
let ceil=def.ceiling10!=null?def.ceiling10/10:NaN;
if(isNaN(ceil)){
const m=/limMode\s*==\s*0\s*\?\s*\(\s*effCeil\s*=\s*(-?[\d.]+)/.exec(t);
if(m)ceil=+m[1];
}
const ok=cnt(/@init/g)==1&&cnt(/@sample/g)==1&&/^desc:/m.test(t)&&names.length>0&&!bad.length&&!unset.length;
return{ok,sliders:names.length,ceil,issues:[...bad.map(n=>n+' out of range'),...unset.map(n=>n+' not set in @init')]};
}

function analyse(buf,vdc,eel){
const v=new DataView(buf),tag=o=>String.fromCharCode(...new Uint8Array(buf,o,4));
if(buf.byteLength<44||tag(0)!='RIFF'||tag(8)!='WAVE'||tag(12)!='fmt '||tag(36)!='data')throw Error('IRS is not a canonical RIFF/WAVE file');
const n=v.getUint32(40,true)/8,sr=v.getUint32(24,true),c={};
c.fmt=v.getUint16(20,true)==3&&v.getUint16(22,true)==2&&v.getUint16(34,true)==32&&sr==FS&&buf.byteLength==44+n*8;
if(!c.fmt||n<256||n>FN)throw Error('IRS must be float32 stereo, 48 kHz, ≤ 65536 taps');
const x=new Float32Array(buf,44,n*2),h=new Float64Array(n);
let fin=true,lr=true,mx=0,pk=0,l1=0,tp=0,e=0,eh=0;
for(let i=0;i<n;i++){
const l=x[2*i],r=x[2*i+1],a=Math.abs(l);
if(!isFinite(l)||!isFinite(r))fin=false;
if(l!==r)lr=false;
h[i]=l;
if(a>mx){
mx=a;
pk=i;
}
l1+=a;
e+=l*l;
if(i<n/10)eh+=l*l;
if(i>=n-256)tp=Math.max(tp,a);
}
const re=new Float64Array(FN),im=new Float64Array(FN);
re.set(h);
fft(re,im);
const P=new Float64Array(FN/2+2);
let g=0;
for(let k=0;k<=FN/2;k++){
const p=re[k]*re[k]+im[k]*im[k];
P[k+1]=P[k]+p;
if(k>=Math.ceil(20*FN/FS)&&k<=Math.floor(2e4*FN/FS))g=Math.max(g,p);
}
const resp=f=>{
const k=f*FN/FS,k0=Math.max(1,Math.floor(k*2**(-1/12))),k1=Math.max(k0,Math.min(FN/2,Math.ceil(k*2**(1/12))));
return 10*Math.log10(Math.max(1e-60,(P[k1+1]-P[k0])/(k1-k0+1)));
};
const o={n,sr,peak:db(mx),pk,l1,tail:db(tp),maxGain:10*Math.log10(Math.max(1e-60,g)),front:e?eh/e:0,resp,vdc:vdcIdentity(vdc),eel:eelInfo(eel)};
Object.assign(c,{fin,lr,peak:o.peak<=0,gain:o.maxGain<0,l1:l1<=L1MAX,tail:o.tail<=-80,vdc:o.vdc>0,eel:o.eel.ok});
o.c=c;
o.pass=Object.values(c).every(Boolean);
return o;
}

/* == State == */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg',svg=(t,a,p)=>{
const e=document.createElementNS(NS,t);
for(const k in a)e.setAttribute(k,a[k]);
if(p)p.append(e);
return e;
};
const PROF={};
$$('.prow').forEach(b=>PROF[b.dataset.k]={...b.dataset,btn:b});
let cur='iem',cs=null,tt=0;
const cache={};

/* == Loading == */
const load=p=>cache[p.k]||(cache[p.k]=(async()=>{
const once=async(u,t)=>{
const c=new AbortController(),id=setTimeout(()=>c.abort(),TIMEOUT);
try{
const r=await fetch(u,{signal:c.signal});
if(!r.ok)throw Error(`${u} → HTTP ${r.status}`);
return await r[t]();
}catch(e){
throw e.name=='AbortError'?Error(`${u} → timed out`):e;
}finally{
clearTimeout(id);
}
},get=(u,t)=>once(u,t).catch(e=>/HTTP 4\d\d/.test(e.message)?Promise.reject(e):once(u,t));
const[i,v,e]=await Promise.all([get(p.irs,'arrayBuffer'),get(p.vdc,'text'),get(p.eel,'text')]);
return analyse(i,v,e);
})().catch(e=>{
delete cache[p.k];
return{err:e.message+(navigator.onLine?'':' (offline)'),pass:false};
}));

/* == Helpers == */
const spark=(p,a)=>{
const r=a.resp(1000),d=Array.from({length:48},(_,i)=>{
const v=Math.max(-12,Math.min(12,a.resp(20*1000**(i/47))-r));
return(i?'L':'M')+(i*120/47).toFixed(1)+' '+(16-v*14/12).toFixed(1);
}).join('');
$('.spark path',p.btn).setAttribute('d',d);
};

const ico=(id,c)=>{
const s=svg('svg',{class:'i '+(c||'xs'),'aria-hidden':'true',focusable:'false'});
svg('use',{href:'#i-'+id},s);
return s;
};
const mob=()=>matchMedia('(max-width:899px)').matches,calm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const NUM=/-?\d+(?:\.\d+)?/;
function count(el,txt){
cancelAnimationFrame(el._r);
const m=NUM.exec(txt),to=m?parseFloat(m[0]):NaN,from=parseFloat(el.dataset.v);
el.dataset.v=isNaN(to)?'':to;
if(isNaN(to)||mob()||calm()){
el.textContent=txt;
return;
}
const dec=(m[0].split('.')[1]||'').length,a=isNaN(from)?0:from,t0=performance.now();
const tick=t=>{
const k=Math.min(1,(t-t0)/400),v=a+(to-a)*(1-Math.pow(1-k,3));
el.textContent=k<1?txt.replace(NUM,v.toFixed(dec)):txt;
if(k<1)el._r=requestAnimationFrame(tick);
};
el._r=requestAnimationFrame(tick);
}
const dot=(p,a)=>{
p.btn.dataset.qa=a.err?'warn':a.pass?'ok':'bad';
$('.pdot .sr',p.btn).textContent='QA '+(a.err?'unavailable':a.pass?'pass':'fail');
};
const sweep=b=>{
b.classList.remove('sweep');
void b.offsetWidth;
b.classList.add('sweep');
};

function toast(msg,err){
const t=$('#toast');
t.replaceChildren(ico(err?'alert':'check'),msg);
t.className='toast'+(err?' err':'');
void t.offsetWidth;
t.classList.add('show');
clearTimeout(tt);
tt=setTimeout(()=>t.classList.remove('show'),3000);
}

const copyText=s=>{
const fb=()=>{
const t=document.createElement('textarea');
t.value=s;
t.style.cssText='position:fixed;opacity:0';
document.body.append(t);
t.select();
let ok=false;
try{ok=document.execCommand('copy')}catch{}
t.remove();
return ok;
};
return navigator.clipboard&&isSecureContext?navigator.clipboard.writeText(s).then(()=>true,fb):Promise.resolve(fb());
};

function dlAll(){
load(PROF[cur]).then(a=>{
if(!a.pass)return toast('QA failed — download blocked',1);
['irs','eel','vdc'].forEach((k,i)=>setTimeout(()=>$('#dl-'+k).click(),i*350));
toast('Downloading 3 files');
});
}

/* == Chart == */
function ghost(){
const l=$('#line');
if(!l.getAttribute('d'))return;
const gh=svg('g',{class:'gh','aria-hidden':'true'},$('#chartSvg'));
[$('#grid'),$('#area'),l].forEach(n=>{
const c=n.cloneNode(true);
c.removeAttribute('id');
if(n==l)c.setAttribute('class','old-l');
gh.append(c);
});
setTimeout(()=>gh.remove(),400);
}

function drawChart(a,anim){
const host=$('#chart'),W=host.clientWidth-16,g=$('#grid');
if(W<100)return;
if(anim)ghost();
g.replaceChildren();
if(!a||a.err){
cs=null;
$('#line').setAttribute('d','');
$('#area').setAttribute('d','');
$('#chartSum').textContent=a?'Response unavailable: '+a.err:'';
return;
}
const H=Math.round(Math.max(220,Math.min(400,W*.42))),m={l:36,r:10,t:12,b:34};
const data=Array.from({length:240},(_,i)=>{
const f=20*1000**(i/239);
return[f,a.resp(f)];
});
cs={data,W,m};
const ys=data.map(d=>d[1]),lo=Math.min(...ys),hi=Math.max(...ys),pad=Math.max(1.5,(hi-lo)*.1),y0=Math.floor(lo-pad),y1=Math.ceil(hi+pad),sp=y1-y0,st=sp>30?10:sp>12?5:2;
const X=v=>m.l+Math.log10(v/20)/3*(W-m.l-m.r),Y=v=>m.t+(y1-v)/(y1-y0)*(H-m.t-m.b);
$('#chartSvg').setAttribute('viewBox',`0 0 ${W} ${H}`);
const txt=(x,y,t,an)=>{
svg('text',{x,y,'text-anchor':an,class:'ax'},g).textContent=t;
};
for(let v=Math.ceil(y0/st)*st;v<=y1;v+=st){
const y=Y(v);
svg('line',{x1:m.l,x2:W-m.r,y1:y,y2:y,class:v?'gl':'gl z'},g);
txt(m.l-6,y+4,v,'end');
}
[20,50,100,200,500,1e3,2e3,5e3,1e4,2e4].forEach(v=>{
const x=X(v);
svg('line',{x1:x,x2:x,y1:m.t,y2:H-m.b,class:'gl'},g);
txt(x,H-16,v>=1e3?v/1e3+'k':v,'middle');
});
const d=data.map((q,i)=>(i?'L':'M')+X(q[0]).toFixed(1)+' '+Y(q[1]).toFixed(1)).join('');
$('#line').setAttribute('d',d);
$('#area').setAttribute('d',`${d}L${X(2e4)} ${Y(y0)}L${X(20)} ${Y(y0)}Z`);
const c=$('#cur');
c.setAttribute('y1',m.t);
c.setAttribute('y2',H-m.b);
c.style.display='none';
$('#tip').hidden=true;
const mx=data.reduce((p,q)=>q[1]>p[1]?q:p),mn=data.reduce((p,q)=>q[1]<p[1]?q:p);
$('#chartSum').textContent=`${PROF[cur].name}: peak ${mx[1].toFixed(1)} dB near ${Math.round(mx[0])} Hz, dip ${mn[1].toFixed(1)} dB near ${Math.round(mn[0])} Hz.`;
if(anim){
host.classList.remove('draw');
void host.offsetWidth;
host.classList.add('draw');
}
}

function tip(f){
if(!cs)return;
const{data,W,m}=cs,host=$('#chart'),t=$('#tip'),x=m.l+Math.log10(f/20)/3*(W-m.l-m.r),i=Math.max(0,Math.min(239,Math.round(Math.log10(f/20)/3*239)));
$('#tip-f').textContent=Math.round(f)+' Hz';
$('#tip-g').textContent=data[i][1].toFixed(1)+' dB';
t.hidden=false;
t.style.left=Math.max(4,Math.min(host.clientWidth-t.offsetWidth-4,x+8-t.offsetWidth/2))+'px';
const c=$('#cur');
c.setAttribute('x1',x);
c.setAttribute('x2',x);
c.style.display='';
host._f=f;
}

const hideTip=()=>{
$('#tip').hidden=true;
$('#cur').style.display='none';
};

/* == Render == */
function show(a){
const ok=!a.err&&a.pass,cls=ok?'ok':'bad',set=(id,v,s)=>{
count($('#st-'+id),v);
$('#st-'+id+'-s').textContent=s||'';
};
if(a.err){
['irs','gain','peak','l1','lim'].forEach(k=>set(k,'—'));
$('#st-irs-s').textContent=a.err;
}else{
set('irs',`${a.n} taps`,'float32 stereo · 48 kHz');
set('gain',a.maxGain.toFixed(2)+' dB','max, 20 Hz–20 kHz');
set('peak',a.peak.toFixed(2)+' dBFS','at tap '+a.pk);
set('l1',a.l1.toFixed(4),'gate ≤ '+L1MAX);
set('lim',isNaN(a.eel.ceil)?'—':a.eel.ceil.toFixed(1)+' dBFS','EEL default');
}
[$('#qaChip'),$('#qaBadge')].forEach(e=>{
e.replaceChildren(ico(a.err?'alert':ok?'check':'close'),a.err?'QA · ERROR':ok?'QA · PASS':'QA · FAIL');
e.className='chip '+cls;
});
const s=$('#qaSeal');
s.replaceChildren(ico(a.err?'alert':ok?'check':'close'),a.err?'Audit unavailable':ok?'Verified · hosted files':'Verification failed');
s.className='st '+cls;
const D=a.err?{}:{fmt:`${a.n} taps · ${a.sr/1000} kHz`,peak:a.peak.toFixed(2)+' dBFS',gain:a.maxGain.toFixed(2)+' dB',l1:a.l1.toFixed(4),tail:`last 256 taps ${a.tail.toFixed(1)} dBFS`,vdc:`${a.vdc} sections`,eel:a.eel.ok?`${a.eel.sliders} sliders`:a.eel.issues.join(', ')||'structure invalid'};
const rows=$$('.crow');
rows.forEach(r=>r.className='crow');
void rows[0].offsetWidth;
rows.forEach((r,i)=>{
const k=r.dataset.c,g=!a.err&&a.c[k];
r.className='crow'+(a.err?'':g?' ok':' bad');
r.style.setProperty('--d',i*35+'ms');
$('small',r).textContent=D[k]?'— '+D[k]:'';
$('b',r).replaceChildren(...(a.err?['—']:[ico(g?'check':'close'),g?'Pass':'Fail']));
});
const fb=$('#fab');
fb.setAttribute('aria-disabled',!ok);
if(ok&&!a.pl){
a.pl=1;
fb.classList.remove('pulse');
void fb.offsetWidth;
fb.classList.add('pulse');
}
drawChart(a,1);
}

function render(){
const p=PROF[cur];
for(const k in PROF)PROF[k].btn.setAttribute('aria-pressed',k==cur);
['irs','eel','vdc'].forEach(k=>{
const a=$('#dl-'+k);
a.href=p[k];
$('small',a).textContent=p[k].split('/').pop();
});
$('#st-dev').textContent=p.name;
$$('.crow').forEach(r=>{
r.className='crow';
$('b',r).textContent='…';
});
load(p).then(a=>{
if(cur==p.k)show(a);
});
}

/* == Verification Harness == */
const con=$('#console'),log=(t,ok)=>{
const d=document.createElement('div');
d.textContent=t;
if(ok!=null)d.className=ok?'ok':'bad';
con.append(d);
con.scrollTop=con.scrollHeight;
};

async function runAB(){
const btn=$('#btnAB');
if(btn.getAttribute('aria-busy'))return;
btn.setAttribute('aria-busy','true');
con.replaceChildren();
const R=[],res=(n,d,ok)=>{
R.push(ok);
log(`${ok?'✓':'✗'} ${n}: ${d}`,ok);
};
log('Running offline checks on hosted files…');
for(const k in PROF){
const p=PROF[k],a=await load(p);
if(a.err){
res(p.name,a.err,false);
continue;
}
res(p.name+' · IRS format',`${a.n} taps · ${a.sr/1000} kHz`+(a.c.fin&&a.c.lr?' · finite · L=R':' · finite/L=R failed'),a.c.fmt&&a.c.fin&&a.c.lr);
res(p.name+' · IRS gates',`peak ${a.peak.toFixed(2)} dBFS · max gain ${a.maxGain.toFixed(2)} dB · L1 ${a.l1.toFixed(4)} · tail ${a.tail.toFixed(1)} dBFS`,a.c.peak&&a.c.gain&&a.c.l1&&a.c.tail);
res(p.name+' · minimum phase',`${(a.front*100).toFixed(4)}% of energy in first 10% of taps`,a.front>=.99);
res(p.name+' · identity DDC',`${a.vdc} sections`,a.c.vdc);
res(p.name+' · EEL static parse',a.eel.ok?`${a.eel.sliders} sliders valid · one @init · one @sample · ceiling ${a.eel.ceil} dBFS`:a.eel.issues.join(', ')||'structure invalid',a.c.eel);
await new Promise(r=>setTimeout(r,20));
}
const all=R.every(Boolean);
log(all?'ALL CHECKS PASSED':'SOME CHECKS FAILED',all);
log('Scope: offline file checks only (static regex slider parse, not the app). No app, ARM, native convolver or listening evidence.');
btn.removeAttribute('aria-busy');
toast(all?'All checks pass':'Some checks failed',!all);
}

/* == Init == */
const idle=window.requestIdleCallback||(f=>setTimeout(f,200));
Object.values(PROF).forEach(p=>{
const go=()=>load(p).then(a=>{
dot(p,a);
if(!a.err)spark(p,a);
});
p.k==cur?go():idle(go);
});
$('#profiles').addEventListener('click',e=>{
const b=e.target.closest('.prow');
if(b&&(b.dataset.k!=cur||!cache[cur])){
cur=b.dataset.k;
render();
sweep(b);
}
});
$$('[data-all]').forEach(b=>b.addEventListener('click',()=>b.getAttribute('aria-disabled')=='true'?toast('Download blocked: QA not passed',1):dlAll()));
$('#btnGeq').onclick=()=>load(PROF[cur]).then(a=>a.err?toast('Copy failed',1):copyText('GraphicEQ: '+Array.from({length:127},(_,i)=>{
const f=20*1000**(i/126);
return f.toFixed(1)+' '+a.resp(f).toFixed(1);
}).join('; ')).then(ok=>toast(ok?'Copied · GraphicEQ':'Copy failed',!ok)));
$('#btnAB').onclick=runAB;
$('#themeBtn').onclick=()=>{
const t=document.documentElement.dataset.theme=='dark'?'light':'dark';
document.documentElement.dataset.theme=t;
try{localStorage.theme=t}catch{}
};
matchMedia('(prefers-color-scheme:light)').addEventListener('change',e=>{
let s;
try{s=localStorage.theme}catch{}
if(!s)document.documentElement.dataset.theme=e.matches?'light':'dark';
});
const ch=$('#chart');
let pm=0;
ch.addEventListener('pointermove',e=>{
if(!cs||pm)return;
const cx=e.clientX;
pm=requestAnimationFrame(()=>{
pm=0;
if(!cs)return;
const r=$('#chartSvg').getBoundingClientRect(),x=(cx-r.left)*cs.W/r.width;
tip(20*1000**Math.max(0,Math.min(1,(x-cs.m.l)/(cs.W-cs.m.l-cs.m.r))));
});
});
ch.addEventListener('pointerleave',hideTip);
ch.addEventListener('blur',hideTip);
ch.addEventListener('keydown',e=>{
if(e.key=='Escape')return hideTip();
if(e.key!='ArrowLeft'&&e.key!='ArrowRight')return;
e.preventDefault();
tip(Math.min(2e4,Math.max(20,(ch._f||1e3)*2**(e.key=='ArrowLeft'?-.15:.15))));
});
let rz=0,rw=0;
new ResizeObserver(([e])=>{
const w=Math.round(e.contentRect.width);
if(w==rw)return;
rw=w;
cancelAnimationFrame(rz);
rz=requestAnimationFrame(()=>load(PROF[cur]).then(a=>{
if(a.err||a.n)drawChart(a);
}));
}).observe(ch);

/* == Motion == */
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('hid',document.hidden));
$('#profiles').addEventListener('animationend',e=>{
if(e.animationName=='sweep')e.target.classList.remove('sweep');
});
$('#fab').addEventListener('animationend',e=>{
if(e.animationName=='pulse')e.target.classList.remove('pulse');
});
const up=$('#toTop');
up.onclick=()=>scrollTo({top:0});
if(window.IntersectionObserver){
new IntersectionObserver(([e])=>up.classList.toggle('show',!e.isIntersecting)).observe($('.hero'));
if(!calm()){
const io=new IntersectionObserver(es=>es.forEach(e=>{
if(e.isIntersecting||e.boundingClientRect.top<0){
e.target.classList.add('in');
io.unobserve(e.target);
}
}),{rootMargin:'0px 0px -6% 0px'});
$$('.sec,.foot').forEach(s=>{
if(s.getBoundingClientRect().top<innerHeight)return;
s.classList.add('rv');
io.observe(s);
});
document.documentElement.classList.add('rv-on');
}
}

/* == Start == */
render();
  

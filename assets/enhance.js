/* HyperAudio enhancements. Independent of script.js: progressive, defensive, no hash changes. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const secs=$$('main .sec'),links=$$('.nav a[href^="#"]');
const bar=document.createElement('div');bar.id='sweep';bar.setAttribute('aria-hidden','true');
const rd=document.createElement('div');rd.id='read';rd.setAttribute('aria-hidden','true');rd.title='J / K: next or previous section. T: theme.';
rd.innerHTML='<span>§<b id="rdN">00</b></span><b id="rdF">20 Hz</b>';
document.body.append(bar,rd);
const rdN=$('#rdN',rd),rdF=$('#rdF',rd);
const fmt=f=>f<1000?Math.round(f)+' Hz':(f<10000?(f/1000).toFixed(2):(f/1000).toFixed(1))+' kHz';
let cur=0,tick=false;
const update=()=>{tick=false;
 const h=document.documentElement,max=h.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
 bar.style.setProperty('--p',p.toFixed(4));
 rdF.textContent=fmt(20*Math.pow(1000,p));};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(update)}},{passive:true});
addEventListener('resize',update,{passive:true});update();
// Scrollspy: the section crossing the upper third of the viewport is current
const setCur=s=>{if(!s)return;cur=secs.indexOf(s);
 const n=$('.sec-h .lbl',s);rdN.textContent=n?n.textContent.trim():String(cur+1).padStart(2,'0');
 links.forEach(a=>{if(a.getAttribute('href')==='#'+s.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
 const on=$('.nav a[aria-current="true"]');if(on&&on.scrollIntoView&&innerWidth<900)on.scrollIntoView({inline:'center',block:'nearest'});};
if('IntersectionObserver' in window&&secs.length){
 const vis=new Set(),io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target));
  const pick=secs.filter(s=>vis.has(s)).pop();if(pick)setCur(pick);},{rootMargin:'-30% 0px -60% 0px'});
 secs.forEach(s=>io.observe(s));}
// Keyboard: j / k move between sections, t toggles theme. Ignored while typing or when a dialog is open.
addEventListener('keydown',e=>{
 if(e.metaKey||e.ctrlKey||e.altKey||e.defaultPrevented)return;
 const t=e.target,typing=t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
 if(typing||$('dialog[open]'))return;
 const k=e.key.toLowerCase();
 if(k==='j'||k==='k'){const i=Math.min(secs.length-1,Math.max(0,cur+(k==='j'?1:-1)));
  secs[i]&&secs[i].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});e.preventDefault();}
 else if(k==='t'){const b=$('#themeBtn');b&&b.click();}
});
// Warm the cache for docs so the reader opens instantly
const warmed=new Set(),warm=a=>{const p=a.dataset.doc;if(!p||warmed.has(p))return;warmed.add(p);
 const l=document.createElement('link');l.rel='prefetch';l.href=p;document.head.append(l);};
$$('[data-doc]').forEach(a=>{a.addEventListener('pointerenter',()=>warm(a),{once:true});a.addEventListener('focus',()=>warm(a),{once:true});});
})();

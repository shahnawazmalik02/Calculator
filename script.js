const keys=[['AC','fn'],['DEL','fn'],['%','fn'],['÷','op'],['7'],['8'],['9'],['×','op'],['4'],['5'],['6'],['−','op'],['1'],['2'],['3'],['+','op'],['+/-','fn'],['0'],['.'],['=','equals']];
const grid=document.getElementById('grid'),res=document.getElementById('result'),expr=document.getElementById('expr'),hist=document.getElementById('hist');
let cur='0',prev=null,op=null,fresh=false;
const play=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
setTimeout(()=>document.querySelector('.splash')?.remove(),2700);
addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')});
keys.forEach(([k,c],i)=>{const b=document.createElement('button');b.className='btn '+(c||'');b.textContent=k;b.style.setProperty('--i',i);
  b.addEventListener('click',e=>{ripple(b,e);press(k)});grid.appendChild(b)});
function ripple(b,e){const r=b.getBoundingClientRect(),d=document.createElement('span');d.className='ripple';
  d.style.left=(e.clientX?e.clientX-r.left:r.width/2)+'px';d.style.top=(e.clientY?e.clientY-r.top:r.height/2)+'px';
  b.appendChild(d);setTimeout(()=>d.remove(),600)}
function show(){res.textContent=cur;play(res,'pop')}
function count(target){const s=parseFloat(res.textContent)||0,t0=performance.now();
  (function f(n){const p=Math.min((n-t0)/450,1),v=s+(target-s)*(1-Math.pow(1-p,3));
    res.textContent=p<1?(Number.isInteger(target)?Math.round(v):v.toFixed(2)):target;
    if(p<1)requestAnimationFrame(f)})(t0)}
function calc(){const a=parseFloat(prev),b=parseFloat(cur);
  return op==='+'?a+b:op==='−'?a-b:op==='×'?a*b:a/b}
function press(k){
  if(/^[0-9]$/.test(k)){cur=(cur==='0'||fresh)?k:cur+k;fresh=false;show()}
  else if(k==='.'){if(fresh){cur='0';fresh=false}if(!cur.includes('.'))cur+='.';show()}
  else if(k==='AC'){cur='0';prev=null;op=null;expr.textContent='Ready to calculate';show()}
  else if(k==='DEL'){cur=cur.length>1?cur.slice(0,-1):'0';show()}
  else if(k==='+/-'){cur=String(-parseFloat(cur));show()}
  else if(k==='%'){cur=String(parseFloat(cur)/100);show()}
  else if(k==='='){if(op===null||prev===null)return;
    const a=prev,o=op,b=cur,v=calc();
    if(!isFinite(v)){res.textContent='Error';play(res,'shake');expr.textContent=a+o+b+' =';cur='0';prev=null;op=null;return}
    const out=Math.round(v*1e10)/1e10;addHist(a+o+b+' =',out);expr.textContent=a+o+b+' =';
    cur=String(out);prev=null;op=null;fresh=true;count(out)}
  else{if(prev!==null&&op&&!fresh)cur=String(calc());prev=cur;op=k;fresh=true;expr.textContent=prev+' '+op}
}
function addHist(e,r){const empty=hist.querySelector('.empty');if(empty)empty.remove();
  const d=document.createElement('div');d.className='item new';d.innerHTML='<small></small><b></b>';
  d.children[0].textContent=e;d.children[1].textContent=r;hist.prepend(d)}
document.getElementById('clr').onclick=()=>{hist.innerHTML='<div class="empty">No calculations yet</div>'};
document.addEventListener('keydown',e=>{const m={'*':'×','/':'÷','-':'−','Enter':'=','Backspace':'DEL','Escape':'AC'};
  const k=m[e.key]||e.key;const b=[...grid.children].find(x=>x.textContent===k);if(b){e.preventDefault();b.click()}});
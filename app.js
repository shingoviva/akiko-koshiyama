// Interruptible transitions: state updates immediately; motion never blocks taps.
const uiMotion=matchMedia('(prefers-reduced-motion: reduce)');
const uiAnimations=new WeakMap();
function animateUI(element,frames,options={}){if(!element||uiMotion.matches||typeof element.animate!=='function')return null;uiAnimations.get(element)?.cancel();const animation=element.animate(frames,{duration:320,easing:'cubic-bezier(.22,.7,.25,1)',...options});uiAnimations.set(element,animation);return animation}
function revealCollection(){gallery.querySelectorAll('.work').forEach((el,i)=>animateUI(el,[{opacity:.2,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:380,delay:Math.min(i,5)*35}))}
const icon=name=>`<img class="icon icon-${name}" src="assets/icons/${name}.svg" alt="" aria-hidden="true" width="24" height="24">`;
const works=[
{category:'inner',img:'p3-1.jpg',ja:'あなたは光',en:'You are light',label:'LIGHT',textJa:'内側から輝く光。暗闇を照らす光。\nあなたの内にある輝きを、自由に表現してほしい。\nその光に、救われる人がいる。',textEn:'A light shining from within. A light illuminating the dark.\nExpress the radiance you carry, freely.\nSomeone, somewhere, will find solace in your light.'},
{category:'nature',img:'p4-1.jpg',ja:'内なる花',en:'The flower within',label:'BLOOM',textJa:'あなたの中には、美しい花がある。\n自分を愛し、誰かを思いやるとき、その花はひらく。\n無限の美しさを、無限の愛を、咲かせて。',textEn:'There is a beautiful flower within you.\nIt opens when you love yourself and care for others.\nLet your boundless beauty, your boundless love, bloom.'},
{category:'inner',img:'p4-0.jpg',ja:'心の声',en:'The voice within',label:'INNER VOICE',textJa:'愛は、あなたの内側から生まれる。\n心の奥にある、本当の願いに耳を澄ませる。\nあなたの声が、進むべき道を照らしてくれる。',textEn:'Love begins within.\nListen for the life you long for, deep in your heart.\nYour own voice can illuminate the way.'},
{category:'body',img:'p6-2.jpg',ja:'土へ、光へ',en:'To earth, to light',label:'MATERIAL STUDY',textJa:'肌と素材が出会い、ひとつの風景になる。\n静けさの中に、生命の気配が残る。',textEn:'Skin and material meet, becoming a landscape.\nIn stillness, a trace of life remains.'},
{category:'nature',img:'p6-1.jpg',ja:'生命の色',en:'The colours of life',label:'COLOUR',textJa:'色が重なり、身体の輪郭を越えてゆく。\n内なる感情を、花ひらく風景として。',textEn:'Colours gather and extend beyond the body.\nAn inner emotion unfolds as a flowering landscape.'},
{category:'body',img:'p6-0.jpg',ja:'月に手を伸ばす',en:'Reaching for the moon',label:'MOVEMENT',textJa:'一瞬の動きの中で、光と生命が響き合う。\n身体が描く、見えない宇宙の軌跡。',textEn:'Light and life resonate in a fleeting movement.\nThe body traces an invisible universe.'}
];
let english=false,current=0;const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#viewer');
const PAGE_SIZE=6;let activeFilter='all',visibleLimit=PAGE_SIZE;
const filteredIndices=()=>works.map((w,i)=>i).filter(i=>activeFilter==='all'||works[i].category===activeFilter);
function renderCollection(){
 const matches=filteredIndices();gallery.replaceChildren();
 matches.slice(0,visibleLimit).forEach((i,pos)=>{const w=works[i],b=document.createElement('button');b.className='work';b.style.setProperty('--order',pos);b.innerHTML=`<div class="work-image"><img src="assets/${w.img}" loading="lazy" decoding="async" width="900" height="1200" alt="${english?w.en:w.ja}"><span class="work-plus" aria-hidden="true">${icon('plus')}</span></div><div class="work-caption"><h3>${english?w.en:w.ja}</h3><span>${String(i+1).padStart(2,'0')} / ${w.label}</span></div>`;b.addEventListener('click',()=>{current=i;renderWork();dialog.showModal();document.body.style.overflow='hidden';animateUI(dialog,[{opacity:0,translate:'0 14px',scale:'.985'},{opacity:1,translate:'0 0',scale:'1'}])});gallery.append(b)});
 document.querySelector('#collection-count').textContent=english?`${Math.min(visibleLimit,matches.length)} of ${matches.length} works`:`${matches.length}作品中 ${Math.min(visibleLimit,matches.length)}作品`;
 document.querySelector('#more-works').hidden=visibleLimit>=matches.length;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===activeFilter)));
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;visibleLimit=PAGE_SIZE;renderCollection();revealCollection()}));
document.querySelector('#more-works').onclick=()=>{visibleLimit+=PAGE_SIZE;renderCollection();revealCollection()};
function stepWork(direction){const matches=filteredIndices(),pos=matches.indexOf(current);current=matches[(pos+direction+matches.length)%matches.length];renderWork();animateUI(document.querySelector('.viewer-image'),[{opacity:.15,translate:`${direction*18}px 0`},{opacity:1,translate:'0 0'}]);animateUI(document.querySelector('.viewer-copy'),[{opacity:.25},{opacity:1}])}
renderCollection();
function renderWork(){const w=works[current];document.querySelector('#view-img').src='assets/'+w.img;document.querySelector('#view-img').alt=english?w.en:w.ja;document.querySelector('#view-title').textContent=english?w.en:w.ja;document.querySelector('#view-text').textContent=(english?w.textEn:w.textJa)+'\n\n'+(english?'Editorial title and text adapted for this site.':'作品名・文章はサイト用に再構成しています。');document.querySelector('#view-number').textContent=w.label;document.querySelector('#view-count').textContent=`${String(filteredIndices().indexOf(current)+1).padStart(2,'0')} / ${String(filteredIndices().length).padStart(2,'0')}`}
document.querySelector('#lang').onclick=()=>{english=!english;document.documentElement.lang=english?'en':'ja';document.querySelectorAll('[data-ja]').forEach(e=>e.innerHTML=e.dataset[english?'en':'ja']);document.querySelector('#lang').innerHTML=english?'EN <span>/ JP</span>':'JP <span>/ EN</span>';document.querySelector('#lang').ariaLabel=english?'日本語に切り替え':'Switch to English';renderWork();renderCollection();updateMotionLabel();animateUI(document.querySelector('main'),[{opacity:.55},{opacity:1}],{duration:280})};
let viewerClosing=false;function closeViewer(){if(viewerClosing||!dialog.open)return;viewerClosing=true;const animation=animateUI(dialog,[{opacity:1,translate:'0 0'},{opacity:0,translate:'0 10px'}],{duration:180});const finish=()=>{dialog.close();document.body.style.overflow='';viewerClosing=false};if(animation)animation.finished.then(finish,finish);else finish()}dialog.addEventListener('cancel',e=>{e.preventDefault();closeViewer()});document.querySelector('#close').onclick=closeViewer;dialog.addEventListener('close',()=>document.body.style.overflow='');dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeViewer()}});document.querySelector('#prev').onclick=()=>{stepWork(-1)};document.querySelector('#next').onclick=()=>{stepWork(1)};document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowRight')document.querySelector('#next').click();if(e.key==='ArrowLeft')document.querySelector('#prev').click()});
const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.07}):null;document.querySelectorAll('.reveal').forEach(e=>observer?observer.observe(e):e.classList.add('visible'));
const canvas=document.querySelector('#cosmos'),ctx=canvas.getContext('2d');
const coarsePointer=matchMedia('(pointer:coarse)').matches;
let W,H,dpr,t=0,px=0,py=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pulse=null,touchLight=null,lastFrame=null,lineTime=-Infinity,lineDirty=true,backgroundOffset=0;
const lineLayer=document.createElement('canvas'),lineCtx=lineLayer.getContext('2d');
const glowLayer=document.createElement('canvas'),glowCtx=glowLayer.getContext('2d');
const pointSprite=document.createElement('canvas');pointSprite.width=72;pointSprite.height=24;
const spriteCtx=pointSprite.getContext('2d');spriteCtx.translate(36,12);spriteCtx.scale(3,1);
const pointGlow=spriteCtx.createRadialGradient(0,0,0,0,0,12);
pointGlow.addColorStop(0,'rgba(235,212,164,.34)');pointGlow.addColorStop(.12,'rgba(215,186,125,.17)');pointGlow.addColorStop(.45,'rgba(202,170,105,.045)');pointGlow.addColorStop(1,'rgba(202,170,105,0)');spriteCtx.fillStyle=pointGlow;spriteCtx.fillRect(-12,-12,24,24);
const stars=Array.from({length:coarsePointer?85:140},()=>({x:(Math.random()-.5)*1600,y:(Math.random()-.5)*1600,z:(Math.random()-.5)*1600,s:Math.random()*1.5+.25}));
function size(){
 const nextWidth=innerWidth,nextDpr=Math.min(devicePixelRatio,coarsePointer?1.25:1.6);
 // iOS browser chrome changes height during scroll. Keep the drawing surface stable.
 if(coarsePointer&&W===nextWidth&&dpr===nextDpr)return;
 W=nextWidth;H=coarsePointer?Math.max(innerHeight,screen.height):innerHeight;dpr=nextDpr;
 for(const layer of [canvas,lineLayer,glowLayer]){layer.width=Math.round(W*dpr);layer.height=Math.round(H*dpr)}
 canvas.style.width=W+'px';canvas.style.height=H+'px';
 ctx.setTransform(dpr,0,0,dpr,0,0);lineCtx.setTransform(dpr,0,0,dpr,0,0);glowCtx.setTransform(dpr,0,0,dpr,0,0);
 const glow=glowCtx.createRadialGradient(W*.7,H*.4,0,W*.7,H*.4,W*.75);glow.addColorStop(0,'rgba(94,104,75,.105)');glow.addColorStop(1,'rgba(17,20,18,0)');glowCtx.fillStyle=glow;glowCtx.fillRect(0,0,W,H);lineDirty=true;
}
let resizeFrame=0;addEventListener('resize',()=>{if(!resizeFrame)resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;size()})},{passive:true});size();

// Line convection runs at exactly 105% of the previous timeline.
const LINE_SPEED=1.05*1.05;
function projectLinePoint(x,y,z,phase){
 const yaw=Math.sin(phase*.43)*.16,pitch=Math.cos(phase*.37)*.12;
 const dx=x-W*.5,dy=y-H*.5,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const xx=dx*cy+z*sy,zz=-dx*sy+z*cy,yy=dy*cp-zz*sp,depth=dy*sp+zz*cp;
 const perspective=Math.max(W,H)*1.8,scale=perspective/(perspective+depth);
 return {x:W*.5+xx*scale,y:H*.5+yy*scale,scale};
}
function orbitPoint(i,theta,clock){
 const unit=Math.max(W,H),phase=clock*.000004;
 const cx=W*(.46+i*.035)+px*(9+i*2),cy=H*(.48+Math.sin(i*1.7+clock*.000003)*.12)+py*10;
 const rx=unit*(.31+i*.065),ry=unit*(.12+i*.027),angle=-.7+i*.31+Math.sin(phase)*.07;
 const x=rx*Math.cos(theta),y=ry*Math.sin(theta),z=Math.sin(theta+phase+i)*unit*.09+Math.sin(phase*.65+i)*unit*.045;
 return projectLinePoint(cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle),z,phase+i*.4);
}
function drawOrbits(ctx,withPoints=false){
 const clock=t*LINE_SPEED;
 ctx.save();
 for(let i=0;i<3;i++){
  if(!withPoints){
   const ink=ctx.createLinearGradient(0,0,W,H);ink.addColorStop(0,'rgba(182,156,109,0)');ink.addColorStop(.32,'rgba(196,169,114,.19)');ink.addColorStop(.65,'rgba(196,169,114,.065)');ink.addColorStop(1,'rgba(182,156,109,0)');ctx.strokeStyle=ink;ctx.lineWidth=.65;
   ctx.beginPath();for(let k=0;k<=100;k++){const p=orbitPoint(i,.2+k/100*(Math.PI*1.85-.2),clock);if(k===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}ctx.stroke();
  }else{
   const theta=clock*.000075+i*1.9,p=orbitPoint(i,theta,clock),next=orbitPoint(i,theta+.005,clock);
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(next.y-p.y,next.x-p.x));ctx.scale(p.scale,p.scale);ctx.drawImage(pointSprite,-18,-6,36,12);ctx.restore();
  }
 }
 ctx.restore();
}

// Bounded harmonic spacing preserves order while giving each current individuality.
function riverOffset(strand,flow,u,drift,baseGap){
 const group=1+(flow-1)*.14;
 const breath=1+.075*Math.sin(Math.PI*u+flow*Math.PI/3+drift*.15);
 const balance=.10*Math.cos(Math.PI*u*.5+flow*Math.PI/3+drift*.12);
 return strand*baseGap*group*breath*(1-strand*balance);
}
// Triple strands move together through a shallow 3D current, retaining their rhythm.
function drawRivers(ctx){
 const drift=t*LINE_SPEED*.000006,unit=Math.max(W,H);
 ctx.save();ctx.lineWidth=.75;ctx.lineCap='round';
 for(let flow=0;flow<3;flow++){
  const points=[],gap=W<700?6:9;
  for(let k=0;k<=100;k++){
   const u=k/100,x=-W*.18+u*W*1.36;
   const y=H*(.22+flow*.29)+Math.sin(u*Math.PI*1.65+flow*1.8+drift)*H*.16+Math.sin(u*Math.PI*3.1-flow+drift*.57)*H*.045+Math.sin(drift*.43+flow)*H*.045;
   const z=Math.sin(u*Math.PI*2+flow*1.5+drift*.72)*unit*.10+Math.sin(drift*.4+flow)*unit*.045;
   points.push({x,y,z});
  }
  const ink=ctx.createLinearGradient(-W*.1,0,W*1.1,H);ink.addColorStop(0,'rgba(181,148,82,0)');ink.addColorStop(.22,'rgba(193,161,99,.18)');ink.addColorStop(.55,'rgba(211,184,124,.26)');ink.addColorStop(.82,'rgba(184,151,87,.12)');ink.addColorStop(1,'rgba(181,148,82,0)');ctx.strokeStyle=ink;
  for(let strand=-1;strand<=1;strand++){
   ctx.beginPath();points.forEach((p,k)=>{const before=points[Math.max(0,k-1)],after=points[Math.min(100,k+1)],dx=after.x-before.x,dy=after.y-before.y,len=Math.hypot(dx,dy)||1;
    const offset=riverOffset(strand,flow,k/100,drift,gap);
    const projected=projectLinePoint(p.x-dy/len*offset,p.y+dx/len*offset,p.z,drift+flow*.4);
    if(k===0)ctx.moveTo(projected.x,projected.y);else ctx.lineTo(projected.x,projected.y)});ctx.stroke();
  }
 }
 ctx.restore();
}

function drawTouchLight(){
 if(!touchLight||paused)return;
 const age=t-touchLight.time,opacity=touchLight.active?.6:Math.max(0,.6-age/1600);
 if(opacity<=0){touchLight=null;return}
 const g=ctx.createRadialGradient(touchLight.x,touchLight.y,0,touchLight.x,touchLight.y,85);
 g.addColorStop(0,`rgba(229,200,139,${opacity*.6})`);g.addColorStop(.2,`rgba(199,167,106,${opacity*.15})`);g.addColorStop(1,'rgba(199,167,106,0)');ctx.fillStyle=g;ctx.fillRect(touchLight.x-85,touchLight.y-85,170,170);
}
function draw(now){
 const delta=lastFrame===null?0:Math.min(now-lastFrame,50);lastFrame=now;
 if(!paused&&!document.hidden){t+=delta;const target=-18*Math.tanh((Number.isFinite(scrollY)?scrollY:0)/1800);backgroundOffset+=(target-backgroundOffset)*(1-Math.exp(-delta/160));}
 if(!document.hidden){
  if(lineDirty||(!paused&&t-lineTime>=100)){
   lineCtx.clearRect(0,0,W,H);drawRivers(lineCtx);drawOrbits(lineCtx);lineTime=t;lineDirty=false;
  }
  ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(W*.5,H*.5+backgroundOffset);ctx.scale(1.06,1.06);ctx.translate(-W*.5,-H*.5);ctx.drawImage(glowLayer,0,0,W,H);ctx.drawImage(lineLayer,0,0,W,H);
  drawOrbits(ctx,true);
  const a=t*.00006,cos=Math.cos(a),sin=Math.sin(a);
  for(const s of stars){const x=s.x*cos+s.z*sin,z=-s.x*sin+s.z*cos,depth=800/(1800+z);ctx.fillStyle='rgba(190,163,104,.34)';ctx.fillRect(W/2+x*depth+px*8,H/2+s.y*depth+py*8,Math.max(.4,s.s*depth),Math.max(.4,s.s*depth*.55))}
  ctx.restore();drawTouchLight();
  if(pulse&&!paused){const age=t-pulse.time;ctx.strokeStyle=`rgba(182,156,109,${Math.max(0,1-age/1800)*.55})`;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(pulse.x,pulse.y,age*.15,age*.06,-.4,0,Math.PI*2);ctx.stroke();if(age>1800)pulse=null}
 }
 requestAnimationFrame(draw);
}
addEventListener('visibilitychange',()=>{lastFrame=null});requestAnimationFrame(draw);
const art=document.querySelector('#hero-art');addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;px=e.clientX/W-.5;py=e.clientY/H-.5;lineDirty=true;if(!paused&&e.pointerType!=='touch')art.style.transform=`perspective(1100px) rotateY(${px*9}deg) rotateX(${-py*6}deg) translate3d(${px*8}px,${py*8}px,0)`});document.querySelector('.hero').addEventListener('pointerdown',e=>{if(!paused&&!e.target.closest('a,button'))pulse={x:e.clientX,y:e.clientY,time:t}});
function updateMotionLabel(){document.querySelector('#motion').innerHTML=icon(paused?'play':'pause');document.querySelector('#motion').ariaLabel=english?(paused?'Resume animation':'Pause animation'):(paused?'アニメーションを再開':'アニメーションを停止');document.querySelectorAll('.orbit').forEach(e=>e.style.animationPlayState=paused?'paused':'running')};document.querySelector('#motion').onclick=()=>{paused=!paused;updateMotionLabel();if(paused)art.style.transform='none';animateUI(document.querySelector('#motion'),[{opacity:.25},{opacity:1}],{duration:220})};updateMotionLabel();

// Touch gestures preserve normal vertical page scrolling.
let swipeStart=null,swipeOffset=0;
const imagePane=document.querySelector('.viewer-image'),viewImage=document.querySelector('#view-img');
imagePane.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;swipeStart={x:e.clientX,y:e.clientY};swipeOffset=0});
imagePane.addEventListener('pointermove',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;if(Math.abs(dx)>Math.abs(dy)*1.3){swipeOffset=dx;if(!paused)viewImage.style.transform=`translateX(${dx*.22}px)`}});
function finishSwipe(e){if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){stepWork(dx<0?1:-1)}swipeStart=null;viewImage.style.transform=''}
imagePane.addEventListener('pointerup',finishSwipe);imagePane.addEventListener('pointercancel',()=>{swipeStart=null;viewImage.style.transform=''});
addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||paused||dialog.open)return;touchLight={x:e.clientX,y:e.clientY,time:t,active:true};pulse={x:e.clientX,y:e.clientY,time:t};const card=e.target.closest('.work');if(card)card.classList.add('touched')},{passive:true});
addEventListener('pointermove',e=>{if(e.pointerType!=='touch'||paused||dialog.open)return;touchLight={x:e.clientX,y:e.clientY,time:t,active:true};if(e.target.closest('.hero'))art.style.transform=`perspective(1100px) rotateY(${(e.clientX/W-.5)*9}deg) rotateX(${-(e.clientY/H-.5)*6}deg)`},{passive:true});
function releaseTouch(){if(touchLight){touchLight.active=false;touchLight.time=t}document.querySelectorAll('.work.touched').forEach(e=>e.classList.remove('touched'));if(!paused)art.style.transform='none'}
addEventListener('pointerup',releaseTouch,{passive:true});addEventListener('pointercancel',releaseTouch,{passive:true});

const flowerScript=document.createElement("script");flowerScript.src="flowers.js?v=smooth-render-28";document.body.append(flowerScript);

// All clickable controls receive restrained visual feedback, including external links.
document.addEventListener('click',e=>{const control=e.target.closest('button,a,summary');if(control)animateUI(control,[{opacity:.5},{opacity:1}],{duration:220})});
for(const details of document.querySelectorAll('details')){
 const summary=details.querySelector('summary');let disclosure=null,targetOpen=details.open;
 summary.addEventListener('click',e=>{
  if(uiMotion.matches||typeof details.animate!=='function')return;e.preventDefault();
  const start=details.getBoundingClientRect().height,opening=!targetOpen;targetOpen=opening;
  disclosure?.cancel();details.open=true;const expanded=details.getBoundingClientRect().height;
  const collapsed=summary.getBoundingClientRect().height;details.style.overflow='hidden';
  disclosure=details.animate([{height:start+'px'},{height:(opening?expanded:collapsed)+'px'}],{duration:320,easing:'cubic-bezier(.22,.7,.25,1)'});
  const currentAnimation=disclosure;disclosure.finished.then(()=>{if(disclosure!==currentAnimation)return;details.open=opening;details.style.overflow='';disclosure=null},()=>{});
 });
}

// Deliberate in-page travel, interruptible by any new user scroll gesture.
let pageTravel=null;
function stopPageTravel(){if(!pageTravel)return;cancelAnimationFrame(pageTravel.frame);clearTimeout(pageTravel.timeout);document.documentElement.style.scrollBehavior=pageTravel.previous;pageTravel=null}
for(const event of ['wheel','touchstart','pointerdown'])addEventListener(event,stopPageTravel,{passive:true});
addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Escape',' '].includes(e.key))stopPageTravel()});
document.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(!link||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const target=document.getElementById(link.getAttribute('href').slice(1));if(!target)return;e.preventDefault();stopPageTravel();const start=scrollY,padding=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,end=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,target.getBoundingClientRect().top+start-padding));history.pushState(null,'',link.getAttribute('href'));if(uiMotion.matches){window.scrollTo({top:end,behavior:'instant'});return}const previous=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';const travel={frame:0,previous,startTime:null},duration=Math.min(1650,1050+Math.abs(end-start)*.12);pageTravel=travel;function step(now){if(pageTravel!==travel)return;if(travel.startTime===null)travel.startTime=now;const t=Math.min(1,(now-travel.startTime)/duration),eased=t*t*t*(t*(t*6-15)+10);window.scrollTo(0,start+(end-start)*eased);if(t<1)travel.frame=requestAnimationFrame(step);else stopPageTravel()}travel.frame=requestAnimationFrame(step);travel.timeout=setTimeout(()=>{if(pageTravel===travel){window.scrollTo(0,end);stopPageTravel()}},duration+160)});

addEventListener("akiko:resetview",()=>{stopPageTravel()});

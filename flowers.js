(()=>{
const c=document.createElement('canvas');c.id='lycoris';c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:12;filter:blur(7px) saturate(.82);-webkit-filter:blur(7px) saturate(.82);transform:translateZ(0)';document.body.append(c);const g=c.getContext('2d');let w,h,last=0,time=0,next=2,items=[],lastLane=-1;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,mesh=[];
// Morphology: Flora of China, Lycoris radiata: 4–7 florets; green tube
// 5 mm; reflexed, strongly undulate tepals 30 × 5 mm. Six stamens + one style.
// Relative mesh units preserve these ratios; posture/curvature inferred from photographs.
for(let f=0;f<6;f++){
 const a=f*Math.PI/3+.11*Math.sin(f*8+.7),radius=.62+.09*Math.sin(f*2.7),elevation=.34+.17*Math.sin(f*3.1+.8),C=[Math.cos(a)*radius,-.10+.18*Math.sin(f*2.3+.4),Math.sin(a)*radius];
 const U=[-Math.sin(a),0,Math.cos(a)],V=[Math.cos(a)*Math.sin(elevation),Math.cos(elevation),Math.sin(a)*Math.sin(elevation)],A=[Math.cos(a)*Math.cos(elevation),-Math.sin(elevation),Math.sin(a)*Math.cos(elevation)];
 const at=(x,y,z)=>C.map((v,i)=>v+U[i]*x+V[i]*y+A[i]*z);
 // Six broad-to-tip tepals arranged as two staggered whorls of three.
 for(let j=0;j<6;j++){
 const angle=(j%3)*Math.PI*2/3+(j<3?0:Math.PI/3)+.10*Math.sin(f*5+j*2.1),length=1+.14*Math.sin(f*4+j*1.7),curl=1+.12*Math.sin(f*2+j*2.6),phase=j*.8+f*.6;
 function petal(t,side){const theta=4.25*t*curl,r=.30*(1-Math.cos(theta))*length,z=.167+.30*Math.sin(theta)*length+.045*Math.sin(f+j*2)*t*t;
 const profile=Math.pow(Math.sin(Math.PI*t),.72)*(.65+.55*t),width=.10*profile*(1+.12*Math.sin(f*3+j*2));
 const wave=.018*Math.sin(t*36+phase)*Math.sin(Math.PI*t)*Math.abs(side),twist=.22*Math.sin(t*5+phase)*t;
 return at(Math.cos(angle)*r-Math.sin(angle)*side*width,Math.sin(angle)*r+Math.cos(angle)*side*width,z+side*width*twist+wave-.018*(1-side*side)*Math.sin(Math.PI*t));}
 // Two cross sections give the surface a central rib and folded edges.
 for(let k=0;k<32;k++)for(const side of [-1,0])mesh.push({pts:[petal(k/32,side),petal(k/32,side+1),petal((k+1)/32,side+1),petal((k+1)/32,side)],tone:j*.8+k*.06});
 }
 // Short green perianth tube, ca. one sixth of a tepal's length.
 for(let k=0;k<8;k++){const t=k*Math.PI/4,n=(k+1)*Math.PI/4;mesh.push({pts:[at(.035*Math.cos(t),.035*Math.sin(t),0),at(.035*Math.cos(n),.035*Math.sin(n),0),at(.05*Math.cos(n),.05*Math.sin(n),.167),at(.05*Math.cos(t),.05*Math.sin(t),.167)],tone:0,green:true})}
 // Six stamens fan outward together before arching upwards, rather than seven radial spokes.
 for(let j=0;j<6;j++){
 const fan=(j-2.5)*.15,pts=[];
 for(let k=0;k<=32;k++){const t=k/32;pts.push(at(fan*(.2*t+.75*t*t),.22*t-.62*t*t,.10+2.15*t-.16*t*t))}
 mesh.push({pts,line:true,anther:true,antherAngle:fan});
 }
 const style=[];for(let k=0;k<=32;k++){const t=k/32;style.push(at(.12*t*t,.17*t-.57*t*t,.1+2.22*t-.12*t*t))}mesh.push({pts:style,line:true,pistil:true});
 mesh.push({pts:[[0,0,0],[C[0]*.5,-.04,C[2]*.5],C],line:true,stem:true});
 // Small inferior ovary below each tube.
 for(let j=0;j<8;j++){const a=j*Math.PI/4,b=(j+1)*Math.PI/4;mesh.push({pts:[at(.052*Math.cos(a),.052*Math.sin(a),-.075),at(.052*Math.cos(b),.052*Math.sin(b),-.075),at(.036*Math.cos(b),.036*Math.sin(b),0),at(.036*Math.cos(a),.036*Math.sin(a),0)],green:true,tone:0})}
}
// Two dry, narrow involucral bracts at the branching point.
for(const sign of [-1,1])mesh.push({pts:[[0,.04,0],[sign*.055,.09,.01],[sign*.16,.75,.05],[sign*.015,.2,-.01]],bract:true,tone:0});
// Cache static surface normals and projected-part containers once, not every frame.
const parts=mesh.map((m,id)=>{let normal=null;if(!m.line){const v=m.pts,e=v[1].map((n,i)=>n-v[0][i]),d=v[3].map((n,i)=>n-v[0][i]);normal=[e[1]*d[2]-e[2]*d[1],e[2]*d[0]-e[0]*d[2],e[0]*d[1]-e[1]*d[0]];const len=Math.hypot(...normal)||1;normal=normal.map(n=>n/len)}return {...m,id,normal,q:[],depth:0}});
const sorted=parts.slice(),coarse=matchMedia('(pointer:coarse)').matches;
let resizeRequest=0;
function resize(){const width=innerWidth,d=Math.min(devicePixelRatio||1,1.5);if(coarse&&w===width&&c.width===Math.round(width*d))return;w=width;h=coarse?Math.max(innerHeight,screen.height):innerHeight;c.width=Math.round(w*d);c.height=Math.round(h*d);c.style.width=w+'px';c.style.height=h+'px';g.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',()=>{if(!resizeRequest)resizeRequest=requestAnimationFrame(()=>{resizeRequest=0;resize()})},{passive:true});
// Orthographic light-space depth map: real surface occlusion, independent of screen blur.
const shadowSize=96,shadowDepth=new Float32Array(shadowSize*shadowSize);
const lightVector=[-.93,-.25,-.27],lightLength=Math.hypot(...lightVector),L=lightVector.map(v=>v/lightLength);
const lightU=[L[2],0,-L[0]],ul=Math.hypot(...lightU);for(let i=0;i<3;i++)lightU[i]/=ul;
const lightV=[L[1]*lightU[2],L[2]*lightU[0]-L[0]*lightU[2],-L[1]*lightU[0]];
function updateShadows(f,rotate){
 if(f.shadowTime!==undefined&&f.age-f.shadowTime<.10)return;f.shadowTime=f.age;shadowDepth.fill(-Infinity);
 const cast=v=>{const q=rotate(v);return [((q[0]*lightU[0]+q[2]*lightU[2])+3)*16,((q[0]*lightV[0]+q[1]*lightV[1]+q[2]*lightV[2])+3)*16,q[0]*L[0]+q[1]*L[1]+q[2]*L[2]]};
 function triangle(a,b,c){const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<.00001)return;
 const xmin=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),xmax=Math.min(95,Math.ceil(Math.max(a[0],b[0],c[0]))),ymin=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),ymax=Math.min(95,Math.ceil(Math.max(a[1],b[1],c[1])));
 for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/den,v=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/den;if(u>=0&&v>=0&&u+v<=1){const z=u*a[2]+v*b[2]+(1-u-v)*c[2],i=y*96+x;if(z>shadowDepth[i])shadowDepth[i]=z}}}
 for(const m of parts){if(m.line)continue;const q=m.pts.map(cast);triangle(q[0],q[1],q[2]);triangle(q[0],q[2],q[3])}
 if(!f.shadows)f.shadows=new Float32Array(parts.length).fill(1);
 for(const m of parts){if(m.line)continue;const center=m.pts[0].map((_,i)=>m.pts.reduce((sum,p)=>sum+p[i],0)/m.pts.length),q=cast(center);let visible=0,total=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=Math.floor(q[0])+dx,y=Math.floor(q[1])+dy;if(x<0||x>=96||y<0||y>=96)continue;total++;visible+=shadowDepth[y*96+x]<=q[2]+.065?1:0}f.shadows[m.id]=total?visible/total:1;}
}
function flower(f){f.lightDt=f.age-(f.lastLightAge??f.age);f.lastLightAge=f.age;const u=f.age/f.duration,near=Math.sin(Math.PI*u),approach=Math.exp(-Math.pow((u-f.peak)/f.spread,2)),s=f.size*(1.45+.10*near)*(1+f.depth*(.90+.10*approach)),a=f.spin+u*f.turn+.09*Math.sin(u*9+f.roll),b=.12+Math.sin(u*3)*.10+.035*Math.sin(u*11+f.spin),r=.06*Math.sin(u*5+f.roll)+.025*Math.sin(u*13+f.spin),cx=w*(f.start+(f.end-f.start)*u+f.sway*Math.sin(u*6.28+f.spin)*Math.sin(Math.PI*u)),cy=h*(-.27+1.45*(.4*u+.6*u*u)+.018*Math.sin(u*10+f.roll)*Math.sin(Math.PI*u));function p(v){let x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a),y=v[1]*Math.cos(b)-z*Math.sin(b);z=v[1]*Math.sin(b)+z*Math.cos(b);const k=7/(7+z);return [cx+(x*Math.cos(r)-y*Math.sin(r))*s*k,cy+(x*Math.sin(r)+y*Math.cos(r))*s*k,z]}
 function rotate(v){const x=v[0]*Math.cos(a)+v[2]*Math.sin(a),z=-v[0]*Math.sin(a)+v[2]*Math.cos(a),y=v[1]*Math.cos(b)-z*Math.sin(b),Z=v[1]*Math.sin(b)+z*Math.cos(b);return [x*Math.cos(r)-y*Math.sin(r),x*Math.sin(r)+y*Math.cos(r),Z]}
 updateShadows(f,rotate);
 g.globalAlpha=Math.min(1,u*8,(1-u)*8)*.47;c.style.filter=`blur(${4+near*5.5+f.depth*(.90+.10*approach)*5}px) saturate(.82)`;c.style.webkitFilter=c.style.filter;g.lineCap='round';
 // Green cylindrical scape with a shaded core and a narrow reflected highlight.
 const stem=Array.from({length:30},(_,i)=>p([.52*Math.sin(i/29*2.2),i/29*4.8,.15*Math.sin(i/29*2.8)]));function path(pts){g.beginPath();pts.forEach((v,i)=>i?g.lineTo(v[0],v[1]):g.moveTo(v[0],v[1]))}path(stem);g.strokeStyle='#101c13';g.lineWidth=s*.085;g.stroke();path(stem);g.strokeStyle='#354d29';g.lineWidth=s*.045;g.stroke();path(stem);g.strokeStyle='#91a66c';g.lineWidth=s*.012;g.stroke();
 function gloss(m){let N=rotate(m.normal);if(N[2]>0)N=N.map(v=>-v);const diffuse=Math.max(0,N[0]*L[0]+N[1]*L[1]+N[2]*L[2]),target=f.shadows[m.id],old=f.shadowSmooth?.get(m.id)??target,shadow=old+(target-old)*(1-Math.exp(-f.lightDt/.2));if(!f.shadowSmooth)f.shadowSmooth=new Map();f.shadowSmooth.set(m.id,shadow);m.diffuse=diffuse*(.12+.88*shadow);m.rim=Math.pow(1-Math.abs(N[2]),3)*diffuse*shadow;return Math.pow(Math.max(0,N[0]*(-.585)+N[1]*(-.157)+N[2]*(-.796)),22)*shadow}

 const blooms=[];for(const m of parts){m.depth=0;for(let i=0;i<m.pts.length;i++){m.q[i]=p(m.pts[i]);m.depth+=m.q[i][2]}m.depth/=m.pts.length}sorted.sort((a,b)=>b.depth-a.depth);
 for(const m of sorted){path(m.q);if(m.line){g.strokeStyle=m.stem?'#6a803c':m.pistil?'#e88f81':'#df5550';g.lineWidth=s*(m.stem?.035:.009);g.stroke();if(m.anther){const q=m.q.at(-1);g.fillStyle='#bc9b57';g.beginPath();g.ellipse(q[0],q[1],s*.026,s*.01,r+(m.antherAngle||0),0,Math.PI*2);g.fill()}}else{g.closePath();const raw=gloss(m),light=m.diffuse,previous=f.highlights.get(m.id)??raw,shine=previous+(raw-previous)*(1-Math.exp(-f.lightDt/.18));f.highlights.set(m.id,shine);g.fillStyle=`rgb(${12+205*light+shine*65+m.rim*32},${2+34*light+shine*140+m.rim*13},${5+36*light+shine*110+m.rim*11})`;if(m.id%12===0)blooms.push({x:m.q[0][0],y:m.q[0][1],shine});if(m.green)g.fillStyle=`rgb(${18+65*light},${28+90*light},${12+38*light})`;if(m.bract)g.fillStyle='#aa9163';g.fill();g.strokeStyle=g.fillStyle;g.lineWidth=.4;g.stroke()}}
 // Broad warm specular circles bloom through the same Safari-compatible CSS blur.
 g.globalCompositeOperation='screen';for(const q of blooms){const radius=s*(.13+.18*f.depth*approach);const glow=g.createRadialGradient(q.x,q.y,0,q.x,q.y,radius);glow.addColorStop(0,`rgba(255,223,192,${q.shine*.14})`);glow.addColorStop(.35,`rgba(255,164,132,${q.shine*.065})`);glow.addColorStop(1,'rgba(255,145,110,0)');g.fillStyle=glow;g.beginPath();g.arc(q.x,q.y,radius,0,Math.PI*2);g.fill()}g.globalCompositeOperation='source-over';g.filter='none';g.globalAlpha=1;
}
let paintTime=-Infinity;addEventListener('visibilitychange',()=>{last=0;paintTime=-Infinity});
function frame(now){if(now-paintTime<15||document.hidden){requestAnimationFrame(frame);return}paintTime=now;let dt=last?Math.min((now-last)/1000,.05):0;last=now;g.clearRect(0,0,w,h);if(!reduced&&!document.hidden&&!paused){time+=dt;if(time>next){let lane=Math.floor(Math.random()*5);if(lane===lastLane)lane=(lane+1+Math.floor(Math.random()*4))%5;lastLane=lane;const routes=[[-.25,1.1],[1.25,-.1],[.2,.65],[.85,.25],[.5,.5]],route=routes[lane];items.push({highlights:new Map(),start:route[0]+(Math.random()-.5)*.2,end:route[1]+(Math.random()-.5)*.3,sway:.06+Math.random()*.09,peak:.28+Math.random()*.45,spread:.22+Math.random()*.15,age:0,duration:(21+Math.random()*3.5)/(.95*.92),side:Math.random()<.5,spin:Math.random()*6.28,roll:Math.random()-.5,turn:(Math.random()<.5?-1:1)*(Math.PI*4+Math.random()*Math.PI*2),depth:Math.random()<.25?0:.45+Math.random()*1.05,size:(w<700?57:88)+Math.random()*12});next=time+38+Math.random()*18}items=items.filter(f=>(f.age+=dt)<f.duration);items.forEach(flower)}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();

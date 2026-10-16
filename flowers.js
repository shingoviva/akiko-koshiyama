(()=>{
const c=document.createElement('canvas');c.id='lycoris';c.setAttribute('aria-hidden','true');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:12;filter:blur(7px) saturate(1.18);-webkit-filter:blur(7px) saturate(1.18);transform:translateZ(0)';document.body.append(c);let g=c.getContext('2d',{alpha:true,colorSpace:'srgb'});const depthLayers=[{canvas:c,ctx:g,blur:5.2}];for(const blur of [3.5,6.0]){const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.style.cssText=c.style.cssText;document.body.append(canvas);depthLayers.push({canvas,ctx:canvas.getContext('2d',{alpha:true,colorSpace:'srgb'}),blur})}for(const layer of depthLayers){layer.canvas.style.filter=`blur(${layer.blur}px) saturate(1.18)`;layer.canvas.style.webkitFilter=layer.canvas.style.filter;layer.canvas.style.visibility='hidden'}let w,h,last=0,time=0,next=2,items=[],lastLane=-1;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,mesh=[];
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
 for(let k=0;k<32;k++)for(const side of [-1,0])mesh.push({pts:[petal(k/32,side),petal(k/32,side+1),petal((k+1)/32,side+1),petal((k+1)/32,side)],tone:j*.8+k*.06,petalId:f*6+j,segment:k,strip:side});
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
const parts=mesh.map((m,id)=>{let normal=null;if(!m.line){const v=m.pts,e=v[1].map((n,i)=>n-v[0][i]),d=v[3].map((n,i)=>n-v[0][i]);normal=[e[1]*d[2]-e[2]*d[1],e[2]*d[0]-e[0]*d[2],e[0]*d[1]-e[1]*d[0]];const len=Math.hypot(...normal)||1;normal=normal.map(n=>n/len)}return {...m,id,normal,deformedPts:m.pts.map(()=>new Float64Array(3)),fragmentNormal:new Float64Array(3),q:m.pts.map(()=>new Float64Array(3)),worldNormal:new Float64Array(3),lightPts:m.pts.map(()=>new Float64Array(3)),depth:0}});
// Smooth neighboring surface normals along each curled tepal; preserve its central fold.
const petalNormals=new Map();for(const m of parts)if(m.petalId!==undefined)petalNormals.set(`${m.petalId}:${m.segment}:${m.strip}`,m.normal.slice());
for(const m of parts){if(m.petalId===undefined)continue;let sum=[0,0,0],weight=0;for(let d=-2;d<=2;d++){const n=petalNormals.get(`${m.petalId}:${m.segment+d}:${m.strip}`);if(!n)continue;const alignment=n.reduce((v,x,i)=>v+x*m.normal[i],0);if(alignment<.2)continue;const w=3-Math.abs(d);sum=sum.map((v,i)=>v+n[i]*w);weight+=w}const len=Math.hypot(...sum);if(weight&&len)m.normal=sum.map(v=>v/len)}
// Petal centers remain fixed within the intact model; only rare flowers release them.
const petalCenters=Array.from({length:36},()=>({sum:[0,0,0],count:0}));
for(const m of parts)if(m.petalId!==undefined){const center=petalCenters[m.petalId];for(const p of m.pts){center.count++;for(let i=0;i<3;i++)center.sum[i]+=p[i]}}
for(const center of petalCenters)center.point=center.sum.map(v=>v/center.count);
function fragmentPose(f,u){
 if(!f.poses)f.poses=Array.from({length:36},(_,id)=>({center:petalCenters[id].point,angle:0,tilt:0,offset:new Float64Array(3),active:false}));
 for(let id=0;id<36;id++){const pose=f.poses[id],seed=(Math.sin(id*127.1+f.spin*13)*43758.5)%1,age=Math.max(0,u-(.52+.018*Math.abs(seed)))*f.duration,t=age*.42,direction=id*2.399+f.spin;pose.angle=t*(1.1+Math.abs(seed)*1.3);pose.tilt=t*(seed<0?-1:1)*1.5;pose.ca=Math.cos(pose.angle);pose.sa=Math.sin(pose.angle);pose.ct=Math.cos(pose.tilt);pose.st=Math.sin(pose.tilt);pose.offset[0]=Math.cos(direction)*t*.55;pose.offset[1]=.18*t+.14*t*t;pose.offset[2]=Math.sin(direction)*t*.55;pose.active=age>0}return f.poses;
}
function fragmentPoint(v,pose,normal=false,out=new Float64Array(3)){if(!pose?.active)return v;const x=v[0]-(normal?0:pose.center[0]),y=v[1]-(normal?0:pose.center[1]),z=v[2]-(normal?0:pose.center[2]),X=x*pose.ca+z*pose.sa,Z=-x*pose.sa+z*pose.ca,Y=y*pose.ct-Z*pose.st,zz=y*pose.st+Z*pose.ct;out[0]=X+(normal?0:pose.center[0]+pose.offset[0]);out[1]=Y+(normal?0:pose.center[1]+pose.offset[1]);out[2]=zz+(normal?0:pose.center[2]+pose.offset[2]);return out}
// Stem tessellation and projection buffers live for the renderer lifetime.
const stemFaces=[];for(let k=0;k<24;k++)for(let j=0;j<10;j++){const angle=j*Math.PI/5,end=(j+1)*Math.PI/5,point=(t,a)=>[.52*Math.sin(t*2.2)+.0425*Math.cos(a),t*4.8,.15*Math.sin(t*2.8)+.0425*Math.sin(a)],pts=[point(k/24,angle),point(k/24,end),point((k+1)/24,end),point((k+1)/24,angle)];stemFaces.push({pts,q:pts.map(()=>new Float64Array(3)),z:0,side:j})}
const stemNormals=Array.from({length:10},(_,j)=>[Math.cos(j*Math.PI/5+.314),0,Math.sin(j*Math.PI/5+.314)]),stemWorld=new Float64Array(3),stemColors=Array(10);
const sorted=parts.slice(),coarse=matchMedia('(pointer:coarse)').matches;
let resizeRequest=0;
function resize(){const width=innerWidth;if(coarse&&w===width)return;w=width;h=coarse?Math.max(innerHeight,screen.height):innerHeight;for(const layer of depthLayers){layer.canvas.width=1;layer.canvas.height=1;layer.canvas.style.width='1px';layer.canvas.style.height='1px';layer.canvas.style.right='auto';layer.canvas.style.bottom='auto'}for(const f of items)f.surfaceReady=false}
function fitSurface(f,minX,minY,maxX,maxY,padding){
 f.onScreen=maxX+padding>=0&&minX-padding<=w&&maxY+padding>=0&&minY-padding<=h;if(!f.onScreen)return false;
 const quantize=v=>Math.max(64,Math.ceil(v/64)*64),needW=Math.min(w,quantize(maxX-minX+padding*2)),needH=Math.min(h,quantize(maxY-minY+padding*2));
 const width=f.surfaceReady?Math.max(c.width,needW):needW,height=f.surfaceReady?Math.max(c.height,needH):needH;
 const left=Math.floor(Math.max(0,Math.min(minX-padding,w-width))),top=Math.floor(Math.max(0,Math.min(minY-padding,h-height)));
 for(const layer of depthLayers){if(layer.canvas.width!==width)layer.canvas.width=width;if(layer.canvas.height!==height)layer.canvas.height=height;layer.canvas.style.width=width+'px';layer.canvas.style.height=height+'px';layer.canvas.style.transform=`translate3d(${left}px,${top}px,0)`;layer.ctx.setTransform(1,0,0,1,-left,-top)}f.surfaceReady=true;return true;
}
function clearSurfaces(){for(const layer of depthLayers){layer.ctx.setTransform(1,0,0,1,0,0);layer.ctx.clearRect(0,0,layer.canvas.width,layer.canvas.height)}}
resize();addEventListener('resize',()=>{if(!resizeRequest)resizeRequest=requestAnimationFrame(()=>{resizeRequest=0;resize()})},{passive:true});
// Orthographic light-space depth map: real surface occlusion, independent of screen blur.
const shadowCentroid=new Float64Array(3);const shadowSize=96,shadowDepth=new Float32Array(shadowSize*shadowSize);
const lightVector=[-.93,-.25,-.27],lightLength=Math.hypot(...lightVector),L=lightVector.map(v=>v/lightLength);
const lightU=[L[2],0,-L[0]],ul=Math.hypot(...lightU);for(let i=0;i<3;i++)lightU[i]/=ul;
const lightV=[L[1]*lightU[2],L[2]*lightU[0]-L[0]*lightU[2],-L[1]*lightU[0]];
function updateShadows(f,rotate){
 if(f.shadowTime!==undefined&&f.age-f.shadowTime<.10)return;f.shadowTime=f.age;shadowDepth.fill(-Infinity);
 const rotated=new Float64Array(3);function cast(v,out){const q=rotate(v,rotated);out[0]=(q[0]*lightU[0]+q[2]*lightU[2]+3)*16;out[1]=(q[0]*lightV[0]+q[1]*lightV[1]+q[2]*lightV[2]+3)*16;out[2]=q[0]*L[0]+q[1]*L[1]+q[2]*L[2]}
 function triangle(a,b,c){const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<.00001)return;
 const xmin=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),xmax=Math.min(95,Math.ceil(Math.max(a[0],b[0],c[0]))),ymin=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),ymax=Math.min(95,Math.ceil(Math.max(a[1],b[1],c[1])));
 for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/den,v=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/den;if(u>=0&&v>=0&&u+v<=1){const z=u*a[2]+v*b[2]+(1-u-v)*c[2],i=y*96+x;if(z>shadowDepth[i])shadowDepth[i]=z}}}
 for(const m of parts){if(m.line)continue;const points=m.drawPts||m.pts,q=m.lightPts;for(let i=0;i<points.length;i++)cast(points[i],q[i]);triangle(q[0],q[1],q[2]);triangle(q[0],q[2],q[3])}
 if(!f.shadows)f.shadows=new Float32Array(parts.length).fill(1);
 for(const m of parts){if(m.line)continue;const points=m.lightPts,q=shadowCentroid;q[0]=q[1]=q[2]=0;for(const p of points){q[0]+=p[0];q[1]+=p[1];q[2]+=p[2]}q[0]/=points.length;q[1]/=points.length;q[2]/=points.length;let visible=0,total=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=Math.floor(q[0])+dx,y=Math.floor(q[1])+dy;if(x<0||x>=96||y<0||y>=96)continue;total++;visible+=shadowDepth[y*96+x]<=q[2]+.065?1:0}f.shadows[m.id]=total?visible/total:1;}
}
// A fixed worst-orientation envelope prevents the mobile cap from resizing a rotating bloom.
let maxBloomSpan=0;
for(let step=0;step<24;step++)for(const pitch of [-.02,.28])for(const roll of [-.09,.09]){const yaw=step*Math.PI/12,ca=Math.cos(yaw),sa=Math.sin(yaw),cb=Math.cos(pitch),sb=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);let min=Infinity,max=-Infinity;for(const m of parts)for(const v of m.pts){const x=v[0]*ca+v[2]*sa,z=-v[0]*sa+v[2]*ca,y=v[1]*cb-z*sb,Z=v[1]*sb+z*cb,X=(x*cr-y*sr)*7/(7+Z);min=Math.min(min,X);max=Math.max(max,X)}maxBloomSpan=Math.max(maxBloomSpan,max-min)}
function bloomBlur(base,scale,proximity=0){return base*scale/130*1.06*(1+.10*Math.min(1.5,proximity))}
function limitBloomScale(desired,width){return width<700?Math.min(desired,width*1.155/maxBloomSpan):desired}
function flower(f){f.lightDt=f.age-(f.lastLightAge??f.age);f.lastLightAge=f.age;const u=f.age/f.duration,near=Math.sin(Math.PI*u),approach=Math.exp(-Math.pow((u-f.peak)/f.spread,2)),desiredScale=f.size*1.5*(1+f.depth*.95),a=f.spin+u*f.turn*.8+.09*Math.sin(u*9+f.roll),b=.12+Math.sin(u*3)*.10+.035*Math.sin(u*11+f.spin),r=.06*Math.sin(u*5+f.roll)+.025*Math.sin(u*13+f.spin),cx=w*(f.start+(f.end-f.start)*u+f.sway*Math.sin(u*6.28+f.spin)*Math.sin(Math.PI*u)),cy=h*(-.27+1.45*(.4*u+.6*u*u)+.024*Math.sin(u*8+f.roll)*Math.sin(Math.PI*u));let s=desiredScale;
 const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),cr=Math.cos(r),sr=Math.sin(r),r00=cr*ca-sr*sb*sa,r01=-sr*cb,r02=cr*sa+sr*sb*ca,r10=sr*ca+cr*sb*sa,r11=cr*cb,r12=sr*sa-cr*sb*ca,r20=-cb*sa,r21=sb,r22=cb*ca;
 function rotate(v,out=new Float64Array(3)){const x=v[0],y=v[1],z=v[2];out[0]=r00*x+r01*y+r02*z;out[1]=r10*x+r11*y+r12*z;out[2]=r20*x+r21*y+r22*z;return out}
 function p(v,out=new Float64Array(3)){rotate(v,out);const k=7/(7+out[2]);out[0]=cx+out[0]*s*k;out[1]=cy+out[1]*s*k;return out}
 // Bound the intact bloom's projected width on phones; depth never defeats the cap.
 s=limitBloomScale(s,w)*(f.presence||1);
 const poses=f.special?fragmentPose(f,u):null;for(const m of parts){const pose=poses&&m.petalId!==undefined?poses[m.petalId]:null;if(pose?.active){for(let i=0;i<m.pts.length;i++)fragmentPoint(m.pts[i],pose,false,m.deformedPts[i]);m.drawPts=m.deformedPts}else m.drawPts=m.pts;m.drawNormal=m.normal?fragmentPoint(m.normal,pose,true,m.fragmentNormal):null}
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;function bound(q){minX=Math.min(minX,q[0]);maxX=Math.max(maxX,q[0]);minY=Math.min(minY,q[1]);maxY=Math.max(maxY,q[1])}
 for(const m of parts){m.depth=0;for(let i=0;i<m.pts.length;i++){p(m.drawPts[i],m.q[i]);m.depth+=m.q[i][2];bound(m.q[i])}m.depth/=m.pts.length}
 for(const face of stemFaces){face.z=0;for(let i=0;i<4;i++){p(face.pts[i],face.q[i]);face.z+=face.q[i][2];bound(face.q[i])}}
 const padding=Math.ceil(bloomBlur(6,s,f.depth)*4+s*(.10+.09*f.depth)+6);if(!fitSurface(f,minX,minY,maxX,maxY,padding))return;
 updateShadows(f,rotate);if(!f.shadowSmooth){f.shadowSmooth=new Float32Array(f.shadows);f.reflections=new Float32Array(parts.length)}
 for(const layer of depthLayers){const blur=bloomBlur(layer.blur,s,f.depth);if(layer.lastBlur===blur)continue;layer.lastBlur=blur;layer.canvas.style.filter=`blur(${blur}px) saturate(1.18)`;layer.canvas.style.webkitFilter=layer.canvas.style.filter}
 const baseAlpha=Math.min(1,u*8,(1-u)*8)*.50;
 // Focus is inside each bloom. Far and near surfaces blend into separate CSS-blurred planes.
 // CSS compositing works on Safari where CanvasRenderingContext2D.filter may not.
 const focus=.10;
 function atDepth(z,paint,arg){const amount=Math.min(1,Math.abs(z-focus)/1.6);if(amount<.985){g=depthLayers[1].ctx;g.globalAlpha=baseAlpha*(1-amount);g.lineCap='round';paint(arg)}if(amount>=.015){g=depthLayers[z>focus?0:2].ctx;g.globalAlpha=baseAlpha*amount;g.lineCap='round';paint(arg)}}
 // Green cylindrical scape with a shaded core and a narrow reflected highlight.
 function path(pts){g.beginPath();pts.forEach((v,i)=>i?g.lineTo(v[0],v[1]):g.moveTo(v[0],v[1]))}
 // Shaded cylindrical scape: the highlight follows the side light, not the screen center.
 for(let j=0;j<10;j++){const N=rotate(stemNormals[j],stemWorld),light=Math.max(0,N[0]*L[0]+N[1]*L[1]+N[2]*L[2]),spec=Math.pow(Math.max(0,N[0]*(-.585)+N[1]*(-.157)+N[2]*(-.796)),25);stemColors[j]=`rgb(${8+48*light+60*spec},${15+71*light+66*spec},${7+30*light+35*spec})`}
 stemFaces.sort((a,b)=>b.z-a.z);function paintStem(face){path(face.q);g.closePath();g.fillStyle=stemColors[face.side];g.fill();g.strokeStyle=g.fillStyle;g.lineWidth=.4;g.stroke()}
 for(const face of stemFaces)atDepth(face.z/4,paintStem,face);
 function gloss(m){const N=rotate(m.drawNormal||m.normal,m.worldNormal);if(N[2]>0){N[0]=-N[0];N[1]=-N[1];N[2]=-N[2];}const diffuse=Math.max(0,N[0]*L[0]+N[1]*L[1]+N[2]*L[2]),target=f.shadows[m.id],old=f.shadowSmooth[m.id],shadow=old+(target-old)*(1-Math.exp(-f.lightDt/.2));f.shadowSmooth[m.id]=shadow;m.diffuse=Math.pow(diffuse,1.3)*(.025+.975*shadow);m.rim=Math.pow(1-Math.abs(N[2]),3)*diffuse*shadow;return Math.pow(Math.max(0,N[0]*(-.585)+N[1]*(-.157)+N[2]*(-.796)),22)*shadow*shadow}

 const blooms=[];sorted.sort((a,b)=>b.depth-a.depth);
 for(const m of parts){if(m.line)continue;const raw=gloss(m),light=m.diffuse,previous=f.reflections[m.id],shine=previous+(raw-previous)*(1-Math.exp(-f.lightDt/.18));f.reflections[m.id]=shine;m.drawColor=`rgb(${2+255*Math.pow(light,.94)+shine*78+m.rim*37},${.3+27*light+shine*125+m.rim*11},${1+32*light+shine*100+m.rim*10})`;if(m.id%12===0)blooms.push({x:m.q[0][0],y:m.q[0][1],depth:m.depth,shine});if(m.green)m.drawColor=`rgb(${18+65*light},${28+90*light},${12+38*light})`;if(m.bract)m.drawColor='#aa9163';}
 function paintPart(m){path(m.q);if(m.line){g.strokeStyle=m.stem?'#6a803c':m.pistil?'#e88f81':'#df5550';g.lineWidth=s*(m.stem?.035:.009);g.stroke();if(m.anther){const q=m.q.at(-1);g.fillStyle='#bc9b57';g.beginPath();g.ellipse(q[0],q[1],s*.026,s*.01,r+(m.antherAngle||0),0,Math.PI*2);g.fill()}}else{g.closePath();g.fillStyle=m.drawColor;g.fill();g.strokeStyle=g.fillStyle;g.lineWidth=.4;g.stroke()}}
 for(const m of sorted)atDepth(m.depth,paintPart,m);
 // Broad warm specular circles bloom through the same Safari-compatible CSS blur.
 for(const q of blooms)atDepth(q.depth,()=>{g.globalCompositeOperation='screen';const radius=s*(.10+.09*f.depth*approach),glow=g.createRadialGradient(q.x,q.y,0,q.x,q.y,radius);glow.addColorStop(0,`rgba(255,223,192,${q.shine*.14})`);glow.addColorStop(.35,`rgba(255,164,132,${q.shine*.065})`);glow.addColorStop(1,'rgba(255,145,110,0)');g.fillStyle=glow;g.beginPath();g.arc(q.x,q.y,radius,0,Math.PI*2);g.fill();g.globalCompositeOperation='source-over'});for(const layer of depthLayers)layer.ctx.globalAlpha=1;

}
let paintTime=-Infinity,nextPaint=0,hadFlower=false;addEventListener('visibilitychange',()=>{last=0;paintTime=-Infinity;nextPaint=0});
function frame(now){if(document.hidden||now+1<nextPaint){requestAnimationFrame(frame);return}nextPaint=now>nextPaint+1000/60?now+1000/60:nextPaint+1000/60;paintTime=now;let dt=last?Math.min((now-last)/1000,.05):0;last=now;if(hadFlower)clearSurfaces();if(!reduced&&!document.hidden&&!paused){time+=dt;if(time>next){let lane=Math.floor(Math.random()*5);if(lane===lastLane)lane=(lane+1+Math.floor(Math.random()*4))%5;lastLane=lane;const routes=[[-.25,1.1],[1.25,-.1],[.2,.65],[.85,.25],[.5,.5]],route=routes[lane];items.push({special:Math.random()<.06,start:route[0]+(Math.random()-.5)*.2,end:route[1]+(Math.random()-.5)*.3,presence:1.03+Math.pow(Math.random(),.8)*.20,sway:.075+Math.random()*.09,peak:.28+Math.random()*.45,spread:.22+Math.random()*.15,age:0,duration:(21+Math.random()*3.5)/(.95*.92*.97),side:Math.random()<.5,spin:Math.random()*6.28,roll:Math.random()-.5,turn:(Math.random()<.5?-1:1)*(Math.PI*4+Math.random()*Math.PI*2),depth:Math.random()<.10?0:.45+Math.pow(Math.random(),.55)*1.05,size:(w<700?57:88)+Math.random()*12});next=time+38+Math.random()*18}items=items.filter(f=>(f.age+=dt)<f.duration);items.forEach(flower)}const visible=!reduced&&!paused&&items.some(f=>f.onScreen);if(visible!==hadFlower)for(const layer of depthLayers)layer.canvas.style.visibility=visible?'visible':'hidden';if(items.length===0&&c.width>1){for(const layer of depthLayers){layer.canvas.width=1;layer.canvas.height=1}}hadFlower=visible;requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();

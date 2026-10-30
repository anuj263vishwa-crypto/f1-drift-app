const fs=require('fs'); const THREE=require('three'); global.THREE=THREE;
// ---- stubs for the game environment
const mkEl=()=>({style:{},dataset:{},append(){},appendChild(){},insertBefore(){},querySelectorAll(){return[]},getContext(){return{createRadialGradient(){return{addColorStop(){}}},fillRect(){}}}});
global.document={createElement:()=>mkEl(),getElementById:()=>null,querySelectorAll:()=>[]};
THREE.TextureLoader=class{load(u){const t=new THREE.Texture();t.userData={url:u.slice(0,30)};return t}};
THREE.CanvasTexture=class extends THREE.Texture{};
global.window=global; global.S=new THREE.Scene(); global.CARS={}; global.CN={};global.TT={};global.WR={};global.ORD=['f60'];
global.$=()=>mkEl(); global.FLM=new THREE.MeshBasicMaterial(); global.glowT=new THREE.Texture(); global.CFG={ws:1};
global.cur='f60'; global.mode='open'; global.dv=false; global.P={nb:0}; global.ready=false; global.localStorage={getItem(){return null}};
global.setCar=()=>{}; global.applyCfg=()=>{}; global.refreshUI=()=>{}; global.dvSteer=()=>{}; global.boostFx=()=>{};
const timers=[]; global.setInterval=(f)=>{timers.push(f);return 1}; global.clearInterval=()=>{}; const st=global.setTimeout;
global.__CD={}; for (const id of ['rb22','gt3','jesko','fxxk','furai','apollo']) { const s=fs.readFileSync('/home/claude/app/www/js/car_'+id+'.js','utf8'); new Function('window',s)(global) }
let src=fs.readFileSync('/home/claude/app/www/js/cars_ext.js','utf8');
src=src.replace('  let firstSel = false','  globalThis.__install = install; globalThis.__DEFS = DEFS; globalThis.__release = releaseCar; let firstSel = false');
new Function(src)();
(async()=>{
  for (const d of __DEFS) {
    await __install(d); const X=EXTCARS[d.id]; 
    console.log('\n=====',d.id,'registered:',!!CARS[d.id],'WR',WR[d.id].toFixed(4),'ORD',ORD.join(','));
    let tris=0,tl=0; X.c.traverse(o=>{ if(o.isMesh&&o.geometry.index){ if(o.visible) tris+=o.geometry.index.count/3; else tl+=o.geometry.index.count/3 } }); console.log('visible(FULL) triangles',tris|0,'| hidden lite',tl|0); X.setLod('lo'); let t2=0; X.c.traverse(o=>{ if(o.isMesh&&o.visible&&o.geometry.index) t2+=o.geometry.index.count/3 }); console.log('LITE triangles',t2|0); X.setLod('hi');
    // wheel concentricity: radial spread of tyre vertices around local X axis
    for (const k of ['fl','fr','rl','rr']) {
      const sp=X.wh[k].sp; let rs=[],cy=0,cz=0,n=0,xs=[];
      sp.traverse(o=>{ if(o.isMesh && o.visible && /tyre|tire|EXT_WHEEL/i.test(o.userData.k)) { const p=o.geometry.attributes.position; for(let i=0;i<p.count;i++){ const y=p.getY(i),z=p.getZ(i); rs.push(Math.hypot(y,z)); cy+=y;cz+=z;n++; xs.push(p.getX(i)) } } });
      const mx=Math.max(...rs),mn=Math.min(...rs); const tread=rs.filter(r=>r>mx-0.01); 
      console.log(k,'tyre verts',n,'outer radius',mx.toFixed(4),'inner',mn.toFixed(4),'centroid offset (mm) y/z',(1000*cy/n).toFixed(2),(1000*cz/n).toFixed(2),'| st pos',X.wh[k].st.position.toArray().map(v=>+v.toFixed(3)).join(','));
      // spin test: rotate and ensure tread vertices stay at same distance from the hub
      sp.rotation.x=1.234; X.c.updateMatrixWorld(true); let dmax=0,dmin=9; const hub=new THREE.Vector3(); X.wh[k].st.getWorldPosition(hub);
      sp.traverse(o=>{ if(o.isMesh && o.visible && /tyre|tire|EXT_WHEEL/i.test(o.userData.k)){ const p=o.geometry.attributes.position,v=new THREE.Vector3(); for(let i=0;i<p.count;i+=7){ v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld); const dx=v.x-hub.x,dy=v.y-hub.y,dz=v.z-hub.z; const r=Math.hypot(dy,dz); if(r>mx-0.01){dmax=Math.max(dmax,r);dmin=Math.min(dmin,r)} } } });
      console.log('   after spin: tread distance from hub axis min/max',dmin.toFixed(4),dmax.toFixed(4),'(spread',(1000*(dmax-dmin)).toFixed(2),'mm)'); sp.rotation.x=0;
    }
    // steering wheel: rotate about column; rim points must keep distance to hub
    const sp=X.dv.sp, par=sp.parent; par.updateMatrixWorld(true);
    const axis=new THREE.Vector3(0,0,1).applyQuaternion(par.quaternion); console.log('steering hub',par.position.toArray().map(v=>+v.toFixed(3)).join(','),'column axis(toward driver)',axis.toArray().map(v=>+v.toFixed(3)).join(','));
    const sample=()=>{ const out=[]; X.c.updateMatrixWorld(true); sp.traverse(o=>{ if(o.isMesh){ const p=o.geometry.attributes.position; const v=new THREE.Vector3(); for(let i=0;i<p.count;i+=97){ v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld); out.push(v.clone()) } } }); return out };
    sp.rotation.z=0; const a=sample(); sp.rotation.z=0.6; const b=sample(); 
    let maxAxisDrift=0,moved=0; for(let i=0;i<a.length;i++){ const da=a[i].clone().sub(par.position),db=b[i].clone().sub(par.position); const ha=da.dot(axis),hb=db.dot(axis); maxAxisDrift=Math.max(maxAxisDrift,Math.abs(ha-hb)); moved=Math.max(moved,a[i].distanceTo(b[i])) }
    console.log('steer rotate 0.6 rad: max movement along column',(1000*maxAxisDrift).toFixed(3),'mm (should be ~0); max point travel',moved.toFixed(3),'m');
    // direction: left turn = +rotation.z should turn the TOP of the wheel towards car-left (+X) when seen by the driver
    sp.rotation.z=0; const top=new THREE.Vector3(0,1,0); sp.rotation.z=0.3; const topPt=new THREE.Vector3(0,0.1,0); const loc=topPt.clone(); par.localToWorld; 
    X.c.updateMatrixWorld(true); const w0=new THREE.Vector3(0,.1,0).applyMatrix4(par.matrixWorld.clone().multiply(new THREE.Matrix4())); 
    const w1=new THREE.Vector3(0,.1,0).applyMatrix4(sp.matrixWorld); const w2=new THREE.Vector3(0,.1,0).applyMatrix4(par.matrixWorld);
    console.log('local-y point moves (world) from',w2.toArray().map(v=>+v.toFixed(3)).join(','),'to',w1.toArray().map(v=>+v.toFixed(3)).join(','));
    console.log('flame ports',JSON.stringify(X.fl.userData.cx.toFixed(3)),X.fl.userData.cy.toFixed(3),X.fl.userData.cz.toFixed(3),'children',X.fl.children.length);
  }
})();
setTimeout(()=>{ const X=EXTCARS.gt3; X.c.visible=true; window.setCar('f60'); __release('gt3'); console.log('\nswitch away -> visible',X.c.visible,'(no exception, GPU buffers released)'); window.setCar('gt3'); console.log('switch back -> visible',X.c.visible) },500);

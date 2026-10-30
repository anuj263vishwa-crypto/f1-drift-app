import sys,io,json,gzip,base64,re,math
sys.path.insert(0,'/tmp/z')
from convert import *
from convert_car import rot_to
from PIL import Image

def s2l_enc(c):   # glTF linear factor -> display-space value (this game renders without sRGB output)
    return [float(x)**(1/2.2) if x>0 else 0.0 for x in c]
def img_bytes(js,bn,src):
    im=js['images'][src]; bv=js['bufferViews'][im['bufferView']]; o=bv.get('byteOffset',0); return bn[o:o+bv['byteLength']]

def build2(cfg):
    R=np.array(cfg['R'],dtype=np.float64); lab=cfg['label']
    def prep(path):
        js,bn,pr=load_prims(path)
        for p in pr: p['P']=p['P']@R.T; p['N']=p['N']@R.T; p['lab']=lab(p,p['P'][p['I']].mean(1))
        return js,bn,pr
    # ---- exact fit on ORIGINAL mesh
    jsf,bnf,pf=prep(cfg['fit_src'])
    tb={}
    for p in pf:
        for k in ('fl','fr','rl','rr'):
            m=(p['lab']==k+'.t')
            if m.any(): tb.setdefault(k,[]).append(p['P'][np.unique(p['I'][m])])
    TV={k:np.vstack(v) for k,v in tb.items()}
    shift=-np.mean([TV[k][:,1].min() for k in TV]); sh=np.array([0,shift,0])
    wheels={}
    def axis_of(V):
        c0=V.mean(0); w,e=np.linalg.eigh(np.cov((V-c0).T)); a0=e[:,0]; a0=a0 if a0[0]>0 else -a0
        x=(V-c0)@a0; res=[]
        for Q in (V[x>0.8*x.max()],V[x<0.8*x.min()]):
            if len(Q)<12: continue
            qc=Q.mean(0); ww,ee=np.linalg.eigh(np.cov((Q-qc).T)); nrm=ee[:,0]; nrm=nrm if nrm@a0>0 else -nrm; res.append(nrm)
        if not res: return a0
        a=sum(res); a/=np.linalg.norm(a)
        if a[0]<0: a=-a
        return a
    for k,V in TV.items():
        V=V+sh; a=None
        dv=[p['P'][np.unique(p['I'][p['lab']==k+'.sp'])] for p in pf if (p['lab']==k+'.sp').any() and cfg['isdisc'](p)]
        if dv and sum(len(x) for x in dv)>=60:        # brake disc = thin flat annulus -> its normal IS the axle
            D_=np.vstack(dv); w_,e_=np.linalg.eigh(np.cov((D_-D_.mean(0)).T)); a=e_[:,0]; a=a if a[0]>0 else -a
        if a is None: a=axis_of(V)
        Ra=rot_to(a,np.array([1.,0,0])); c0=V.mean(0); Vp=(V-c0)@Ra.T
        mn=Vp.min(0); mx=Vp.max(0); cl=(mn+mx)/2; cw=c0+Ra.T@cl; rad=((mx[1]-mn[1])+(mx[2]-mn[2]))/4
        wheels[k]=dict(c=cw,r=rad,Ra=Ra)
        # concentricity of the other spinning parts (rim/disc) around the same axis
        other=[(p['P'][np.unique(p['I'][p['lab']==k+'.sp'])]+sh) for p in pf if (p['lab']==k+'.sp').any()]
        off=''
        if other:
            O=(np.vstack(other)-cw)@Ra.T; O=O[np.hypot(O[:,1],O[:,2])<rad*0.9]; om=(O.min(0)+O.max(0))/2; off=f' | rim/disc centre offset y {1000*om[1]:.1f}mm z {1000*om[2]:.1f}mm'
        print(f'wheel {k}: centre={cw.round(4)} radius={rad:.4f} camber/toe removed: {math.degrees(math.acos(min(1,abs(a[0])))):.2f}°{off}')
    swv=[(p['P'][np.unique(p['I'][p['lab']=='sw'])],p['N'][np.unique(p['I'][p['lab']=='sw'])]) for p in pf if (p['lab']=='sw').any()]
    sw=None
    if swv:
        V=np.vstack([a for a,b in swv])+sh; Nn=np.vstack([b for a,b in swv]); csw=(V.min(0)+V.max(0))/2
        n=np.array([0,.12,-1.]); n/=np.linalg.norm(n)
        for it in range(8):
            s_=np.abs(Nn@n)>0.96
            if s_.sum()<50: break
            nn=Nn[s_]*np.sign(Nn[s_]@n)[:,None]; n=nn.mean(0); n/=np.linalg.norm(n)
        if n@np.array([0,.25,-1.])<0: n=-n
        e1=np.cross([0,1.,0],n); e1/=np.linalg.norm(e1); e2=np.cross(n,e1); B=np.c_[e1,e2,n]
        Vf=V[s_]; u=(Vf-csw)@e1; vv=(Vf-csw)@e2; csw=csw+e1*(u.min()+u.max())/2+e2*(vv.min()+vv.max())/2
        sw=dict(c=csw,B=B,n=n); print('steering centre',csw.round(3),'axis',n.round(4))
    jsm=jsf['materials']; usedmats=set()
    def tinfo(ti): return ti.get('extensions',{}).get('KHR_texture_transform') if ti else None
    def uvxf(UV,ext):
        if not ext: return UV
        sx,sy=ext.get('scale',[1,1]); ox,oy=ext.get('offset',[0,0]); rot=ext.get('rotation',0); S=np.c_[UV[:,0]*sx,UV[:,1]*sy]; c,s=math.cos(rot),math.sin(rot)
        return np.c_[c*S[:,0]+s*S[:,1]+ox,-s*S[:,0]+c*S[:,1]+oy]
    def emit_lod(body_path,wheel_path):
        js,bn,prims=prep(body_path)
        for p in prims: p['P']=p['P']+sh
        if wheel_path:
            _,_,pw=prep(wheel_path)
            for p in pw: p['P']=p['P']+sh
        else: pw=prims
        mats_js=js['materials']
        def gather(test,xf,src):
            acc_={}
            for p in src:
                m=test(p['lab'])
                if not m.any(): continue
                pb=mats_js[p['mat']].get('pbrMetallicRoughness',{}); UV=uvxf(p['UV'],tinfo(pb.get('baseColorTexture')))
                P,N=xf(p['P'],p['N']); acc_.setdefault(p['matname'],[]).append((P,N,UV,p['I'][m]))
            res={}
            for nm,lst in acc_.items():
                off=0; Ps=[];Ns=[];Us=[];Is=[]
                for P,N,UV,I in lst: Ps.append(P);Ns.append(N);Us.append(UV);Is.append(I+off); off+=len(P)
                res[nm]=(np.vstack(Ps),np.vstack(Ns),np.vstack(Us),np.vstack(Is))
            return res
        def emit(res):
            pl=[]
            for nm,(P,N,UV,I) in res.items():
                usedmats.add(nm); pl+=split_emit(P,N,UV,I,nm)
            return pl
        ident=lambda P,N:(P,N); g={}
        g['body']=emit(gather(lambda L:L=='body',ident,prims)); g['wheels']={}
        for k,W in wheels.items():
            xf=lambda P,N,W=W:((P-W['c'])@W['Ra'].T,N@W['Ra'].T)
            g['wheels'][k]=dict(c=[round(float(x),5) for x in W['c']],r=round(float(W['r']),5),
                sp=emit(gather(lambda L,k=k:np.isin(L,[k+'.t',k+'.sp']),xf,pw)),st=emit(gather(lambda L,k=k:L==k+'.st',xf,prims)))
        if sw:
            xs=lambda P,N:((P-sw['c'])@sw['B'],N@sw['B'])
            g['sw']=dict(c=[round(float(x),5) for x in sw['c']],B=[round(float(x),6) for x in sw['B'].T.ravel()],prims=emit(gather(lambda L:L=='sw',xs,prims)))
        return g
    G={name:emit_lod(v['body'],v.get('wheel')) for name,v in cfg['lods'].items()}
    # ---- materials / textures (union of both LODs). material identity = name
    byname={}
    for i,m in enumerate(jsm): byname.setdefault(m['name'],i)
    order=sorted(usedmats); remap={n:i for i,n in enumerate(order)}
    texmap={}; texlist=[]; texs=jsf.get('textures',[])
    def addtex(ti,maxd,alpha,q=76):
        if ti is None: return -1
        src=texs[ti['index']]['source']; key=(src,maxd,alpha)
        if key in texmap: return texmap[key]
        im=Image.open(io.BytesIO(img_bytes(jsf,bnf,src))); im.load(); w,h=im.size; sc=min(1.0,maxd/max(w,h))
        if sc<1: im=im.resize((max(1,int(w*sc)),max(1,int(h*sc))),Image.LANCZOS)
        im=im.convert('RGBA' if alpha else 'RGB'); buf=io.BytesIO(); im.save(buf,'WEBP',quality=q,method=6)
        texlist.append('data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()); texmap[key]=len(texlist)-1; return texmap[key]
    def has_alpha(src):
        im=Image.open(io.BytesIO(img_bytes(jsf,bnf,src)))
        if im.mode in ('RGBA','LA') or 'transparency' in im.info: return bool((np.array(im.convert('RGBA'))[:,:,3]<250).mean()>0.002)
        return False
    mats=[]
    for nm in order:
        m=jsm[byname[nm]]; pb=m.get('pbrMetallicRoughness',{}); bc=pb.get('baseColorFactor',[1,1,1,1]); ti=pb.get('baseColorTexture'); al=m.get('alphaMode','OPAQUE')
        md=cfg['texmax'].get(nm,cfg.get('tmax',1024)); ta=has_alpha(texs[ti['index']]['source']) if ti is not None else False
        t=addtex(ti,md,ta and al!='OPAQUE')
        mr=addtex(pb.get('metallicRoughnessTexture'),cfg.get('mrmax',512),False,80)
        nt=addtex(m.get('normalTexture'),cfg.get('nmax',512),False,86); ns=(m.get('normalTexture') or {}).get('scale',1)
        et=addtex(m.get('emissiveTexture'),512,False,80) if m.get('emissiveTexture') else -1
        ex=m.get('extensions',{}); cc=ex.get('KHR_materials_clearcoat',{}); es=ex.get('KHR_materials_emissive_strength',{}).get('emissiveStrength',1); em=m.get('emissiveFactor',[0,0,0])
        mats.append(dict(n=nm,c=[round(x,4) for x in s2l_enc(bc[:3])],a=round(bc[3],3),r=round(pb.get('roughnessFactor',1.0),3),
            m=round(pb.get('metallicFactor',1.0),3),t=t,mr=mr,nt=nt,ns=round(ns,2),bl=int(al=='BLEND'),mk=int(al=='MASK'),ac=round(m.get('alphaCutoff',.5),2),
            cc=round(cc.get('clearcoatFactor',0),2),ccr=round(cc.get('clearcoatRoughnessFactor',0),2),ds=int(m.get('doubleSided',False)),
            em=[round(float(x*min(es,3))**(1/2.2),3) for x in em] if any(em) else 0,et=et))
    def fix(g):
        for p in g['body']: p['m']=remap[p['m']]
        for k in g['wheels']:
            for p in g['wheels'][k]['sp']+g['wheels'][k]['st']: p['m']=remap[p['m']]
        if 'sw' in g:
            for p in g['sw']['prims']: p['m']=remap[p['m']]
    for g in G.values(): fix(g)
    a=next(iter(G.values())); fr=np.mean([wheels['fl']['r'],wheels['fr']['r']]); rr=np.mean([wheels['rl']['r'],wheels['rr']['r']])
    return dict(id=cfg['id'],name=cfg['name'],title=cfg['title'],wr=round(float((fr+rr)/2),4),tex=texlist,mats=mats,g=G,ex=cfg['exhaust'](shift),eye=cfg['eye'](sw),shift=float(shift))

def save2(out,fn):
    raw=json.dumps(out,separators=(',',':')).encode(); gz=gzip.compress(raw,9)
    open(fn,'w').write('/* auto-generated car data */\n(window.__CD=window.__CD||{})["%s"]="%s";\n'%(out['id'],base64.b64encode(gz).decode()))
    tr=lambda g:sum(len(base64.b64decode(p['I']))//6 for p in g['body']+[q for w in g['wheels'].values() for q in w['sp']+w['st']]+(g['sw']['prims'] if 'sw' in g else []))
    print(out['id'],'gz+b64 %d KB'%(len(base64.b64encode(gz))//1024),'textures',len(out['tex']),sum(len(t) for t in out['tex'])//1024,'KB','| tris',{k:tr(v) for k,v in out['g'].items()})

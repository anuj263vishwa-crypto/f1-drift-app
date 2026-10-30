import sys; sys.path.insert(0,'/tmp/z')
from convert import *

def img_bytes(js,bn,src):
    im=js['images'][src]; bv=js['bufferViews'][im['bufferView']]; o=bv.get('byteOffset',0); return bn[o:o+bv['byteLength']]

def build(cfg):
    js,bn,prims=load_prims(cfg['src'])
    R=np.array(cfg['R'],dtype=np.float64)
    for p in prims: p['P']=p['P']@R.T; p['N']=p['N']@R.T
    # ---- classify triangles
    for p in prims:
        T=p['P'][p['I']]; cent=T.mean(1); p['lab']=cfg['label'](p,cent)
    # ---- fit pass on the ORIGINAL (unsimplified) mesh: exact wheel centres / steering axis
    jsf,bnf,pf=load_prims(cfg.get('fit_src',cfg['src']))
    for p in pf:
        p['P']=p['P']@R.T; p['N']=p['N']@R.T; T=p['P'][p['I']]; p['lab']=cfg['label'](p,T.mean(1))
    tb={}
    for p in pf:
        for k in ('fl','fr','rl','rr'):
            m=(p['lab']==k+'.t')
            if m.any(): tb.setdefault(k,[]).append(p['P'][np.unique(p['I'][m])])
    TV={k:np.vstack(v) for k,v in tb.items()}
    shift=-np.mean([TV[k][:,1].min() for k in TV])
    for p in prims: p['P']=p['P']+np.array([0,shift,0])
    wheels={}
    for k,V in TV.items():
        V=V+np.array([0,shift,0]); mn=V.min(0); mx=V.max(0); cw=(mn+mx)/2; rad=((mx[1]-mn[1])+(mx[2]-mn[2]))/4
        cy,cz,rf=fit_circle(V[:,1][np.hypot(V[:,1]-cw[1],V[:,2]-cw[2])>0.93*rad],V[:,2][np.hypot(V[:,1]-cw[1],V[:,2]-cw[2])>0.93*rad])
        wheels[k]=dict(c=cw,Ra=np.eye(3),r=rad,tilt=0)
        print(f'wheel {k}: centre={cw.round(4)} radius={rad:.4f} (circle-fit centre diff {1000*math.hypot(cy-cw[1],cz-cw[2]):.1f}mm) width={(mx[0]-mn[0]):.3f}')
    swv=[(p['P'][np.unique(p['I'][p['lab']=='sw'])],p['N'][np.unique(p['I'][p['lab']=='sw'])]) for p in pf if (p['lab']=='sw').any()]
    sw=None
    if swv:
        V=np.vstack([a for a,b in swv])+np.array([0,shift,0]); Nn=np.vstack([b for a,b in swv])
        csw=(V.min(0)+V.max(0))/2; n=np.array([0,.12,-1.]); n/=np.linalg.norm(n)   # driver faces forward: wheel face looks rearwards
        for it in range(8):   # refine with face normals (robust against paddles / buttons)
            s_=np.abs(Nn@n)>0.96
            if s_.sum()<50: break
            nn=Nn[s_]*np.sign(Nn[s_]@n)[:,None]; n=nn.mean(0); n/=np.linalg.norm(n)
        if n@np.array([0,.25,-1.])<0: n=-n
        e1=np.cross([0,1.,0],n); e1/=np.linalg.norm(e1); e2=np.cross(n,e1); B=np.c_[e1,e2,n]
        Vf=V[s_]; u=(Vf-csw)@e1; vv=(Vf-csw)@e2; csw=csw+e1*(u.min()+u.max())/2+e2*(vv.min()+vv.max())/2   # hub = centre of the wheel face
        sw=dict(c=csw,B=B,n=n); print('steering centre',csw.round(3),'axis',n.round(4),'size',(V.max(0)-V.min(0)).round(3),'face verts',int(s_.sum()))
    for p in pf: p['P']=p['P']+np.array([0,shift,0])
    if cfg.get('wheel_src'):
        _,_,pw=load_prims(cfg['wheel_src'])
        for p in pw:
            p['P']=p['P']@R.T+np.array([0,shift,0]); p['N']=p['N']@R.T; p['lab']=cfg['label'](p,p['P'][p['I']].mean(1))
    else: pw=prims
    # ---- materials used, UV transform
    mats_js=js['materials']; texs=js.get('textures',[])
    def tinfo(ti):
        if ti is None: return None
        t=ti['index']; ext=ti.get('extensions',{}).get('KHR_texture_transform')
        return t,ext
    def uvxf(UV,ext):
        if not ext: return UV
        sx,sy=ext.get('scale',[1,1]); ox,oy=ext.get('offset',[0,0]); rot=ext.get('rotation',0)
        S=np.c_[UV[:,0]*sx,UV[:,1]*sy]; c,s=math.cos(rot),math.sin(rot)
        return np.c_[c*S[:,0]+s*S[:,1]+ox,-s*S[:,0]+c*S[:,1]+oy]
    # ---- emit groups
    def gather(label_test,xf,src=None):
        """xf(P,N)->(P,N) for the group; returns {mat:[(P,N,UV,I)...]}"""
        acc_={}
        for p in (src if src is not None else prims):
            m=label_test(p['lab'])
            if not m.any(): continue
            pb=mats_js[p['mat']].get('pbrMetallicRoughness',{}); ti=tinfo(pb.get('baseColorTexture'))
            UV=uvxf(p['UV'],ti[1] if ti else None)
            P,N=xf(p['P'],p['N'])
            acc_.setdefault(p['mat'],[]).append((P,N,UV,p['I'][m]))
        res={}
        for mi,lst in acc_.items():
            off=0; Ps=[];Ns=[];Us=[];Is=[]
            for P,N,UV,I in lst: Ps.append(P);Ns.append(N);Us.append(UV);Is.append(I+off); off+=len(P)
            res[mi]=(np.vstack(Ps),np.vstack(Ns),np.vstack(Us),np.vstack(Is))
        return res
    usedmats=set(); groups={}
    def emit(key,res):
        pl=[]
        for mi,(P,N,UV,I) in res.items():
            usedmats.add(mi); pl+=split_emit(P,N,UV,I,mi)
        return pl
    ident=lambda P,N:(P,N)
    groups['body']=emit('body',gather(lambda L:np.isin(L,['body']),ident))
    gw={}
    for k,W in wheels.items():
        def xf(P,N,W=W): return (P-W['c'])@W['Ra'].T, N@W['Ra'].T
        sp=emit(k+'.sp',gather(lambda L,k=k:np.isin(L,[k+'.t',k+'.sp']),xf,pw))
        st=emit(k+'.st',gather(lambda L,k=k:np.isin(L,[k+'.st']),xf,prims))
        gw[k]=dict(c=[round(float(x),5) for x in W['c']],r=round(float(W['r']),5),sp=sp,st=st)
    groups['wheels']=gw
    if sw:
        def xf(P,N): return (P-sw['c'])@sw['B'], N@sw['B']
        groups['sw']=dict(c=[round(float(x),5) for x in sw['c']],B=[round(float(x),6) for x in sw['B'].T.ravel()],prims=emit('sw',gather(lambda L:np.isin(L,['sw']),xf,prims)))
    # ---- materials + textures
    order=sorted(usedmats); remap={m:i for i,m in enumerate(order)}
    texmap={}; texlist=[]
    def addtex(ti,maxd,alpha):
        if ti is None: return -1
        t=ti['index']; src=texs[t]['source']; key=(src,maxd,alpha)
        if key in texmap: return texmap[key]
        im=Image.open(io.BytesIO(img_bytes(js,bn,src))); im.load()
        w,h=im.size; sc=min(1.0,maxd/max(w,h)); 
        if sc<1: im=im.resize((max(1,int(w*sc)),max(1,int(h*sc))),Image.LANCZOS)
        im=im.convert('RGBA' if alpha else 'RGB'); buf=io.BytesIO(); im.save(buf,'WEBP',quality=cfg.get('wq',80),method=6)
        texlist.append('data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()); texmap[key]=len(texlist)-1
        return texmap[key]
    def has_alpha(src):
        im=Image.open(io.BytesIO(img_bytes(js,bn,src))); 
        if im.mode in ('RGBA','LA') or 'transparency' in im.info:
            a=np.array(im.convert('RGBA'))[:,:,3]; return bool((a<250).mean()>0.002)
        return False
    mats=[]
    for mi in order:
        m=mats_js[mi]; pb=m.get('pbrMetallicRoughness',{}); bc=pb.get('baseColorFactor',[1,1,1,1])
        ti=pb.get('baseColorTexture'); md=cfg['texmax'].get(m['name'],cfg.get('tmax',1024))
        al=m.get('alphaMode','OPAQUE'); ta=False; 
        if ti is not None:
            ta=has_alpha(texs[ti['index']]['source'])
        t=addtex(ti,md,ta and al!='OPAQUE' or (ta and cfg.get('alphatex',lambda n:False)(m['name'])))
        em=m.get('emissiveFactor',[0,0,0]); ex=m.get('extensions',{}).get('KHR_materials_emissive_strength',{}).get('emissiveStrength',1)
        et=addtex(m.get('emissiveTexture'),512,False) if m.get('emissiveTexture') else -1
        mats.append(dict(n=m['name'],c=[round(x,4) for x in bc[:3]],a=round(bc[3],3),r=round(pb.get('roughnessFactor',1) if pb.get('roughnessFactor') is not None else 1,3),
            m=round(pb.get('metallicFactor',0) if pb.get('metallicFactor') is not None else 0,3),t=t,bl=int(al=='BLEND'),mk=int(al=='MASK'),ta=int(ta),
            em=[round(x*min(ex,3),3) for x in em] if any(em) else 0,et=et,ds=int(m.get('doubleSided',False))))
    def fixprims(pl):
        for p in pl: p['m']=remap[p['m']]
    fixprims(groups['body'])
    for k in groups['wheels']: fixprims(groups['wheels'][k]['sp']); fixprims(groups['wheels'][k]['st'])
    if sw: fixprims(groups['sw']['prims'])
    fr=np.mean([wheels['fl']['r'],wheels['fr']['r']]); rr=np.mean([wheels['rl']['r'],wheels['rr']['r']])
    out=dict(id=cfg['id'],name=cfg['name'],title=cfg['title'],wr=round(float((fr+rr)/2),4),tex=texlist,mats=mats,g=groups,ex=cfg['exhaust'](shift),eye=cfg['eye'](sw),shift=float(shift))
    return out

def save(out,fn):
    raw=json.dumps(out,separators=(',',':')).encode(); gz=gzip.compress(raw,9)
    open(fn,'w').write('/* auto-generated car data */\n(window.__CD=window.__CD||{})["%s"]="%s";\n'%(out['id'],base64.b64encode(gz).decode()))
    print('raw json',len(raw)//1024,'KB  gz+b64',len(base64.b64encode(gz))//1024,'KB  textures',len(out['tex']),sum(len(t) for t in out['tex'])//1024,'KB(b64)')

import sys,re; sys.path.insert(0,'/tmp/z')
from convert_car import *

def wheel_info(src,R,tyre):
    js,bn,pr=load_prims(src); V=[]
    for p in pr:
        if p['matname'] in tyre: V.append((p['P'][np.unique(p['I'])])@np.array(R).T)
    V=np.vstack(V); zm=V[:,2]; zc=[zm.min(),zm.max()]
    for _ in range(12):
        a=zm<(zc[0]+zc[1])/2; zc=[zm[a].mean(),zm[~a].mean()]
    zsplit=(zc[0]+zc[1])/2; out={}
    for fr in (0,1):
        for lf in (0,1):
            m=((V[:,2]>zsplit)==bool(fr))&((V[:,0]>0)==bool(lf)); Q=V[m]; mn=Q.min(0); mx=Q.max(0)
            k=('f' if fr else 'r')+('l' if lf else 'r'); out[k]=dict(c=(mn+mx)/2,r=((mx[1]-mn[1])+(mx[2]-mn[2]))/4,hw=(mx[0]-mn[0])/2)
    return out

def _m(nm,S): return nm in S or any(x.endswith('*') and nm.startswith(x[:-1]) for x in S)
def make_label(wi,tyre,spin,calip,drop=(),sw=None):
    keys=list(wi); C=np.array([wi[k]['c'] for k in keys])
    def label(p,cent):
        n=len(cent); L=np.full(n,'body',dtype='<U6'); nm=p['matname']
        if _m(nm,drop): L[:]='drop'; return L
        if sw and _m(nm,sw['mats']):
            b=sw['box']; ins=(cent[:,0]>b[0])&(cent[:,0]<b[1])&(cent[:,1]>b[2])&(cent[:,1]<b[3])&(cent[:,2]>b[4])&(cent[:,2]<b[5])
            L[ins]='sw'
        if _m(nm,tyre) or _m(nm,spin) or _m(nm,calip):
            d=np.hypot(cent[:,None,0]-C[None,:,0],cent[:,None,2]-C[None,:,2]); kk=d.argmin(1)
            for i,k in enumerate(keys):
                m=(kk==i); c=wi[k]['c']; r=np.hypot(cent[:,1]-c[1],cent[:,2]-c[2]); lat=np.abs(cent[:,0])-abs(c[0])
                ok=m&(r<=wi[k]['r']*1.04)&(lat>-(wi[k]['hw']+0.36))&(lat<wi[k]['hw']+0.08)
                key={'fl':'fl','fr':'fr','rl':'rl','rr':'rr'}[k]
                suf='.t' if _m(nm,tyre) else '.sp' if _m(nm,spin) else '.st'
                L[ok]=key+suf
        return L
    return label

def run(cid,name,title,fit_src,body_src,wheel_src,R,tyre,spin,calip,drop,sw,exhaust,eye=None,texmax=None,tmax=512,out='/tmp/n/car'):
    import os; os.makedirs(out,exist_ok=True)
    wi=wheel_info(fit_src,R,tyre); 
    for k,v in wi.items(): print('  wheel',k,'ctr',v['c'].round(3),'r %.3f hw %.3f'%(v['r'],v['hw']))
    label=make_label(wi,set(tyre),set(spin),set(calip),set(drop),sw and dict(mats=set(sw['mats']),box=sw['box']))
    cfg=dict(id=cid,name=name,title=title,src=body_src,wheel_src=wheel_src,fit_src=fit_src,R=np.array(R,dtype=float),label=label,texmax=texmax or {},tmax=tmax,wq=76,
      exhaust=exhaust,eye=eye or (lambda s:[float(s['c'][0]),float(s['c'][1])+0.12,float(s['c'][2])-0.42]))
    o=build(cfg); save(o,f'{out}/car_{cid}.js'); return o

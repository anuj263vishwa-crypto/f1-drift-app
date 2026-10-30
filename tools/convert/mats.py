import sys; sys.path.insert(0,'/tmp/n'); sys.path.insert(0,'/tmp/z')
from bake import *
def mats(fn):
    js,bn=load(fn); agg={}
    for (ni,p,W,mi) in walk(js,bn):
        for pr in js['meshes'][mi]['primitives']:
            P=acc(js,bn,pr['attributes']['POSITION']).astype(np.float64); Pw=(np.c_[P,np.ones(len(P))]@W.T)[:,:3]
            I=acc(js,bn,pr['indices']).ravel(); nm=js['materials'][pr['material']]['name']
            a=agg.setdefault(nm,[0,0,None,None]); a[0]+=len(P); a[1]+=len(I)//3
            a[2]=Pw.min(0) if a[2] is None else np.minimum(a[2],Pw.min(0)); a[3]=Pw.max(0) if a[3] is None else np.maximum(a[3],Pw.max(0))
    A=np.vstack([v[2] for v in agg.values()]+[v[3] for v in agg.values()]); print('overall',A.min(0).round(2),A.max(0).round(2))
    for nm,(n,t,mn,mx) in sorted(agg.items(),key=lambda kv:-kv[1][1]):
        c=(mn+mx)/2; s=mx-mn; print(f'{nm[:30]:30s} tris={t:6d} ctr={c.round(2)} size={s.round(2)}')
if __name__=='__main__': mats(sys.argv[1])

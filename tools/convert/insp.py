import sys,re; sys.path.insert(0,'/tmp/n'); sys.path.insert(0,'/tmp/z')
from bake import *
def inspect(fn,maxrows=90):
    js,bn=load(fn); rows=[]
    for (ni,p,W,mi) in walk(js,bn):
        for pr in js['meshes'][mi]['primitives']:
            P=acc(js,bn,pr['attributes']['POSITION']).astype(np.float64); Pw=(np.c_[P,np.ones(len(P))]@W.T)[:,:3]
            rows.append((p[-1][:34],js['materials'][pr['material']]['name'][:26],len(P),Pw.min(0),Pw.max(0)))
    A=np.vstack([np.vstack([r[3],r[4]]) for r in rows]); print('overall min',A.min(0).round(3),'max',A.max(0).round(3),'size',(A.max(0)-A.min(0)).round(3))
    for r in rows[:maxrows]:
        c=(r[3]+r[4])/2; s=r[4]-r[3]; print(f'{r[0]:34s} {r[1]:26s} n={r[2]:6d} ctr={c.round(2)} size={s.round(2)}')
    return js,rows
if __name__=='__main__': inspect(sys.argv[1],int(sys.argv[2]) if len(sys.argv)>2 else 90)

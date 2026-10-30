import sys; sys.path.insert(0,'/tmp/z')
from bake import *
from PIL import Image, ImageDraw
def tris(path):
    js,bn=load(path); out=[]
    for (ni,p,W,mi) in walk(js,bn):
        for pr in js['meshes'][mi]['primitives']:
            P=acc(js,bn,pr['attributes']['POSITION']).astype(np.float64); Pw=(np.c_[P,np.ones(len(P))]@W.T)[:,:3]
            I=acc(js,bn,pr['indices']).ravel().reshape(-1,3)
            out.append(dict(path=p,mat=pr.get('material'),P=Pw,I=I,js=js))
    return js,out
def render(items,view,box,fn,size=1000,colfn=None,filt=None):
    """view=(ha,va,da): horizontal axis, vertical axis, depth axis (larger depth = nearer). """
    ha,va,da,sx,sy,sd=view  # signs
    x0,x1,y0,y1=box; sc=size/(x1-x0); H=int((y1-y0)*sc)
    im=Image.new('RGB',(size,H),(20,20,26)); d=ImageDraw.Draw(im)
    polys=[]
    for it in items:
        P=it['P']; I=it['I']; col=(colfn(it) if colfn else (180,180,190))
        T=P[I]  # n,3,3
        n=np.cross(T[:,1]-T[:,0],T[:,2]-T[:,0]); nl=np.linalg.norm(n,axis=1)+1e-12; n/=nl[:,None]
        depth=(T[:,:,da].mean(1))*sd
        light=np.clip(0.35+0.65*np.abs(n[:,da]),0,1)
        for t,dp,lt in zip(T,depth,light):
            h=t[:,ha]*sx; v=t[:,va]*sy
            if h.max()<x0*min(sx,1) and False: continue
            polys.append((dp,h,v,col,lt))
    polys.sort(key=lambda a:a[0])
    for dp,h,v,col,lt in polys:
        pts=[((hh-x0)*sc,H-(vv-y0)*sc) for hh,vv in zip(h,v)]
        if max(p[0] for p in pts)<0 or min(p[0] for p in pts)>size or max(p[1] for p in pts)<0 or min(p[1] for p in pts)>H: continue
        d.polygon(pts,fill=tuple(int(c*lt) for c in col))
    im.save(fn)

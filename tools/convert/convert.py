import sys,io,json,gzip,base64,re,math
sys.path.insert(0,'/tmp/z')
from bake import *
from PIL import Image

def load_prims(path):
    js,bn=load(path); out=[]
    for (ni,p,W,mi) in walk(js,bn):
        Rn=np.linalg.inv(W[:3,:3]).T
        for pr in js['meshes'][mi]['primitives']:
            at=pr['attributes']
            P=acc(js,bn,at['POSITION']).astype(np.float64); Pw=(np.c_[P,np.ones(len(P))]@W.T)[:,:3]
            if 'NORMAL' in at:
                N=acc(js,bn,at['NORMAL']).astype(np.float64)@Rn.T; N/=np.linalg.norm(N,axis=1)[:,None]+1e-12
            else: N=np.zeros_like(Pw)
            UV=acc(js,bn,at['TEXCOORD_0']).astype(np.float64) if 'TEXCOORD_0' in at else np.zeros((len(P),2))
            I=acc(js,bn,pr['indices']).ravel().astype(np.int64).reshape(-1,3)
            if np.linalg.det(W[:3,:3])<0: I=I[:,[0,2,1]]
            out.append(dict(path='/'.join(p),mat=pr['material'],matname=js['materials'][pr['material']]['name'],P=Pw,N=N,UV=UV,I=I))
    return js,bn,out

def fit_circle(Y,Z):
    A=np.c_[2*Y,2*Z,np.ones(len(Y))]; b=Y*Y+Z*Z
    s=np.linalg.lstsq(A,b,rcond=None)[0]; cy,cz=s[0],s[1]; r=math.sqrt(max(s[2]+cy*cy+cz*cz,1e-9)); return cy,cz,r

def rot_to(a,b):
    a=a/np.linalg.norm(a); b=b/np.linalg.norm(b); v=np.cross(a,b); c=float(a@b)
    if np.linalg.norm(v)<1e-9: return np.eye(3) if c>0 else -np.eye(3)*0+np.diag([1,-1,-1])
    K=np.array([[0,-v[2],v[1]],[v[2],0,-v[0]],[-v[1],v[0],0]]); return np.eye(3)+K+K@K*(1/(1+c))

def encode_prim(P,N,UV,I,mat):
    n=len(P); mn=P.min(0); mx=P.max(0); rg=np.where(mx-mn<1e-9,1,mx-mn)
    q=np.round((P-mn)/rg*65535).astype('<u2')
    nn=np.round(np.clip(N,-1,1)*127).astype('i1')
    umn=UV.min(0); umx=UV.max(0); ur=np.where(umx-umn<1e-9,1,umx-umn)
    qu=np.round((UV-umn)/ur*65535).astype('<u2')
    b=lambda a:base64.b64encode(a.tobytes()).decode()
    return dict(m=mat,n=n,P=b(q),N=b(nn),U=b(qu),I=b(I.ravel().astype('<u2')),mn=[round(float(x),5) for x in mn],mx=[round(float(x),5) for x in mx],umn=[round(float(x),6) for x in umn],umx=[round(float(x),6) for x in umx])

def split_emit(P,N,UV,I,mat,maxv=60000):
    """emit prim(s) from triangle list I over arrays; compact unused verts; split when >maxv"""
    out=[]; 
    if len(I)==0: return out
    # chunk triangles so unique verts <= maxv
    start=0; 
    while start<len(I):
        end=min(len(I),start+20000)
        while True:
            u=np.unique(I[start:end]); 
            if len(u)<=maxv or end-start<=3: break
            end=start+(end-start)//2
        sub=I[start:end]; u,inv=np.unique(sub,return_inverse=True)
        out.append(encode_prim(P[u],N[u],UV[u],inv.reshape(-1,3),mat)); start=end
    return out

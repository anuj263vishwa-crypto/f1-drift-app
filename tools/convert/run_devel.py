# Devel Sixteen 2022 (CC BY 4.0, xvirusxvirus50). Run:  F1_SCALE=100 python3 run_devel.py   (model is in 0.01-scaled units)
import sys,re,math,os; sys.path.insert(0,'/tmp/h'); sys.path.insert(0,'/tmp/n'); sys.path.insert(0,'/tmp/z')
os.environ.setdefault('F1_SCALE','100')
from convert2 import *
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
from scipy.spatial import cKDTree
SRC='/mnt/user-data/uploads/2022__devel__sixteen.glb'; OUT='/tmp/h/car'; os.makedirs(OUT,exist_ok=True)
HUB=np.array([0.353,0.695,0.746]); STM=re.compile(r'InteriorA_Material1|Carbon1_Material1|Base_Material1|Coloured_Material1')
# ---- steering wheel = connected components of the interior meshes that sit around the wheel hub (taken from the ORIGINAL mesh)
_,_,pr0=load_prims(SRC); sv=[]
for p in pr0:
    if not STM.search(p['matname']): continue
    P=p['P']; T=p['I']; key=np.round(P/1e-4).astype(np.int64); _,inv=np.unique(key,axis=0,return_inverse=True); inv=inv.ravel(); n=inv.max()+1
    e=np.vstack([T[:,[0,1]],T[:,[1,2]]]); a=inv[e[:,0]]; b=inv[e[:,1]]
    nc,lab=connected_components(coo_matrix((np.ones(len(a)),(a,b)),shape=(n,n)),directed=False); tl=lab[inv[T[:,0]]]
    for c in range(nc):
        m=tl==c; V=P[np.unique(T[m])]; mn=V.min(0); mx=V.max(0); ctr=(mn+mx)/2
        if np.linalg.norm(ctr-HUB)<0.21 and (mx-mn).max()<0.45 and ctr[2]<0.80: sv.append(V)
SV=np.vstack(sv); tree=cKDTree(SV); print('steering vertices',len(SV))
WH=re.compile(r'_DWheel_(Front|Rear)_([LR])'); CAL=re.compile(r'Calliper(?:Zone)?_(Front|Rear)_([LR])')
def isflat(p):
    V=p['P'][np.unique(p['I'])]
    if len(V)<60: return False
    c0=V.mean(0); w,e=np.linalg.eigh(np.cov((V-c0).T)); ext=math.sqrt(max(w[2],0))*3.46
    return w[0]/max(w[1],1e-12)<0.01 and ext>0.18 and abs(e[0,0])>0.9
def key(m): return ('f' if m.group(1)=='Front' else 'r')+('l' if m.group(2)=='L' else 'r')
def label(p,cent):
    n=len(cent); L=np.full(n,'body',dtype='<U6'); path=p['path']
    m=WH.search(path)
    if m: L[:]=key(m)+('.sp' if isflat(p) else '.t'); return L
    m=CAL.search(path)
    if m: L[:]=key(m)+'.st'; return L
    if STM.search(p['matname']): d,_=tree.query(cent); L[d<0.008]='sw'
    return L
cfg=dict(id='devel',name='DEVEL 16',title='DEVEL SIXTEEN 2022',fit_src=SRC,R=np.eye(3),label=label,
  lods=dict(hi=dict(body='/tmp/h/devel_bh.glb',wheel='/tmp/h/devel_wh.glb'),lo=dict(body='/tmp/n/out/devel_b.glb',wheel='/tmp/n/out/devel_w.glb')),
  isdisc=lambda p:True,exhaust=lambda sh:[[-0.217,round(0.67+sh,4),-2.55,0.24],[0.217,round(0.67+sh,4),-2.55,0.24]],
  eye=lambda s:[float(s['c'][0]),float(s['c'][1])+0.12,float(s['c'][2])-0.42],texmax={},tmax=1024)
o=build2(cfg); save2(o,f'{OUT}/car_devel.js')

import json,struct,numpy as np,sys
sys.path.insert(0,'/tmp/z')
from glbinfo import load
CT={5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32,5126:np.float32}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def acc(js,bn,i):
    a=js['accessors'][i]; bv=js['bufferViews'][a['bufferView']]
    dt=CT[a['componentType']]; n=NC[a['type']]; off=bv.get('byteOffset',0)+a.get('byteOffset',0)
    st=bv.get('byteStride')
    if st and st!=np.dtype(dt).itemsize*n:
        arr=np.frombuffer(bn,dtype=np.uint8,count=a['count']*st,offset=off).reshape(a['count'],st)[:,:np.dtype(dt).itemsize*n].copy().view(dt).reshape(a['count'],n)
    else:
        arr=np.frombuffer(bn,dtype=dt,count=a['count']*n,offset=off).reshape(a['count'],n)
    if a.get('normalized'):
        arr=arr.astype(np.float32)/ (np.iinfo(dt).max if np.issubdtype(dt,np.integer) else 1)
    return arr
def nmat(n):
    if 'matrix' in n: return np.array(n['matrix'],dtype=np.float64).reshape(4,4).T
    T=np.eye(4); 
    if 'scale' in n: S=np.diag(list(n['scale'])+[1]); 
    else: S=np.eye(4)
    R=np.eye(4)
    if 'rotation' in n:
        x,y,z,w=n['rotation']; R[:3,:3]=[[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]]
    if 'translation' in n: T[:3,3]=n['translation']
    return T@R@S
def walk(js,bn):
    """yield (node_index, path_names, world_matrix, prim list) for mesh nodes"""
    N=js['nodes']; out=[]
    def rec(i,M,path):
        n=N[i]; W=M@nmat(n); p=path+[n.get('name','')]
        if 'mesh' in n: out.append((i,p,W,n['mesh']))
        for c in n.get('children',[]): rec(c,W,p)
    for r in js['scenes'][js.get('scene',0)]['nodes']: rec(r,np.eye(4),[])
    return out

import sys,json,gzip,base64,re; sys.path.insert(0,'/tmp/z')
import numpy as np
from rtri import render
def dec(p):
    n=p['n']; D=lambda s,dt:np.frombuffer(base64.b64decode(s),dtype=dt)
    P=D(p['P'],'<u2').reshape(n,3)/65535*(np.array(p['mx'])-np.array(p['mn']))+np.array(p['mn'])
    I=D(p['I'],'<u2').reshape(-1,3).astype(np.int64); return P,I
def load(fn):
    s=open(fn).read(); b=re.search(r'="([A-Za-z0-9+/=]+)"',s).group(1); return json.loads(gzip.decompress(base64.b64decode(b)))
def items_of(d,steer=0.0,spin=0.0):
    out=[]
    for p in d['g']['body']:
        P,I=dec(p); out.append(dict(P=P,I=I,mat=p['m']))
    for k,w in d['g']['wheels'].items():
        c=np.array(w['c'])
        for grp in ('sp','st'):
            for p in w[grp]:
                P,I=dec(p)
                if grp=='sp' and spin:   # spin about X
                    cs,sn=np.cos(spin),np.sin(spin); y=P[:,1]*cs-P[:,2]*sn; z=P[:,1]*sn+P[:,2]*cs; P=np.c_[P[:,0],y,z]
                out.append(dict(P=P+c,I=I,mat=p['m'],tag=k+grp))
    if 'sw' in d['g']:
        sw=d['g']['sw']; B=np.array(sw['B']).reshape(3,3).T if False else np.array(sw['B']).reshape(3,3)  # stored as B.T.ravel -> rows = e1,e2,n
        Bm=np.array(sw['B']).reshape(3,3).T   # columns e1,e2,n
        for p in sw['prims']:
            P,I=dec(p); 
            if steer:
                n=Bm[:,2]; c_,s_=np.cos(steer),np.sin(steer); loc=P  # rotate about local z
                P=np.c_[loc[:,0]*c_-loc[:,1]*s_,loc[:,0]*s_+loc[:,1]*c_,loc[:,2]]
            out.append(dict(P=P@Bm.T+np.array(sw['c']),I=I,mat=p['m'],tag='sw'))
    return out
PAL=[(230,60,60),(60,200,60),(70,120,255),(240,200,40),(200,80,230),(60,220,220),(250,140,40),(170,170,170),(255,120,160),(120,255,160)]

import sys; sys.path.insert(0,'/tmp/z')
from convert import *
def pipes(src,R,mats,depth=0.12,axis_rear=-1):
    js,bn,pr=load_prims(src); V=[]
    for p in pr:
        if p['matname'] in mats: V.append(p['P'][np.unique(p['I'])]@np.array(R).T)
    V=np.vstack(V); zr=V[:,2].min(); S=V[V[:,2]<zr+depth]
    xs=np.sort(S[:,0]); cl=[[xs[0]]]
    for x in xs[1:]:
        (cl[-1].append(x) if x-cl[-1][-1]<0.06 else cl.append([x]))
    print('rear-most z %.3f, verts %d'%(zr,len(S)))
    for c in cl:
        m=(S[:,0]>=min(c)-1e-6)&(S[:,0]<=max(c)+1e-6); Q=S[m]; print('  cluster n=%d x[%.3f..%.3f] y[%.3f..%.3f] z[%.3f..%.3f] -> centre (%.3f,%.3f) diam~%.3f'%(len(Q),Q[:,0].min(),Q[:,0].max(),Q[:,1].min(),Q[:,1].max(),Q[:,2].min(),Q[:,2].max(),(Q[:,0].min()+Q[:,0].max())/2,(Q[:,1].min()+Q[:,1].max())/2,max(Q[:,0].max()-Q[:,0].min(),Q[:,1].max()-Q[:,1].min())))
if __name__=='__main__':
    import json; pipes(sys.argv[1],eval(sys.argv[2]),sys.argv[3].split(','),float(sys.argv[4]) if len(sys.argv)>4 else .12)

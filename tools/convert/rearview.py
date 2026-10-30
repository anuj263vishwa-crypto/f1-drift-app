import sys; sys.path.insert(0,'/tmp/z')
from rtri import *
def rear(src,R,tag,hi,zmax=-1.7,box=(-1.0,1.0,0.1,0.9),ymax=1.0,flip=False):
    js,items=tris(src); Rn=np.array(R); sel=[]
    for it in items:
        P=it['P']@Rn.T; T=P[it['I']]; c=T.mean(1); m=(c[:,2]<zmax)&(c[:,1]<ymax)
        sel.append(dict(path=it['path'],mat=it['mat'],P=P,I=it['I'][m],nm=js['materials'][it['mat']]['name']))
    pal={}; 
    def col(it):
        n=it['nm']
        return (255,200,0) if n in hi else (150,150,160)
    render(sel,(0,1,2,-1 if True else 1,1,-1),box,f'/tmp/n/{tag}_rear.png',size=1000,colfn=col)
if __name__=='__main__': rear(sys.argv[1],eval(sys.argv[2]),sys.argv[3],sys.argv[4].split(','),float(sys.argv[5]))

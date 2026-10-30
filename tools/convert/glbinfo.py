import json,struct,sys
def load(p):
    b=open(p,'rb').read(); magic,ver,ln=struct.unpack('<4sII',b[:12]); off=12; js=None; bin_=None
    while off<ln:
        cl,ct=struct.unpack('<I4s',b[off:off+8]); d=b[off+8:off+8+cl]
        if ct==b'JSON': js=json.loads(d)
        elif ct==b'BIN\0': bin_=d
        off+=8+cl+(0)
    return js,bin_
if __name__=='__main__':
    js,bn=load(sys.argv[1])
    print({k:(len(v) if isinstance(v,list) else v) for k,v in js.items() if k!='asset'})
    print(js.get('asset'), js.get('extensionsUsed'))
    nodes=js['nodes']; 
    sc=js['scenes'][js.get('scene',0)]['nodes']
    def cnt(i):
        n=nodes[i]; c=1 if 'mesh' in n else 0
        return c+sum(cnt(j) for j in n.get('children',[]))
    def pr(i,d=0,maxd=int(sys.argv[2]) if len(sys.argv)>2 else 4):
        n=nodes[i]; m=n.get('mesh'); 
        info=''
        if m is not None:
            prs=js['meshes'][m]['primitives']
            vc=sum(js['accessors'][p['attributes']['POSITION']]['count'] for p in prs)
            info=f' mesh#{m} prims={len(prs)} verts={vc}'
        tr={k:[round(x,3) for x in n[k]] for k in ('translation','rotation','scale') if k in n}
        print('  '*d+f'[{i}] {n.get("name")} {tr if tr else ""} meshes_in_subtree={cnt(i)}{info}')
        if d<maxd:
            for j in n.get('children',[]): pr(j,d+1,maxd)
    for r in sc: pr(r)

import sys,re; sys.path.insert(0,'/tmp/h'); sys.path.insert(0,'/tmp/n'); sys.path.insert(0,'/tmp/z')
from convert2 import *
from newcars import wheel_info, make_label
I3=np.eye(3); U='/mnt/user-data/uploads/'; OUT='/tmp/h/car'
import os; os.makedirs(OUT,exist_ok=True)
def L(k,fit,b_hi,w_hi,b_lo,w_lo): return dict(hi=dict(body=b_hi,wheel=w_hi),lo=dict(body=b_lo,wheel=w_lo))
def rb22():
    def label(p,cent):
        n=len(cent); Lb=np.full(n,'body',dtype='<U6'); path=p['path']
        m=re.search(r'WHEEL_(LF|LR|RF|RR)_',path)
        if m: Lb[:]={'LF':'fl','LR':'rl','RF':'fr','RR':'rr'}[m.group(1)]+('.t' if 'TYRE_' in path else '.sp'); return Lb
        m=re.search(r'/disc_(fl|bl|fr|br)',path)
        if m: Lb[:]={'fl':'fl','bl':'rl','fr':'fr','br':'rr'}[m.group(1)]+'.sp'; return Lb
        m=re.search(r'/hub_caliper_(fl|bl|fr|br)',path)
        if m: Lb[:]={'fl':'fl','bl':'rl','fr':'fr','br':'rr'}[m.group(1)]+'.st'; return Lb
        if '/STEER_HR' in path: Lb[:]='sw'
        return Lb
    return dict(id='rb22',name='RB22 2026',title='RED BULL RACING RB22',fit_src='/tmp/z/2026-red-bull-racing-rb22/source/2026_red_bull_racing_rb22.glb',R=I3,label=label,
      lods=dict(hi=dict(body='/tmp/h/rb22_bh.glb',wheel='/tmp/h/rb22_wh.glb'),lo=dict(body='/tmp/z/out/rb22_b.glb',wheel='/tmp/z/out/rb22_w.glb')),
      isdisc=lambda p:False,exhaust=lambda sh:[[0.0,round(0.566+sh,4),-1.588,0.106]],eye=lambda s:[float(s['c'][0]),float(s['c'][1])+0.12,float(s['c'][2])-0.42],texmax={},tmax=1024)
def gt3():
    WH={'MI_Mercedes_AMG_GT3_Evo_Tyre_Inst':'.t','MI_Mercedes_AMG_GT3_Evo_Rim_Inst':'.sp','MI_Mercedes_AMG_GT3_Evo_Brake_Disc_Inst':'.sp','MI_Mercedes_AMG_GT3_Evo_Caliper_Inst':'.st'}
    SW={'MI_Mercedes_AMG_GT3_Evo_Steering_Wheel_Inst','MI_Carbon_Fiber_Tile_Tow_Normalmap_Steering_Wheel'}
    def label(p,cent):
        n=len(cent); Lb=np.full(n,'body',dtype='<U6'); nm=p['matname']
        if nm in WH:
            fr=cent[:,2]>0.09; lf=cent[:,0]>0; key=np.where(fr,np.where(lf,'fl','fr'),np.where(lf,'rl','rr'))
            return np.char.add(key.astype('<U2'),WH[nm]).astype('<U6')
        if nm in SW: Lb[:]='sw'
        return Lb
    return dict(id='gt3',name='AMG GT3',title='MERCEDES-AMG GT3 RED BULL',fit_src='/tmp/z/mercedes-amg-gt3-red-bull-racing/source/mercedes_benz_amg_gt3_red_bull.glb',R=np.array([[0,0,-1],[0,1,0],[1,0,0]],float),label=label,
      lods=dict(hi=dict(body='/tmp/h/gt3_bh.glb',wheel='/tmp/h/gt3_wh.glb'),lo=dict(body='/tmp/z/out/gt3_b.glb',wheel='/tmp/z/out/gt3_w2.glb')),
      isdisc=lambda p:'Brake_Disc' in p['matname'],exhaust=lambda sh:[[0.0,round(0.34+sh,4),-1.68,0.10]],eye=lambda s:[float(s['c'][0]),float(s['c'][1])+0.12,float(s['c'][2])-0.42],texmax={},tmax=1024)
def newcar(k,name,title,glb,tyre,spin,calip,drop,sw,exhaust,disc):
    wi=wheel_info(glb,I3,tyre); label=make_label(wi,set(tyre),set(spin),set(calip),set(drop),dict(mats=set(sw['mats']),box=sw['box']))
    return dict(id=k,name=name,title=title,fit_src=glb,R=I3,label=label,lods=dict(hi=dict(body=f'/tmp/h/{k}_bh.glb',wheel=f'/tmp/h/{k}_wh.glb'),lo=dict(body=f'/tmp/n/out/{k}_b.glb',wheel=f'/tmp/n/out/{k}_w.glb')),
      isdisc=lambda p,disc=disc:p['matname'] in disc,exhaust=exhaust,eye=lambda s:[float(s['c'][0]),float(s['c'][1])+0.12,float(s['c'][2])-0.42],texmax={},tmax=1024)
CFG={
 'rb22':rb22,'gt3':gt3,
 'jesko':lambda:newcar('jesko','JESKO','KOENIGSEGG JESKO',U+'2019__koenigsegg_jesko.glb',['EXT_WHEEL'],['material_47','rim1','rim_chrome','rim_gold','EXT_Disc'],['MultiMat_5_Slot_1','CalliperBadgeBMtl'],[],
   dict(mats=['alca_steer','int_steer','steer_center','Carbon1M','Material_3','lcd_cifra'],box=[0.12,0.52,0.56,0.9,0.36,0.54]),lambda sh:[[-0.085,0.525+sh,-2.25,0.12],[0.085,0.525+sh,-2.25,0.12]],['EXT_Disc']),
 'fxxk':lambda:newcar('fxxk','FXX-K EVO','FERRARI FXX-K EVO',U+'2017__ferrari_fxx-k_evo_special_thanks_for_600.glb',['TYRE'],['EXT_Rim_Base','EXT_DISK_BRAKE'],['EXT_Claw'],['EXT_Rim_Blur'],
   dict(mats=['steer_ao','interior','steer_alc','Carbon2M'],box=[0.17,0.5,0.58,0.84,0.38,0.56]),lambda sh:[[-0.68,0.345+sh,-2.09,0.12],[0.68,0.345+sh,-2.09,0.12]],['EXT_DISK_BRAKE']),
 'furai':lambda:newcar('furai','FURAI','MAZDA FURAI',U+'2008__mazda_furai__1_.glb',['tyre_fx'],['material_42','inner_rim','outer_rim','wheel_black','rotor','material'],['caliper'],[],
   dict(mats=['Material_74','buttons','display','badge_cp','green','greeon','Material_75'],box=[-0.38,0.0,0.36,0.64,0.62,0.76]),lambda sh:[[0.0,0.21+sh,-2.1,0.1]],['rotor']),
 'apollo':lambda:newcar('apollo','APOLLO IE','APOLLO INTENSA EMOZIONE',U+'2018__apollo_intensa_emozione.glb',['EXT_Tyre'],['Apollo_IntensaEmozione_2019_Wh*','EXT_Rim','EXT_Disc'],['Brake_Caliper','EXT_caliper_AT'],['EXT_Rim_Blur'],
   dict(mats=['Apollo_IntensaEmozione_2019InteriorA_Material','leather_color','krutilki_metal','krutilki_steer','hud_leds','stro4ka','Apollo_IntensaEmozione_2019Carbon1M_Material','bronze'],box=[-0.5,-0.08,0.58,0.85,0.36,0.56]),
   lambda sh:[[-0.09,0.59+sh,-2.2,0.1],[0.09,0.59+sh,-2.2,0.1],[0.0,0.47+sh,-2.2,0.1]],['EXT_Disc']),
}
k=sys.argv[1]; o=build2(CFG[k]()); save2(o,f'{OUT}/car_{k}.js')
import json; json.dump({n:{kk:v for kk,v in m.items()} for n,m in enumerate(o['mats'])},open(f'{OUT}/{k}_mats.json','w'))

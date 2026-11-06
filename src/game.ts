import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PointerEventTypes} from '@babylonjs/core/Events/pointerEvents';
import {planWorkerArrivalPath} from './navigation';

export class OfficeGame {
 engine:Engine; scene:Scene; camera:ArcRotateCamera; floor:any; desks:TransformNode[]=[]; workers:TransformNode[]=[]; workerArms:Array<[any,any]>=[]; workerLegs:Array<[any,any]>=[]; workerWalkStartedAt:number[]=[]; workerWalkPaths:Vector3[][]=[]; workerWalkPathLengths:number[][]=[]; workerWalkPathTotalLengths:number[]=[]; materials:Record<string,StandardMaterial>={}; placing=false; onFloorTap?:(x:number,z:number)=>boolean;
 constructor(canvas:HTMLCanvasElement){
  this.engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,adaptToDeviceRatio:true});
  this.scene=new Scene(this.engine);this.scene.clearColor=new Color4(.72,.83,.91,1);
  this.camera=new ArcRotateCamera('camera',Math.PI/4,1.05,15,new Vector3(0,0,0),this.scene);
  this.camera.lowerRadiusLimit=10;this.camera.upperRadiusLimit=22;this.camera.lowerBetaLimit=.7;this.camera.upperBetaLimit=1.35;this.camera.wheelPrecision=45;this.camera.panningSensibility=90;
  const syncCameraState=()=>{for(const [name,value] of [['alpha',this.camera.alpha.toFixed(3)],['beta',this.camera.beta.toFixed(3)],['radius',this.camera.radius.toFixed(2)]] as const){const key='data-camera-'+name;if(canvas.getAttribute(key)!==value)canvas.setAttribute(key,value);}};
  canvas.setAttribute('data-camera-beta-min','0.7');canvas.setAttribute('data-camera-beta-max','1.35');canvas.setAttribute('data-camera-radius-min','10');canvas.setAttribute('data-camera-radius-max','22');
  this.camera.onViewMatrixChangedObservable.add(syncCameraState);syncCameraState();
  this.camera.attachControl(canvas,true);
  new HemisphericLight('ambient',new Vector3(0,1,0),this.scene).intensity=.85;
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.4),this.scene);sun.position=new Vector3(8,12,-8);sun.intensity=.55;
  const mat=(name:string,c:Color3)=>this.getMaterial(name,c);
  const ground=MeshBuilder.CreateGround('ground',{width:22,height:18},this.scene);ground.material=mat('groundmat',new Color3(.55,.62,.64));
  this.floor=MeshBuilder.CreateGround('office-floor',{width:10,height:8},this.scene);this.floor.position.y=.04;this.floor.material=mat('tile',new Color3(.72,.78,.83));
  const wall=mat('wall',new Color3(.82,.87,.9));
  const back=MeshBuilder.CreateBox('back-wall',{width:10,height:2.3,depth:.18},this.scene);back.position.set(0,1.15,-4);back.material=wall;
  const side=MeshBuilder.CreateBox('side-wall',{width:.18,height:2.3,depth:8},this.scene);side.position.set(-5,1.15,0);side.material=wall;
  const glass=mat('panoramic-glass',new Color3(.24,.55,.72));glass.alpha=.72;
  for(const x of [-3.2,-1.1,1.1]){const pane=MeshBuilder.CreateBox('window-pane',{width:1.65,height:1.25,depth:.06},this.scene);pane.position.set(x,1.65,-3.88);pane.material=glass;}
  const rug=MeshBuilder.CreateGround('rug',{width:4.2,height:2.6},this.scene);rug.position.set(0,.075,1.45);rug.material=mat('rugmat',new Color3(.16,.29,.43));
  const leaf=mat('plant-leaf',new Color3(.18,.42,.29)),potMat=mat('planter',new Color3(.76,.65,.48));
  for(const [x,z] of [[-4,3],[4,-2]]){const pot=MeshBuilder.CreateCylinder('pot',{height:.55,diameter:.55},this.scene);pot.position.set(x,.34,z);pot.material=potMat;for(let i=0;i<5;i++){const l=MeshBuilder.CreateSphere('leaf',{diameter:.48,segments:6},this.scene);l.scaling.set(.65,1.6,.65);l.position.set(x+Math.cos(i*1.25)*.22,.82,z+Math.sin(i*1.25)*.22);l.material=leaf;}}
  this.addDesk(-2,-1);this.addDesk(1,-1);
  this.scene.onPointerObservable.add(pi=>{if(pi.type===PointerEventTypes.POINTERPICK&&this.placing){const pick=this.scene.pick(this.scene.pointerX,this.scene.pointerY,m=>m===this.floor);if(pick?.hit&&pick.pickedPoint){const x=Math.round(pick.pickedPoint.x),z=Math.round(pick.pickedPoint.z);if(this.onFloorTap?.(x,z))this.addDesk(x,z);}}});
  const frameDurations=new Array<number>(120).fill(0);
  let frameSampleCount=0,frameSampleCursor=0,frameStartedAt=0;
  this.scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now();
   frameStartedAt=now;
   const time=now*.001;
   let walkingCount=0;
   this.workers.forEach((worker,index)=>{
    worker.position.y=.08+Math.sin(time*2+index*.8)*.018;
    const elapsed=(now-this.workerWalkStartedAt[index])/1000;
    const progress=Math.min(1,Math.max(0,elapsed/1.6));
    if(progress<1){
     walkingCount++;
     const stride=Math.sin(time*10+index*.9);
     const eased=progress*progress*(3-2*progress);
     const path=this.workerWalkPaths[index];
     const lengths=this.workerWalkPathLengths[index];
     const totalLength=this.workerWalkPathTotalLengths[index];
     let remaining=eased*totalLength;
     let segment=0;
     while(segment<lengths.length-1&&remaining>lengths[segment]){remaining-=lengths[segment];segment++;}
     const from=path[segment]??Vector3.Zero(),to=path[segment+1]??from;
     const segmentProgress=lengths[segment]>0?Math.min(1,remaining/lengths[segment]):1;
     Vector3.LerpToRef(from,to,segmentProgress,worker.position);
     const legs=this.workerLegs[index],arms=this.workerArms[index];
     if(legs){legs[0].rotation.x=stride*.38;legs[1].rotation.x=-stride*.38;legs[0].position.z=.48+stride*.08;legs[1].position.z=.48-stride*.08;}
     if(arms){arms[0].rotation.x=Math.PI/2-stride*.28;arms[1].rotation.x=Math.PI/2+stride*.28;}
     return;
    }
    worker.position.x=0;worker.position.z=0;
    const legs=this.workerLegs[index],arms=this.workerArms[index];
    if(legs){legs[0].rotation.x=Math.PI/2;legs[1].rotation.x=Math.PI/2;legs[0].position.z=.48;legs[1].position.z=.48;}
    if(arms){
     const leftTap=Math.max(0,Math.sin(time*8+index*1.7));
     const rightTap=Math.max(0,Math.sin(time*8+index*1.7+Math.PI));
     arms[0].rotation.x=Math.PI/2;arms[1].rotation.x=Math.PI/2;
     arms[0].rotation.z=-.04-leftTap*.14;arms[1].rotation.z=.04+rightTap*.14;
     arms[0].position.y=1.02+leftTap*.045;arms[1].position.y=1.02+rightTap*.045;
    }
   });
   this.engine.getRenderingCanvas()?.setAttribute('data-walking-worker-count',String(walkingCount));
  });
  this.scene.onAfterRenderObservable.add(()=>{
   const duration=Math.max(0,performance.now()-frameStartedAt);
   frameDurations[frameSampleCursor]=duration;
   frameSampleCursor=(frameSampleCursor+1)%frameDurations.length;
   frameSampleCount=Math.min(frameSampleCount+1,frameDurations.length);
   if(frameSampleCount<frameDurations.length||frameSampleCursor!==0)return;
   const sorted=frameDurations.slice().sort((a,b)=>a-b);
   const average=frameDurations.reduce((sum,value)=>sum+value,0)/frameDurations.length;
   const canvas=this.engine.getRenderingCanvas();
   canvas?.setAttribute('data-frame-cpu-ms-avg',average.toFixed(3));
   canvas?.setAttribute('data-frame-cpu-ms-p95',sorted[Math.floor((sorted.length-1)*.95)].toFixed(3));
   canvas?.setAttribute('data-frame-cpu-ms-max',sorted[sorted.length-1].toFixed(3));
   canvas?.setAttribute('data-scene-mesh-count',String(this.scene.meshes.length));
   canvas?.setAttribute('data-scene-active-mesh-count',String(this.scene.getActiveMeshes().length));
   canvas?.setAttribute('data-scene-material-count',String(this.scene.materials.length));
   canvas?.setAttribute('data-scene-light-count',String(this.scene.lights.length));
  });
  this.engine.runRenderLoop(()=>this.scene.render());window.addEventListener('resize',()=>this.engine.resize());
 }
 addDesk(x:number,z:number){
  const root=new TransformNode('desk-root',this.scene);root.position.set(x,.08,z);
  const wood=this.getMaterial('deskwood',new Color3(.88,.9,.91));
  const top=MeshBuilder.CreateBox('desk-top',{width:1.5,height:.13,depth:.75},this.scene);top.parent=root;top.position.y=.85;top.material=wood;
  for(const dx of [-.62,.62])for(const dz of [-.25,.25]){const leg=MeshBuilder.CreateBox('desk-leg',{width:.08,height:.82,depth:.08},this.scene);leg.parent=root;leg.position.set(dx,.41,dz);leg.material=wood;}
  const chair=this.getMaterial('chair',new Color3(.12,.24,.38));
  const seat=MeshBuilder.CreateBox('chair-seat',{width:.62,height:.13,depth:.62},this.scene);seat.parent=root;seat.position.set(0,.53,.72);seat.material=chair;
  const backrest=MeshBuilder.CreateBox('chair-back',{width:.62,height:.62,depth:.12},this.scene);backrest.parent=root;backrest.position.set(0,.88,1.0);backrest.material=chair;
  const monitor=MeshBuilder.CreateBox('monitor',{width:.65,height:.42,depth:.07},this.scene);monitor.parent=root;monitor.position.set(0,1.2,-.12);const screen=this.getMaterial('screen',new Color3(.035,.07,.12));monitor.material=screen;
  this.desks.push(root);return root;
 }
 syncWorkers(count:number,animateNewWorkers=true){
  const target=Math.max(0,Math.min(Math.floor(count),this.desks.length));
  while(this.workers.length>target){const worker=this.workers.pop()!;this.workerArms.pop();this.workerLegs.pop();this.workerWalkStartedAt.pop();this.workerWalkPaths.pop();this.workerWalkPathLengths.pop();this.workerWalkPathTotalLengths.pop();worker.dispose();}
  while(this.workers.length<target){
   const index=this.workers.length,desk=this.desks[index],worker=new TransformNode('worker-'+(index+1),this.scene);
   worker.parent=desk;
   const fixedObstacles=[{x:-4,z:3,halfWidth:.48,halfDepth:.48},{x:4,z:-2,halfWidth:.48,halfDepth:.48},{x:-5,z:0,halfWidth:.09,halfDepth:4},{x:0,z:-4,halfWidth:5,halfDepth:.09}];
   if(animateNewWorkers){
    this.workers.forEach((existing,existingIndex)=>{
     if(performance.now()-this.workerWalkStartedAt[existingIndex]>=1600)return;
     const existingDesk=this.desks[existingIndex],existingPath=this.workerWalkPaths[existingIndex]??[];
     for(let segment=1;segment<existingPath.length;segment++){
      const from=existingPath[segment-1],to=existingPath[segment];
      const dx=to.x-from.x,dz=to.z-from.z;
      fixedObstacles.push({
       x:existingDesk.position.x+(from.x+to.x)/2,
       z:existingDesk.position.z+(from.z+to.z)/2,
       halfWidth:Math.abs(dx)/2+.22,
       halfDepth:Math.abs(dz)/2+.22
      });
     }
    });
   }
   let path: Array<{x:number;y:number;z:number}>=[Vector3.Zero()];
   if(animateNewWorkers){
    for(const entranceOffset of [0,-.8,.8,-1.6,1.6,-2.4,2.4]){
     const candidate=planWorkerArrivalPath(
      {x:desk.position.x,z:desk.position.z},
      this.desks.map(item=>({x:item.position.x,z:item.position.z})),
      fixedObstacles,
      entranceOffset
     );
     if(candidate.length>1){path=candidate;break;}
    }
   }
   const vectorPath=path.map(point=>new Vector3(point.x,point.y,point.z));
   const segmentLengths=vectorPath.slice(1).map((point,segment)=>Vector3.Distance(vectorPath[segment],point));
   this.workerWalkPaths.push(vectorPath);
   this.workerWalkPathLengths.push(segmentLengths);
   this.workerWalkPathTotalLengths.push(segmentLengths.reduce((sum,length)=>sum+length,0));
   worker.position.copyFrom(vectorPath[0]);this.workerWalkStartedAt.push(performance.now()-(animateNewWorkers?0:1600));
   const skin=this.getMaterial('worker-skin',new Color3(.78,.55,.39));
   const shirtColors=[new Color3(.16,.48,.72),new Color3(.22,.58,.43),new Color3(.62,.36,.68),new Color3(.78,.48,.2)];
   const shirt=this.getMaterial('worker-shirt-'+(index%shirtColors.length),shirtColors[index%shirtColors.length]);
   const hair=this.getMaterial('worker-hair',new Color3(.12,.1,.1));
   const trousers=this.getMaterial('worker-trousers',new Color3(.12,.19,.27));
   const shoes=this.getMaterial('worker-shoes',new Color3(.055,.065,.075));
   const torso=MeshBuilder.CreateCylinder('worker-torso-'+index,{height:.48,diameterTop:.34,diameterBottom:.42,tessellation:8},this.scene);torso.parent=worker;torso.position.set(0,1.03,.65);torso.material=shirt;
   const head=MeshBuilder.CreateSphere('worker-head-'+index,{diameter:.34,segments:10},this.scene);head.parent=worker;head.position.set(0,1.43,.55);head.material=skin;
   const hairCap=MeshBuilder.CreateSphere('worker-hair-'+index,{diameter:.35,segments:8},this.scene);hairCap.parent=worker;hairCap.scaling.y=.48;hairCap.position.set(0,1.57,.55);hairCap.material=hair;
   // Seated legs: thighs extend toward the desk, with lower legs and shoes below the desktop.
   const thighs:any[]=[];
   for(const side of [-1,1]){
    const thigh=MeshBuilder.CreateCapsule('worker-thigh-'+index+'-'+side,{height:.48,radius:.105,tessellation:6},this.scene);thigh.parent=worker;thigh.rotation.x=0;thigh.position.set(side*.13,.69,.48);thigh.material=trousers;thighs.push(thigh);
    const shin=MeshBuilder.CreateCapsule('worker-shin-'+index+'-'+side,{height:.42,radius:.078,tessellation:6},this.scene);shin.parent=worker;shin.position.set(side*.13,.43,.24);shin.material=trousers;
    const shoe=MeshBuilder.CreateBox('worker-shoe-'+index+'-'+side,{width:.19,height:.11,depth:.3},this.scene);shoe.parent=worker;shoe.position.set(side*.13,.24,.06);shoe.material=shoes;
   }
   const arms:any[]=[];
   for(const side of [-1,1]){
    const arm=MeshBuilder.CreateCapsule('worker-arm-'+index+'-'+side,{height:.48,radius:.075,tessellation:6},this.scene);arm.parent=worker;arm.rotation.x=Math.PI/2;arm.position.set(side*.22,1.05,.35);arm.material=shirt;arms.push(arm);
   }
   this.workerArms.push([arms[0],arms[1]]);
   this.workerLegs.push([thighs[0],thighs[1]]);
   this.workers.push(worker);
  }
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-model-count',String(this.workers.length));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-arrival-waypoint-counts',this.workerWalkPaths.map(path=>String(path.length)).join(','));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-leg-mesh-count',String(this.workers.length*6));
  this.engine.getRenderingCanvas()?.setAttribute('data-scene-material-count',String(this.scene.materials.length));
 }
 getMaterial(name:string,color:Color3){
  const existing=this.materials[name];
  if(existing)return existing;
  const material=new StandardMaterial(name,this.scene);
  material.diffuseColor=color;
  this.materials[name]=material;
  return material;
 }
}
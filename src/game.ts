import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {PointLight} from '@babylonjs/core/Lights/pointLight';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PointerEventTypes} from '@babylonjs/core/Events/pointerEvents';
import {planWorkerArrivalPath} from './navigation';

export class OfficeGame {
 engine:Engine; scene:Scene; camera:ArcRotateCamera; floor:any; desks:TransformNode[]=[]; workers:TransformNode[]=[]; workerArms:Array<[any,any]>=[]; workerHeads:any[]=[]; workerLegs:Array<[any,any]>=[]; workerShins:Array<[any,any]>=[]; workerWalkStartedAt:number[]=[]; workerWalkPaths:Vector3[][]=[]; workerWalkPathLengths:number[][]=[]; workerWalkPathTotalLengths:number[]=[]; materials:Record<string,StandardMaterial>={}; placing=false; onFloorTap?:(x:number,z:number)=>boolean;
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
  const right=MeshBuilder.CreateBox('right-wall',{width:.18,height:2.3,depth:8},this.scene);right.position.set(5,1.15,0);right.material=wall;
  // The front wall is split around a wide, permanently open entrance so arrival paths stay unobstructed.
  const frontLeft=MeshBuilder.CreateBox('front-wall-left',{width:3.75,height:2.3,depth:.18},this.scene);frontLeft.position.set(-3.125,1.15,4);frontLeft.material=wall;
  const frontRight=MeshBuilder.CreateBox('front-wall-right',{width:3.75,height:2.3,depth:.18},this.scene);frontRight.position.set(3.125,1.15,4);frontRight.material=wall;
  const entranceHeader=MeshBuilder.CreateBox('entrance-header',{width:2.5,height:.28,depth:.24},this.scene);entranceHeader.position.set(0,2.16,4);entranceHeader.material=wall;
  const trim=mat('architectural-trim',new Color3(.34,.43,.51));
  for(const x of [-1.25,1.25]){const jamb=MeshBuilder.CreateBox('entrance-jamb',{width:.09,height:2.05,depth:.25},this.scene);jamb.position.set(x,1.025,4);jamb.material=trim;}
  const threshold=MeshBuilder.CreateBox('entrance-threshold',{width:2.5,height:.055,depth:.32},this.scene);threshold.position.set(0,.085,4);threshold.material=trim;
  const glass=mat('panoramic-glass',new Color3(.24,.55,.72));glass.alpha=.72;
  const windowFrame=mat('window-frame',new Color3(.34,.43,.51));
  for(const x of [-3.2,-1.1,1.1]){
   const pane=MeshBuilder.CreateBox('window-pane',{width:1.65,height:1.25,depth:.06},this.scene);pane.position.set(x,1.65,-3.88);pane.material=glass;
   for(const dx of [-.86,.86]){const mullion=MeshBuilder.CreateBox('window-mullion',{width:.055,height:1.34,depth:.09},this.scene);mullion.position.set(x+dx,1.65,-3.9);mullion.material=windowFrame;}
   const sill=MeshBuilder.CreateBox('window-sill',{width:1.82,height:.09,depth:.18},this.scene);sill.position.set(x,1.0,-3.88);sill.material=trim;
  }
  const baseboard=mat('baseboard',new Color3(.58,.65,.7));
  for(const [name,width,depth,x,z] of [['back-baseboard',9.7,.07,0,-3.87],['left-baseboard',.07,7.7,-4.87,0],['right-baseboard',.07,7.7,4.87,0]] as const){
   const board=MeshBuilder.CreateBox(name,{width,height:.12,depth},this.scene);board.position.set(x,.16,z);board.material=baseboard;
  }
  const entranceSign=MeshBuilder.CreateBox('entrance-sign',{width:1.15,height:.24,depth:.06},this.scene);entranceSign.position.set(0,2.32,3.82);entranceSign.material=trim;
  // A simple three-bar emblem gives the entrance sign a readable focal point without text or external assets.
  const emblem=mat('entrance-emblem',new Color3(.82,.68,.42));
  for(const [index,height] of [.09,.15,.12].entries()){
   const bar=MeshBuilder.CreateBox('sign-emblem-bar',{width:.07,height,depth:.025},this.scene);bar.position.set((index-1)*.16,2.32,3.775);bar.material=emblem;
  }
  // Keep the entry mat nearly flush with the floor so it cannot obstruct worker arrival paths.
  const entryMat=MeshBuilder.CreateGround('entry-mat',{width:1.85,height:.62},this.scene);entryMat.position.set(0,.078,3.42);entryMat.material=mat('entry-mat-fabric',new Color3(.19,.27,.34));
  const entryMatTrim=mat('entry-mat-trim',new Color3(.72,.61,.43));
  for(const [name,width,depth,x,z] of [
   ['entry-mat-front',1.85,.035,0,3.11],['entry-mat-back',1.85,.035,0,3.73],
   ['entry-mat-left',.035,.62,-.91,3.42],['entry-mat-right',.035,.62,.91,3.42]
  ] as const){const edge=MeshBuilder.CreateBox(name,{width,height:.018,depth},this.scene);edge.position.set(x,.09,z);edge.material=entryMatTrim;}
  const entryMatStripe=MeshBuilder.CreateBox('entry-mat-stripe',{width:.055,height:.018,depth:.42},this.scene);entryMatStripe.position.set(0,.09,3.42);entryMatStripe.material=entryMatTrim;
  canvas.setAttribute('data-office-entry-detail-count','9');
  // Compact storage and wall accents add office identity without intruding into worker routes.
  const bookcaseMat=mat('bookcase-wood',new Color3(.43,.32,.24));
  const bookcase=MeshBuilder.CreateBox('office-bookcase',{width:.48,height:.92,depth:1.65},this.scene);bookcase.position.set(4.48,.54,-.55);bookcase.material=bookcaseMat;
  const shelfMat=mat('bookcase-shelf',new Color3(.66,.53,.39));
  for(const y of [.3,.62,.94]){const shelf=MeshBuilder.CreateBox('bookcase-shelf',{width:.55,height:.055,depth:1.72},this.scene);shelf.position.set(4.2,y,-.55);shelf.material=shelfMat;}
  const bookColors=[new Color3(.62,.25,.2),new Color3(.2,.38,.52),new Color3(.78,.61,.3),new Color3(.24,.43,.34)];
  for(let i=0;i<8;i++){const book=MeshBuilder.CreateBox('bookcase-book',{width:.12,height:.24+(i%3)*.035,depth:.16},this.scene);book.position.set(4.18,.43+(i%2)*.32,-1.18+i*.18);book.material=mat('book-'+i,bookColors[i%bookColors.length]);}
  const clockFace=mat('wall-clock-face',new Color3(.94,.91,.82));
  // Mount the clock on the right wall, clear of the notice board on the rear wall.
  const clock=MeshBuilder.CreateCylinder('office-wall-clock',{diameter:.62,height:.08,tessellation:24},this.scene);clock.rotation.z=Math.PI/2;clock.position.set(4.86,1.72,-2.25);clock.material=clockFace;
  const clockHand=MeshBuilder.CreateBox('wall-clock-hand',{width:.025,height:.22,depth:.025},this.scene);clockHand.rotation.z=Math.PI/2;clockHand.position.set(4.78,1.78,-2.25);clockHand.material=trim;
  const artFrame=MeshBuilder.CreateBox('office-wall-art-frame',{width:.08,height:.92,depth:1.2},this.scene);artFrame.position.set(-4.86,1.55,-1.65);artFrame.material=trim;
  const artPanel=MeshBuilder.CreateBox('office-wall-art-panel',{width:.035,height:.78,depth:1.06},this.scene);artPanel.position.set(-4.8,1.55,-1.65);artPanel.material=mat('wall-art',new Color3(.3,.52,.58));
  // Mount the notice board flat on the rear wall, in the clear bay to the right of the windows.
  const boardFrame=mat('notice-board-frame',new Color3(.36,.27,.2));
  const boardSurface=mat('notice-board-surface',new Color3(.57,.39,.27));
  const noticeBoard=MeshBuilder.CreateBox('office-notice-board',{width:1.35,height:1.02,depth:.09},this.scene);noticeBoard.position.set(3.55,1.58,-3.86);noticeBoard.material=boardFrame;
  const cork=MeshBuilder.CreateBox('notice-board-cork',{width:1.21,height:.88,depth:.035},this.scene);cork.position.set(3.55,1.58,-3.79);cork.material=boardSurface;
  const noteColors=[new Color3(.91,.86,.68),new Color3(.75,.84,.86),new Color3(.88,.76,.65)];
  for(let i=0;i<3;i++){
   const x=3.2+i*.35;
   const note=MeshBuilder.CreateBox('notice-board-note',{width:.27,height:.31,depth:.025},this.scene);note.position.set(x,1.58+(i%2)*.08,-3.765);note.material=mat('notice-note-'+i,noteColors[i]);
   const pin=MeshBuilder.CreateSphere('notice-board-pin',{diameter:.07,segments:8},this.scene);pin.position.set(x-.08,1.69+(i%2)*.08,-3.73);pin.material=mat('notice-pin-'+i,new Color3(.65,.24,.18));
  }
  canvas.setAttribute('data-office-notice-board-mesh-count','8');
  canvas.setAttribute('data-office-notice-board-mounted','rear-wall');
  canvas.setAttribute('data-office-clock-mounted','right-wall');
  // A compact waiting bench sits against the left wall, outside the entrance lane.
  const benchWood=mat('waiting-bench-wood',new Color3(.38,.29,.23));
  const benchSeat=MeshBuilder.CreateBox('waiting-bench-seat',{width:.72,height:.14,depth:1.5},this.scene);benchSeat.position.set(-4.48,.52,1.1);benchSeat.material=benchWood;
  const benchBack=MeshBuilder.CreateBox('waiting-bench-back',{width:.13,height:.58,depth:1.5},this.scene);benchBack.position.set(-4.79,.83,1.1);benchBack.material=benchWood;
  const benchCushion=MeshBuilder.CreateBox('waiting-bench-cushion',{width:.62,height:.07,depth:1.34},this.scene);benchCushion.position.set(-4.43,.63,1.1);benchCushion.material=mat('waiting-bench-fabric',new Color3(.22,.36,.46));
  for(const z of [.52,1.68]){const support=MeshBuilder.CreateBox('waiting-bench-support',{width:.12,height:.48,depth:.12},this.scene);support.position.set(-4.48,.28,z);support.material=benchWood;}
  canvas.setAttribute('data-office-waiting-area-mesh-count','5');
  canvas.setAttribute('data-office-furniture-count','5');
  const warmLight=new Color3(1,.88,.7);
  for(const [index,x,z] of [[0,-2.8,-.8],[1,2.8,-.8],[2,0,2.4]] as const){
   const lamp=new PointLight('office-fill-'+index,new Vector3(x,2.1,z),this.scene);lamp.diffuse=warmLight;lamp.intensity=.22;lamp.range=8;
  }
  const ceilingPanel=mat('ceiling-panel',new Color3(.88,.91,.93));
  for(const x of [-3,0,3]){const panel=MeshBuilder.CreateBox('ceiling-light-panel',{width:1.05,height:.045,depth:.38},this.scene);panel.position.set(x,2.26,.2);panel.material=ceilingPanel;}
  const environmentCounts={
   walls:this.scene.meshes.filter(mesh=>['back-wall','side-wall','right-wall','front-wall-left','front-wall-right'].includes(mesh.name)).length,
   windows:this.scene.meshes.filter(mesh=>mesh.name==='window-pane').length,
   entrance:this.scene.meshes.filter(mesh=>['entrance-header','entrance-sign','entrance-jamb','entrance-threshold'].includes(mesh.name)).length,
   lights:this.scene.lights.length
  };
  canvas.setAttribute('data-office-wall-segment-count',String(environmentCounts.walls));
  canvas.setAttribute('data-office-window-count',String(environmentCounts.windows));
  canvas.setAttribute('data-office-entrance-part-count',String(environmentCounts.entrance));
  canvas.setAttribute('data-office-light-count',String(environmentCounts.lights));
  const rug=MeshBuilder.CreateGround('rug',{width:4.2,height:2.6},this.scene);rug.position.set(0,.075,1.45);rug.material=mat('rugmat',new Color3(.16,.29,.43));
  const leaf=mat('plant-leaf',new Color3(.18,.42,.29)),potMat=mat('planter',new Color3(.76,.65,.48));
  for(const [x,z] of [[-4,3],[4,-2]]){const pot=MeshBuilder.CreateCylinder('pot',{height:.55,diameter:.55},this.scene);pot.position.set(x,.34,z);pot.material=potMat;for(let i=0;i<5;i++){const l=MeshBuilder.CreateSphere('leaf',{diameter:.48,segments:6},this.scene);l.scaling.set(.65,1.6,.65);l.position.set(x+Math.cos(i*1.25)*.22,.82,z+Math.sin(i*1.25)*.22);l.material=leaf;}}
  this.addDesk(-2,-1);this.addDesk(1,-1);
  // Office architecture and furniture are static; freeze their world matrices so Babylon can skip per-frame recomputation.
  this.scene.meshes.forEach(mesh=>mesh.freezeWorldMatrix());
  this.scene.onPointerObservable.add(pi=>{if(pi.type===PointerEventTypes.POINTERPICK&&this.placing){const pick=this.scene.pick(this.scene.pointerX,this.scene.pointerY,m=>m===this.floor);if(pick?.hit&&pick.pickedPoint){const x=Math.round(pick.pickedPoint.x),z=Math.round(pick.pickedPoint.z);if(this.onFloorTap?.(x,z))this.addDesk(x,z);}}});
  const profileEnabled=window.location.search.includes('profile=1');
  const frameDurations=new Array<number>(120).fill(0);
  let frameSampleCount=0,frameSampleCursor=0,frameStartedAt=0,lastWorkerUpdateAt=0;
  const workerUpdateIntervalMs=1000/30;
  canvas.setAttribute('data-worker-animation-update-hz','30');
  this.scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now();
   if(profileEnabled)frameStartedAt=now;
   if(now-lastWorkerUpdateAt<workerUpdateIntervalMs)return;
   lastWorkerUpdateAt=now;
   const time=now*.001;
   let walkingCount=0,shinSwing=0;
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
     const legs=this.workerLegs[index],shins=this.workerShins[index],arms=this.workerArms[index];
     if(legs){legs[0].rotation.x=stride*.38;legs[1].rotation.x=-stride*.38;legs[0].position.z=.48+stride*.08;legs[1].position.z=.48-stride*.08;}
     if(shins){shins[0].rotation.x=-stride*.24;shins[1].rotation.x=stride*.24;shinSwing=Math.max(shinSwing,Math.abs(stride*.24));}
     if(arms){arms[0].rotation.x=Math.PI/2-stride*.28;arms[1].rotation.x=Math.PI/2+stride*.28;}
     return;
    }
    worker.position.x=0;worker.position.z=0;
    const legs=this.workerLegs[index],shins=this.workerShins[index],arms=this.workerArms[index],head=this.workerHeads[index];
    if(head)head.rotation.set(0,0,0);
    if(legs){legs[0].rotation.x=Math.PI/2;legs[1].rotation.x=Math.PI/2;legs[0].position.z=.48;legs[1].position.z=.48;}
    if(shins){shins[0].rotation.x=0;shins[1].rotation.x=0;}
    if(arms){
     const leftTap=Math.max(0,Math.sin(time*8+index*1.7));
     const rightTap=Math.max(0,Math.sin(time*8+index*1.7+Math.PI));
     const workPose=index%3;
     if(workPose===0){
      arms[0].rotation.x=Math.PI/2;arms[1].rotation.x=Math.PI/2;
      arms[0].rotation.z=-.04-leftTap*.14;arms[1].rotation.z=.04+rightTap*.14;
      arms[0].position.y=1.02+leftTap*.045;arms[1].position.y=1.02+rightTap*.045;
      if(head)head.rotation.z=Math.sin(time*1.2+index)*.025;
     }else if(workPose===1){
      arms[0].rotation.x=Math.PI/2+.12;arms[1].rotation.x=Math.PI/2;
      arms[0].rotation.z=-.02;arms[1].rotation.z=.04+rightTap*.1;
      arms[0].position.y=.99;arms[1].position.y=1.02+rightTap*.035;
      if(head){head.rotation.x=-.07;head.rotation.z=.035+Math.sin(time*.8+index)*.012;}
     }else{
      arms[0].rotation.x=Math.PI/2-.22;arms[1].rotation.x=Math.PI/2;
      arms[0].rotation.z=-.28;arms[1].rotation.z=.04+rightTap*.04;
      arms[0].position.y=1.12+Math.sin(time*1.4+index)*.018;arms[1].position.y=1.0;
      if(head){head.rotation.x=-.1;head.rotation.z=-.055+Math.sin(time*.7+index)*.01;}
     }
    }
   });
   this.engine.getRenderingCanvas()?.setAttribute('data-walking-worker-count',String(walkingCount));
   this.engine.getRenderingCanvas()?.setAttribute('data-worker-shin-swing',shinSwing.toFixed(3));
  });
  if(profileEnabled)this.scene.onAfterRenderObservable.add(()=>{
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
  const deskAccent=this.getMaterial('desk-accent',new Color3(.34,.4,.46));
  const peripherals=this.getMaterial('desk-peripherals',new Color3(.16,.19,.22));
  const monitorStand=MeshBuilder.CreateBox('monitor-stand',{width:.09,height:.16,depth:.08},this.scene);monitorStand.parent=root;monitorStand.position.set(0,1.0,-.12);monitorStand.material=deskAccent;
  const monitorBase=MeshBuilder.CreateBox('monitor-base',{width:.34,height:.035,depth:.2},this.scene);monitorBase.parent=root;monitorBase.position.set(0,.94,-.12);monitorBase.material=deskAccent;
  const keyboard=MeshBuilder.CreateBox('keyboard',{width:.58,height:.045,depth:.19},this.scene);keyboard.parent=root;keyboard.position.set(0,.94,.27);keyboard.material=peripherals;
  const mouse=MeshBuilder.CreateSphere('mouse',{diameter:.13,segments:8},this.scene);mouse.parent=root;mouse.scaling.set(1,.32,1.45);mouse.position.set(.48,.96,.27);mouse.material=peripherals;  const paper=this.getMaterial('desk-paper',new Color3(.88,.86,.78));
  const paperStack=MeshBuilder.CreateBox('desk-paper-stack',{width:.28,height:.035,depth:.2},this.scene);paperStack.parent=root;paperStack.position.set(-.48,.94,.12);paperStack.material=paper;
  const mugMat=this.getMaterial('desk-mug',new Color3(.72,.78,.8));
  const mug=MeshBuilder.CreateCylinder('desk-mug',{height:.16,diameter:.13,tessellation:12},this.scene);mug.parent=root;mug.position.set(.53,1.02,-.16);mug.material=mugMat;
  const pen=MeshBuilder.CreateCylinder('desk-pen',{height:.2,diameter:.025,tessellation:8},this.scene);pen.parent=root;pen.rotation.z=.16;pen.position.set(-.48,1.04,.12);pen.material=peripherals;
  const drawerMat=this.getMaterial('desk-drawer',new Color3(.56,.62,.66));
  const drawer=MeshBuilder.CreateBox('desk-drawer-unit',{width:.32,height:.48,depth:.52},this.scene);drawer.parent=root;drawer.position.set(-.43,.42,-.02);drawer.material=drawerMat;
  const drawerHandle=MeshBuilder.CreateBox('desk-drawer-handle',{width:.12,height:.025,depth:.035},this.scene);drawerHandle.parent=root;drawerHandle.position.set(-.43,.53,.26);drawerHandle.material=deskAccent;
  root.freezeWorldMatrix();
  root.getChildMeshes().forEach(mesh=>mesh.freezeWorldMatrix());
  this.desks.push(root);
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-detail-mesh-count',String(this.desks.length*4));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-accessory-mesh-count',String(this.desks.length*3));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-storage-mesh-count',String(this.desks.length*2));
  return root;
 }
 syncWorkers(count:number,animateNewWorkers=true){
  const target=Math.max(0,Math.min(Math.floor(count),this.desks.length));
  while(this.workers.length>target){const worker=this.workers.pop()!;this.workerArms.pop();this.workerHeads.pop();this.workerLegs.pop();this.workerShins.pop();this.workerWalkStartedAt.pop();this.workerWalkPaths.pop();this.workerWalkPathLengths.pop();this.workerWalkPathTotalLengths.pop();worker.dispose();}
  while(this.workers.length<target){
   const index=this.workers.length,desk=this.desks[index],worker=new TransformNode('worker-'+(index+1),this.scene);
   worker.parent=desk;
   const fixedObstacles=[{x:-4,z:3,halfWidth:.48,halfDepth:.48},{x:4,z:-2,halfWidth:.48,halfDepth:.48},{x:4.48,z:-.55,halfWidth:.38,halfDepth:.95},{x:-4.48,z:1.1,halfWidth:.48,halfDepth:.9},{x:-5,z:0,halfWidth:.09,halfDepth:4},{x:0,z:-4,halfWidth:5,halfDepth:.09}];
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
   const skinColors=[new Color3(.78,.55,.39),new Color3(.56,.34,.23),new Color3(.91,.71,.55),new Color3(.38,.23,.17)];
   const hairColors=[new Color3(.12,.1,.1),new Color3(.32,.17,.08),new Color3(.55,.34,.16),new Color3(.72,.68,.58)];
   const shirtColors=[new Color3(.16,.48,.72),new Color3(.22,.58,.43),new Color3(.62,.36,.68),new Color3(.78,.48,.2)];
   const variant=index%shirtColors.length;
   const skin=this.getMaterial('worker-skin-'+(index%skinColors.length),skinColors[index%skinColors.length]);
   const shirt=this.getMaterial('worker-shirt-'+variant,shirtColors[variant]);
   const hair=this.getMaterial('worker-hair-'+(index%hairColors.length),hairColors[index%hairColors.length]);
   const trousers=this.getMaterial('worker-trousers',new Color3(.12,.19,.27));
   const shoes=this.getMaterial('worker-shoes',new Color3(.055,.065,.075));
   const tieColors=[new Color3(.78,.3,.24),new Color3(.84,.67,.34),new Color3(.3,.52,.66),new Color3(.35,.58,.43)];
   const tie=this.getMaterial('worker-tie-'+variant,tieColors[variant]);
   const torso=MeshBuilder.CreateCylinder('worker-torso-'+index,{height:.48,diameterTop:.34,diameterBottom:.42,tessellation:8},this.scene);torso.parent=worker;torso.position.set(0,1.03,.65);torso.material=shirt;
   const necktie=MeshBuilder.CreateBox('worker-necktie-'+index,{width:.075,height:.22,depth:.025},this.scene);necktie.parent=worker;necktie.position.set(0,1.02,.435);necktie.material=tie;
   const head=MeshBuilder.CreateSphere('worker-head-'+index,{diameter:.34,segments:10},this.scene);head.parent=worker;head.position.set(0,1.43,.55);head.material=skin;this.workerHeads.push(head);
   const hairCap=MeshBuilder.CreateSphere('worker-hair-'+index,{diameter:.35,segments:8},this.scene);hairCap.parent=worker;hairCap.scaling.y=[.42,.5,.58,.46][variant];hairCap.scaling.x=[1,.96,1.04,.92][variant];hairCap.position.set(0,1.57,.55);hairCap.material=hair;
   // Seated legs: thighs extend toward the desk, with lower legs and shoes below the desktop.
   const thighs:any[]=[],shins:any[]=[],shoeMeshes:any[]=[];
   for(const side of [-1,1]){
    const thigh=MeshBuilder.CreateCapsule('worker-thigh-'+index+'-'+side,{height:.48,radius:.105,tessellation:6},this.scene);thigh.parent=worker;thigh.rotation.x=0;thigh.position.set(side*.13,.69,.48);thigh.material=trousers;thighs.push(thigh);
    const shin=MeshBuilder.CreateCapsule('worker-shin-'+index+'-'+side,{height:.42,radius:.078,tessellation:6},this.scene);shin.parent=worker;shin.position.set(side*.13,.43,.24);shin.material=trousers;shins.push(shin);
    const shoe=MeshBuilder.CreateBox('worker-shoe-'+index+'-'+side,{width:.19,height:.11,depth:.3},this.scene);shoe.position.set(side*.13,.24,.06);shoe.material=shoes;shoeMeshes.push(shoe);
   }
   // Combine the two static shoes into one worker-local mesh; animated leg meshes remain separate.
   const shoePair=Mesh.MergeMeshes(shoeMeshes,true,true);if(shoePair){shoePair.name='worker-shoes-'+index;shoePair.parent=worker;shoePair.material=shoes;}
   const arms:any[]=[];
   for(const side of [-1,1]){
    const arm=MeshBuilder.CreateCapsule('worker-arm-'+index+'-'+side,{height:.48,radius:.075,tessellation:6},this.scene);arm.parent=worker;arm.rotation.x=Math.PI/2;arm.position.set(side*.22,1.05,.35);arm.material=shirt;arms.push(arm);
   }
   this.workerArms.push([arms[0],arms[1]]);
   this.workerLegs.push([thighs[0],thighs[1]]);
   this.workerShins.push([shins[0],shins[1]]);
   this.workers.push(worker);
  }
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-model-count',String(this.workers.length));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-appearance-variant-count',String(new Set(this.workers.map((_,index)=>index%4)).size));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-idle-pose-types',['typing','reviewing','thinking'].filter((_,pose)=>this.workers.some((__,index)=>index%3===pose)).join(','));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-arrival-waypoint-counts',this.workerWalkPaths.map(path=>String(path.length)).join(','));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-leg-mesh-count',String(this.workers.length*5));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-necktie-mesh-count',String(this.workers.length));
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
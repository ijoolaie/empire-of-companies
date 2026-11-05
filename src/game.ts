import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,DirectionalLight,MeshBuilder,StandardMaterial,Color3,Color4,TransformNode,PointerEventTypes} from '@babylonjs/core';

export class OfficeGame {
 engine:Engine; scene:Scene; camera:ArcRotateCamera; floor:any; desks:TransformNode[]=[]; placing=false; onFloorTap?:(x:number,z:number)=>boolean;
 constructor(canvas:HTMLCanvasElement){
  this.engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,adaptToDeviceRatio:true});
  this.scene=new Scene(canvas.ownerDocument ? this.engine.getRenderingCanvas() ? this.engine.getRenderingCanvas()!.ownerDocument.defaultView ? undefined as never : undefined as never : undefined as never : undefined as never);
  this.scene=new Scene(this.engine);this.scene.clearColor=new Color4(.72,.83,.91,1);
  this.camera=new ArcRotateCamera('camera',-Math.PI/4,1.05,15,new Vector3(0,0,0),this.scene);
  this.camera.lowerRadiusLimit=10;this.camera.upperRadiusLimit=22;this.camera.wheelPrecision=45;this.camera.panningSensibility=90;this.camera.attachControl(canvas,true);
  new HemisphericLight('ambient',new Vector3(0,1,0),this.scene).intensity=.85;
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.4),this.scene);sun.position=new Vector3(8,12,-8);sun.intensity=.55;
  const mat=(name:string,c:Color3)=>{const m=new StandardMaterial(name,this.scene);m.diffuseColor=c;return m};
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
  this.engine.runRenderLoop(()=>this.scene.render());window.addEventListener('resize',()=>this.engine.resize());
 }
 addDesk(x:number,z:number){
  const root=new TransformNode('desk-root',this.scene);root.position.set(x,.08,z);
  const wood=new StandardMaterial('deskwood',this.scene);wood.diffuseColor=new Color3(.88,.9,.91);
  const top=MeshBuilder.CreateBox('desk-top',{width:1.5,height:.13,depth:.75},this.scene);top.parent=root;top.position.y=.85;top.material=wood;
  for(const dx of [-.62,.62])for(const dz of [-.25,.25]){const leg=MeshBuilder.CreateBox('desk-leg',{width:.08,height:.82,depth:.08},this.scene);leg.parent=root;leg.position.set(dx,.41,dz);leg.material=wood;}
  const chair=new StandardMaterial('chair',this.scene);chair.diffuseColor=new Color3(.12,.24,.38);
  const seat=MeshBuilder.CreateBox('chair-seat',{width:.62,height:.13,depth:.62},this.scene);seat.parent=root;seat.position.set(0,.53,.72);seat.material=chair;
  const monitor=MeshBuilder.CreateBox('monitor',{width:.65,height:.42,depth:.07},this.scene);monitor.parent=root;monitor.position.set(0,1.2,-.12);const screen=new StandardMaterial('screen',this.scene);screen.diffuseColor=new Color3(.035,.07,.12);monitor.material=screen;
  this.desks.push(root);return root;
 }
}
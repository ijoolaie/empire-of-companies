import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Matrix,Vector3} from '@babylonjs/core/Maths/math.vector';
import {Ray} from '@babylonjs/core/Culling/ray';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {PointLight} from '@babylonjs/core/Lights/pointLight';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {planWorkerArrivalPath} from './navigation';

export class OfficeGame {
 engine:Engine; scene:Scene; camera:ArcRotateCamera; floor:any; placementPreview:any; placementMaterials:Record<string,StandardMaterial>={}; canPreviewDesk?:(x:number,z:number)=>boolean; onTouchPlacementPreview?:()=>void; touchPlacementTarget:{x:number;z:number}|null=null; desks:TransformNode[]=[]; mainCharacter:TransformNode|null=null; playerKeys=new Set<string>(); playerArms:Mesh[]=[]; playerLegs:Mesh[]=[]; playerShoes:Mesh[]=[]; playerHeadMesh:Mesh|null=null; officeUpgradeDecor:Array<{mesh:Mesh;requiredLevel:number}>=[]; officeVisualTier=1; workers:TransformNode[]=[]; workerArms:Array<[any,any]>=[]; workerHeads:any[]=[]; workerLegs:Array<[any,any]>=[]; workerShins:Array<[any,any]>=[]; workerWalkStartedAt:number[]=[]; workerWalkPaths:Vector3[][]=[]; workerWalkPathLengths:number[][]=[]; workerWalkPathTotalLengths:number[]=[]; materials:Record<string,StandardMaterial>={}; surfaceTextures:Record<string,DynamicTexture>={}; shadowGenerator!:ShadowGenerator; placing=false; onFloorTap?:(x:number,z:number)=>boolean;
 constructor(canvas:HTMLCanvasElement){
  this.engine=new Engine(canvas,true,{preserveDrawingBuffer:false,stencil:true,adaptToDeviceRatio:true});
  this.scene=new Scene(this.engine);this.scene.clearColor=new Color4(.72,.83,.91,1);
  // Frame the playable founder and central work area together while keeping the rear windows readable.
  this.camera=new ArcRotateCamera('camera',Math.PI/4,1.05,16.5,new Vector3(0,.9,.85),this.scene);
  this.camera.lowerRadiusLimit=10;this.camera.upperRadiusLimit=22;this.camera.lowerBetaLimit=.7;this.camera.upperBetaLimit=1.35;this.camera.wheelPrecision=45;this.camera.panningSensibility=90;
  const syncCameraState=()=>{for(const [name,value] of [['alpha',this.camera.alpha.toFixed(3)],['beta',this.camera.beta.toFixed(3)],['radius',this.camera.radius.toFixed(2)],['target-x',this.camera.target.x.toFixed(2)],['target-y',this.camera.target.y.toFixed(2)],['target-z',this.camera.target.z.toFixed(2)]] as const){const key='data-camera-'+name;if(canvas.getAttribute(key)!==value)canvas.setAttribute(key,value);}};
  canvas.setAttribute('data-camera-beta-min','0.7');canvas.setAttribute('data-camera-beta-max','1.35');canvas.setAttribute('data-camera-radius-min','10');canvas.setAttribute('data-camera-radius-max','22');
  this.camera.onViewMatrixChangedObservable.add(syncCameraState);syncCameraState();
  this.camera.attachControl(canvas,true);this.camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
  const hemi=new HemisphericLight('ambient',new Vector3(0,1,0),this.scene);hemi.intensity=.58;hemi.diffuse=new Color3(1,.94,.84);hemi.groundColor=new Color3(.22,.25,.29);
  const sun=new DirectionalLight('sun',new Vector3(-.5,-1,.4),this.scene);sun.position=new Vector3(8,12,-8);sun.intensity=.92;sun.diffuse=new Color3(1,.88,.72);
  this.shadowGenerator=new ShadowGenerator(1024,sun);this.shadowGenerator.useBlurExponentialShadowMap=true;this.shadowGenerator.blurKernel=18;this.shadowGenerator.setDarkness(.28);this.shadowGenerator.bias=.0005;this.shadowGenerator.normalBias=.025;
  this.scene.imageProcessingConfiguration.exposure=1.06;this.scene.imageProcessingConfiguration.contrast=1.16;
  const mat=(name:string,c:Color3)=>this.getMaterial(name,c);
  const ground=MeshBuilder.CreateGround('ground',{width:22,height:18},this.scene);ground.material=mat('groundmat',new Color3(.72,.78,.83));(ground.material as StandardMaterial).diffuseTexture=this.createSurfaceTexture('exterior-stone-texture','rgb(76,89,101)','rgb(102,114,124)',1100);
  this.floor=MeshBuilder.CreateGround('office-floor',{width:10,height:8},this.scene);this.floor.position.y=.04;this.floor.material=mat('tile',new Color3(.72,.68,.59));this.floor.receiveShadows=true;
  const floorTexture=this.createSurfaceTexture('floor-stone-texture','rgb(205,198,184)','rgb(231,223,207)',1100);floorTexture.uScale=2;floorTexture.vScale=2;(this.floor.material as StandardMaterial).diffuseTexture=floorTexture;
  // Fine, recessed-looking grout lines give the open office floor a subtle one-metre tile layout.
  const floorGrout=mat('floor-grout',new Color3(.53,.49,.42));
  for(let x=-4.5;x<=4.5;x+=1){const joint=MeshBuilder.CreateBox('office-floor-joint',{width:.012,height:.006,depth:8},this.scene);joint.position.set(x,.045,0);joint.material=floorGrout;}
  for(let z=-3.5;z<=3.5;z+=1){const joint=MeshBuilder.CreateBox('office-floor-joint',{width:10,height:.006,depth:.012},this.scene);joint.position.set(0,.045,z);joint.material=floorGrout;}
  canvas.setAttribute('data-office-floor-joint-count',String(this.scene.meshes.filter(mesh=>mesh.name==='office-floor-joint').length));
  const wall=mat('wall',new Color3(.83,.81,.75));(wall as StandardMaterial).diffuseTexture=this.createSurfaceTexture('wall-plaster-texture','rgb(216,211,198)','rgb(231,225,212)',700);
  const back=MeshBuilder.CreateBox('back-wall',{width:10,height:2.3,depth:.18},this.scene);back.position.set(0,1.15,-4);back.material=wall;
  const side=MeshBuilder.CreateBox('side-wall',{width:.18,height:2.3,depth:8},this.scene);side.position.set(-5,1.15,0);side.material=wall;
  const right=MeshBuilder.CreateBox('right-wall',{width:.18,height:1.85,depth:8},this.scene);right.position.set(5,.925,0);right.material=wall;
  // The front wall is split around a wide, permanently open entrance so arrival paths stay unobstructed.
  const frontLeft=MeshBuilder.CreateBox('front-wall-left',{width:3.75,height:1.25,depth:.18},this.scene);frontLeft.position.set(-3.125,.625,4);frontLeft.material=wall;
  const frontRight=MeshBuilder.CreateBox('front-wall-right',{width:3.75,height:1.25,depth:.18},this.scene);frontRight.position.set(3.125,.625,4);frontRight.material=wall;
  canvas.setAttribute('data-office-front-cutaway-wall-height','1.25');canvas.setAttribute('data-office-right-cutaway-wall-height','1.85');
  const entranceHeader=MeshBuilder.CreateBox('entrance-header',{width:2.5,height:.12,depth:.24},this.scene);entranceHeader.position.set(0,1.32,4);entranceHeader.material=wall;
  const trim=mat('architectural-trim',new Color3(.16,.22,.29));
  for(const x of [-1.25,1.25]){const jamb=MeshBuilder.CreateBox('entrance-jamb',{width:.09,height:1.2,depth:.25},this.scene);jamb.position.set(x,.6,4);jamb.material=trim;}
  const threshold=MeshBuilder.CreateBox('entrance-threshold',{width:2.5,height:.055,depth:.32},this.scene);threshold.position.set(0,.085,4);threshold.material=trim;
  const glass=mat('panoramic-glass',new Color3(1,1,1));glass.alpha=1;glass.diffuseTexture=this.createCityscapeTexture();glass.disableLighting=true;glass.backFaceCulling=false;glass.emissiveColor=new Color3(.95,.95,.95);
  const windowFrame=mat('window-frame',new Color3(.16,.22,.29));
  for(const x of [-3.2,-1.1,1.1]){
   const pane=MeshBuilder.CreatePlane('window-pane',{width:1.65,height:1.25,sideOrientation:Mesh.DOUBLESIDE},this.scene);pane.position.set(x,1.65,-3.5);pane.material=glass;pane.isPickable=false;
   for(const dx of [-.86,.86]){const mullion=MeshBuilder.CreateBox('window-mullion',{width:.055,height:1.34,depth:.09},this.scene);mullion.position.set(x+dx,1.65,-3.42);mullion.material=windowFrame;}
   const centerMullion=MeshBuilder.CreateBox('window-center-mullion',{width:.055,height:1.34,depth:.09},this.scene);centerMullion.position.set(x,1.65,-3.42);centerMullion.material=windowFrame;
   const transom=MeshBuilder.CreateBox('window-transom',{width:1.72,height:.055,depth:.09},this.scene);transom.position.set(x,1.65,-3.42);transom.material=windowFrame;
   const sill=MeshBuilder.CreateBox('window-sill',{width:1.82,height:.09,depth:.18},this.scene);sill.position.set(x,1.0,-3.4);sill.material=trim;
  }
  const baseboard=mat('baseboard',new Color3(.25,.29,.33));
  for(const [name,width,depth,x,z] of [['back-baseboard',9.7,.07,0,-3.87],['left-baseboard',.07,7.7,-4.87,0],['right-baseboard',.07,7.7,4.87,0]] as const){
   const board=MeshBuilder.CreateBox(name,{width,height:.12,depth},this.scene);board.position.set(x,.16,z);board.material=baseboard;
  }
  const entranceSign=MeshBuilder.CreateBox('entrance-sign',{width:1.15,height:.24,depth:.06},this.scene);entranceSign.position.set(0,1.48,3.82);entranceSign.material=trim;
  // A simple three-bar emblem gives the entrance sign a readable focal point without text or external assets.
  const emblem=mat('entrance-emblem',new Color3(.82,.68,.42));
  for(const [index,height] of [.09,.15,.12].entries()){
   const bar=MeshBuilder.CreateBox('sign-emblem-bar',{width:.07,height,depth:.025},this.scene);bar.position.set((index-1)*.16,1.48,3.775);bar.material=emblem;
  }
  // Keep the entry mat nearly flush with the floor so it cannot obstruct worker arrival paths.
  const entryMat=MeshBuilder.CreateGround('entry-mat',{width:1.85,height:.62},this.scene);entryMat.position.set(0,.078,3.42);entryMat.material=mat('entry-mat-fabric',new Color3(.1,.15,.22));
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
  for(let i=0;i<8;i++){const book=MeshBuilder.CreateBox('bookcase-book',{width:.12,height:.24+(i%3)*.035,depth:.16},this.scene);book.position.set(4.18,.43+(i%2)*.32,-1.18+i*.18);book.material=mat('book-'+(i%bookColors.length),bookColors[i%bookColors.length]);}
  canvas.setAttribute('data-office-book-material-count',String(bookColors.length));
  const clockFace=mat('wall-clock-face',new Color3(.94,.91,.82));
  // Mount the clock on the right wall, clear of the notice board on the rear wall.
  const clock=MeshBuilder.CreateCylinder('office-wall-clock',{diameter:.62,height:.08,tessellation:24},this.scene);clock.rotation.z=Math.PI/2;clock.position.set(4.86,1.72,-2.25);clock.material=clockFace;
  const clockMarks=mat('wall-clock-markers',new Color3(.25,.34,.4));
  for(let mark=0;mark<12;mark++){const angle=mark*Math.PI/6;const tick=MeshBuilder.CreateBox('wall-clock-tick',{width:.018,height:.045,depth:.018},this.scene);tick.position.set(4.805,1.72+Math.sin(angle)*.245,-2.25+Math.cos(angle)*.245);tick.material=clockMarks;}
  const minuteHand=MeshBuilder.CreateBox('wall-clock-minute-hand',{width:.025,height:.22,depth:.025},this.scene);minuteHand.position.set(4.795,1.77,-2.25);minuteHand.material=trim;
  const hourHand=MeshBuilder.CreateBox('wall-clock-hour-hand',{width:.03,height:.15,depth:.03},this.scene);hourHand.position.set(4.79,1.75,-2.285);hourHand.rotation.x=-.55;hourHand.material=clockMarks;
  const clockPin=MeshBuilder.CreateSphere('wall-clock-center-pin',{diameter:.055,segments:8},this.scene);clockPin.position.set(4.775,1.72,-2.25);clockPin.material=emblem;
  canvas.setAttribute('data-office-clock-detail-count',String(this.scene.meshes.filter(mesh=>mesh.name==='wall-clock-tick'||mesh.name.startsWith('wall-clock-')&&mesh.name!=='wall-clock-markers').length));
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
  const benchCushion=MeshBuilder.CreateBox('waiting-bench-cushion',{width:.62,height:.07,depth:1.34},this.scene);benchCushion.position.set(-4.43,.63,1.1);benchCushion.material=mat('waiting-bench-fabric',new Color3(.17,.25,.31));
  for(const z of [.52,1.68]){const support=MeshBuilder.CreateBox('waiting-bench-support',{width:.12,height:.48,depth:.12},this.scene);support.position.set(-4.48,.28,z);support.material=benchWood;}
  canvas.setAttribute('data-office-waiting-area-mesh-count','5');
  canvas.setAttribute('data-office-furniture-count','5');
  const warmLight=new Color3(1,.76,.52),coolLight=new Color3(.42,.64,.82);
  for(const [index,x,z] of [[0,-2.8,-.8],[1,2.8,-.8],[2,0,2.4]] as const){
   const lamp=new PointLight('office-fill-'+index,new Vector3(x,2.1,z),this.scene);lamp.diffuse=index===1?coolLight:warmLight;lamp.intensity=index===1?.14:.3;lamp.range=8;
  }
  const ceilingPanel=mat('ceiling-panel',new Color3(.84,.81,.74));ceilingPanel.emissiveColor=new Color3(.22,.18,.12);
  for(const x of [-3,0,3]){const panel=MeshBuilder.CreateBox('ceiling-light-panel',{width:1.05,height:.045,depth:.38},this.scene);panel.position.set(x,2.26,.2);panel.material=ceilingPanel;}
  canvas.setAttribute('data-office-ceiling-panel-count',String(this.scene.meshes.filter(mesh=>mesh.name==='ceiling-light-panel').length));
  const environmentCounts={
   walls:this.scene.meshes.filter(mesh=>['back-wall','side-wall','right-wall','front-wall-left','front-wall-right'].includes(mesh.name)).length,
   windows:this.scene.meshes.filter(mesh=>mesh.name==='window-pane').length,
   entrance:this.scene.meshes.filter(mesh=>['entrance-header','entrance-sign','entrance-jamb','entrance-threshold'].includes(mesh.name)).length,
   lights:this.scene.lights.length
  };
  canvas.setAttribute('data-office-wall-segment-count',String(environmentCounts.walls));
  canvas.setAttribute('data-office-window-count',String(environmentCounts.windows));
  canvas.setAttribute('data-office-cityscape-window-count',String(this.scene.meshes.filter(mesh=>mesh.name==='window-pane').length));
  canvas.setAttribute('data-office-window-transom-count',String(this.scene.meshes.filter(mesh=>mesh.name==='window-transom').length));
  canvas.setAttribute('data-office-window-center-mullion-count',String(this.scene.meshes.filter(mesh=>mesh.name==='window-center-mullion').length));
  canvas.setAttribute('data-office-entrance-part-count',String(environmentCounts.entrance));
  canvas.setAttribute('data-office-light-count',String(environmentCounts.lights));
  const rug=MeshBuilder.CreateGround('rug',{width:4.2,height:2.6},this.scene);rug.position.set(0,.075,1.45);rug.material=mat('rugmat',new Color3(.13,.2,.29));
  const leaf=mat('plant-leaf',new Color3(.18,.42,.29)),potMat=mat('planter',new Color3(.76,.65,.48));
  for(const [plantIndex,[x,z]] of [[-4,3],[4,-2]].entries()){
   const pot=MeshBuilder.CreateCylinder('pot',{height:.55,diameter:.55},this.scene);pot.position.set(x,.34,z);pot.material=potMat;
   const soil=MeshBuilder.CreateCylinder('planter-soil',{height:.035,diameter:.43,tessellation:16},this.scene);soil.position.set(x,.61,z);soil.material=mat('planter-soil',new Color3(.24,.19,.13));
   const rim=MeshBuilder.CreateTorus('planter-rim',{diameter:.57,thickness:.045,tessellation:20},this.scene);rim.position.set(x,.62,z);rim.material=mat('planter-rim',new Color3(.88,.76,.58));
   const foliage:Mesh[]=[];
   for(let i=0;i<5;i++){const l=MeshBuilder.CreateSphere('leaf',{diameter:.48,segments:6},this.scene);l.scaling.set(.65,1.6,.65);l.position.set(x+Math.cos(i*1.25)*.22,.82,z+Math.sin(i*1.25)*.22);l.material=leaf;foliage.push(l);}
   const canopy=Mesh.MergeMeshes(foliage,true,true);if(canopy){canopy.name='plant-foliage-'+plantIndex;canopy.material=leaf;}
  }
  canvas.setAttribute('data-office-plant-foliage-mesh-count',String(this.scene.meshes.filter(mesh=>mesh.name.startsWith('plant-foliage-')).length));
  canvas.setAttribute('data-office-planter-detail-count',String(this.scene.meshes.filter(mesh=>mesh.name==='planter-soil'||mesh.name==='planter-rim').length));
  this.addDesk(-2,-1);this.addDesk(1,-1);this.createMainCharacter();this.createOfficeUpgradeDecor();this.createPremiumOfficeDetails();
  // Office architecture and furniture are static; freeze their world matrices so Babylon can skip per-frame recomputation.
  const shadowCasterNames=new Set(['back-wall','side-wall','right-wall','front-wall-left','front-wall-right','entrance-header','office-bookcase','office-wall-clock','office-wall-art-frame','office-wall-art-panel','office-notice-board','notice-board-cork','player-feature-wall-panel','player-feature-wall-slat','player-feature-wall-emblem','waiting-bench-seat','waiting-bench-back','waiting-bench-support','pot','desk-top','desk-leg','chair-frame','chair-upholstery','chair-base','monitor']);
  const shadowReceiverNames=new Set(['ground','office-floor','rug','back-wall','side-wall','right-wall','front-wall-left','front-wall-right']);
  this.scene.meshes.forEach(mesh=>{if(mesh.material&&(shadowCasterNames.has(mesh.name)||mesh.name.startsWith('plant-foliage-')))this.shadowGenerator.addShadowCaster(mesh);mesh.receiveShadows=shadowReceiverNames.has(mesh.name);if(!mesh.name.startsWith('player-')||mesh.name.startsWith('player-feature-wall-'))mesh.freezeWorldMatrix();});
  this.placementMaterials.valid=this.getMaterial('placement-valid',new Color3(.16,.72,.34));
  this.placementMaterials.invalid=this.getMaterial('placement-invalid',new Color3(.82,.2,.18));
  this.placementPreview=MeshBuilder.CreateBox('desk-placement-preview',{width:1.5,height:.025,depth:1.45},this.scene);
  this.placementPreview.position.y=.065;this.placementPreview.isPickable=false;this.placementPreview.visibility=.58;this.placementPreview.isVisible=false;this.engine.getRenderingCanvas()?.setAttribute("data-desk-placement-preview-count","1");this.engine.getRenderingCanvas()?.setAttribute("data-desk-placement-preview-visible","false");
  const renderCanvas=this.engine.getRenderingCanvas()!;
  const updatePlacement=(event:PointerEvent):{x:number;z:number;valid:boolean}|null=>{
   if(!this.placing)return null;
   const rect=renderCanvas.getBoundingClientRect();
   const px=(event.clientX-rect.left)*this.engine.getRenderWidth()/rect.width;
   const py=(event.clientY-rect.top)*this.engine.getRenderHeight()/rect.height;
   const ray=this.scene.createPickingRay(px,py,Matrix.Identity(),this.camera);
   if(!(ray instanceof Ray))return null;
   const distance=(.04-ray.origin.y)/ray.direction.y;
   const intersectsFloor=Number.isFinite(distance)&&distance>=0&&Math.abs(ray.direction.y)>.0001;
   const point=intersectsFloor?ray.origin.add(ray.direction.scale(distance)):null;
   const insideFloor=!!point&&Math.abs(point.x)<=5&&Math.abs(point.z)<=4;
   renderCanvas.setAttribute("data-desk-placement-floor-hit",String(insideFloor));
   if(!insideFloor||!point){this.placementPreview.isVisible=false;renderCanvas.setAttribute("data-desk-placement-preview-visible","false");renderCanvas.setAttribute("data-desk-placement-valid","false");return null;}
   const x=Math.round(point.x),z=Math.round(point.z);
   this.placementPreview.position.x=x;this.placementPreview.position.z=z+.3425;
   const valid=this.canPreviewDesk?.(x,z)??false;
   this.placementPreview.material=this.placementMaterials[valid?'valid':'invalid'];
   this.placementPreview.isVisible=true;
   renderCanvas.setAttribute("data-desk-placement-preview-visible","true");
   renderCanvas.setAttribute("data-desk-placement-valid",String(valid));
   renderCanvas.setAttribute("data-desk-placement-x",String(x));
   renderCanvas.setAttribute("data-desk-placement-z",String(z));
   return {x,z,valid};
  };
  renderCanvas.addEventListener('pointermove',event=>{const candidate=updatePlacement(event);if(event.pointerType==='touch'&&!candidate)this.touchPlacementTarget=null;});
  renderCanvas.addEventListener('pointerdown',event=>{
   const candidate=updatePlacement(event);
   if(!candidate){if(event.pointerType==='touch')this.touchPlacementTarget=null;return;}
   if(event.pointerType==='touch'){
    if(!candidate.valid){this.touchPlacementTarget=null;this.onFloorTap?.(candidate.x,candidate.z);return;}
    if(this.touchPlacementTarget?.x===candidate.x&&this.touchPlacementTarget.z===candidate.z){
     this.touchPlacementTarget=null;
     if(this.onFloorTap?.(candidate.x,candidate.z))this.addDesk(candidate.x,candidate.z);
    }else{
     this.touchPlacementTarget={x:candidate.x,z:candidate.z};
     this.onTouchPlacementPreview?.();
    }
    return;
   }
   if(this.onFloorTap?.(candidate.x,candidate.z))this.addDesk(candidate.x,candidate.z);
  });
  const profileEnabled=window.location.search.includes('profile=1');
  const frameDurations=new Array<number>(30).fill(0);
  let frameSampleCount=0,frameSampleCursor=0,frameStartedAt=0,lastWorkerUpdateAt=0;
  const workerUpdateIntervalMs=1000/30;
  canvas.setAttribute('data-worker-animation-update-hz','30');
  this.scene.onBeforeRenderObservable.add(()=>{
   const now=performance.now();
   if(profileEnabled)frameStartedAt=now;
   if(this.mainCharacter){
    const active=document.activeElement as HTMLElement|null;const editing=!!active&&(/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)||active.isContentEditable);
    const forward=(this.playerKeys.has('KeyW')||this.playerKeys.has('ArrowUp')?1:0)-(this.playerKeys.has('KeyS')||this.playerKeys.has('ArrowDown')?1:0);
    const strafe=(this.playerKeys.has('KeyD')||this.playerKeys.has('ArrowRight')?1:0)-(this.playerKeys.has('KeyA')||this.playerKeys.has('ArrowLeft')?1:0);
    const moving=!editing&&!this.placing&&!document.querySelector('.modal-backdrop')&&(forward!==0||strafe!==0);
    const delta=Math.min(.05,this.engine.getDeltaTime()/1000);
    if(moving){
     const magnitude=Math.hypot(strafe,forward)||1;const dx=strafe/magnitude*2.7*delta,dz=-forward/magnitude*2.7*delta;const current=this.mainCharacter.position;
     const obstacles=[...this.desks.map(d=>({x:d.position.x,z:d.position.z+.22,halfWidth:.84,halfDepth:1.05})),{x:4.48,z:-.55,halfWidth:.48,halfDepth:.9},{x:4.84,z:2.55,halfWidth:.16,halfDepth:1.02},{x:-4,z:3,halfWidth:.38,halfDepth:.38},{x:4,z:-2,halfWidth:.38,halfDepth:.38},{x:-4.48,z:1.1,halfWidth:.48,halfDepth:.9},{x:-4.8,z:-1.65,halfWidth:.18,halfDepth:.65}];
     const blocked=(x:number,z:number)=>Math.abs(x)>4.62||z< -3.62||z>3.72||obstacles.some(o=>Math.abs(x-o.x)<o.halfWidth+.22&&Math.abs(z-o.z)<o.halfDepth+.22);
     const nextX=current.x+dx,nextZ=current.z+dz;if(!blocked(nextX,current.z))current.x=nextX;if(!blocked(current.x,nextZ))current.z=nextZ;
     this.mainCharacter.rotation.y=Math.atan2(strafe,-forward);const stride=Math.sin(now*.012)*.72;
     this.playerLegs.forEach((leg,index)=>leg.rotation.x=(index===0?1:-1)*stride);this.playerArms.forEach((arm,index)=>arm.rotation.x=(index===0?-1:1)*stride*.42);this.playerShoes.forEach((shoe,index)=>shoe.position.y=.13+Math.max(0,(index===0?1:-1)*stride)*.045);
    }else{this.playerLegs.forEach(leg=>leg.rotation.x*=.72);this.playerArms.forEach(arm=>arm.rotation.x*=.72);}
    const playerCanvas=this.engine.getRenderingCanvas();if(moving){playerCanvas?.setAttribute('data-player-x',this.mainCharacter.position.x.toFixed(2));playerCanvas?.setAttribute('data-player-z',this.mainCharacter.position.z.toFixed(2));playerCanvas?.setAttribute('data-player-facing-yaw',this.mainCharacter.rotation.y.toFixed(3));this.playerHeadMesh?.computeWorldMatrix(true);if(this.playerHeadMesh)playerCanvas?.setAttribute('data-player-head-world-x',this.playerHeadMesh.getAbsolutePosition().x.toFixed(2));}if(playerCanvas?.getAttribute('data-player-moving')!==String(moving))playerCanvas?.setAttribute('data-player-moving',String(moving));
   }   if(now-lastWorkerUpdateAt<workerUpdateIntervalMs)return;
   lastWorkerUpdateAt=now;
   const time=now*.001;
   let walkingCount=0,shinSwing=0;
   this.workers.forEach((worker,index)=>{
    worker.position.y=.08+Math.sin(time*2+index*.8)*.018;
    const elapsed=(now-this.workerWalkStartedAt[index])/1000;
    const progress=Math.min(1,Math.max(0,elapsed/3.2));
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
     Vector3.LerpToRef(from,to,segmentProgress,worker.position);if(segmentProgress<1){const directionX=to.x-from.x,directionZ=to.z-from.z;if(directionX*directionX+directionZ*directionZ>.0001)worker.rotation.y=Math.atan2(directionX,directionZ);}else worker.rotation.y=Math.PI/4;
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
  let initialMaterialDiagnosticsReady=false;this.scene.onAfterRenderObservable.add(()=>{if(!initialMaterialDiagnosticsReady){initialMaterialDiagnosticsReady=true;canvas.setAttribute('data-scene-material-count',String(this.scene.materials.length));}});
  this.engine.runRenderLoop(()=>this.scene.render());window.addEventListener('resize',()=>this.engine.resize());
 }
 resetCamera(){this.camera.inertialAlphaOffset=0;this.camera.inertialBetaOffset=0;this.camera.inertialRadiusOffset=0;this.camera.alpha=Math.PI/4;this.camera.beta=1.05;this.camera.radius=16.5;this.camera.setTarget(new Vector3(0,.9,.85));}
 setPlacing(active:boolean){this.placing=active;if(!active)this.touchPlacementTarget=null;this.engine.getRenderingCanvas()?.setAttribute("data-desk-placement-active",String(active));if(!active&&this.placementPreview){this.placementPreview.isVisible=false;this.engine.getRenderingCanvas()?.setAttribute("data-desk-placement-preview-visible","false");this.engine.getRenderingCanvas()?.setAttribute("data-desk-placement-valid","false");}}
 addDesk(x:number,z:number){
  const root=new TransformNode('desk-root',this.scene);root.position.set(x,.08,z);
  const wood=this.getMaterial('deskwood',new Color3(.65,.43,.27));(wood as StandardMaterial).diffuseTexture=this.createSurfaceTexture('walnut-wood-texture','rgb(112,70,42)','rgb(151,101,65)',420);
  const top=MeshBuilder.CreateBox('desk-top',{width:1.5,height:.13,depth:.75},this.scene);top.parent=root;top.position.y=.85;top.material=wood;
  for(const dx of [-.62,.62])for(const dz of [-.25,.25]){const leg=MeshBuilder.CreateBox('desk-leg',{width:.08,height:.82,depth:.08},this.scene);leg.parent=root;leg.position.set(dx,.41,dz);leg.material=wood;}
  const chair=this.getMaterial('chair',new Color3(.12,.18,.25));
  const seat=MeshBuilder.CreateBox('chair-seat',{width:.62,height:.13,depth:.62},this.scene);seat.parent=root;seat.position.set(0,.53,.72);seat.material=chair;
  const backrest=MeshBuilder.CreateBox('chair-back',{width:.62,height:.62,depth:.12},this.scene);backrest.parent=root;backrest.position.set(0,.88,1.0);backrest.material=chair;  const chairFrameParts:Mesh[]=[seat,backrest];
  for(const side of [-1,1]){
   const armSupport=MeshBuilder.CreateBox('chair-arm-support',{width:.055,height:.25,depth:.07},this.scene);armSupport.position.set(side*.35,.69,.78);armSupport.material=chair;chairFrameParts.push(armSupport);
   const armPad=MeshBuilder.CreateBox('chair-arm-pad',{width:.1,height:.075,depth:.44},this.scene);armPad.position.set(side*.35,.82,.78);armPad.material=chair;chairFrameParts.push(armPad);
  }
  chairFrameParts.forEach(mesh=>{mesh.parent=null;});const chairFrame=Mesh.MergeMeshes(chairFrameParts,true,true);if(chairFrame){chairFrame.name='chair-frame';chairFrame.parent=root;chairFrame.material=chair;}
  const chairFabric=this.getMaterial('chair-fabric',new Color3(.16,.24,.31));
  const upholsteryParts:Mesh[]=[];
  const seatPad=MeshBuilder.CreateBox('chair-seat-cushion',{width:.54,height:.065,depth:.54},this.scene);seatPad.position.set(0,.63,.72);seatPad.material=chairFabric;upholsteryParts.push(seatPad);
  const backPad=MeshBuilder.CreateBox('chair-back-cushion',{width:.52,height:.48,depth:.055},this.scene);backPad.position.set(0,.9,.925);backPad.material=chairFabric;upholsteryParts.push(backPad);
  const upholstery=Mesh.MergeMeshes(upholsteryParts,true,true);if(upholstery){upholstery.name='chair-upholstery';upholstery.parent=root;upholstery.material=chairFabric;}
  const chairMetal=this.getMaterial('chair-metal',new Color3(.42,.49,.54));const baseParts:Mesh[]=[];
  const gasLift=MeshBuilder.CreateCylinder('chair-gas-lift',{height:.3,diameter:.105,tessellation:10},this.scene);gasLift.position.set(0,.31,.72);gasLift.material=chairMetal;baseParts.push(gasLift);
  for(const rotation of [0,Math.PI/2]){const spoke=MeshBuilder.CreateBox('chair-base-spoke',{width:.78,height:.045,depth:.065},this.scene);spoke.position.set(0,.16,.72);spoke.rotation.y=rotation;spoke.material=chairMetal;baseParts.push(spoke);}
  for(const [dx,dz] of [[-.3,-.3],[-.3,.3],[.3,-.3],[.3,.3]] as const){const caster=MeshBuilder.CreateSphere('chair-caster',{diameter:.105,segments:8},this.scene);caster.position.set(dx,.105,.72+dz);caster.scaling.y=.62;caster.material=chairMetal;baseParts.push(caster);}
  const chairBase=Mesh.MergeMeshes(baseParts,true,true);if(chairBase){chairBase.name='chair-base';chairBase.parent=root;chairBase.material=chairMetal;}
  const monitor=MeshBuilder.CreateBox('monitor',{width:.65,height:.42,depth:.07},this.scene);monitor.parent=root;monitor.position.set(0,1.2,-.12);const screen=this.getMaterial('screen',new Color3(.035,.07,.12));screen.diffuseTexture=this.createMonitorDisplayTexture();monitor.material=screen;
  const deskAccent=this.getMaterial('desk-accent',new Color3(.22,.28,.32));
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
  // Premium furniture detailing: walnut edge banding, brass joinery, ergonomic upholstery and refined peripherals.
  const woodFinish=wood as StandardMaterial;woodFinish.specularColor=new Color3(.22,.16,.1);woodFinish.specularPower=48;
  const brass=this.getMaterial('desk-brass-detail',new Color3(.68,.49,.25));brass.specularColor=new Color3(.82,.7,.48);brass.specularPower=96;
  const graphite=this.getMaterial('desk-graphite-detail',new Color3(.055,.075,.09));graphite.specularColor=new Color3(.32,.36,.4);graphite.specularPower=72;
  const deskEdge=MeshBuilder.CreateBox('desk-walnut-edge-band',{width:1.52,height:.035,depth:.77},this.scene);deskEdge.parent=root;deskEdge.position.set(0,.78,0);deskEdge.material=brass;
  for(const dx of [-.62,.62]){const collar=MeshBuilder.CreateCylinder('desk-leg-brass-collar',{height:.07,diameter:.105,tessellation:12},this.scene);collar.parent=root;collar.position.set(dx,.12,0);collar.material=brass;}
  // Replace the block-like rear cushion with a softly rounded, contoured lumbar and shoulder profile.
  const lumbar=MeshBuilder.CreateCapsule('chair-lumbar-cushion',{height:.34,radius:.105,tessellation:12},this.scene);lumbar.parent=root;lumbar.position.set(0,.91,.91);lumbar.rotation.x=-.12;lumbar.scaling.set(1.12,.72,.48);lumbar.material=chairFabric;
  const headrest=MeshBuilder.CreateCapsule('chair-headrest',{height:.22,radius:.105,tessellation:12},this.scene);headrest.parent=root;headrest.position.set(0,1.19,.91);headrest.rotation.x=-.12;headrest.scaling.set(.92,.7,.48);headrest.material=chairFabric;
  const chairSeam=this.getMaterial('chair-stitching',new Color3(.42,.34,.25));
  for(const side of [-1,1]){const seam=MeshBuilder.CreateTube('chair-upholstery-seam',{path:[new Vector3(side*.2,.72,.91),new Vector3(side*.22,.88,.91),new Vector3(side*.2,1.05,.91)],radius:.006,tessellation:6},this.scene);seam.parent=root;seam.material=chairSeam;}
  const monitorFrame=MeshBuilder.CreateBox('monitor-bezel',{width:.69,height:.46,depth:.025},this.scene);monitorFrame.parent=root;monitorFrame.position.set(0,1.2,-.165);monitorFrame.material=graphite;
  const monitorCamera=MeshBuilder.CreateSphere('monitor-camera',{diameter:.025,segments:8},this.scene);monitorCamera.parent=root;monitorCamera.position.set(0,1.405,-.149);monitorCamera.material=brass;
  const keyboardKeys=this.getMaterial('keyboard-keycaps',new Color3(.34,.39,.43));
  const keycapParts:Mesh[]=[];for(let row=0;row<3;row++)for(let col=0;col<10;col++){const key=MeshBuilder.CreateBox('keyboard-keycap',{width:.042,height:.012,depth:.035},this.scene);key.position.set(-.25+col*.055,.969,.205+row*.052);key.material=keyboardKeys;keycapParts.push(key);}const keycaps=Mesh.MergeMeshes(keycapParts,true,true);if(keycaps){keycaps.name='keyboard-keycaps';keycaps.parent=root;keycaps.material=keyboardKeys;}
  const mouseWheel=MeshBuilder.CreateCylinder('mouse-scroll-wheel',{height:.025,diameter:.028,tessellation:8},this.scene);mouseWheel.parent=root;mouseWheel.rotation.x=Math.PI/2;mouseWheel.position.set(.48,.986,.265);mouseWheel.material=brass;
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-premium-detail-count',String(this.desks.length*11));
  root.freezeWorldMatrix();
  root.getChildMeshes().forEach(mesh=>{if(['desk-top','desk-leg','chair-frame','chair-upholstery','chair-base','monitor'].includes(mesh.name))this.shadowGenerator.addShadowCaster(mesh);mesh.freezeWorldMatrix();});
  this.desks.push(root);
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-chair-detail-mesh-count',String(this.desks.length*3));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-monitor-ui-count',String(this.desks.length));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-detail-mesh-count',String(this.desks.length*4));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-accessory-mesh-count',String(this.desks.length*3));
  this.engine.getRenderingCanvas()?.setAttribute('data-desk-storage-mesh-count',String(this.desks.length*2));
  return root;
 }
 createMainCharacter(){
  const root=new TransformNode('main-character-player',this.scene);root.position.set(.75,.08,2.75);root.rotation.y=Math.PI/4;this.mainCharacter=root;
  const skin=this.getMaterial('player-skin',new Color3(.72,.48,.34));
  const hair=this.getMaterial('player-hair',new Color3(.075,.065,.06));
  const jacket=this.getMaterial('player-jacket',new Color3(.12,.2,.29));
  const shirt=this.getMaterial('player-shirt',new Color3(.88,.87,.81));
  const trousers=this.getMaterial('player-trousers',new Color3(.11,.14,.19));
  const shoes=this.getMaterial('player-shoes',new Color3(.045,.05,.06));
  const gold=this.getMaterial('player-accent',new Color3(.78,.59,.29));
  const body=MeshBuilder.CreateCapsule('player-jacket-body',{height:.78,radius:.23,tessellation:10},this.scene);body.parent=root;body.position.y=1.08;body.scaling.set(1.05,1,.72);body.material=jacket;
  const shirtFront=MeshBuilder.CreateBox('player-shirt-front',{width:.19,height:.58,depth:.035},this.scene);shirtFront.parent=root;shirtFront.position.set(0,1.12,.205);shirtFront.material=shirt;
  const tie=MeshBuilder.CreateBox('player-tie',{width:.07,height:.32,depth:.035},this.scene);tie.parent=root;tie.position.set(0,1.12,.23);tie.material=gold;
  const playerArms:Mesh[]=[],playerLegs:Mesh[]=[],playerShoes:Mesh[]=[];
  for(const side of [-1,1]){
   const lapel=MeshBuilder.CreateBox('player-lapel',{width:.105,height:.42,depth:.045},this.scene);lapel.parent=root;lapel.position.set(side*.105,1.22,.225);lapel.rotation.z=side*.32;lapel.material=jacket;
   const arm=MeshBuilder.CreateCapsule('player-arm',{height:.66,radius:.09,tessellation:8},this.scene);arm.parent=root;arm.position.set(side*.29,1.08,.015);arm.rotation.z=side*.12;arm.material=jacket;playerArms.push(arm);
   const cuff=MeshBuilder.CreateCylinder('player-cuff',{height:.12,diameter:.19,tessellation:10},this.scene);cuff.parent=root;cuff.position.set(side*.32,.78,.04);cuff.rotation.z=Math.PI/2;cuff.material=shirt;
   const hand=MeshBuilder.CreateSphere('player-hand',{diameter:.17,segments:8},this.scene);hand.parent=root;hand.position.set(side*.33,.68,.05);hand.material=skin;
   const leg=MeshBuilder.CreateCapsule('player-leg',{height:.72,radius:.115,tessellation:8},this.scene);leg.parent=root;leg.position.set(side*.13,.43,0);leg.material=trousers;playerLegs.push(leg);
   const shoe=MeshBuilder.CreateBox('player-shoe',{width:.22,height:.13,depth:.38},this.scene);shoe.parent=root;shoe.position.set(side*.13,.13,.08);shoe.material=shoes;playerShoes.push(shoe);
  }
  const neck=MeshBuilder.CreateCylinder('player-neck',{height:.18,diameter:.16,tessellation:10},this.scene);neck.parent=root;neck.position.y=1.51;neck.material=skin;
  const head=MeshBuilder.CreateSphere('player-head',{diameter:.39,segments:16},this.scene);head.parent=root;head.position.y=1.72;head.scaling.set(.92,1.12,.9);head.material=skin;this.playerHeadMesh=head;
  const hairCap=MeshBuilder.CreateSphere('player-hair-cap',{diameter:.405,segments:16},this.scene);hairCap.parent=root;hairCap.position.set(0,1.87,-.015);hairCap.scaling.set(1,.58,.95);hairCap.material=hair;
  const fringe=MeshBuilder.CreateSphere('player-hair-fringe',{diameter:.22,segments:12},this.scene);fringe.parent=root;fringe.position.set(-.075,1.86,.145);fringe.scaling.set(1.2,.38,.55);fringe.material=hair;const sidePart=MeshBuilder.CreateSphere('player-hair-side-part',{diameter:.24,segments:12},this.scene);sidePart.parent=root;sidePart.position.set(.12,1.83,.025);sidePart.scaling.set(.42,.6,.88);sidePart.material=hair;
  this.playerArms=playerArms;this.playerLegs=playerLegs;this.playerShoes=playerShoes;
  const white=this.getMaterial('player-eye-white',new Color3(.99,.98,.94));const iris=this.getMaterial('player-iris',new Color3(.18,.38,.62));const pupil=this.getMaterial('player-pupil',new Color3(.018,.025,.05));const sparkle=this.getMaterial('player-eye-sparkle',new Color3(1,1,1));[skin,hair,jacket,shirt,trousers,shoes,gold,white,iris,pupil,sparkle].forEach(material=>{material.specularColor=new Color3(.025,.03,.05);material.specularPower=8;});
  for(const side of [-1,1]){
   const eye=MeshBuilder.CreateSphere('player-eye',{diameter:.09,segments:12},this.scene);eye.parent=root;eye.position.set(side*.078,1.735,.178);eye.scaling.z=.42;eye.material=white;
   const irisMesh=MeshBuilder.CreateSphere('player-iris',{diameter:.06,segments:10},this.scene);irisMesh.parent=root;irisMesh.position.set(side*.078,1.735,.222);irisMesh.scaling.z=.4;irisMesh.material=iris;
   const pupilMesh=MeshBuilder.CreateSphere('player-pupil',{diameter:.03,segments:8},this.scene);pupilMesh.parent=root;pupilMesh.position.set(side*.078,1.735,.242);pupilMesh.scaling.z=.4;pupilMesh.material=pupil;const glint=MeshBuilder.CreateSphere('player-eye-glint',{diameter:.022,segments:6},this.scene);glint.parent=root;glint.position.set(side*.06,1.755,.258);glint.material=sparkle;
   const brow=MeshBuilder.CreateBox('player-eyebrow',{width:.09,height:.02,depth:.025},this.scene);brow.parent=root;brow.position.set(side*.078,1.79,.17);brow.rotation.z=side*.08;brow.material=hair;
   const ear=MeshBuilder.CreateSphere('player-ear',{diameter:.09,segments:8},this.scene);ear.parent=root;ear.position.set(side*.18,1.7,0);ear.scaling.set(.55,1,.65);ear.material=skin;
  }

  const nose=MeshBuilder.CreateSphere('player-nose',{diameter:.07,segments:10},this.scene);nose.parent=root;nose.position.set(0,1.69,.2);nose.scaling.set(.65,.85,.8);nose.material=skin;
  const mouth=MeshBuilder.CreateBox('player-mouth',{width:.09,height:.014,depth:.02},this.scene);mouth.parent=root;mouth.position.set(0,1.625,.17);mouth.material=this.getMaterial('player-mouth',new Color3(.32,.12,.12));
  const hairHighlight=this.getMaterial('player-hair-highlight',new Color3(.12,.2,.31));const hairSweep=MeshBuilder.CreateSphere('player-hair-sweep',{diameter:.25,segments:12},this.scene);hairSweep.parent=root;hairSweep.position.set(-.11,1.96,.015);hairSweep.scaling.set(.78,.32,.92);hairSweep.rotation.z=-.18;hairSweep.material=hairHighlight;
  const beard=this.getMaterial('player-beard',new Color3(.16,.12,.1));const chin=MeshBuilder.CreateSphere('player-beard-chin',{diameter:.2,segments:10},this.scene);chin.parent=root;chin.position.set(0,1.59,.105);chin.scaling.set(.9,.38,.65);chin.material=beard;
  const badge=MeshBuilder.CreateBox('player-identity-badge',{width:.16,height:.2,depth:.025},this.scene);badge.parent=root;badge.position.set(-.16,1.08,.235);badge.material=gold;
  const badgeDot=MeshBuilder.CreateSphere('player-badge-mark',{diameter:.055,segments:8},this.scene);badgeDot.parent=root;badgeDot.position.set(-.16,1.1,.255);badgeDot.material=shirt;  const nameplateTexture=new DynamicTexture('player-nameplate-texture',{width:256,height:64},this.scene,false);const nameplateContext=nameplateTexture.getContext();nameplateContext.fillStyle='#14283a';nameplateContext.fillRect(0,0,256,64);nameplateContext.strokeStyle='#c9a66b';nameplateContext.lineWidth=5;nameplateContext.strokeRect(3,3,250,58);nameplateContext.fillStyle='#f3e7cf';nameplateContext.font='bold 28px Arial';nameplateContext.fillText('FOUNDER',60,42);nameplateTexture.update(false);
  const nameplateMaterial=this.getMaterial('player-nameplate-material',new Color3(1,1,1));nameplateMaterial.diffuseTexture=nameplateTexture;nameplateMaterial.emissiveColor=new Color3(.18,.16,.12);
  const nameplate=MeshBuilder.CreatePlane('player-nameplate',{width:.72,height:.18},this.scene);nameplate.parent=root;nameplate.position.set(0,2.12,.015);nameplate.material=nameplateMaterial;nameplate.isPickable=false;
  const featureWall=this.getMaterial('player-feature-wall',new Color3(.16,.24,.3));const featureWallPanel=MeshBuilder.CreateBox('player-feature-wall-panel',{width:.08,height:2.05,depth:1.9},this.scene);featureWallPanel.position.set(4.84,1.15,2.55);featureWallPanel.material=featureWall;
  const featureSlat=this.getMaterial('player-feature-wall-slat',new Color3(.62,.43,.28));for(let slat=0;slat<5;slat++){const detail=MeshBuilder.CreateBox('player-feature-wall-slat',{width:.035,height:1.88,depth:.07},this.scene);detail.position.set(4.9,1.15,1.82+slat*.36);detail.material=featureSlat;}
  const wallEmblem=MeshBuilder.CreateBox('player-feature-wall-emblem',{width:.035,height:.34,depth:.52},this.scene);wallEmblem.position.set(4.92,1.88,2.55);wallEmblem.material=gold;
  this.engine.getRenderingCanvas()?.setAttribute('data-office-feature-wall-slat-count','5');
  const shadowMeshes=root.getChildMeshes();shadowMeshes.forEach(mesh=>{this.shadowGenerator.addShadowCaster(mesh);if(['player-jacket-body','player-head','player-hair-cap','player-hair-fringe','player-leg','player-arm'].includes(mesh.name)){mesh.renderOutline=true;mesh.outlineWidth=.012;mesh.outlineColor=new Color3(.055,.075,.13);}});
  this.playerKeys.clear();const movementKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
  const onPlayerKeyDown=(event:KeyboardEvent)=>{const key=event.code;if(!movementKeys.has(key))return;const target=event.target as HTMLElement|null;if(target&&(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)||target.isContentEditable))return;if(this.placing||document.querySelector('.modal-backdrop'))return;this.playerKeys.add(key);event.preventDefault();};
  const onPlayerKeyUp=(event:KeyboardEvent)=>{this.playerKeys.delete(event.code);};
  window.addEventListener('keydown',onPlayerKeyDown);window.addEventListener('keyup',onPlayerKeyUp);window.addEventListener('blur',()=>this.playerKeys.clear());
  const canvas=this.engine.getRenderingCanvas();canvas?.setAttribute('data-main-character-present','true');canvas?.setAttribute('data-main-character-role','player-founder');canvas?.setAttribute('data-main-character-style','semi-realistic-business');canvas?.setAttribute('data-main-character-anime-blush-count','0');canvas?.setAttribute('data-player-controls','WASD+ArrowKeys');canvas?.setAttribute('data-player-facing-camera','true');canvas?.setAttribute('data-player-x',root.position.x.toFixed(2));canvas?.setAttribute('data-player-z',root.position.z.toFixed(2));canvas?.setAttribute('data-main-character-nameplate','true');canvas?.setAttribute('data-main-character-face-detail-count',String(shadowMeshes.filter(mesh=>/player-(eye|iris|pupil|eyebrow|ear|nose|mouth)/.test(mesh.name)).length));
 }
 syncWorkers(count:number,animateNewWorkers=true){
  const target=Math.max(0,Math.min(Math.floor(count),this.desks.length));
  while(this.workers.length>target){const worker=this.workers.pop()!;this.workerArms.pop();this.workerHeads.pop();this.workerLegs.pop();this.workerShins.pop();this.workerWalkStartedAt.pop();this.workerWalkPaths.pop();this.workerWalkPathLengths.pop();this.workerWalkPathTotalLengths.pop();worker.dispose();}
  while(this.workers.length<target){
   const index=this.workers.length,desk=this.desks[index],worker=new TransformNode('worker-'+(index+1),this.scene);
   worker.parent=desk;worker.rotation.y=Math.PI/4;
   const fixedObstacles=[{x:-4,z:3,halfWidth:.48,halfDepth:.48},{x:4,z:-2,halfWidth:.48,halfDepth:.48},{x:4.48,z:-.55,halfWidth:.38,halfDepth:.95},{x:.75,z:2.75,halfWidth:.38,halfDepth:.38},{x:-4.48,z:1.1,halfWidth:.48,halfDepth:.9},{x:-5,z:0,halfWidth:.09,halfDepth:4},{x:0,z:-4,halfWidth:5,halfDepth:.09}];
   if(animateNewWorkers){
    this.workers.forEach((existing,existingIndex)=>{
     if(performance.now()-this.workerWalkStartedAt[existingIndex]>=3200)return;
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
   worker.position.copyFrom(vectorPath[0]);
   const skinColors=[new Color3(.78,.55,.39),new Color3(.56,.34,.23),new Color3(.91,.71,.55),new Color3(.38,.23,.17)];
   const hairColors=[new Color3(.12,.1,.1),new Color3(.32,.17,.08),new Color3(.55,.34,.16),new Color3(.72,.68,.58)];
   const shirtColors=[new Color3(.91,.88,.81),new Color3(.86,.9,.91),new Color3(.91,.86,.8),new Color3(.88,.9,.84)];
   const jacketColors=[new Color3(.105,.16,.23),new Color3(.19,.22,.24),new Color3(.16,.2,.28),new Color3(.25,.19,.15)];
   const variant=index%shirtColors.length;
   const skin=this.getMaterial('worker-skin-'+(index%skinColors.length),skinColors[index%skinColors.length]);
   const shirt=this.getMaterial('worker-shirt-'+variant,shirtColors[variant]);
   const jacket=this.getMaterial('worker-jacket-'+variant,jacketColors[variant]);
   const hair=this.getMaterial('worker-hair-'+(index%hairColors.length),hairColors[index%hairColors.length]);
   const trousers=this.getMaterial('worker-trousers',new Color3(.12,.19,.27));
   const shoes=this.getMaterial('worker-shoes',new Color3(.055,.065,.075));
   const tieColors=[new Color3(.78,.3,.24),new Color3(.84,.67,.34),new Color3(.3,.52,.66),new Color3(.35,.58,.43)];
   const tie=this.getMaterial('worker-tie-'+variant,tieColors[variant]);
   const bodyShape=index%3;const torso=MeshBuilder.CreateCapsule('worker-torso-'+index,{height:.58,radius:.18,tessellation:10},this.scene);torso.parent=worker;torso.position.set(0,1.03,.65);torso.scaling.set([1.0,1.12,.94][bodyShape],[1,1.04,.96][bodyShape],[.78,.84,.74][bodyShape]);torso.material=jacket; const shirtFront=MeshBuilder.CreateBox('worker-shirt-front-'+index,{width:.13,height:.34,depth:.026},this.scene);shirtFront.parent=worker;shirtFront.position.set(0,1.06,.444);shirtFront.material=this.getMaterial('worker-shirt-front',new Color3(.86,.85,.8)); const lapels:Mesh[]=[];for(const side of [-1,1]){const lapel=MeshBuilder.CreateBox('worker-jacket-lapel-'+index+'-'+side,{width:.105,height:.36,depth:.035},this.scene);lapel.parent=worker;lapel.position.set(side*.105,1.12,.43);lapel.rotation.z=side*.28;lapel.material=jacket;lapels.push(lapel);}const lapelPair=Mesh.MergeMeshes(lapels,true,true);if(lapelPair){lapelPair.name='worker-jacket-lapels-'+index;lapelPair.parent=worker;lapelPair.material=shirt;}
   const necktie=MeshBuilder.CreateBox('worker-necktie-'+index,{width:.075,height:.22,depth:.025},this.scene);necktie.parent=worker;necktie.position.set(0,1.02,.435);necktie.material=tie;
   const headRoot=new TransformNode('worker-head-root-'+index,this.scene);headRoot.parent=worker;headRoot.position.set(0,1.43,.55);
   const faceShape=index%3;const head=MeshBuilder.CreateSphere('worker-head-'+index,{diameter:.34,segments:16},this.scene);head.parent=headRoot;head.position.set(0,0,0);head.scaling.set([.94,.88,1.0][faceShape],[1.08,1.16,1.04][faceShape],[.92,.88,.96][faceShape]);head.material=skin;this.workerHeads.push(headRoot);
   const hairStyle=index%4;const hairCap=MeshBuilder.CreateSphere('worker-hair-'+index,{diameter:.35,segments:16},this.scene);hairCap.parent=headRoot;hairCap.scaling.y=[.4,.56,.34,.62][hairStyle];hairCap.scaling.x=[1.02,.98,1.06,1.0][hairStyle];hairCap.scaling.z=[.98,.94,.92,1.02][hairStyle];hairCap.position.set(0,[.13,.145,.14,.15][hairStyle],0);hairCap.material=hair;
   // Readable facial features turn the former blank head spheres into identifiable people.
   const eyeWhite=this.getMaterial('worker-eye-white',new Color3(.94,.92,.86));
   const iris=this.getMaterial('worker-iris-'+variant,[new Color3(.18,.32,.25),new Color3(.28,.2,.13),new Color3(.16,.28,.4),new Color3(.34,.25,.18)][variant]);
   const pupil=this.getMaterial('worker-pupil',new Color3(.035,.045,.055));
   const features:Mesh[]=[];const blush=skin;const sparkle=eyeWhite;
   for(const side of [-1,1]){
    const eye=MeshBuilder.CreateSphere('worker-eye-'+index+'-'+side,{diameter:.082,segments:12},this.scene);eye.parent=headRoot;eye.position.set(side*.066,.015,.17);eye.scaling.z=.42;eye.material=eyeWhite;features.push(eye);
    const irisMesh=MeshBuilder.CreateSphere('worker-iris-'+index+'-'+side,{diameter:.046,segments:10},this.scene);irisMesh.parent=headRoot;irisMesh.position.set(side*.066,.015,.198);irisMesh.scaling.z=.42;irisMesh.material=iris;features.push(irisMesh);
    const pupilMesh=MeshBuilder.CreateSphere('worker-pupil-'+index+'-'+side,{diameter:.025,segments:8},this.scene);pupilMesh.parent=headRoot;pupilMesh.position.set(side*.066,.015,.215);pupilMesh.scaling.z=.4;pupilMesh.material=pupil;features.push(pupilMesh);const glint=MeshBuilder.CreateSphere('worker-eye-glint-'+index+'-'+side,{diameter:.018,segments:6},this.scene);glint.parent=headRoot;glint.position.set(side*.055,.03,.23);glint.material=sparkle;features.push(glint);
    const brow=MeshBuilder.CreateBox('worker-brow-'+index+'-'+side,{width:.075,height:.018,depth:.025},this.scene);brow.parent=headRoot;brow.position.set(side*.066,.063,.154);brow.rotation.z=side*.08;brow.material=hair;features.push(brow);
    const ear=MeshBuilder.CreateSphere('worker-ear-'+index+'-'+side,{diameter:.085,segments:8},this.scene);ear.parent=headRoot;ear.position.set(side*.166,0,0);ear.scaling.set(.55,1,.62);ear.material=skin;features.push(ear);
   }

   const nose=MeshBuilder.CreateSphere('worker-nose-'+index,{diameter:.065,segments:8},this.scene);nose.parent=headRoot;nose.position.set(0,-.025,.168);nose.scaling.set(.62,.8,.72);nose.material=skin;features.push(nose);
   const mouth=MeshBuilder.CreateBox('worker-mouth-'+index,{width:.075,height:.012,depth:.018},this.scene);mouth.parent=headRoot;mouth.position.set(0,-.065,.154);mouth.material=this.getMaterial('worker-mouth',new Color3(.36,.13,.13));features.push(mouth);
   if(hairStyle===0){const crop=MeshBuilder.CreateSphere('worker-hair-crop-'+index,{diameter:.19,segments:12},this.scene);crop.parent=headRoot;crop.position.set(0,.13,.105);crop.scaling.set(1.12,.3,.62);crop.material=hair;features.push(crop);}else if(hairStyle===1){const fringe=MeshBuilder.CreateSphere('worker-fringe-'+index,{diameter:.24,segments:12},this.scene);fringe.parent=headRoot;fringe.position.set(-.07,.135,.13);fringe.scaling.set(1.25,.42,.62);fringe.rotation.z=-.16;fringe.material=hair;features.push(fringe);const sidePart=MeshBuilder.CreateSphere('worker-side-part-'+index,{diameter:.23,segments:10},this.scene);sidePart.parent=headRoot;sidePart.position.set(.12,.105,.015);sidePart.scaling.set(.42,.72,.9);sidePart.material=hair;features.push(sidePart);}else if(hairStyle===2){const swept=MeshBuilder.CreateSphere('worker-hair-swept-'+index,{diameter:.25,segments:12},this.scene);swept.parent=headRoot;swept.position.set(-.015,.17,-.015);swept.scaling.set(1.12,.3,.92);swept.rotation.z=.1;swept.material=hair;features.push(swept);}else{for(const [lock,x,y,z,sx] of [[0,-.09,.17,.015,.48],[1,0,.19,-.005,.5],[2,.09,.17,.015,.48]] as const){const wave=MeshBuilder.CreateSphere('worker-hair-wave-'+index+'-'+lock,{diameter:.13,segments:10},this.scene);wave.parent=headRoot;wave.position.set(x,y,z);wave.scaling.set(sx,.52,.7);wave.material=hair;features.push(wave);}}if(index%3===1){const beard=MeshBuilder.CreateCapsule('worker-beard-'+index,{height:.13,radius:.07,tessellation:8},this.scene);beard.parent=headRoot;beard.position.set(0,-.105,.12);beard.scaling.set(1.05,.45,.42);beard.material=hair;features.push(beard);}   // Merge same-material face parts into a handful of meshes to keep 20-worker scenes affordable.
   const faceMaterials=[...new Set([eyeWhite,iris,pupil,hair,skin,this.materials['worker-mouth']])];
   faceMaterials.forEach((material,groupIndex)=>{
    const parts=features.filter(mesh=>mesh.material===material);if(!parts.length)return;
    if(parts.length===1){parts[0].name='worker-face-detail-'+index+'-'+groupIndex;return;}
    parts.forEach(mesh=>{mesh.parent=null;});
    const merged=Mesh.MergeMeshes(parts,true,true);if(merged){merged.name='worker-face-detail-'+index+'-'+groupIndex;merged.parent=headRoot;merged.material=material;}
   });
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
    const arm=MeshBuilder.CreateCapsule('worker-arm-'+index+'-'+side,{height:.48,radius:.075,tessellation:6},this.scene);arm.parent=worker;arm.rotation.x=Math.PI/2;arm.position.set(side*.22,1.05,.35);arm.material=jacket;arms.push(arm);
   }
   this.workerArms.push([arms[0],arms[1]]);
   this.workerLegs.push([thighs[0],thighs[1]]);
   this.workerShins.push([shins[0],shins[1]]);
   worker.getChildMeshes().forEach(mesh=>{if(/^(worker-head|worker-hair)-/.test(mesh.name)){mesh.renderOutline=true;mesh.outlineWidth=.01;mesh.outlineColor=new Color3(.055,.075,.13);}if(/^(worker-torso|worker-head|worker-hair|worker-face-detail|worker-thigh|worker-shin|worker-arm|worker-shoes)-/.test(mesh.name))this.shadowGenerator.addShadowCaster(mesh);});
    this.workerWalkStartedAt.push(performance.now()-(animateNewWorkers?0:3200));this.workers.push(worker);
  }
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-model-count',String(this.workers.length));this.engine.getRenderingCanvas()?.setAttribute('data-worker-facing-camera','true');this.engine.getRenderingCanvas()?.setAttribute('data-worker-style','semi-realistic-business');this.engine.getRenderingCanvas()?.setAttribute('data-worker-anime-hair-lock-count',String(this.scene.meshes.filter(mesh=>mesh.name.startsWith('worker-anime-hair-lock-')).length));this.engine.getRenderingCanvas()?.setAttribute('data-worker-anime-blush-count',String(this.scene.meshes.filter(mesh=>mesh.name.startsWith('worker-anime-blush-')).length));this.engine.getRenderingCanvas()?.setAttribute('data-worker-tailored-jacket-count',String(this.workers.length));this.engine.getRenderingCanvas()?.setAttribute('data-worker-hair-style-count',String(new Set(this.workers.map((_,index)=>index%4)).size));this.engine.getRenderingCanvas()?.setAttribute('data-worker-hairstyle-types',['short-crop','side-swept','brushed-back','soft-wave'].filter((_,style)=>this.workers.some((__,index)=>index%4===style)).join(','));this.engine.getRenderingCanvas()?.setAttribute('data-worker-face-shape-count',String(new Set(this.workers.map((_,index)=>index%3)).size));this.engine.getRenderingCanvas()?.setAttribute('data-worker-body-shape-count',String(new Set(this.workers.map((_,index)=>index%3)).size));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-appearance-variant-count',String(new Set(this.workers.map((_,index)=>index%4)).size));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-idle-pose-types',['typing','reviewing','thinking'].filter((_,pose)=>this.workers.some((__,index)=>index%3===pose)).join(','));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-arrival-waypoint-counts',this.workerWalkPaths.map(path=>String(path.length)).join(','));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-leg-mesh-count',String(this.workers.length*5));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-necktie-mesh-count',String(this.workers.length));
  this.engine.getRenderingCanvas()?.setAttribute('data-worker-face-detail-mesh-count',String(this.scene.meshes.filter(mesh=>mesh.name.startsWith('worker-face-detail-')).length));
  this.engine.getRenderingCanvas()?.setAttribute('data-scene-material-count',String(this.scene.materials.length));
 }
 createPremiumOfficeDetails(){
  const gold=this.getMaterial('premium-champagne-gold',new Color3(.76,.61,.38));
  gold.specularColor=new Color3(.9,.76,.52);gold.specularPower=96;
  const navy=this.getMaterial('premium-navy-panel',new Color3(.075,.12,.18));
  const ivory=this.getMaterial('premium-ivory-detail',new Color3(.88,.83,.72));
  const glow=this.getMaterial('premium-warm-glow',new Color3(1,.79,.48));
  glow.emissiveColor=new Color3(.85,.48,.16);
  const add=(mesh:Mesh)=>{mesh.isPickable=false;mesh.receiveShadows=false;};
  // Champagne inlay defines the room footprint against the darker exterior stone.
  for(const [name,width,depth,x,z] of [
   ['back',9.58,.045,0,-3.82],['front',9.58,.045,0,3.82],
   ['left',.045,7.64,-4.78,0],['right',.045,7.64,4.78,0]
  ] as const){const line=MeshBuilder.CreateBox('premium-floor-inlay-'+name,{width,height:.018,depth},this.scene);line.position.set(x,.058,z);line.material=gold;add(line);}
  // Gold-capped cutaway parapets keep the office readable from the approved gameplay camera.
  for(const [side,x] of [['left',-3.125],['right',3.125]] as const){const cap=MeshBuilder.CreateBox('premium-front-parapet-cap-'+side,{width:3.78,height:.045,depth:.22},this.scene);cap.position.set(x,1.265,4);cap.material=gold;add(cap);}
  // A restrained second line gives the founder's rug a tailored, executive finish.
  for(const [name,width,depth,x,z] of [
   ['front',4.34,.028,0,.12],['back',4.34,.028,0,2.78],
   ['left',.028,2.66,-2.17,1.45],['right',.028,2.66,2.17,1.45]
  ] as const){const line=MeshBuilder.CreateBox('premium-rug-inlay-'+name,{width,height:.014,depth},this.scene);line.position.set(x,.087,z);line.material=gold;add(line);}
  const medallion=MeshBuilder.CreateCylinder('premium-rug-medallion',{diameter:.46,height:.018,tessellation:32},this.scene);medallion.position.set(0,.09,1.45);medallion.material=gold;add(medallion);
  const medallionCore=MeshBuilder.CreateCylinder('premium-rug-medallion-core',{diameter:.3,height:.02,tessellation:8},this.scene);medallionCore.position.set(0,.102,1.45);medallionCore.material=navy;add(medallionCore);
  // Slim wall rails and a framed brand panel bring the architecture up to the approved navy-and-gold direction.
  for(const [name,x] of [['left',-4.86],['right',4.86]] as const){
   const rail=MeshBuilder.CreateBox('premium-wall-rail-'+name,{width:.045,height:.035,depth:7.62},this.scene);rail.position.set(x,.34,0);rail.material=gold;add(rail);
  }
  const brandPanel=MeshBuilder.CreateBox('premium-brand-panel',{width:.055,height:1.28,depth:.78},this.scene);brandPanel.position.set(-4.84,1.48,-2.95);brandPanel.material=navy;add(brandPanel);
  for(const [name,y] of [['top',2.12],['bottom',.84]] as const){const edge=MeshBuilder.CreateBox('premium-brand-panel-edge-'+name,{width:.075,height:.035,depth:.86},this.scene);edge.position.set(-4.79,y,-2.95);edge.material=gold;add(edge);}
  const brandMark=MeshBuilder.CreateTorus('premium-brand-mark',{diameter:.42,thickness:.035,tessellation:32},this.scene);brandMark.position.set(-4.79,1.55,-2.95);brandMark.rotation.y=Math.PI/2;brandMark.material=gold;add(brandMark);
  const brandCore=MeshBuilder.CreateBox('premium-brand-core',{width:.035,height:.2,depth:.2},this.scene);brandCore.position.set(-4.77,1.55,-2.95);brandCore.material=ivory;add(brandCore);
  // Three brass pendants and warm point lights add a layered executive-office lighting scheme.
  for(const [index,x] of [-2.7,0,2.7].entries()){
   const cable=MeshBuilder.CreateCylinder('premium-pendant-cable-'+index,{height:.32,diameter:.018,tessellation:8},this.scene);cable.position.set(x,2.02,-.65);cable.material=gold;add(cable);
   const shade=MeshBuilder.CreateCylinder('premium-pendant-shade-'+index,{height:.13,diameter:.34,tessellation:24},this.scene);shade.position.set(x,1.79,-.65);shade.material=navy;add(shade);
   const rim=MeshBuilder.CreateTorus('premium-pendant-rim-'+index,{diameter:.31,thickness:.022,tessellation:24},this.scene);rim.position.set(x,1.72,-.65);rim.material=gold;add(rim);
   const bulb=MeshBuilder.CreateSphere('premium-pendant-bulb-'+index,{diameter:.095,segments:10},this.scene);bulb.position.set(x,1.69,-.65);bulb.material=glow;add(bulb);
   const light=new PointLight('premium-pendant-light-'+index,new Vector3(x,1.72,-.65),this.scene);light.diffuse=new Color3(1,.76,.49);light.intensity=.18;light.range=5;
  }
  const canvas=this.engine.getRenderingCanvas();
  canvas?.setAttribute('data-office-premium-detail-count',String(this.scene.meshes.filter(mesh=>mesh.name.startsWith('premium-')).length));
  canvas?.setAttribute('data-office-premium-pendant-count','3');canvas?.setAttribute('data-office-light-count',String(this.scene.lights.length));
 }
 createOfficeUpgradeDecor(){
  const add=(mesh:Mesh,requiredLevel:number)=>{mesh.isPickable=false;mesh.setEnabled(false);this.officeUpgradeDecor.push({mesh,requiredLevel});};
  const beam=this.getMaterial('office-upgrade-beam',new Color3(.3,.24,.18));
  const gold=this.getMaterial('office-upgrade-gold',new Color3(.72,.55,.3));
  const lamp=this.getMaterial('office-upgrade-lamp',new Color3(.94,.8,.53));lamp.emissiveColor=new Color3(.22,.14,.055);
  const bulb=this.getMaterial('office-upgrade-bulb',new Color3(1,.88,.62));bulb.emissiveColor=new Color3(.8,.52,.2);
  const beamMesh=MeshBuilder.CreateBox('office-upgrade-ceiling-beam',{width:9.1,height:.09,depth:.13},this.scene);beamMesh.position.set(0,2.23,-2.55);beamMesh.material=beam;add(beamMesh,2);
  for(const x of [-2.35,0,2.35]){
   const cable=MeshBuilder.CreateCylinder('office-upgrade-pendant-cable',{height:.29,diameter:.018,tessellation:8},this.scene);cable.position.set(x,2.04,-2.55);cable.material=gold;add(cable,2);
   const shade=MeshBuilder.CreateCylinder('office-upgrade-pendant-shade',{height:.12,diameter:.32,tessellation:16},this.scene);shade.position.set(x,1.835,-2.55);shade.material=lamp;add(shade,2);
   const glow=MeshBuilder.CreateSphere('office-upgrade-pendant-bulb',{diameter:.105,segments:8},this.scene);glow.position.set(x,1.75,-2.55);glow.material=bulb;add(glow,2);
  }
  const displayFrameMat=this.getMaterial('office-upgrade-display-frame',new Color3(.18,.24,.31));
  const displayMat=this.getMaterial('office-upgrade-display',new Color3(.025,.1,.17));displayMat.emissiveColor=new Color3(.025,.11,.19);
  const graphMat=this.getMaterial('office-upgrade-display-graph',new Color3(.28,.75,.78));graphMat.emissiveColor=new Color3(.08,.32,.34);
  const frame=MeshBuilder.CreateBox('office-upgrade-display-frame',{width:.9,height:.92,depth:.09},this.scene);frame.position.set(2.35,1.58,-3.84);frame.material=displayFrameMat;add(frame,3);
  const screen=MeshBuilder.CreateBox('office-upgrade-display-screen',{width:.78,height:.78,depth:.035},this.scene);screen.position.set(2.35,1.58,-3.775);screen.material=displayMat;add(screen,3);
  for(let i=0;i<3;i++){const bar=MeshBuilder.CreateBox('office-upgrade-display-bar',{width:.2+i*.08,height:.025,depth:.018},this.scene);bar.position.set(2.25+i*.12,1.4+i*.13,-3.75);bar.material=graphMat;add(bar,3);}
  const rugGold=this.getMaterial('office-upgrade-rug-border',new Color3(.72,.56,.32));
  for(const [name,width,depth,x,z] of [['front',4.2,.035,0,.15],['back',4.2,.035,0,2.75],['left',.035,2.6,-2.1,1.45],['right',.035,2.6,2.1,1.45]] as const){const strip=MeshBuilder.CreateBox('office-upgrade-rug-'+name,{width,height:.018,depth},this.scene);strip.position.set(x,.086,z);strip.material=rugGold;add(strip,3);}
  const plaqueFrame=MeshBuilder.CreateBox('office-upgrade-executive-plaque-frame',{width:.08,height:.92,depth:1.18},this.scene);plaqueFrame.position.set(4.83,1.5,.85);plaqueFrame.material=displayFrameMat;add(plaqueFrame,4);
  const plaque=MeshBuilder.CreateBox('office-upgrade-executive-plaque',{width:.035,height:.76,depth:1.02},this.scene);plaque.position.set(4.775,1.5,.85);plaque.material=gold;add(plaque,4);
  const emblem=MeshBuilder.CreateBox('office-upgrade-executive-emblem',{width:.025,height:.22,depth:.38},this.scene);emblem.position.set(4.75,1.68,.85);emblem.material=lamp;add(emblem,4);
 }
 applyOfficeLevel(level:number){
  const tier=Math.max(1,Math.min(4,Math.floor(level)||1));this.officeVisualTier=tier;
  const colors:Record<string,Color3>={
   wall:tier===1?new Color3(.83,.81,.75):tier===2?new Color3(.88,.86,.79):tier===3?new Color3(.92,.89,.81):new Color3(.96,.93,.86),
   tile:tier===1?new Color3(.72,.68,.59):tier===2?new Color3(.79,.75,.66):tier===3?new Color3(.85,.81,.72):new Color3(.9,.86,.77),
   'architectural-trim':tier===1?new Color3(.16,.22,.29):tier===2?new Color3(.24,.24,.25):tier===3?new Color3(.58,.45,.26):new Color3(.78,.63,.36),
   rugmat:tier===1?new Color3(.13,.2,.29):tier===2?new Color3(.18,.28,.4):tier===3?new Color3(.24,.2,.38):new Color3(.27,.18,.35),
   deskwood:tier===1?new Color3(.65,.43,.27):tier===2?new Color3(.82,.68,.49):tier===3?new Color3(.92,.78,.55):new Color3(.98,.86,.65),
   chair:tier===1?new Color3(.12,.18,.25):tier===2?new Color3(.15,.25,.32):tier===3?new Color3(.24,.22,.42):new Color3(.3,.2,.4),
   'chair-fabric':tier===1?new Color3(.16,.24,.31):tier===2?new Color3(.18,.32,.4):tier===3?new Color3(.26,.3,.5):new Color3(.3,.26,.45),
   'chair-metal':tier<2?new Color3(.42,.49,.54):tier===2?new Color3(.58,.46,.3):tier===3?new Color3(.7,.56,.33):new Color3(.8,.66,.4),
   'bookcase-wood':tier<3?new Color3(.43,.32,.24):new Color3(.55,.37,.22),
   'desk-accent':tier<2?new Color3(.22,.28,.32):tier===2?new Color3(.45,.34,.22):new Color3(.65,.5,.28)
  };
  for(const [name,color] of Object.entries(colors))this.materials[name]?.diffuseColor.copyFrom(color);
  let visible=0;for(const item of this.officeUpgradeDecor){const enabled=tier>=item.requiredLevel;item.mesh.setEnabled(enabled);if(enabled)visible++;}
  const canvas=this.engine.getRenderingCanvas();canvas?.setAttribute('data-office-visual-tier',String(tier));canvas?.setAttribute('data-office-upgrade-decor-count',String(visible));
 }
  createCityscapeTexture(){
   const existing=this.surfaceTextures['cityscape-backdrop'];if(existing)return existing;
   const texture=new DynamicTexture('cityscape-backdrop',{width:512,height:256},this.scene,false);
   const ctx=texture.getContext();
   const sky=ctx.createLinearGradient(0,0,0,256);sky.addColorStop(0,'#6f9db7');sky.addColorStop(.58,'#c7d8d5');sky.addColorStop(1,'#f3c991');ctx.fillStyle=sky;ctx.fillRect(0,0,512,256);
   ctx.fillStyle='rgba(255,230,184,.72)';ctx.beginPath();ctx.arc(418,68,27,0,Math.PI*2);ctx.fill();
   const farBuildings:[number,number,number,number][]=[
    [0,116,42,140],[35,91,35,165],[66,128,52,128],[111,76,39,180],[146,110,45,146],[188,88,47,168],
    [230,121,36,135],[263,70,52,186],[311,105,43,151],[350,84,48,172],[394,116,39,140],[429,93,42,163],[468,126,44,130]
   ];
   for(const [x,y,width,height] of farBuildings){ctx.fillStyle='#9db9c5';ctx.fillRect(x,y,width,height);ctx.fillStyle='rgba(255,224,170,.48)';for(let wx=x+7;wx<x+width-4;wx+=12)for(let wy=y+10;wy<y+height-5;wy+=15)ctx.fillRect(wx,wy,4,6);}
   const nearBuildings:[number,number,number,number][]=[
    [0,159,54,97],[47,137,48,119],[91,169,58,87],[145,132,51,124],[193,158,58,98],[247,143,50,113],
    [293,166,57,90],[346,132,54,124],[396,151,61,105],[453,140,59,116]
   ];
   for(const [x,y,width,height] of nearBuildings){ctx.fillStyle='#66879a';ctx.fillRect(x,y,width,height);ctx.fillStyle='rgba(255,214,145,.64)';for(let wx=x+8;wx<x+width-5;wx+=13)for(let wy=y+11;wy<y+height-5;wy+=16)ctx.fillRect(wx,wy,5,7);}
   ctx.fillStyle='#1b3044';ctx.fillRect(0,235,512,21);
   texture.update(false);this.surfaceTextures['cityscape-backdrop']=texture;return texture;
  }
  createMonitorDisplayTexture(){
  const existing=this.surfaceTextures['monitor-ui-display'];if(existing)return existing;
  const texture=new DynamicTexture('monitor-ui-display',{width:512,height:512},this.scene,false);
  const ctx=texture.getContext();
  ctx.fillStyle='#101c2b';ctx.fillRect(0,0,512,512);
  ctx.fillStyle='#172a3d';ctx.fillRect(0,0,512,54);
  ctx.fillStyle='#e9f0f3';ctx.font='bold 20px Arial';ctx.fillText('OFFICE / CONTROL',20,34);
  ctx.fillStyle='#39b9a4';ctx.fillRect(20,68,7,7);ctx.fillStyle='#9bb2c1';ctx.font='13px Arial';ctx.fillText('LIVE WORKSPACE',36,78);
  ctx.fillStyle='#1b3044';ctx.fillRect(18,94,476,112);ctx.fillRect(18,220,228,118);ctx.fillRect(264,220,230,118);
  ctx.fillStyle='#7f9aac';ctx.font='12px Arial';ctx.fillText('WEEKLY PERFORMANCE',32,116);ctx.fillText('TASK FLOW',32,242);ctx.fillText('TEAM ACTIVITY',278,242);
  ctx.strokeStyle='#31536b';ctx.lineWidth=1;for(let y=132;y<194;y+=20){ctx.beginPath();ctx.moveTo(32,y);ctx.lineTo(478,y);ctx.stroke();}
  ctx.strokeStyle='#45c7b0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(34,181);ctx.lineTo(92,168);ctx.lineTo(151,174);ctx.lineTo(211,145);ctx.lineTo(270,155);ctx.lineTo(330,133);ctx.lineTo(389,142);ctx.lineTo(470,119);ctx.stroke();
  const bars=[38,61,48,78,91,70];bars.forEach((height,index)=>{ctx.fillStyle=index===4?'#e2b86b':'#3d9f9a';ctx.fillRect(34+index*30,320-height,17,height);});
  for(let i=0;i<4;i++){ctx.fillStyle=i===0?'#45c7b0':'#35546b';ctx.beginPath();ctx.arc(286,270+i*17,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#a8bac5';ctx.fillRect(300,266+i*17,150-(i%2)*36,7);}
  ctx.fillStyle='#172a3d';ctx.fillRect(18,356,476,136);ctx.fillStyle='#7f9aac';ctx.font='12px Arial';ctx.fillText('PROJECT STATUS',32,378);
  for(let i=0;i<3;i++){ctx.fillStyle='#a8bac5';ctx.fillRect(32,397+i*28,92,6);ctx.fillStyle='#263f53';ctx.fillRect(142,394+i*28,320,12);ctx.fillStyle=['#45c7b0','#e2b86b','#6f9ed0'][i];ctx.fillRect(142,394+i*28,[244,188,276][i],12);}
  texture.update(false);this.surfaceTextures['monitor-ui-display']=texture;return texture;
 }
 createSurfaceTexture(name:string,base:string,accent:string,detailCount:number){
  const existing=this.surfaceTextures[name];if(existing)return existing;
  const texture=new DynamicTexture(name,{width:512,height:512},this.scene,false);
  const context=texture.getContext();context.fillStyle=base;context.fillRect(0,0,512,512);
  let seed=name.length*7919;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<detailCount;i++){const x=random()*512,y=random()*512;context.globalAlpha=.035+random()*.055;context.fillStyle=accent;context.fillRect(x,y,1+random()*5,1+random()*3);}
  context.globalAlpha=1;texture.update(false);this.surfaceTextures[name]=texture;return texture;
 } getMaterial(name:string,color:Color3){
  const existing=this.materials[name];
  if(existing)return existing;
  const material=new StandardMaterial(name,this.scene);
  material.diffuseColor=color;material.specularColor=new Color3(.16,.18,.2);material.specularPower=48;
  this.materials[name]=material;
  return material;
 }
}

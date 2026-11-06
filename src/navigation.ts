export interface DeskObstacle { x: number; z: number }
export interface ArrivalPoint { x: number; y: number; z: number }
const HALF_WIDTH=1.05, HALF_DEPTH=.68;
function pointBlocked(x:number,z:number,obs:DeskObstacle[]):boolean{return obs.some(o=>Math.abs(x-o.x)<HALF_WIDTH&&Math.abs(z-o.z)<HALF_DEPTH);}
function distance(a:ArrivalPoint,b:ArrivalPoint):number{return Math.hypot(b.x-a.x,b.z-a.z);}
function segmentBlocked(a:ArrivalPoint,b:ArrivalPoint,obs:DeskObstacle[]):boolean{
 const steps=Math.max(2,Math.ceil(distance(a,b)/.12));
 for(let i=1;i<steps;i++){const t=i/steps;if(pointBlocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,obs))return true;}
 return false;
}
function routeLength(points:ArrivalPoint[]):number{return points.slice(1).reduce((s,p,i)=>s+distance(points[i],p),0);}
/** Plans a deterministic local-space arrival route around nearby desk footprints. */
export function planWorkerArrivalPath(ownDesk:DeskObstacle,desks:DeskObstacle[]):ArrivalPoint[]{
 const obs=desks.filter(d=>d!==ownDesk&&(d.x!==ownDesk.x||d.z!==ownDesk.z)).map(d=>({x:d.x-ownDesk.x,z:d.z-ownDesk.z}));
 const start={x:0,y:0,z:2.1};
 const candidates:ArrivalPoint[][]=[-1,1].map(side=>[
  start,{x:side*1.35,y:0,z:2.1},{x:side*1.35,y:0,z:1.65},
  {x:side*1.35,y:0,z:.55},{x:side*.62,y:0,z:.42},{x:0,y:0,z:0}
 ]);
 const clear=candidates.filter(route=>route.slice(1).every((p,i)=>!segmentBlocked(route[i],p,obs)));
 const selected=(clear.length?clear:candidates).sort((a,b)=>routeLength(a)-routeLength(b))[0];
 return selected.map(p=>({...p}));
}

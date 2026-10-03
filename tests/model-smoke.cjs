const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const events=new Map(),elements=new Map(),downloads=[],blobs=new Map();
function element(id=''){const el={id,style:{},dataset:{},value:'',checked:false,hidden:false,clientWidth:1440,clientHeight:650,children:[],options:[],textContent:'',addEventListener(type,fn){events.set(id+':'+type,fn)},append(child){this.children.push(child);if(id==='room-select'||id==='item-select')this.options.push(child)},setAttribute(k,v){this[k]=v},focus(){},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:1440,height:650}},click(){if(this.download)downloads.push({name:this.download,blob:blobs.get(this.href)})},toDataURL(){return 'data:image/png;base64,'}};return el;}
for(const id of ['bunker-viewer','model-canvas','model-stage','model-labels','model-message','room-select','room-detail','gap','gap-value','rock','labels','route','home','top','focus-room','export-model','export-image','walk-toggle','walk-up','walk-down','walk-status','walk-pad','item-select','item-inspector','item-title','item-description','item-variant','item-color','item-apply','item-reset','item-focus','item-save-status','blast-door','interact','drive','pickup','drop','shoot','reload','drone-hatch','game-status','crosshair','ammo-hud','vehicle-mods','mod-armor','mod-tires','mod-rack','mod-lights','apply-mods','mouse-lock','take-ammo','reserve-summary','open-lid'])elements.set(id,element(id));
elements.get('item-variant').options=[element(),element()];
elements.get('labels').checked=true;elements.get('route').checked=true;elements.get('rock').checked=true;elements.get('gap').value='6';
const buttons=['all','0','1','2','3','4'].map(f=>{const el=element('floor-'+f);el.dataset.floor=f;return el});
const root=elements.get('bunker-viewer');root.querySelector=s=>elements.get(s.slice(1));root.querySelectorAll=s=>s==='[data-floor]'?buttons:[];
const storage=new Map();const ctx={console,Blob,devicePixelRatio:1,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},addEventListener:(k,fn)=>events.set('window:'+k,fn),setTimeout:fn=>fn(),requestAnimationFrame(){},matchMedia:()=>({matches:false,addEventListener(){}}),ResizeObserver:class{constructor(fn){this.fn=fn}observe(){this.fn()}},URL:{createObjectURL(blob){const key='blob:'+blobs.size;blobs.set(key,blob);return key},revokeObjectURL(){}},document:{getElementById:id=>elements.get(id),createElement:()=>element()}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/three.min.js'),'utf8'),ctx);
ctx.THREE.WebGLRenderer=class{setPixelRatio(){}setSize(){}render(){}};
const html=fs.readFileSync(path.join(__dirname,'../public/model-fragment.html'),'utf8');
const code=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
vm.runInContext(code,ctx,{timeout:30000});
const model=ctx.bunkerModel;assert(model,'model initialized');assert.equal(model.floors.length,5);assert(model.rooms.length>=20);
const counts={trucks:0,generators:0,firearmAlcoves:0,storedSilhouettes:0,vehicleGates:0};model.model.traverse(o=>{if(o.name==='heavy-truck')counts.trucks++;if(o.name==='generator')counts.generators++;if(o.name==='firearm-storage-alcove'){counts.firearmAlcoves++;assert(['独立无人机间','维修工坊'].includes(model.rooms[Number(o.parent.userData.room)].name));}if(o.name==='stored-firearm-silhouette')counts.storedSilhouettes++;if(o.name==='vehicle-isolation-gate')counts.vehicleGates++;});assert.equal(counts.trucks,4);assert.equal(counts.generators,10);assert.equal(counts.firearmAlcoves,2);assert.equal(counts.storedSilhouettes,16);assert.equal(counts.vehicleGates,4);assert.equal(model.state.coverDepth,32);assert.equal(model.model.getObjectByName('thick-rock-cap').scale.y,32);assert(model.model.getObjectByName('drone-surface-lift'));
model.setFloor('0');assert.deepEqual(Array.from(model.floors,f=>f.visible),[true,false,false,false,false]);
const drone=model.rooms.find(r=>r.name==='独立无人机间'),garage=model.rooms.find(r=>r.name==='九车位车辆库'),control=model.rooms.find(r=>r.name==='总监控室');assert.equal(drone.floor,0);assert(garage.x<drone.x&&drone.x<control.x);
model.setSelection(drone.id);assert(elements.get('room-detail').textContent.includes('室外起降点'));
events.get('focus-room:click')();assert.equal(model.state.mode,'0');assert(model.state.radius<50);
elements.get('gap').value='12';events.get('gap:input')({target:elements.get('gap')});assert.equal(model.state.gap,12);assert.equal(model.floors[0].position.y,84);
events.get('model-canvas:keydown')({key:'ArrowRight',preventDefault(){}});assert(model.state.theta>.3);
events.get('model-canvas:wheel')({deltaY:-100,preventDefault(){}});assert(model.state.radius<280);
elements.get('route').checked=false;events.get('route:change')();assert.equal(model.model.getObjectByName('drone-transfer-route').visible,false);
elements.get('route').checked=true;elements.get('gap').value='0';events.get('gap:input')({target:elements.get('gap')});model.setFloor('all');model.setSelection('');
assert(model.items.length>100,'individual item catalog');
assert.equal(model.counts.warehousePackages,2160);
assert.equal(model.game.gunTypes.length,8);
assert.equal(new Set(model.items.filter(i=>i.type==='firearm').map(i=>i.group.userData.gunKey)).size,8);
assert.equal(model.game.ammoCrates.length,48);
for(const pool of ['P','R','S','D','M'])assert(model.game.ammoCrates.some(g=>g.userData.ammoPool===pool));
for(const r of model.rooms){assert(r.pad.material.map,'room floor has a pixel surface map');assert(r.group.getObjectByName('architectural-details'));}

assert(model.model.getObjectByName('garage-drone-blast-partition'),'solid separation between garage and drone room');
model.setSelection(drone.id);model.enterWalk();assert(model.state.walking);assert.equal(model.state.gap,0);assert.equal(model.state.walkFloor,0);assert.equal(elements.get('gap').disabled,true);
const before=model.state.walkPosition.z;model.moveWalk(0,-1);assert(model.state.walkPosition.z<before,'walks forward');model.moveWalk(200,0);assert(model.state.walkPosition.x<62,'cannot leave floor edge');model.moveWalk(0,100);assert(model.state.walkPosition.z<27,'cannot walk through perimeter');
model.changeWalkFloor(4);assert.equal(model.state.walkFloor,4);assert.equal(model.state.walkPosition.y,1.75);
assert(!model.canWalk(-49,-8,4),'tank blocks player');
model.exitWalk();assert(!model.state.walking);assert.equal(elements.get('gap').disabled,false);
model.setFloor('all');model.rebuildColliders();
model.doors.forEach(d=>d.open=1);for(const room of model.rooms){if(room.name==='单人生活区')continue;assert(model.canWalk(room.x,13.5,room.floor),room.name+' hallway access');assert(model.canWalk(room.x,11,room.floor),room.name+' front doorway');}
assert(model.canWalk(-7,-2,0),'garage-drone partition portal connects');assert(!model.canWalk(-7,-8,0),'partition blocks elsewhere');
model.doors.forEach(d=>d.open=0);events.get('blast-door:click')();model.animateDoors(.2);assert.equal(model.doors.find(d=>d.blast).open,1);events.get('blast-door:click')();model.animateDoors(.2);assert.equal(model.doors.find(d=>d.blast).open,0);
const living=model.rooms.find(r=>r.name==='单人生活区');
assert.equal(control.x+control.w/2,living.x-living.w/2,'shared wall without corridor gap');
assert(model.model.getObjectByName('control-living-single-blast-door'));
for(const x of [32.4,33,33.6])assert(model.canWalk(x,3,0),'walk through direct control-living doorway');
assert(!model.canWalk(33,-4,0),'shared wall blocks except doorway');
assert.equal(model.items.filter(i=>i.group.name==='light-offroad').length,2);
assert.equal(model.items.filter(i=>i.group.name==='heavy-offroad').length,3);
const warehouses=model.rooms.filter(r=>r.floor===3&&r.name!=='维修工坊');
assert.equal(warehouses.reduce((n,r)=>n+model.items.filter(i=>i.roomId===r.id&&i.type==='shelf').length,0),108);
assert(warehouses.every(r=>r.d===62),'storage footprint expanded');
assert(model.canWalk(-46,-53,3),'expanded rear service gallery reachable');
assert(model.canWalk(-30.5,-35,0),'expanded garage gallery reachable');
const suv=model.items.find(i=>i.type==='offroad');model.replaceItem(suv,1,'olive');assert(suv.extra);model.replaceItem(suv,0,'original');assert.equal(suv.extra,null);
const access=model.model.getObjectByName('arrival-and-drone-route');model.setFloor('0');assert(access.visible,'road visible in B1');
const segments=[];access.traverse(o=>{if(o.name==='vehicle-road-segment')segments.push(o)});
assert.equal(segments.length,4);
for(const segment of segments){const b=new ctx.THREE.Box3().setFromObject(segment);assert(b.max.x<=garage.x-garage.w/2+.001,'road stays outside garage footprint');}
assert.equal(model.model.getObjectByName('garage-side-vehicle-door').scale.y,1.8,'truck doorway has vehicle clearance');for(const o of model.floors[0].children){if(!o.isMesh)continue;const b=new ctx.THREE.Box3().setFromObject(o);const base=model.floors[0].position.y;if(b.max.y-base>.42&&b.min.y-base<2.5)assert(!(b.min.x<3.77&&b.max.x>3.23&&b.min.z<-18.43&&b.max.z>-18.97),'floor boundary wall preserves drone passage');}
for(const name of ['drone-public-isolation-door','drone-transfer-isolation-door','transfer-lift-isolation-door']){const frame=model.model.getObjectByName(name);assert(frame?.userData.isolation,name);model.toggleIsolationDoor(name);model.animateDoors(.2);assert.equal(model.doors.find(d=>d.frame===frame).open,1);model.toggleIsolationDoor(name);model.animateDoors(.2);assert.equal(model.doors.find(d=>d.frame===frame).open,0);}
model.setFloor('all');model.rebuildColliders();model.doors.forEach(d=>d.open=1);assert(model.canWalk(3.5,-16,0),'drone transfer threshold');assert(model.canWalk(3.5,-39,0),'transfer corridor turn');assert(model.canWalk(-63,-40,0),'lift isolation threshold');assert(!model.canWalk(-63,-38,0),'lift partition solid beside door');assert(model.canWalk(-68,-40,0),'cargo lift entrance');
const truckItem=model.items.find(i=>i.type==='truck'),otherTruck=model.items.filter(i=>i.type==='truck')[1];
const otherMaterial=otherTruck.group.children.find(o=>o.isMesh).material;
model.selectItem(truckItem.id);model.replaceItem(truckItem,1,'slate');assert.equal(truckItem.cargo.visible,false);assert.equal(truckItem.variant,1);assert.equal(otherTruck.group.children.find(o=>o.isMesh).material,otherMaterial,'replacement isolated to one item');assert(storage.get('bunker-item-edits-v1').includes('slate'));
model.replaceItem(truckItem,0,'original');assert(truckItem.cargo.visible);assert.equal(truckItem.extra,null);
const tankItem=model.items.find(i=>i.type==='tank'),tankOriginal=tankItem.group.geometry;model.replaceItem(tankItem,1,'original');assert.notEqual(tankItem.group.geometry,tankOriginal);model.replaceItem(tankItem,0,'original');assert.equal(tankItem.group.geometry,tankOriginal);
model.selectItem('');model.setSelection('');model.setFloor('all');model.doors.forEach(d=>{d.open=0;d.frame.userData.manual=false;});

const game=model.game;assert(game,'game engine available');
const hall=model.model.getObjectByName('normally-closed-hallway-blast-door');assert(hall.userData.normallyClosed);
game.setPlayerPosition(-9,15,36,0);model.animateDoors(.2);assert.equal(model.doors.find(d=>d.frame===hall).open,0,'normally closed door does not open by proximity');
assert(!model.canWalk(-7,15,0),'closed blast door blocks player');model.toggleIsolationDoor(hall);model.animateDoors(.2);assert(model.canWalk(-7,15,0));
game.setPlayerPosition(-5,15,36,0);game.tick(4.1);model.animateDoors(.2);assert.equal(model.doors.find(d=>d.frame===hall).open,0,'manual door closes after use');
function walkTo(x,z,max=6000){let n=0;while(Math.hypot(x-model.state.walkPosition.x,z-model.state.walkPosition.z)>.025&&n++<max){const p=model.state.walkPosition,d=Math.hypot(x-p.x,z-p.z);model.animateDoors(.05);model.moveWalk((x-p.x)/d*Math.min(.08,d),(z-p.z)/d*Math.min(.08,d));}assert(n<max,'walk route reaches '+x+','+z);}
game.setPlayerPosition(64.9,10,0,4);
for(let i=4;i>0;i--){walkTo(64.9,2);walkTo(67.1,2);walkTo(67.1,10);assert(Math.abs(model.state.walkPosition.y-1.75-(5-i)*9)<.12,'emergency stairs rise one floor');walkTo(64.9,10);}
assert.equal(model.state.walkFloor,0,'B5 to B1 emergency route');
for(let i=0;i<5;i++){walkTo(64.9,2);walkTo(67.1,2);walkTo(67.1,10);if(i<4)walkTo(64.9,10);}
assert(Math.abs(model.state.walkPosition.y-81.75)<.2,'emergency stairs reach concealed exterior exit');
game.setPlayerPosition(-5.9,26,0,4);for(let i=4;i>0;i--){walkTo(-5.9,19.8);walkTo(-2.1,19.8);walkTo(-2.1,26);assert(Math.abs(model.state.walkPosition.y-1.75-(5-i)*9)<.12,'central stairs rise one floor');if(i>1)walkTo(-5.9,26);}
game.setPlayerPosition(4,23,0,4);assert(game.requestLift(0));game.tick(4.5);assert(model.state.walkPosition.y>2&&model.state.walkPosition.y<37,'lift interpolates vertical travel');game.tick(4.5);assert.equal(model.state.walkFloor,0);assert.equal(model.state.walkPosition.y,37.75);
game.setPlayerPosition(54,14,36,0);walkTo(66,14);assert(model.model.getObjectByName('bedroom-emergency-direct-door'),'bedroom short escape connection');game.setPlayerPosition(-70,-40,36,0);assert(game.requestLift(-1));game.tick(5.5);assert(model.state.walkPosition.y>38&&model.state.walkPosition.y<80,'cargo lift runs vertically');game.tick(5.5);assert.equal(model.state.walkPosition.y,81.75);assert(game.requestLift(1));game.tick(11);assert.equal(model.state.walkPosition.y,37.75);
game.setPlayerPosition(-53.7,-5,36,0);for(const p of game.roadNav.slice(1))walkTo(p.x,p.z);
assert(model.state.walkPosition.y>81,'walkable folded road reaches outdoors');
for(const vehicle of [model.items.find(i=>i.type==='truck'),model.items.find(i=>i.type==='offroad')]){const original={p:vehicle.group.position.clone(),r:vehicle.group.rotation.clone()};model.selectItem(vehicle.id);assert(game.startDrive(vehicle));events.get('model-canvas:keydown')({key:'w',preventDefault(){}});
for(const target of (vehicle.type==='offroad'?[{x:-50.8,z:-22},{x:-50.8,z:-5},...game.roadNav]:game.roadNav)){let n=0;while(Math.hypot(target.x-model.state.walkPosition.x,target.z-model.state.walkPosition.z)>.35&&n++<4000){const p=model.state.walkPosition;vehicle.group.rotation.y=Math.atan2(target.x-p.x,target.z-p.z);model.animateDoors(.05);game.tick(.05);}assert(n<4000,vehicle.type+' drives folded road leg '+target.x+','+target.z+' from '+JSON.stringify(model.state.walkPosition));}
events.get('window:keyup')({key:'w'});assert(model.state.walkPosition.y>81,'vehicle drives up to exterior');game.stopDrive();vehicle.group.position.copy(original.p);vehicle.group.rotation.copy(original.r);model.rebuildColliders();}
const vehicle=model.items.find(i=>i.type==='offroad');game.fitMods(vehicle,{armor:1,tires:true,rack:false,lights:true});assert(vehicle.modGroup.children.length>5);assert(storage.get('bunker-vehicle-mods-v1'));game.fitMods(vehicle,{armor:2,tires:true,rack:true,lights:true});
const gun=model.items.find(i=>i.type==='firearm'),origin={parent:gun.group.parent,p:gun.group.position.clone(),r:gun.group.rotation.clone(),room:gun.roomId,floor:gun.floor};model.model.updateMatrixWorld(true);const gp=gun.group.getWorldPosition(new ctx.THREE.Vector3());game.setPlayerPosition(gp.x,gp.z+1,36,0);assert(game.pickupItem(gun));assert.equal(gun.group.visible,false);
game.setPlayerPosition(41,10,27,1);assert(game.fire());assert.equal(game.state.ammo,23);assert(game.state.hitsScored>0,'first-person ray shot hits practice target');assert(game.reload());game.tick(.8);assert.equal(game.state.ammo,23);game.tick(.8);assert.equal(game.state.ammo,24);assert(game.dropItem());origin.parent.add(gun.group);gun.group.position.copy(origin.p);gun.group.rotation.copy(origin.r);gun.roomId=origin.room;gun.floor=origin.floor;gun.group.visible=true;
if(game.state.hatchOpen>.5){events.get('drone-hatch:click')();game.tick(1);}events.get('drone-hatch:click')();game.tick(1);assert(game.state.hatchOpen>.9);events.get('drone-hatch:click')();game.tick(1);assert(game.state.hatchOpen<.1);

// Each family has its own silhouette and magazine; resupply consumes real saved stock.
const shapes=new Set();
for(const kind of game.gunTypes){const item=model.items.find(i=>i.type==='firearm'&&i.group.userData.gunKey===kind.key);assert(item);let vertexCount=0;item.group.traverse(o=>{if(o.isMesh)vertexCount+=o.geometry.attributes.position.count;});shapes.add(vertexCount+':'+new ctx.THREE.Box3().setFromObject(item.group).getSize(new ctx.THREE.Vector3()).toArray().map(v=>v.toFixed(3)).join(','));model.model.updateMatrixWorld(true);const p=item.group.getWorldPosition(new ctx.THREE.Vector3());game.setPlayerPosition(p.x,p.z+.8,model.floors[item.floor].position.y,item.floor);assert(game.pickupItem(item));assert.equal(game.state.ammo,kind.cap);const reserveBefore=game.state.reserve[kind.pool];assert(game.fire());game.tick(.8);assert.equal(game.state.ammo,kind.cap-1);assert(game.reload());game.tick(1.6);assert.equal(game.state.ammo,kind.cap);assert.equal(game.state.reserve[kind.pool],reserveBefore-1);assert(game.dropItem(true));}
assert(shapes.size===8,'families have distinct geometric silhouettes');
const ammoItem=model.items.find(i=>i.type==='ammo'&&i.group.userData.ammoPool==='R'),crate=ammoItem.group,crateInitial=crate.userData.stock;
game.setPlayerPosition(40,10,27,1);assert.equal(game.takeAmmo(ammoItem),false,'cannot collect ammunition remotely');
model.model.updateMatrixWorld(true);const ap=crate.getWorldPosition(new ctx.THREE.Vector3());game.setPlayerPosition(ap.x,ap.z+.8,model.floors[ammoItem.floor].position.y,ammoItem.floor);const beforeReserve=game.state.reserve.R;
assert(game.takeAmmo(ammoItem));assert.equal(game.state.reserve.R,beforeReserve+crateInitial);assert.equal(crate.userData.stock,0);assert.equal(game.takeAmmo(ammoItem),false,'empty crate cannot supply ammo again');
const savedAmmo=JSON.parse(storage.get('bunker-ammo-stock-v1'));assert.equal(savedAmmo.crates[ammoItem.id],0);assert.equal(savedAmmo.reserve.R,game.state.reserve.R);
model.selectItem(ammoItem.id);assert(elements.get('item-description').textContent.includes('箱内 0'));assert(elements.get('reserve-summary').textContent.includes('2160'));
const whShelf=model.items.find(i=>i.type==='shelf'&&i.floor===3);model.selectItem(whShelf.id);assert(elements.get('item-description').textContent.includes('4层 × 5包装位'));
game.dropItem(true);


model.exitWalk();model.selectItem(ammoItem.id);
const stockedCase=model.items.find(i=>i.type==='ammo'&&i.group.userData.stock>0);model.selectItem(stockedCase.id);
assert(game.inspectItem(stockedCase));assert.equal(model.state.inspecting,stockedCase.id);assert.equal(model.model.visible,false);assert(model.state.radius<3,'small object fills the close-up view');
const isolated=model.scene.getObjectByName('isolated-detail-view'),clone=isolated.children[0],lid=clone.getObjectByName('hinged-ammo-lid');
game.tick(.2);assert(lid.rotation.x<-1.7);assert(clone.getObjectByName('ammo-contents').visible);
game.toggleLid(stockedCase);game.tick(.2);assert(Math.abs(lid.rotation.x)<.05);assert.equal(clone.getObjectByName('ammo-contents').visible,false);
assert.equal(stockedCase.group.userData.lidWanted,false,'inspection lid state is local to the inspected copy');
game.exitInspection();assert.equal(model.model.visible,true);assert.equal(model.state.inspecting,null);
game.toggleLid(stockedCase);game.tick(.2);assert(stockedCase.group.getObjectByName('hinged-ammo-lid').rotation.x<-1.7);
game.toggleLid(stockedCase);game.tick(.2);assert.equal(stockedCase.group.getObjectByName('ammo-contents').visible,false);
model.selectItem(gun.id);assert(game.inspectItem(gun));assert(model.state.radius<4);model.setFloor('3');assert.equal(model.state.inspecting,null);assert(model.model.visible);
assert(model.model.getObjectByName('room-small-props'));assert(model.items.find(i=>i.type==='truck').group.getObjectByName('detailed-wheel'));
assert(gun.group.getObjectByName('detachable-magazine'),'magazine survives mesh batching');

model.exitWalk();model.setFloor('all');model.doors.forEach(d=>{d.open=0;d.frame.userData.manual=false;});model.rebuildColliders();

events.get('export-model:click')();assert.equal(downloads.length,2);assert(downloads[0].name==='bunker.obj');
(async()=>{const out=path.join(__dirname,'../../bunker-3d-offline');for(const download of downloads){const text=await download.blob.text();assert(text.length>500);assert(!text.includes('NaN'));if(download.name.endsWith('.mtl'))assert(text.includes('d 0.16'));fs.writeFileSync(path.join(out,download.name),text);}console.log(JSON.stringify({status:'pass',floors:5,rooms:model.rooms.length,inspectableItems:model.items.length,...counts,lightOffroads:2,heavyOffroads:3,warehouseShelves:108,checked:['isolated close-up framing and restoring floor view','hinged case lid, interior visibility and independent inspect state','detailed wheels and preserved animated magazine','2160 classified packages on 108 shelves','8 weapon family geometry and magazine capacities','finite resupply, distance gate, depleted crate and saved stock','walk and drive folded road to exterior','continuous B5–B1 and surface emergency stairs','usable central stair flights','passenger and cargo elevator motion through shafts','bedroom short emergency connection','normally closed manual blast door','persistent vehicle upgrades','first-person pickup, shooting, target hit, reload and drop','concealed drone hatch','initialization','B1 drone adjacency','vehicle road outside garage footprint','road visible in B1','three drone route isolation doors and animation','transfer corridor and cargo lift entry collision','two storage alcoves','deeper rock cap','surface cargo lift','four vehicle gates','room focus','single floor visibility','room selection','floor spread','keyboard orbit','wheel zoom','route visibility','OBJ+MTL export with transparency','first-person movement and floor change','wall and equipment collision','all front doorways accessible','blast partition and door animation','individual item replacement and reset','device-local item persistence'],limitation:'This run validates geometry and gameplay with a mocked DOM and renderer; browser WebGL appearance is not asserted by this script.'},null,2));})().catch(e=>{console.error(e);process.exitCode=1});

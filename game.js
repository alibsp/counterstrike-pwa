
(()={
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');

const hpEl=document.getElementById('hp');
const killsEl=document.getElementById('kills');
const ammoEl=document.getElementById('ammo');
const msg=document.getElementById('message');
const start=document.getElementById('start');

let W,H,running=false,last=0;
let hp=100,kills=0,ammo=12;
let damageFlash=0;

const map=[
1111111111111111,
1000000000000001,
1000100001000001,
1000100001000001,
1000000000000001,
1000011001100001,
1000000000000001,
1000000000000001,
1000110000010001,
1000000000000001,
1000000000000001,
1111111111111111
];

const player={x2.5,y2.5,a0};
let enemies=[];
const keys={};
const touch={forwardfalse,backfalse,leftfalse,rightfalse};
const FOV=Math.PI3;

function resize(){
 W=canvas.width=innerWidthdevicePixelRatio;
 H=canvas.height=innerHeightdevicePixelRatio;
}
addEventListener('resize',resize);
resize();

function wall(x,y){
 return map[Math.floor(y)].[Math.floor(x)]!=='0';
}

function spawn(){
 enemies=[];
 for(let i=0;i7;i++){
  let x,y,n=0;
  do{
   x=3+Math.random()11;
   y=1.5+Math.random()9;
   n++;
  }while((wall(x,y)Math.hypot(x-player.x,y-player.y)4)&&n100);

  enemies.push({
   x,y,hp100,alivetrue,
   cool1+Math.random()2
  });
 }
}

function reset(){
 player.x=2.5;
 player.y=2.5;
 player.a=0;
 hp=100;kills=0;ammo=12;
 spawn();
 updateHud();
}

function updateHud(){
 hpEl.textContent=hp;
 killsEl.textContent=kills;
 ammoEl.textContent=ammo;
}

function cast(angle){
 const sin=Math.sin(angle);
 const cos=Math.cos(angle);

 for(let d=.02;d20;d+=.025){
  const x=player.x+cosd;
  const y=player.y+sind;
  if(wall(x,y))return {d,x,y};
 }
 return {d20};
}

function render(){
 const sky=ctx.createLinearGradient(0,0,0,H2);
 sky.addColorStop(0,'#172b3b');
 sky.addColorStop(1,'#80909a');
 ctx.fillStyle=sky;
 ctx.fillRect(0,0,W,H2);

 const floor=ctx.createLinearGradient(0,H2,0,H);
 floor.addColorStop(0,'#5c625f');
 floor.addColorStop(1,'#1c2426');
 ctx.fillStyle=floor;
 ctx.fillRect(0,H2,W,H2);

 const cols=Math.ceil(W2);
 const depth=[];

 for(let i=0;icols;i++){
  const a=player.a+(icols-.5)FOV;
  const hit=cast(a);
  const corrected=hit.dMath.cos(a-player.a);
  depth[i]=corrected;

  const wallH=Math.min(H,H(corrected.1));
  const shade=Math.max(35,190-corrected18);

  ctx.fillStyle=`rgb(${shade},${shade},${shade})`;
  ctx.fillRect(i2,(H-wallH)2,2,wallH);
 }

 const sprites=[];

 for(const e of enemies){
  if(!e.alive)continue;

  const dx=e.x-player.x;
  const dy=e.y-player.y;
  const dist=Math.hypot(dx,dy);
  let ang=Math.atan2(dy,dx)-player.a;

  while(angMath.PI)ang-=2Math.PI;
  while(ang -Math.PI)ang+=2Math.PI;

  if(Math.abs(ang)FOV.7)
   sprites.push({e,dist,ang});
 }

 sprites.sort((a,b)=b.dist-a.dist);

 for(const s of sprites){
  const sx=(.5+s.angFOV)W;
  const sz=Math.min(H,H(s.dist.8));
  const col=Math.floor(sx2);

  if(col=0&&coldepth.length&&s.distdepth[col]){
   const y=H2-sz.42;

   ctx.fillStyle='#171b20';
   ctx.fillRect(sx-sz.16,y+sz.2,sz.32,sz.58);

   ctx.fillStyle='#c58d68';
   ctx.beginPath();
   ctx.arc(sx,y+sz.12,sz.13,0,Math.PI2);
   ctx.fill();

   ctx.fillStyle='#b53d36';
   ctx.fillRect(sx-sz.19,y+sz.31,sz.38,sz.12);
  }
 }

  اسلحه بازیکن
 ctx.fillStyle='#151a1d';
 ctx.beginPath();
 ctx.moveTo(W.59,H);
 ctx.lineTo(W.62,H.78);
 ctx.lineTo(W.7,H.73);
 ctx.lineTo(W.76,H);
 ctx.fill();

 if(damageFlash0){
  ctx.fillStyle=`rgba(210,20,20,${damageFlash.35})`;
  ctx.fillRect(0,0,W,H);
  damageFlash=Math.max(0,damageFlash-.04);
 }
}

function move(dt){
 const speed=2.6dt;
 let dx=0,dy=0;

 if(keys.KeyWtouch.forward){
  dx+=Math.cos(player.a)speed;
  dy+=Math.sin(player.a)speed;
 }
 if(keys.KeyStouch.back){
  dx-=Math.cos(player.a)speed;
  dy-=Math.sin(player.a)speed;
 }
 if(keys.KeyAtouch.left){
  dx+=Math.cos(player.a-Math.PI2)speed;
  dy+=Math.sin(player.a-Math.PI2)speed;
 }
 if(keys.KeyDtouch.right){
  dx+=Math.cos(player.a+Math.PI2)speed;
  dy+=Math.sin(player.a+Math.PI2)speed;
 }

 if(!wall(player.x+dx,player.y))player.x+=dx;
 if(!wall(player.x,player.y+dy))player.y+=dy;
}

function shoot(){
 if(!runningammo=0)return;

 ammo--;
 updateHud();

 let target=null,best=1e9;

 for(const e of enemies){
  if(!e.alive)continue;

  const dx=e.x-player.x;
  const dy=e.y-player.y;
  const d=Math.hypot(dx,dy);
  let a=Math.atan2(dy,dx)-player.a;

  while(aMath.PI)a-=2Math.PI;
  while(a -Math.PI)a+=2Math.PI;

  if(Math.abs(a).075&&dbest&&cast(player.a).dd-.35){
   best=d;
   target=e;
  }
 }

 if(target){
  target.hp-=50;
  if(target.hp=0){
   target.alive=false;
   kills++;
   updateHud();

   if(enemies.every(e=!e.alive)){
    msg.textContent='مرحله پاک‌سازی شد!';
    setTimeout(()={
     if(running){
      spawn();
      msg.textContent='موج جدید دشمنان';
     }
    },1200);
   }
  }
 }
}

function reload(){
 if(ammo===12)return;
 msg.textContent='در حال تعویض خشاب...';
 setTimeout(()={
  ammo=12;
  updateHud();
  msg.textContent='';
 },1100);
}

function update(dt){
 move(dt);

 for(const e of enemies){
  if(!e.alive)continue;

  const dx=player.x-e.x;
  const dy=player.y-e.y;
  const d=Math.hypot(dx,dy);

  if(d1.2){
   const vx=dxddt.48;
   const vy=dyddt.48;

   if(!wall(e.x+vx,e.y))e.x+=vx;
   if(!wall(e.x,e.y+vy))e.y+=vy;
  }else{
   e.cool-=dt;

   if(e.cool=0){
    hp=Math.max(0,hp-7);
    damageFlash=1;
    e.cool=1.5+Math.random();
    updateHud();

    if(hp=0){
     running=false;
     msg.textContent='شکست خوردی!';
     start.style.display='flex';
     start.querySelector('h1').textContent='پایان بازی';
     start.querySelector('p').textContent=
       `تعداد کشتار ${kills}`;
    }
   }
  }
 }
}

function loop(t){
 if(!running)return;
 const dt=Math.min(.04,(t-last)10000);
 last=t;
 update(dt);
 render();
 requestAnimationFrame(loop);
}

document.getElementById('play').onclick=()={
 reset();
 start.style.display='none';
 msg.textContent='';
 running=true;
 last=performance.now();
 requestAnimationFrame(loop);
};

document.getElementById('fire')
 .addEventListener('pointerdown',e={
  e.preventDefault();
  shoot();
 });

document.getElementById('reload').onclick=reload;

let lookX=null;

canvas.addEventListener('pointermove',e={
 if(e.pointerType!=='mouse'&&e.buttons){
  if(lookX!==null)
   player.a+=(e.clientX-lookX).008;
  lookX=e.clientX;
 }
});

canvas.addEventListener('pointerup',()=lookX=null);

document.querySelectorAll('[data-move]').forEach(b={
 const k=b.dataset.move;

 b.addEventListener('pointerdown',e={
  e.preventDefault();
  touch[k]=true;
  b.setPointerCapture(e.pointerId);
 });

 ['pointerup','pointercancel','lostpointercapture'].forEach(ev={
  b.addEventListener(ev,()=touch[k]=false);
 });
});

addEventListener('keydown',e={
 keys[e.code]=true;
 if(e.code==='Space')shoot();
 if(e.code==='KeyR')reload();
});

addEventListener('keyup',e=keys[e.code]=false);

addEventListener('mousemove',e={
 if(document.pointerLockElement===canvas)
  player.a+=e.movementX.0025;
});

canvas.addEventListener('click',()={
 if(innerWidth700)
  canvas.requestPointerLock.();
});
})();

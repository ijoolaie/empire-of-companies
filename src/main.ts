import {OfficeGame} from './game';
import {t,type Lang} from './i18n';
import {authConfigured,currentEmail,signIn,signOut,signUp} from './auth';
import {buildDesk,canPlaceDesk,hireWorker,incomePerSecond,parseGameState,serializeGameState,upgradeCost,upgradeOffice,LEGACY_SAVE_KEYS,SAVE_KEY} from './economy';
import {OBJECTIVES,playerLevelForXp,syncObjectives,xpIntoCurrentLevel} from './progression';
import {canDeskFitOffice} from './office-layout';
import './style.css';

const canvas=document.querySelector<HTMLCanvasElement>('#game')!,ui=document.querySelector<HTMLDivElement>('#ui')!;
const loaded=parseGameState(localStorage.getItem(SAVE_KEY)??LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean)??null);
const state=loaded.state;
syncObjectives(state);
const game=new OfficeGame(canvas);
for(const d of state.desks.slice(2))game.addDesk(d.x,d.z);
game.syncWorkers(state.workers,false);
let lang:Lang=localStorage.getItem('eoc-lang')==='fa'?'fa':navigator.language.toLowerCase().startsWith('fa')?'fa':'en';
let buildMode=false,accountEmail:string|null=null,authMessage='',authMode:'signin'|'signup'='signin';
let lastTick=Date.now();

function persist(){localStorage.setItem(SAVE_KEY,serializeGameState(state));localStorage.setItem('eoc-lang',lang);}
function notify(s:string){authMessage=s;render();}
function syncProgress(){
 const completed=syncObjectives(state);
 if(completed.length){
  const labels=completed.map(id=>{const objective=OBJECTIVES.find(item=>item.id===id)!;return t(lang,objective.titleKey);});
  authMessage=t(lang,'objectiveCompleted')+' '+labels.join(', ');
 }
}
function money(v:number){return Math.floor(v).toLocaleString(lang==='fa'?'fa-IR':'en-US');}
function cancelBuildMode(){buildMode=false;game.setPlacing(false);render();}
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&buildMode){event.preventDefault();cancelBuildMode();}});
function render(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';
 const income30=Math.floor(incomePerSecond(state)*30);
 const playerLevel=playerLevelForXp(state.playerXp),xpInLevel=xpIntoCurrentLevel(state.playerXp);
 const completed=new Set(state.completedObjectives);
 const objectiveRows=OBJECTIVES.map(objective=>`<li class="objective ${completed.has(objective.id)?'is-complete':''}"><span class="objective-mark">${completed.has(objective.id)?'✓':'○'}</span><span class="objective-copy"><strong>${t(lang,objective.titleKey)}</strong><small>+${money(objective.rewardCash)} · +${money(objective.rewardXp)} XP</small></span></li>`).join('');
 const currentObjective=OBJECTIVES.find(objective=>!completed.has(objective.id));
 const tutorial=!state.tutorialDismissed&&currentObjective?`<div class="tutorial"><div class="tutorial-title">${t(lang,'tutorialTitle')}</div><p>${t(lang,currentObjective.hintKey)}</p><button class="text-button" id="tutorial-skip" type="button">${t(lang,'tutorialSkip')}</button></div>`:'';
 ui.innerHTML=`<div class="topbar"><div class="brand">🏢 ${t(lang,'brand')} · ${t(lang,'office')}</div><div class="stats"><div class="stat">💵 ${t(lang,'cash')}: ${money(state.cash)}</div><div class="stat">📈 ${t(lang,'income')}: +${money(income30)}</div><div class="stat">⭐ ${t(lang,'level')}: ${money(state.level)}</div><div class="stat">🎖 ${t(lang,'playerLevel')}: ${money(playerLevel)}</div><button class="action" id="progress">🏆 ${t(lang,'progression')}</button><button class="action" id="account">${accountEmail?'👤 '+accountEmail:(lang==='fa'?'ورود / ثبت‌نام':'Sign in / Register')}</button><button class="action" id="lang">${t(lang,'language')}</button><button class="action camera-reset" id="camera-reset" type="button" aria-label="${t(lang,'resetCamera')}" title="${t(lang,'resetCamera')}">↺</button></div></div><div class="panel"><h3>${t(lang,'welcome')}</h3><p>${t(lang,'hint')}</p><p>${t(lang,'worker')}: ${money(state.workers)} / ${money(state.desks.length)}</p><p>${lang==='fa'?'درآمد به‌صورت خودکار تولید می‌شود و ذخیره بازی فقط روی همین دستگاه است.':'Income is generated automatically. Game saves stay on this device.'}</p>${loaded.offlineEarned>0?`<p>${lang==='fa'?'درآمد زمان غیبت: ':'Offline earnings: '}+${money(loaded.offlineEarned)}</p>`:''}<section class="progress-card"><div class="progress-heading"><strong>${t(lang,'playerLevel')} ${money(playerLevel)}</strong><span>${money(xpInLevel)} / 100 XP</span></div><div class="xp-track"><span style="width:${xpInLevel}%"></span></div><h4>${t(lang,'objectives')}</h4><ul class="objectives">${objectiveRows}</ul>${tutorial}</section></div><div class="toolbar"><button class="action" id="build">🪑 ${t(lang,'build')} · ${money(1000)}</button><button class="action" id="hire">👤 ${t(lang,'hire')} · ${money(2500)}</button><button class="action" id="upgrade">⬆️ ${t(lang,'upgrade')} · ${money(upgradeCost(state))}</button><button class="action" id="save">💾 ${t(lang,'save')}</button>${buildMode?`<button class="action" id="cancel-build">${t(lang,'cancelBuild')}</button>`:''}</div>${authMessage?`<div class="toast">${authMessage}</div>`:''}`;
 document.querySelector('#progress')!.addEventListener('click',showProgression);
 document.querySelector('#lang')!.addEventListener('click',()=>{lang=lang==='en'?'fa':'en';persist();render();});
 document.querySelector('#camera-reset')!.addEventListener('click',()=>game.resetCamera());
 document.querySelector('#build')!.addEventListener('click',()=>{buildMode=true;game.setPlacing(true);notify(t(lang,'placementGuide'));});
 document.querySelector('#cancel-build')?.addEventListener('click',cancelBuildMode);
 document.querySelector('#hire')!.addEventListener('click',()=>{if(hireWorker(state)){game.syncWorkers(state.workers);syncProgress();persist();render();}else notify(state.workers>=state.desks.length?(lang==='fa'?'برای استخدام، ابتدا میز جدید بسازید.':'Build another desk before hiring.') : t(lang,'notEnough'));});
 document.querySelector('#upgrade')!.addEventListener('click',()=>{if(upgradeOffice(state)){syncProgress();persist();render();}else notify(t(lang,'notEnough'));});
 document.querySelector('#save')!.addEventListener('click',()=>{persist();notify(lang==='fa'?'بازی روی دستگاه ذخیره شد.':'Game saved on this device.');});
 document.querySelector('#account')!.addEventListener('click',()=>accountEmail?void handleSignOut():showAuth());
 document.querySelector('#tutorial-skip')?.addEventListener('click',()=>{state.tutorialDismissed=true;persist();render();});
}
function showProgression(){
 const opener=document.querySelector<HTMLButtonElement>('#progress');
 const completed=new Set(state.completedObjectives);
 const milestones=OBJECTIVES.map((objective,index)=>{
  const done=completed.has(objective.id);
  const prerequisite=index===0?true:completed.has(OBJECTIVES[index-1].id);
  return '<li class="roadmap-item '+(done?'is-complete':prerequisite?'is-current':'is-locked')+'"><span class="roadmap-mark">'+(done?'✓':prerequisite?'●':'🔒')+'</span><span><strong>'+t(lang,objective.titleKey)+'</strong><small>'+t(lang,objective.hintKey)+'</small><small>+'+money(objective.rewardCash)+' · +'+money(objective.rewardXp)+' XP</small></span><em>'+(done?t(lang,'completed'):prerequisite?t(lang,'available'):t(lang,'locked'))+'</em></li>';
 }).join('');
 const future:{level:number;title:Parameters<typeof t>[1];detail:Parameters<typeof t>[1]}[]=[
  {level:3,title:'unlockFloor',detail:'unlockFloorDetail'},
  {level:5,title:'unlockDepartments',detail:'unlockDepartmentsDetail'},
  {level:10,title:'unlockCompanies',detail:'unlockCompaniesDetail'}
 ];
 const planned=future.map(item=>'<li class="future-item"><span class="future-level">'+t(lang,'levelShort')+' '+item.level+'</span><span><strong>'+t(lang,item.title)+'</strong><small>'+t(lang,item.detail)+'</small></span><em>'+t(lang,'planned')+'</em></li>').join('');
 const modal=document.createElement('section');modal.className='progress-modal modal-backdrop';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','progress-title');
 modal.innerHTML='<div class="progress-sheet"><header><div><h2 id="progress-title">🏆 '+t(lang,'progression')+'</h2><p id="progress-description">'+t(lang,'progressionSubtitle')+'</p></div><button type="button" class="close" aria-label="'+t(lang,'close')+'">×</button></header><div class="progress-summary"><strong>'+t(lang,'playerLevel')+' '+money(playerLevelForXp(state.playerXp))+'</strong><span>'+money(xpIntoCurrentLevel(state.playerXp))+' / 100 XP</span></div><div class="xp-track"><span style="width:'+xpIntoCurrentLevel(state.playerXp)+'%"></span></div><h3>'+t(lang,'milestonePath')+'</h3><ol class="roadmap-list">'+milestones+'</ol><h3>'+t(lang,'futureUnlocks')+'</h3><p class="planned-note">'+t(lang,'plannedNote')+'</p><ul class="future-list">'+planned+'</ul></div>';
 modal.setAttribute('aria-describedby','progress-description');
 ui.append(modal);
 const close=()=>{
  modal.remove();
  if(opener?.isConnected)opener.focus();
 };
 const closeButton=modal.querySelector<HTMLButtonElement>('.close')!;
 closeButton.addEventListener('click',close);
 modal.addEventListener('click',event=>{if(event.target===modal)close();});
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const focusable=[...modal.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getAttribute('aria-hidden')!=='true');
  if(!focusable.length){event.preventDefault();modal.focus();return;}
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){event.preventDefault();first.focus();}
 });
 closeButton.focus();
}
function showAuth(){
 const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML=`<form class="auth-card"><button type="button" class="close">×</button><h2>${lang==='fa'?'حساب بازیکن':'Player account'}</h2><p>${lang==='fa'?'حساب فقط برای هویت بازیکن است؛ ذخیره بازی روی دستگاه می‌ماند.':'Your account identifies you; game saves stay on this device.'}</p>${!authConfigured()?'<p>Supabase config missing. Set .env.local first.</p>':''}<input name="email" type="email" placeholder="Email" aria-label="Email" required autocomplete="email"/><input name="password" type="password" placeholder="Password (min 8 characters)" aria-label="Password" required minlength="8"/><button class="action" type="submit" ${!authConfigured()?'disabled':''}>${authMode==='signin'?(lang==='fa'?'ورود':'Sign in'):(lang==='fa'?'ساخت حساب':'Create account')}</button><button class="text-button" type="button" id="switch">${authMode==='signin'?'Need an account? Register':'Already registered? Sign in'}</button><div class="auth-error" role="status">${authMessage}</div></form>`;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','auth-title');modal.setAttribute('aria-describedby','auth-description');
 const opener=document.querySelector<HTMLButtonElement>('#account');
 const close=()=>{modal.remove();if(opener?.isConnected)opener.focus();};
 const closeButton=modal.querySelector<HTMLButtonElement>('.close')!;closeButton.setAttribute('aria-label',t(lang,'close'));
 modal.querySelector('h2')!.id='auth-title';modal.querySelector('p')!.id='auth-description';
 closeButton.addEventListener('click',close);
 modal.addEventListener('click',event=>{if(event.target===modal)close();});
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const focusable=[...modal.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]')];
  if(!focusable.length){event.preventDefault();modal.focus();return;}
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){event.preventDefault();first.focus();}
 });
 ui.append(modal);modal.querySelector<HTMLInputElement>('input[name="email"]')!.focus();
 modal.querySelector('#switch')!.addEventListener('click',()=>{authMode=authMode==='signin'?'signup':'signin';authMessage='';modal.remove();showAuth();});
 modal.querySelector('form')!.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget as HTMLFormElement,data=new FormData(form),email=String(data.get('email')).trim(),password=String(data.get('password')),submit=form.querySelector('button[type="submit"]') as HTMLButtonElement;submit.disabled=true;try{if(authMode==='signin')accountEmail=await signIn(email,password);else{const result=await signUp(email,password);accountEmail=result.needsConfirmation?null:result.email;authMessage=result.needsConfirmation?(lang==='fa'?'حساب ساخته شد؛ ایمیل تأیید را بررسی کنید.':'Account created. Check your email to confirm it.'):'';}modal.remove();render();}catch(err){form.querySelector('.auth-error')!.textContent=err instanceof Error?err.message:'Authentication failed';submit.disabled=false;}});
}
async function handleSignOut(){try{await signOut();accountEmail=null;notify(lang==='fa'?'خارج شدید.':'Signed out.');}catch(e){notify(String(e));}}

game.canPreviewDesk=(x,z)=>state.cash>=1000&&canPlaceDesk(state,{x,z})&&canDeskFitOffice({x,z});game.onTouchPlacementPreview=()=>notify(t(lang,'touchPlacementConfirm'));
game.onFloorTap=(x,z)=>{if(!buildMode)return false;if(!buildDesk(state,{x,z})){notify(state.cash<1000?t(lang,'notEnough'):(lang==='fa'?'این محل برای ساخت مناسب نیست.':'That spot is too close to another desk.'));return false;}buildMode=false;game.setPlacing(false);syncProgress();persist();render();return true;};
void currentEmail().then(email=>{accountEmail=email;render();}).catch(()=>{});
window.setInterval(()=>{const now=Date.now();const elapsed=(now-lastTick)/1000;lastTick=now;if(elapsed>0){const earned=Math.floor(incomePerSecond(state)*Math.min(elapsed,8*60*60));state.cash+=earned;state.lifetimeEarned+=earned;}},1000);
window.setInterval(()=>{persist();render();},15000);
persist();render();
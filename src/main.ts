import {OfficeGame} from './game';
import {t,type Lang} from './i18n';
import {authConfigured,currentEmail,signIn,signOut,signUp} from './auth';
import {buildDesk,hireWorker,incomePerSecond,parseGameState,serializeGameState,upgradeCost,upgradeOffice,LEGACY_SAVE_KEYS,SAVE_KEY} from './economy';
import {OBJECTIVES,playerLevelForXp,syncObjectives,xpIntoCurrentLevel} from './progression';
import './style.css';

const canvas=document.querySelector<HTMLCanvasElement>('#game')!,ui=document.querySelector<HTMLDivElement>('#ui')!;
const loaded=parseGameState(localStorage.getItem(SAVE_KEY)??LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean)??null);
const state=loaded.state;
syncObjectives(state);
const game=new OfficeGame(canvas);
for(const d of state.desks.slice(2))game.addDesk(d.x,d.z);
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
function render(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';
 const income30=Math.floor(incomePerSecond(state)*30);
 const playerLevel=playerLevelForXp(state.playerXp),xpInLevel=xpIntoCurrentLevel(state.playerXp);
 const completed=new Set(state.completedObjectives);
 const objectiveRows=OBJECTIVES.map(objective=>`<li class="objective ${completed.has(objective.id)?'is-complete':''}"><span class="objective-mark">${completed.has(objective.id)?'✓':'○'}</span><span class="objective-copy"><strong>${t(lang,objective.titleKey)}</strong><small>+${money(objective.rewardCash)} · +${money(objective.rewardXp)} XP</small></span></li>`).join('');
 const currentObjective=OBJECTIVES.find(objective=>!completed.has(objective.id));
 const tutorial=!state.tutorialDismissed&&currentObjective?`<div class="tutorial"><div class="tutorial-title">${t(lang,'tutorialTitle')}</div><p>${t(lang,currentObjective.hintKey)}</p><button class="text-button" id="tutorial-skip" type="button">${t(lang,'tutorialSkip')}</button></div>`:'';
 ui.innerHTML=`<div class="topbar"><div class="brand">🏢 ${t(lang,'brand')} · ${t(lang,'office')}</div><div class="stats"><div class="stat">💵 ${t(lang,'cash')}: ${money(state.cash)}</div><div class="stat">📈 ${t(lang,'income')}: +${money(income30)}</div><div class="stat">⭐ ${t(lang,'level')}: ${money(state.level)}</div><div class="stat">🎖 ${t(lang,'playerLevel')}: ${money(playerLevel)}</div><button class="action" id="account">${accountEmail?'👤 '+accountEmail:(lang==='fa'?'ورود / ثبت‌نام':'Sign in / Register')}</button><button class="action" id="lang">${t(lang,'language')}</button></div></div><div class="panel"><h3>${t(lang,'welcome')}</h3><p>${t(lang,'hint')}</p><p>${t(lang,'worker')}: ${money(state.workers)} / ${money(state.desks.length)}</p><p>${lang==='fa'?'درآمد به‌صورت خودکار تولید می‌شود و ذخیره بازی فقط روی همین دستگاه است.':'Income is generated automatically. Game saves stay on this device.'}</p>${loaded.offlineEarned>0?`<p>${lang==='fa'?'درآمد زمان غیبت: ':'Offline earnings: '}+${money(loaded.offlineEarned)}</p>`:''}<section class="progress-card"><div class="progress-heading"><strong>${t(lang,'playerLevel')} ${money(playerLevel)}</strong><span>${money(xpInLevel)} / 100 XP</span></div><div class="xp-track"><span style="width:${xpInLevel}%"></span></div><h4>${t(lang,'objectives')}</h4><ul class="objectives">${objectiveRows}</ul>${tutorial}</section></div><div class="toolbar"><button class="action" id="build">🪑 ${t(lang,'build')} · ${money(1000)}</button><button class="action" id="hire">👤 ${t(lang,'hire')} · ${money(2500)}</button><button class="action" id="upgrade">⬆️ ${t(lang,'upgrade')} · ${money(upgradeCost(state))}</button><button class="action" id="save">💾 ${t(lang,'save')}</button></div>${authMessage?`<div class="toast">${authMessage}</div>`:''}`;
 document.querySelector('#lang')!.addEventListener('click',()=>{lang=lang==='en'?'fa':'en';persist();render();});
 document.querySelector('#build')!.addEventListener('click',()=>{buildMode=true;game.placing=true;notify(lang==='fa'?'محل میز جدید را روی کف دفتر انتخاب کنید.':'Choose a spot on the office floor for the new desk.');});
 document.querySelector('#hire')!.addEventListener('click',()=>{if(hireWorker(state)){syncProgress();persist();render();}else notify(state.workers>=state.desks.length?(lang==='fa'?'برای استخدام، ابتدا میز جدید بسازید.':'Build another desk before hiring.') : t(lang,'notEnough'));});
 document.querySelector('#upgrade')!.addEventListener('click',()=>{if(upgradeOffice(state)){syncProgress();persist();render();}else notify(t(lang,'notEnough'));});
 document.querySelector('#save')!.addEventListener('click',()=>{persist();notify(lang==='fa'?'بازی روی دستگاه ذخیره شد.':'Game saved on this device.');});
 document.querySelector('#account')!.addEventListener('click',()=>accountEmail?void handleSignOut():showAuth());
 document.querySelector('#tutorial-skip')?.addEventListener('click',()=>{state.tutorialDismissed=true;persist();render();});
}
function showAuth(){
 const modal=document.createElement('div');modal.className='modal-backdrop';modal.innerHTML=`<form class="auth-card"><button type="button" class="close">×</button><h2>${lang==='fa'?'حساب بازیکن':'Player account'}</h2><p>${lang==='fa'?'حساب فقط برای هویت بازیکن است؛ ذخیره بازی روی دستگاه می‌ماند.':'Your account identifies you; game saves stay on this device.'}</p>${!authConfigured()?'<p>Supabase config missing. Set .env.local first.</p>':''}<input name="email" type="email" placeholder="Email" required autocomplete="email"/><input name="password" type="password" placeholder="Password (min 8 characters)" required minlength="8"/><button class="action" type="submit" ${!authConfigured()?'disabled':''}>${authMode==='signin'?(lang==='fa'?'ورود':'Sign in'):(lang==='fa'?'ساخت حساب':'Create account')}</button><button class="text-button" type="button" id="switch">${authMode==='signin'?'Need an account? Register':'Already registered? Sign in'}</button><div class="auth-error" role="status">${authMessage}</div></form>`;
 ui.append(modal);modal.querySelector('.close')!.addEventListener('click',()=>modal.remove());modal.querySelector('#switch')!.addEventListener('click',()=>{authMode=authMode==='signin'?'signup':'signin';authMessage='';modal.remove();showAuth();});
 modal.querySelector('form')!.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget as HTMLFormElement,data=new FormData(form),email=String(data.get('email')).trim(),password=String(data.get('password')),submit=form.querySelector('button[type="submit"]') as HTMLButtonElement;submit.disabled=true;try{if(authMode==='signin')accountEmail=await signIn(email,password);else{const result=await signUp(email,password);accountEmail=result.needsConfirmation?null:result.email;authMessage=result.needsConfirmation?(lang==='fa'?'حساب ساخته شد؛ ایمیل تأیید را بررسی کنید.':'Account created. Check your email to confirm it.'):'';}modal.remove();render();}catch(err){form.querySelector('.auth-error')!.textContent=err instanceof Error?err.message:'Authentication failed';submit.disabled=false;}});
}
async function handleSignOut(){try{await signOut();accountEmail=null;notify(lang==='fa'?'خارج شدید.':'Signed out.');}catch(e){notify(String(e));}}

game.onFloorTap=(x,z)=>{if(!buildMode)return false;if(!buildDesk(state,{x,z})){notify(state.cash<1000?t(lang,'notEnough'):(lang==='fa'?'این محل برای ساخت مناسب نیست.':'That spot is too close to another desk.'));return false;}buildMode=false;game.placing=false;syncProgress();persist();render();return true;};
void currentEmail().then(email=>{accountEmail=email;render();}).catch(()=>{});
window.setInterval(()=>{const now=Date.now();const elapsed=(now-lastTick)/1000;lastTick=now;if(elapsed>0){const earned=Math.floor(incomePerSecond(state)*Math.min(elapsed,8*60*60));state.cash+=earned;state.lifetimeEarned+=earned;}},1000);
window.setInterval(()=>{persist();render();},15000);
persist();render();

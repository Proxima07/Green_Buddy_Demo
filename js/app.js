(function(){
 'use strict';
 const KEY='greenbuddy.demo.v1';
 const clone=x=>JSON.parse(JSON.stringify(x));
 let state;
 try{state=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
 if(!state||state.version!==1||!Array.isArray(state.plants))state=clone(MOCK);
 let loggedIn=false;try{loggedIn=localStorage.getItem('greenbuddy.auth')==='1'}catch{}
 const params=new URLSearchParams(location.search),page=document.body.dataset.page||'index';
 if(params.get('demo')==='1')sessionStorage.setItem('greenbuddy.demo','1');
 const demo=params.get('demo')==='0'?false:params.get('demo')==='1'||sessionStorage.getItem('greenbuddy.demo')==='1';
 const G=window.GB={state,page,params,demo,loggedIn,pages:{},chart:null,cleanup:[],render:null};
 G.esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 G.icon=n=>`<i class="icon ph-duotone ph-${n==='bow'?'bow-tie':n}" aria-hidden="true"></i>`;
 G.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(G.state))}catch{G.toast('瀏覽器無法保存資料；關閉頁面後可能需要重新開始。')}};
 G.auth=yes=>{G.loggedIn=yes;try{yes?localStorage.setItem('greenbuddy.auth','1'):localStorage.removeItem('greenbuddy.auth')}catch{}};
 G.href=url=>{const parts=url.split('#');let s=parts[0];if(G.demo&&!/[?&]demo=/.test(s))s+=(s.includes('?')?'&':'?')+'demo=1';if(params.get('assets')==='local')s+=(s.includes('?')?'&':'?')+'assets=local';return s+(parts[1]?'#'+parts[1]:'')};
 G.go=url=>location.href=G.href(url);
 G.plant=id=>G.state.plants.find(p=>p.id===id);
 G.garden=id=>G.state.gardens.find(g=>g.id===id);
 G.nav=(url,label,cls='',aria='')=>`<a class="${cls}" href="${G.esc(G.href(url))}" ${aria?`aria-label="${G.esc(aria)}"`:''} ${cls.includes('active')?'aria-current="page"':''}>${label}</a>`;
 G.header=(title='',back='home.html',right='')=>`<header class="app-header">${title?`<div class="back-title">${G.nav(back,G.icon('arrow-left'),'icon-btn','回到上一頁') }<h2>${G.esc(title)}</h2></div>`:G.nav('home.html',G.icon('plant')+'<span>GreenBuddy</span>','brand')}${right||`<button class="icon-btn" data-action="push" aria-label="查看植物提醒">${G.icon('bell')}<span class="unread"></span></button>`}</header>`;
 G.steps=n=>`<div class="stepper" aria-label="目前第 ${n} 步，共三步">${['綁定裝置','連上網路','植物建檔'].map((v,i)=>`${i?'<span class="step-line"></span>':''}<span class="step ${i+1===n?'active':i+1<n?'done':''}"><b>${i+1<n?'✓':i+1}</b>${v}</span>`).join('')}</div>`;
 G.applyTheme=theme=>{if(!['companion','game','simple'].includes(theme))return;G.state.user.style=theme;document.documentElement.dataset.theme=theme;G.save()};
 G.refresh=()=>{if(G.chart){G.chart.destroy();G.chart=null}G.cleanup.forEach(fn=>fn());G.cleanup=[];G.pages[page]?.()};
 G.mount=(html,nav=true)=>{
  document.getElementById('app').innerHTML=html;
  document.getElementById('app').className=`page ${nav?'has-nav':''}`;
  const tabs=[['home','house','首頁'],['gardens','plant','花圃'],['tasks','check-square','任務'],['select','magnifying-glass','選株'],['settings','user-circle','我的']];
  document.getElementById('bottom-nav').innerHTML=nav?tabs.map(([id,icon,label])=>G.nav(id+'.html',`${G.icon(icon)}<span>${label}</span>`,`nav-item ${id===page?'active':''}`)).join(''):'';
  document.getElementById('bottom-nav').hidden=!nav;
  document.querySelector('.fab')?.remove();
  if(page==='home'&&nav){const a=document.createElement('a');a.className='fab';a.href=G.href('add-device.html');a.setAttribute('aria-label','新增設備');a.innerHTML=G.icon('plus');document.querySelector('.phone').append(a)}
 };
 G.toast=message=>{document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.querySelector('.phone')?.append(el);setTimeout(()=>el.remove(),3300)};
 G.confetti=()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=document.querySelector('.phone').getBoundingClientRect();window.confetti?.({particleCount:75,spread:65,startVelocity:28,origin:{x:(r.left+r.width/2)/innerWidth,y:.58},colors:['#82a661','#dfad7b','#b7cca0','#f2d283'],disableForReducedMotion:true,zIndex:90})};
 G.dialog=async options=>{await VendorReady;if(window.Swal)return Swal.fire({confirmButtonText:'好，知道了',cancelButtonText:'先不要',...options});if(options.input){const v=prompt(options.title,options.inputValue||'');return {isConfirmed:v!==null,value:v}}return {isConfirmed:options.showCancelButton?confirm(options.title+'\n'+(options.text||'')):(alert(options.title+'\n'+(options.text||'')),true)}};
 G.push=()=>{document.querySelector('.push')?.remove();const p=G.state.plants.find(p=>p.state==='thirsty')||G.state.plants[0];if(!p)return G.toast('先迎接一盆植物，再傳送提醒吧。');const el=document.createElement('button');el.className='push';el.innerHTML=`<div class="row">${G.icon('plant')}<h3>GreenBuddy · ${G.esc(p.name)}</h3><span class="muted small" style="margin-left:auto">現在</span></div><p>${G.esc(say(stateEvent(p.state),p))}</p>`;el.onclick=()=>G.go('plant.html?id='+p.id);document.querySelector('.phone').append(el);setTimeout(()=>el.remove(),4500)};
 G.stateFrom=p=>!p.online?'offline':p.temp>p.ideal.temp[1]?'hot':p.soil>p.ideal.soil[1]?'overwater':p.soil<p.ideal.soil[0]?'thirsty':p.lux<p.ideal.lux[0]?'dark':'happy';
 G.award=xp=>{G.state.user.xp+=xp;while(G.state.user.xp>=G.state.user.xpMax){G.state.user.xp-=G.state.user.xpMax;G.state.user.level++}G.state.completedCount++;const d=new Date().toLocaleDateString('en-CA');if(G.state.lastCareDate!==d){const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);G.state.user.streak=G.state.lastCareDate&&G.state.lastCareDate!==yesterday.toLocaleDateString('en-CA')?1:G.state.user.streak+1;G.state.lastCareDate=d}};
 G.log=(p,action)=>G.state.history.push({plant:p.id,action,time:Date.now(),soil:p.soil});
 G.completeTask=(id,skip=false,reason='')=>{const t=G.state.tasks.find(t=>t.id===id);if(!t||t.status!=='pending')return 0;const p=G.plant(t.plant);if(!p)return 0;t.status=skip?'skipped':'done';t.reason=reason;t.completedAt=Date.now();if(!skip){if(t.event==='water_needed'){p.soil=Math.round((p.ideal.soil[0]+p.ideal.soil[1])/2);G.log(p,'water')}if(t.event==='dark')p.lux=Math.round((p.ideal.lux[0]+p.ideal.lux[1])/2);if(t.event==='overwater')p.soil=Math.round((p.ideal.soil[0]+p.ideal.soil[1])/2);if(t.event==='temp_high'){p.temp=28;p.lux=Math.min(p.lux,p.ideal.lux[1])}if(t.event==='offline'){p.online=true;p.battery=85;for(const m of ['soil','lux','temp','hum'])p[m]=Math.round((p.ideal[m][0]+p.ideal[m][1])/2);p.lastSeen='剛剛'}p.state=G.stateFrom(p);G.award(t.xp)}G.save();return skip?0:t.xp};
 G.finish=async(id)=>{const before=ACCESSORIES.filter(G.unlocked).map(a=>a.id);const gained=G.completeTask(id);const fresh=ACCESSORIES.find(a=>G.unlocked(a)&&!before.includes(a.id));G.refresh();G.confetti();G.toast((G.state.user.style==='game'?`任務完成！+${gained} XP`:'照顧收到了，謝謝你。')+(fresh?` 已解鎖「${fresh.name}」！`:''))};
 G.skip=async id=>{const r=await G.dialog({title:'這次為什麼先略過？',input:'select',inputOptions:{watered:'剛澆過',rain:'下雨了',other:'其他'},inputPlaceholder:'選擇原因',showCancelButton:true,confirmButtonText:'略過這次',inputValidator:v=>!v?'請選擇原因':undefined});if(r.isConfirmed){G.completeTask(id,true,r.value);G.refresh();G.toast('已記錄略過原因。')}};
 G.water=async id=>{const p=G.plant(id);if(!p)return;if(p.state!=='thirsty'){const r=await G.dialog({title:'確認已經澆水了嗎？',text:p.state==='offline'?'裝置離線，這裡只會新增照護紀錄。':'目前沒有缺水任務，請先確認盆土狀況，避免重複澆水。',showCancelButton:true,confirmButtonText:'是，記錄澆水'});if(!r.isConfirmed)return}const t=G.state.tasks.find(t=>t.plant===id&&t.event==='water_needed'&&t.status==='pending');let xp=0;if(t)xp=G.completeTask(t.id);else{if(p.online){p.soil=Math.round((p.ideal.soil[0]+p.ideal.soil[1])/2);p.state=G.stateFrom(p)}G.log(p,'water');G.save()}G.refresh();document.querySelector('.detail-stage')?.classList.add('celebrate');G.confetti();G.toast(G.state.user.style==='game'?(xp?`補水任務完成！+${xp} XP`:'已記錄澆水；同一任務不重複加經驗值。'):say('water_done',p))};
 G.plantCard=p=>`<a class="plant-card" data-state="${p.state}" href="${G.href('plant.html?id='+p.id)}"><span class="card-tag">${G.esc(STATE_META[p.state][0])}</span>${renderPlant(p.species,p.state,p.accessory)}<h3>${G.esc(p.name)}</h3><div class="species">${G.esc(p.speciesName)} · ${G.esc(G.garden(p.garden)?.name||'花圃')}</div>${G.state.user.style==='simple'?`<div class="simple-values">${p.lux??'—'} lux · ${p.temp??'—'}°C · ${p.hum??'—'}% RH</div>`:''}<div class="soil-line">${G.icon('drop')}<div class="meter"><span style="width:${p.soil??0}%"></span></div><span>${p.soil??'—'}${p.soil===null?'':'%'}</span></div></a>`;
 G.xp=()=>G.state.user.style==='game'?`<div class="xp-card"><div class="row between"><b>Lv.${G.state.user.level} ${G.esc(G.state.user.levelTitle)}</b><span>${G.icon('fire')} ${G.state.user.streak} 天</span></div><div class="row mt8"><div class="meter"><span style="width:${G.state.user.xp}%"></span></div><span>${G.state.user.xp}/${G.state.user.xpMax} XP</span></div></div>`:'';
 G.unlocked=a=>!!a.free||(a.streak?G.state.user.streak>=a.streak:G.state.completedCount>=a.tasks);
 G.addGarden=async()=>{const r=await G.dialog({title:'留一個新的綠色角落',html:'<label for="garden-name">花圃名稱</label><input id="garden-name" maxlength="24" placeholder="例如：書房" autocomplete="off"><label for="garden-type">空間類型</label><select id="garden-type"><option>室內</option><option>陽台</option><option>戶外</option></select>',showCancelButton:true,confirmButtonText:'建立花圃',preConfirm:()=>{const name=document.getElementById('garden-name').value.trim();if(!name){Swal.showValidationMessage('幫這個角落取個名字吧。');return false}return{name,type:document.getElementById('garden-type').value}}});if(r.isConfirmed&&r.value){const g={id:'g'+Date.now(),name:r.value.name,type:r.value.type,members:[G.state.user.name]};G.state.gardens.push(g);G.save();return g}return null};
 G.makeChart = async (canvas, plant, metric='soil', range='24') => {
  await VendorReady;
  if (!canvas?.isConnected) return;
  if (G.chart) G.chart.destroy();
  const n = range === '24' ? 24 : range === '7' ? 7 : 30;
  const config = {
   soil: ['土壤濕度', '%', 100],
   lux: ['光照', 'lux', Math.max(5000, plant.lux * 1.2 || 25000, plant.ideal?.lux?.[1] || 0)],
   temp: ['溫度', '°C', 45], hum: ['空氣濕度', '%', 100]
  }[metric];
  const base = plant[metric] ?? {soil:45,lux:1200,temp:26,hum:60}[metric];
  const hasWater = G.state.history.some(h => h.plant === plant.id && h.action === 'water');
  const vals = Array.from({length:n}, (_,i) => {
   const wave = Math.sin(i*.65) * {soil:5,lux:base*.35,temp:3,hum:6}[metric];
   let value = base + wave + Math.sin(i*2.17) * {soil:1.4,lux:base*.08,temp:.6,hum:1.2}[metric];
   if (metric === 'soil' && hasWater) value = i > n*.62 ? base+9-(i-n*.62)*.7 : Math.max(8,base-22+wave);
   return Math.round(Math.max(0,value)*10)/10;
  });
  vals[n-1] = base;
  const labels = Array.from({length:n}, (_,i) => range === '24' ? `${String(i).padStart(2,'0')}:00` : `${n-i-1} 天前`);
  labels[n-1] = '現在';
  if (!window.Chart) {
   canvas.replaceWith(Object.assign(document.createElement('p'), {textContent:'圖表暫時無法載入，請重新整理。'}));
   return;
  }
  const ideal = plant.ideal?.[metric] || {temp:[18,30],hum:[40,80],lux:[800,20000],soil:[30,60]}[metric];
  const band = {
   id: 'idealBand',
   beforeDraw(chart) {
    const {ctx,chartArea:a,scales:{y}} = chart;
    if (!a) return;
    ctx.save(); ctx.fillStyle = '#dfeacd75';
    const top = Math.max(a.top,y.getPixelForValue(ideal[1]));
    const bottom = Math.min(a.bottom,y.getPixelForValue(ideal[0]));
    if (bottom > top) ctx.fillRect(a.left,top,a.right-a.left,bottom-top);
    ctx.restore();
   }
  };
  G.chart = new Chart(canvas, {
   type: 'line',
   data: {labels, datasets:[{label:config[0],data:vals,borderColor:metric==='soil'?'#679daf':'#759958',backgroundColor:'#82afbf12',borderWidth:2,tension:.4,pointRadius:0,pointHitRadius:15,fill:true}]},
   plugins: [band],
   options: {
    responsive:true, maintainAspectRatio:false,
    animation:matchMedia('(prefers-reduced-motion: reduce)').matches?false:{duration:450},
    plugins:{legend:{display:false},tooltip:{displayColors:false,callbacks:{label:ctx=>`${ctx.parsed.y} ${config[1]}`}}},
    scales: {
     x:{grid:{display:false},ticks:{maxTicksLimit:5,maxRotation:0,color:'#8a9381',font:{size:10}},border:{display:false}},
     y:{min:0,max:config[2],grid:{color:'#899c7012'},border:{display:false},ticks:{maxTicksLimit:4,color:'#8a9381',font:{size:10}}}
    }
   }
  });
 };
 G.swiper=async(selector,options={})=>{await VendorReady;const el=document.querySelector(selector);if(!el)return;if(window.Swiper){const swiper=new Swiper(el,{spaceBetween:16,pagination:{el:el.querySelector('.swiper-pagination'),clickable:true},...options});G.cleanup.push(()=>swiper.destroy(true,true));return swiper}el.classList.add('slide-fallback')};
 G.demoPanel=()=>{const panel=document.getElementById('demo-panel');if(panel){panel.remove();return}const el=document.createElement('aside');el.id='demo-panel';el.className='demo-panel';el.innerHTML=`<div class="row between"><h2>展示控制台</h2><button data-action="demo-toggle" class="icon-btn" aria-label="關閉控制台">${G.icon('x')}</button></div><p class="small muted">控制表情與配網情境。</p><label>風格方案</label><div class="chip-row">${[['companion','陪伴'],['game','任務'],['simple','簡潔']].map(([v,n])=>`<button class="chip ${G.state.user.style===v?'active':''}" data-theme-set="${v}">${n}</button>`).join('')}</div><label for="demo-plant">植物</label><select id="demo-plant">${G.state.plants.map(p=>`<option value="${p.id}">${G.esc(p.name)}</option>`).join('')}</select><label for="demo-state">指定狀態</label><select id="demo-state">${Object.entries(STATE_META).map(([v,n])=>`<option value="${v}">${n[0]}</option>`).join('')}</select><button class="btn secondary full" id="apply-state">套用植物狀態</button><label for="demo-route">配網路線</label><select id="demo-route"><option value="auto">依瀏覽器自動選擇</option><option value="ble">藍牙路線</option><option value="ap">熱點路線</option></select><label for="demo-outcome">連線結果</label><select id="demo-outcome"><option value="success">連線成功</option><option value="fail">連線逾時</option></select><label class="row"><input type="checkbox" id="demo-confidence" ${G.state.demo.lowConfidence?'checked':''}>辨識信心度不足</label><button class="btn outline full" data-action="push">觸發模擬推播</button><button class="btn outline full" id="demo-empty">展示空花圃</button><button class="btn danger full" id="demo-reset">重設全部展示資料</button>`;document.body.append(el);el.querySelector('#demo-route').value=G.state.demo.route;el.querySelector('#demo-outcome').value=G.state.demo.outcome;el.querySelectorAll('[data-theme-set]').forEach(b=>b.onclick=()=>{G.applyTheme(b.dataset.themeSet);G.refresh();G.demoPanel();G.demoPanel()});el.querySelector('#demo-plant').onchange=()=>{el.querySelector('#demo-state').value=G.plant(el.querySelector('#demo-plant').value)?.state||'happy'};el.querySelector('#demo-plant').dispatchEvent(new Event('change'));el.querySelector('#apply-state').onclick=()=>{const p=G.plant(el.querySelector('#demo-plant').value);if(!p)return;const s=el.querySelector('#demo-state').value;p.state=s;p.online=s!=='offline';for(const k of ['soil','lux','temp','hum'])p[k]=Math.round((p.ideal[k][0]+p.ideal[k][1])/2);if(s==='thirsty')p.soil=Math.max(1,p.ideal.soil[0]-12);if(s==='overwater')p.soil=88;if(s==='dark')p.lux=80;if(s==='hot')p.temp=36;if(s==='offline')for(const k of ['soil','lux','temp','hum'])p[k]=null;G.state.tasks=G.state.tasks.filter(t=>!(t.plant===p.id&&t.status==='pending'));if(['thirsty','hot','offline','dark','overwater'].includes(s))G.state.tasks.push({id:'t'+Date.now(),plant:p.id,event:stateEvent(s),xp:s==='hot'?15:10,due:'today',status:'pending'});G.save();G.refresh();G.toast('已套用展示情境。')};for(const id of ['route','outcome'])el.querySelector('#demo-'+id).onchange=e=>{G.state.demo[id]=e.target.value;G.save();if(page==='provision'&&id==='route')G.refresh()};el.querySelector('#demo-confidence').onchange=e=>{G.state.demo.lowConfidence=e.target.checked;G.save()};el.querySelector('#demo-empty').onclick=async()=>{const r=await G.dialog({title:'切換成空花圃？',text:'會清空目前展示植物與任務，可隨時用「重設」還原。',showCancelButton:true,confirmButtonText:'切換'});if(r.isConfirmed){G.state.plants=[];G.state.tasks=[];G.save();G.go('home.html')}};el.querySelector('#demo-reset').onclick=async()=>{const r=await G.dialog({title:'重設展示資料？',text:'目前的植物、造型與照護紀錄會恢復成初始示範內容。',showCancelButton:true,confirmButtonText:'重設'});if(r.isConfirmed){G.state=clone(MOCK);G.auth(true);G.save();G.go('home.html')}}};
 document.documentElement.dataset.theme=G.state.user.style;
 document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(a==='push')G.push();if(a==='demo-toggle')G.demoPanel();if(a==='task-done')G.finish(b.dataset.id);if(a==='task-skip')G.skip(b.dataset.id);if(a==='water')G.water(b.dataset.id)});
 document.addEventListener('DOMContentLoaded',()=>{
  if(!G.loggedIn&&!['index','login'].includes(page)){sessionStorage.setItem('greenbuddy.return',location.pathname.split('/').pop()+location.search);G.go('login.html');return}
  if(G.loggedIn&&page==='index'){G.go('home.html');return}
  G.refresh();
  if(demo){const b=document.createElement('button');b.className='demo-toggle';b.dataset.action='demo-toggle';b.setAttribute('aria-label','開啟展示控制台');b.innerHTML=G.icon('sliders-horizontal');document.body.append(b)}
 });
})();

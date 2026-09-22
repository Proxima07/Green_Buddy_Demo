(function(){
 'use strict';
 const G=GB;
 G.modes=[
  {id:'companion',name:'陪伴',icon:'heart',title:'把植物當作生活夥伴',desc:'先看看它的心情，再留下一點照顧。'},
  {id:'game',name:'任務',icon:'flag-checkered',title:'讓每次照顧都有成就感',desc:'完成任務、累積經驗，收集下一份造型獎勵。'},
  {id:'simple',name:'數據',icon:'chart-line',title:'用數據掌握植物環境',desc:'先看異常指標與趨勢，再決定要做的事。'}
 ];
 G.modeTabs=()=>`<div class="mode-switch" role="group" aria-label="介面模式">${G.modes.map(m=>`<button data-action="mode-set" data-mode="${m.id}" aria-pressed="${G.state.user.style===m.id}">${G.icon(m.icon)}${m.name}</button>`).join('')}</div>`;
 G.workHeader=()=>G.header('','',`<div class="header-tools"><button class="icon-btn" data-action="push" aria-label="查看植物提醒">${G.icon('bell')}</button>${G.nav('add-device.html',G.icon('plus'),'icon-btn','新增設備')}</div>`);
 G.readings={soil:{label:'土壤濕度',short:'土壤',unit:'%',icon:'drop'},lux:{label:'光照',short:'光照',unit:'lux',icon:'sun'},temp:{label:'溫度',short:'溫度',unit:'°C',icon:'thermometer'},hum:{label:'空氣濕度',short:'空氣濕度',unit:'%',icon:'cloud'}};
 G.reading=(p,key)=>{
  const meta=G.readings[key],value=p[key],ideal=p.ideal?.[key];
  const available=!!p.online&&Number.isFinite(value);
  const low=available&&ideal&&value<ideal[0],high=available&&ideal&&value>ideal[1];
  return {...meta,value,ideal,available,abnormal:!!(low||high),status:!available?'無讀值':low?'偏低':high?'偏高':'範圍內',display:available?value.toLocaleString():'—'};
 };
 G.abnormalReadings=p=>Object.keys(G.readings).map(key=>({key,...G.reading(p,key)})).filter(r=>r.abnormal);
 G.sensorState=p=>!p.online?'設備離線':G.abnormalReadings(p).length?'指標異常':Object.keys(G.readings).some(k=>!G.reading(p,k).available)?'等待回報':'範圍正常';
 G.sensorRow=p=>`<a class="sensor-row ${!p.online?'is-offline':G.abnormalReadings(p).length?'has-alert':''}" href="${G.href('plant.html?id='+p.id)}"><div class="sensor-row-heading"><div><h3>${G.esc(p.name)}</h3><span>${G.esc(G.garden(p.garden)?.name||'花圃')} · ${G.esc(p.speciesName)}</span></div><span class="sensor-state">${G.sensorState(p)} ${G.icon('caret-right')}</span></div><div class="sensor-values">${Object.keys(G.readings).map(key=>{const r=G.reading(p,key);return `<div class="${r.abnormal?'reading-alert':''}"><span>${r.short}</span><strong>${r.display}<small>${r.unit}</small></strong>${r.abnormal?`<em>${r.status}</em>`:''}</div>`}).join('')}</div><div class="sensor-row-footer"><span>${G.esc(p.device)}</span><span>${G.esc(p.lastSeen)}回報</span></div></a>`;
 G.todaySummary=(tasks=G.state.tasks)=>{
  const today=tasks.filter(t=>t.due==='today'&&G.plant(t.plant));
  const pending=today.filter(t=>t.status==='pending'),done=today.filter(t=>t.status==='done'),skipped=today.filter(t=>t.status==='skipped');
  return {total:today.length,pending:pending.length,done:done.length,skipped:skipped.length,resolved:done.length+skipped.length,xp:pending.reduce((n,t)=>n+t.xp,0),percent:today.length?(done.length+skipped.length)/today.length*100:100};
 };
 G.questProgress=(tasks=G.state.tasks)=>{
  const s=G.todaySummary(tasks);
  return `<section class="quest-progress"><div class="quest-progress-heading"><div><span class="mode-kicker">TODAY'S QUESTS</span><h2>${s.pending?`還有 ${s.pending} 項任務`:'今日任務已處理'}</h2></div><strong>${s.resolved}<small> / ${s.total}</small></strong></div><div class="quest-track" role="progressbar" aria-label="今日任務處理進度" aria-valuenow="${s.resolved}" aria-valuemin="0" aria-valuemax="${Math.max(1,s.total)}"><span style="width:${s.percent}%"></span></div><div class="quest-progress-footer"><span>完成 ${s.done} · 略過 ${s.skipped}</span><span>${s.xp?`待領取 ${s.xp} XP`:'每一份照顧都已記錄'}</span></div></section>`;
 };
 G.questPlayer=()=>{
  const u=G.state.user,pct=Math.min(100,Math.max(0,u.xp/u.xpMax*100));
  return `<section class="quest-player"><div class="level-emblem">${G.icon('plant')}<b>${u.level}</b></div><div class="quest-player-main"><div class="row between"><strong>${G.esc(u.levelTitle)}</strong><span>${G.icon('fire')}${u.streak} 天</span></div><div class="quest-track" role="progressbar" aria-label="升級經驗值" aria-valuenow="${u.xp}" aria-valuemin="0" aria-valuemax="${u.xpMax}"><span style="width:${pct}%"></span></div><div class="quest-player-caption"><span>Lv.${u.level} → Lv.${u.level+1}</span><span>${u.xp} / ${u.xpMax} XP</span></div></div></section>`;
 };
 G.rewardCard=()=>{
  const locked=ACCESSORIES.filter(a=>!G.unlocked(a));
  const a=locked.filter(a=>a.tasks).sort((a,b)=>a.tasks-b.tasks)[0]||locked.filter(a=>a.streak).sort((a,b)=>a.streak-b.streak)[0];
  if(!a)return G.nav('closet.html',`${G.icon('trophy')}<div><span>收藏完成</span><h3>所有造型都在衣櫥裡了</h3></div>${G.icon('caret-right')}`,'reward-card');
  const current=a.tasks?G.state.completedCount:G.state.user.streak,target=a.tasks||a.streak,unit=a.tasks?'個任務':'天連續照護';
  return G.nav('closet.html',`<div class="reward-icon">${G.icon(a.icon)}</div><div class="reward-copy"><span>${a.tasks?'下一份任務獎勵':'下一份陪伴獎勵'}</span><h3>${G.esc(a.name)}</h3><p>再 ${target-current} ${unit}</p><div class="quest-track"><span style="width:${Math.min(100,current/target*100)}%"></span></div></div>${G.icon('caret-right')}`,'reward-card');
 };
 G.taskInfo=(t,p)=>{
  const names={water_needed:['drop','補水任務','土壤乾燥後再適量澆水。'],temp_high:['sun','降溫任務','移到通風、沒有烈日直射的位置。'],offline:['wifi-slash','恢復連線','檢查感測器電源與 Wi-Fi。'],dark:['sun-horizon','改善光照','移到有明亮散射光的位置。'],overwater:['drop','改善排水','暫停澆水，確認盆底排水暢通。']};
  const [icon,title,action]=names[t.event]||['leaf','照護任務','觀察葉片與盆土狀態。'];
  const key={water_needed:'soil',temp_high:'temp',dark:'lux',overwater:'soil'}[t.event],r=key?G.reading(p,key):null;
  const evidence=r?(r.available?`${r.label} ${r.display}${r.unit}${r.ideal?` · 理想 ${r.ideal[0]}–${r.ideal[1]}${r.unit}`:''}`:`${r.label}暫無讀值`):`設備${p.online?'已連線':'離線'} · ${p.lastSeen}`;
  return {icon,title,action,evidence};
 };
 G.taskCard=(t,variant=G.state.user.style)=>{
  const p=G.plant(t.plant);if(!p)return '';
  const info=G.taskInfo(t,p),pending=t.status==='pending';
  const status=t.status==='done'?'已完成':t.status==='skipped'?`已略過 · ${{watered:'剛澆過',rain:'下雨了',other:'其他'}[t.reason]||'已記錄'}`:'';
  if(variant==='game')return `<article class="mission-card ${pending?'':'is-resolved'}"><div class="mission-heading"><span class="mission-icon">${G.icon(info.icon)}</span><div>${G.nav('plant.html?id='+p.id,`<h3>${G.esc(info.title)}</h3><p>${G.esc(p.name)} · ${G.esc(G.garden(p.garden)?.name)}</p>`)}</div><span class="xp-reward">${pending?`+${t.xp} XP`:t.status==='done'?G.icon('check-circle'):'略過'}</span></div><p class="mission-copy">${G.esc(pending?info.action:status)}</p>${pending?`<div class="mission-actions"><button class="text-link" data-action="task-skip" data-id="${t.id}">略過</button><button class="btn small" data-action="task-done" data-id="${t.id}">${G.icon('check')} 完成任務</button></div>`:''}</article>`;
  if(variant==='simple')return `<article class="data-task ${pending?'':'is-resolved'}"><div class="row between"><h3>${G.nav('plant.html?id='+p.id,G.esc(p.name))}</h3><span class="tag ${pending?'warm':'gray'}">${pending?G.esc(info.title):G.esc(status)}</span></div><p class="data-evidence">${G.esc(info.evidence)}</p><p>${G.esc(info.action)}</p>${pending?`<div class="mission-actions"><button class="text-link" data-action="task-skip" data-id="${t.id}">略過</button><button class="btn small" data-action="task-done" data-id="${t.id}">${G.icon('check')} 標記已處理</button></div>`:''}</article>`;
  return `<article class="task-card ${pending?'':'done'}"><div class="row">${renderPlant(p.species,p.state,p.accessory)}<div class="grow">${G.nav('plant.html?id='+p.id,`<h3>${G.esc(p.name)}</h3><p>${G.esc(pending?say(t.event,p):status)}</p>`)}</div>${t.status==='done'?G.icon('check-circle'):''}</div>${pending?`<div class="actions"><button class="text-link" data-action="task-skip" data-id="${t.id}">略過這次</button><button class="btn small" data-action="task-done" data-id="${t.id}">${G.icon('check')} 我完成了</button></div>`:''}</article>`;
 };
 G.modePreview=id=>{
  const p=G.state.plants.find(p=>p.online)||G.state.plants[0],s=G.todaySummary();
  if(id==='companion')return `<div class="mode-preview preview-companion">${renderPlant(p?.species||'monstera','happy',p?.accessory)}<span>看看它的心情<br><b>今天，也一起慢慢生長。</b></span></div>`;
  if(id==='game')return `<div class="mode-preview preview-game"><div class="row between"><b>${G.icon('flag-checkered')} 今日任務</b><span>${s.resolved} / ${s.total}</span></div><div class="quest-track"><span style="width:${s.percent}%"></span></div><div class="row between"><span>Lv.${G.state.user.level}</span><strong>+${s.xp} XP 待領取</strong></div></div>`;
  return `<div class="mode-preview preview-data">${['soil','temp','lux'].map(k=>{const r=p?G.reading(p,k):{...G.readings[k],display:'—'};return `<div><span>${r.label}</span><strong>${r.display}<small>${r.unit}</small></strong></div>`}).join('')}</div>`;
 };
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action="mode-set"]');if(!button)return;
  G.applyTheme(button.dataset.mode);G.refresh();
  document.querySelector('.phone-scroll').scrollTop=0;
 });
})();

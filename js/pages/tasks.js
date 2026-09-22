GB.pages.tasks=()=>{
 const G=GB,mode=G.state.user.style;
 const tasks=G.state.tasks.filter(t=>G.plant(t.plant)),pending=tasks.filter(t=>t.status==='pending'),resolved=tasks.filter(t=>t.status!=='pending');
 const today=pending.filter(t=>t.due==='today'),later=pending.filter(t=>t.due!=='today'),summary=G.todaySummary(tasks);
 const title=mode==='game'?'任務日誌':mode==='simple'?'待處理事項':'今天，也好好照顧。';
 let overview;
 if(mode==='game')overview=`${G.questPlayer()}${G.questProgress(tasks)}`;
 else if(mode==='simple')overview=`<div class="data-kpis"><div class="${today.length?'kpi-alert':''}"><span>今日待辦</span><strong>${today.length}</strong></div><div><span>已完成</span><strong>${tasks.filter(t=>t.status==='done').length}</strong></div><div><span>已略過</span><strong>${tasks.filter(t=>t.status==='skipped').length}</strong></div></div>`;
 else overview=`<div class="task-summary"><div><h3>${today.length?`還有 ${today.length} 份小小的關心`:'今天的照顧，都處理好了。'}</h3><p class="small muted">完成 ${summary.done} 項 · 略過 ${summary.skipped} 項</p></div><div class="completion-ring" style="--progress:${summary.percent}%"><span>${summary.resolved}/${summary.total}</span></div></div>`;
 const group=(label,list)=>`<div class="section-head"><h2>${label}</h2><span class="small muted">${list.length} 項</span></div><div class="${mode==='game'?'mission-list':'stack'}">${list.map(t=>G.taskCard(t,mode)).join('')}</div>`;
 G.mount(`${G.header()}${G.modeTabs()}<div class="mode-page-heading"><div><span class="mode-kicker">${mode==='game'?'QUEST LOG':mode==='simple'?'CARE ACTIONS':'LITTLE ACTS OF CARE'}</span><h1>${title}</h1></div></div>${overview}${today.length?group(mode==='game'?'今日挑戰':'今天',today):`<div class="quest-clear mt24">${G.icon('check-circle')}<div><h3>${mode==='game'?'今日待辦已清空':'目前沒有今日待辦'}</h3><p>${mode==='simple'?'可前往總覽查看環境數值。':'去看看植物，或試穿一件喜歡的造型吧。'}</p></div></div>`}${later.length?group('稍後',later):''}${mode==='game'?G.rewardCard():''}${group('已處理紀錄',resolved)}${resolved.length?'':'<p class="small muted">完成或略過的照護事項會留在這裡。</p>'}`);
};

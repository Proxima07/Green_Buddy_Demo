GB.pages['style-pick']=()=>{
 const G=GB;
 G.mount(`${G.header('選擇照護方式','home.html','<span aria-hidden="true"></span>')}<div class="eyebrow caps mt24">YOUR WAY TO GROW</div><h1>讓首頁，<br>先呈現你在意的事。</h1><p class="muted mt8">植物的心情、任務成就，或環境數據。</p>${G.modes.map(m=>`<button class="style-choice mode-choice ${G.state.user.style===m.id?'selected':''}" data-style="${m.id}" aria-pressed="${G.state.user.style===m.id}"><div class="row"><span class="style-color">${G.icon(m.icon)}</span><div class="grow"><h3>${m.name}模式</h3></div>${G.state.user.style===m.id?G.icon('check-circle'):''}</div><p>${m.desc}</p>${G.modePreview(m.id)}</button>`).join('')}<button class="btn full mt16" id="style-save">使用${G.modes.find(m=>m.id===G.state.user.style).name}模式 ${G.icon('arrow-right')}</button><div class="center mt8"><button class="text-link" id="style-skip">先用陪伴模式</button></div><p class="footnote">之後可在首頁切換，也能在「我的」調整。</p>`,false);
 document.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{G.applyTheme(b.dataset.style);G.refresh()});
 const next=()=>{const dest=sessionStorage.getItem('greenbuddy.return');sessionStorage.removeItem('greenbuddy.return');G.go(dest||'home.html')};
 document.getElementById('style-save').onclick=next;
 document.getElementById('style-skip').onclick=()=>{G.applyTheme('companion');next()};
};

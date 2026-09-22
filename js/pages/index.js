GB.pages.index=()=>{
 const G=GB;
 G.mount(`${G.header('','', '<span class="demo-badge">DEMO</span>')}<div class="welcome-art"><span class="hello-bubble">嗨，很高興遇見你。</span>${renderPlant('monstera','happy','bow')}<span class="float-badge">${G.icon('heart')}</span></div><div class="center"><div class="eyebrow caps">A LITTLE GREEN, A LITTLE COMPANY</div><h1 class="welcome-title">讓一點綠，<br>陪你過每一天。</h1><div class="swiper welcome-swiper"><div class="swiper-wrapper">${[['plant','找到適合你的那一盆','從你的生活，遇見剛剛好的植物。'],['drop','不用猜，它會告訴你','口渴、怕熱，讓每一份需要被聽見。'],['heart','一起，把日子慢慢養好','從第一片新葉，到每一天的小陪伴。']].map(([icon,title,copy])=>`<div class="swiper-slide"><p><strong>${G.esc(title)}</strong><br>${G.esc(copy)}</p></div>`).join('')}</div><div class="swiper-pagination"></div></div></div><div class="welcome-actions">${G.nav('login.html?tab=register','開始使用 '+G.icon('arrow-right'),'btn full')}<div class="center mt8">${G.nav('login.html','我已經有帳號','text-link')}</div><div class="center"><button class="text-link small" id="quick-demo">直接逛逛示範花圃 ${G.icon('arrow-up-right')}</button></div></div>`,false);
 document.getElementById('app').classList.add('welcome');
 G.swiper('.welcome-swiper',{autoplay:matchMedia('(prefers-reduced-motion: reduce)').matches?false:{delay:4500,disableOnInteraction:false},loop:true});
 document.getElementById('quick-demo').onclick=()=>{G.auth(true);G.go('home.html')};
};

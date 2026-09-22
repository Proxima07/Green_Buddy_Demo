window.PERSONA = {
  companion:{water_needed:'我有點口渴了……今天可以給我一點水嗎？',overwater:'我喝太飽了啦……這幾天先讓我休息一下。',dark:'這裡有點暗暗的，可以帶我到明亮一點的地方嗎？',temp_high:'好熱喔……可以幫我躲一下太陽嗎？',happy:'今天的我很有精神，謝謝你一直陪著我。',sleeping:'噓，我正在做一個綠色的夢。',offline:'我的手環好像睡著了，可以幫我看一下嗎？',battery_low:'我的手環快沒電了，找時間幫我充個電好嗎？',water_done:'好舒服～謝謝你！又是被好好照顧的一天。',task_done:'收到你的心意了，謝謝你。'},
  game:{water_needed:'每日任務：幫{name}補水！獎勵 +10 XP',overwater:'{name}泡水中！先暫停澆水，守護根系。',dark:'支線任務：幫{name}找個明亮位置！',temp_high:'高溫警報！把{name}移到陰涼處 +15 XP',happy:'狀態滿分！連續照顧第 {streak} 天。',sleeping:'夥伴休息中，明天再一起冒險。',offline:'隊友失聯！檢查{name}的感測器 +5 XP',battery_low:'能量不足！替感測器補充電力。',water_done:'補水紀錄完成！繼續守護你的花園。',task_done:'任務達成，花園又進步了一點！'},
  simple:{water_needed:'{name}土壤濕度 {soil}%，建議檢查土壤後適量澆水。',overwater:'土壤濕度 {soil}%，偏濕。暫停澆水並確認排水。',dark:'{name}光照偏低，建議移近有散射光的窗邊。',temp_high:'目前 {temp}°C，建議移到通風陰涼處。',happy:'目前四項指標均在理想範圍。',sleeping:'夜間休息中，維持目前照護設定。',offline:'感測器已 3 小時未回報，請檢查電源與 Wi-Fi。',battery_low:'感測器剩餘電量 {battery}%，建議充電。',water_done:'已記錄澆水，展示數值已更新。',task_done:'已完成照護紀錄。'}
};
window.STATE_META={happy:['狀態很好','leaf'],thirsty:['有點口渴','drop'],overwater:['喝得太飽','drop'],dark:['想要亮一點','cloud'],hot:['有點太熱','sun'],sleeping:['休息中','moon'],offline:['設備離線','wifi-slash']};
window.say=function(event,plant={}){
 const s=window.GB?.state||MOCK, theme=s.user.style;
 const args={...s.user,...plant,streak:s.user.streak};
 return (PERSONA[theme]?.[event]||PERSONA.companion[event]||'').replace(/\{(\w+)\}/g,(_,key)=>String(args[key]??''));
};
window.stateEvent=s=>({thirsty:'water_needed',hot:'temp_high'}[s]||s);

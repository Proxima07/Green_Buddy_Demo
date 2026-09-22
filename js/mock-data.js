/* GreenBuddy Demo v1.0 — all values are simulated and stay in this browser. */
window.MOCK = {
  version: 1,
  user: {name: 'Kevin', style: 'companion', level: 3, levelTitle: '綠手指學徒', xp: 70, xpMax: 100, streak: 12, daysTogether: 32},
  settings: {notifications: true, reminder: '09:00', installed: false},
  gardens: [
    {id:'g1', name:'客廳', type:'室內', members:['Kevin','媽媽']},
    {id:'g2', name:'陽台', type:'陽台', members:['Kevin'], envModule:{temp:31.2, hum:62, lux:18000}}
  ],
  plants: [
    {id:'p1',garden:'g1',name:'小綠',species:'monstera',speciesName:'龜背芋',state:'happy',soil:45,lux:1200,temp:26,hum:60,battery:82,online:true,lastSeen:'5 分鐘前',accessory:'bow',device:'GB-000101',days:32,ideal:{soil:[35,60],lux:[800,3000],temp:[18,30],hum:[50,80]}},
    {id:'p2',garden:'g1',name:'波波',species:'pothos',speciesName:'黃金葛',state:'thirsty',soil:18,lux:600,temp:26,hum:58,battery:64,online:true,lastSeen:'12 分鐘前',accessory:null,device:'GB-000102',days:24,ideal:{soil:[30,60],lux:[300,2000],temp:[18,30],hum:[40,80]}},
    {id:'p3',garden:'g2',name:'阿肉',species:'succulent',speciesName:'多肉',state:'hot',soil:12,lux:42000,temp:35,hum:55,battery:90,online:true,lastSeen:'3 分鐘前',accessory:'sunglasses',device:'GB-000103',days:18,ideal:{soil:[5,25],lux:[5000,30000],temp:[10,32],hum:[20,60]}},
    {id:'p4',garden:'g2',name:'阿福',species:'snake',speciesName:'虎尾蘭',state:'offline',soil:null,lux:null,temp:null,hum:null,battery:8,online:false,lastSeen:'3 小時前',accessory:null,device:'GB-000104',days:12,ideal:{soil:[10,40],lux:[200,5000],temp:[15,32],hum:[30,70]}}
  ],
  tasks:[
    {id:'t1',plant:'p2',event:'water_needed',xp:10,due:'today',status:'pending'},
    {id:'t2',plant:'p3',event:'temp_high',xp:15,due:'today',status:'pending'},
    {id:'t3',plant:'p4',event:'offline',xp:5,due:'today',status:'pending'}
  ],
  wishlist:[], history:[], lastCareDate:null, completedCount:8, draft:null,
  demo:{route:'auto', outcome:'success', lowConfidence:false}
};
window.SPECIES = {
  monstera:{name:'龜背芋',latin:'Monstera deliciosa',ideal:{soil:[35,60],lux:[800,3000],temp:[18,30],hum:[50,80]},difficulty:2,pet:false,desc:'喜歡明亮的散射光，等表土稍乾再澆透水。'},
  pothos:{name:'黃金葛',latin:'Epipremnum aureum',ideal:{soil:[30,60],lux:[300,2000],temp:[18,30],hum:[40,80]},difficulty:1,pet:false,desc:'適應室內散射光，讓土壤乾濕交替，避免積水。'},
  snake:{name:'虎尾蘭',latin:'Dracaena trifasciata',ideal:{soil:[10,40],lux:[200,5000],temp:[15,32],hum:[30,70]},difficulty:1,pet:false,desc:'耐旱好照顧，土壤乾透再澆水，冬季減少澆水。'},
  succulent:{name:'多肉',latin:'Succulent collection',ideal:{soil:[5,25],lux:[5000,30000],temp:[10,32],hum:[20,60]},difficulty:2,pet:null,desc:'需要充足光照與通風，確認具體品種再評估寵物接觸。'},
  philodendron:{name:'蔓綠絨',latin:'Philodendron',avatar:'monstera',ideal:{soil:[30,60],lux:[800,3000],temp:[18,30],hum:[50,80]},difficulty:2,pet:false,desc:'放在明亮的散射光下，避免盆底積水。'},
  syngonium:{name:'合果芋',latin:'Syngonium podophyllum',avatar:'pothos',ideal:{soil:[30,60],lux:[500,2500],temp:[18,30],hum:[50,80]},difficulty:2,pet:false,desc:'喜歡溫暖、散射光，避免烈日直曬。'},
  peperomia:{name:'圓葉椒草',latin:'Peperomia obtusifolia',avatar:'succulent',ideal:{soil:[20,45],lux:[800,3000],temp:[18,30],hum:[40,70]},difficulty:1,pet:true,desc:'適合明亮散射光，表土乾了再澆水；仍應避免寵物啃食。'},
  palm:{name:'袖珍椰子',latin:'Chamaedorea elegans',avatar:'snake',ideal:{soil:[30,55],lux:[500,3000],temp:[18,30],hum:[45,75]},difficulty:2,pet:true,desc:'喜歡柔和光線，避免冷風與積水；仍應避免寵物啃食。'}
};
window.ACCESSORIES = [
  {id:'none',name:'原本的我',cat:'hat',icon:'plant',free:true},
  {id:'sunhat',name:'出遊草帽',cat:'hat',icon:'sun',free:true},
  {id:'crown',name:'綠手指皇冠',cat:'hat',icon:'crown',streak:7},
  {id:'beret',name:'小畫家帽',cat:'hat',icon:'palette',tasks:20},
  {id:'party',name:'派對尖帽',cat:'hat',icon:'confetti',tasks:30},
  {id:'nightcap',name:'晚安睡帽',cat:'hat',icon:'moon',streak:30},
  {id:'bow',name:'蝴蝶領結',cat:'jewel',icon:'bow',free:true},
  {id:'sunglasses',name:'夏日墨鏡',cat:'jewel',icon:'sunglasses',free:true},
  {id:'scarf',name:'暖暖圍巾',cat:'jewel',icon:'heart',streak:14},
  {id:'necklace',name:'星光項鍊',cat:'jewel',icon:'star',tasks:20},
  {id:'headphones',name:'音樂時光',cat:'jewel',icon:'headphones',tasks:40},
  {id:'ribbon',name:'花園勳章',cat:'jewel',icon:'medal',tasks:50},
  {id:'heart',name:'小小愛心',cat:'sticker',icon:'heart',tasks:10},
  {id:'star',name:'閃閃星光',cat:'sticker',icon:'star',streak:21},
  {id:'flower',name:'開一朵花',cat:'sticker',icon:'flower',tasks:25},
  {id:'rainbow',name:'雨後彩虹',cat:'sticker',icon:'rainbow',tasks:35},
  {id:'moon',name:'月光晚安',cat:'sticker',icon:'moon',streak:45},
  {id:'sparkle',name:'森林魔法',cat:'sticker',icon:'sparkle',tasks:60}
];

/* Pinned CDN libraries; a bundled copy makes the demo resilient to poor Wi-Fi. */
window.VendorReady=(async function(){
 const source=new URLSearchParams(location.search).get('assets');
 const list=[
  ['Chart','https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.js','assets/vendor/chart.umd.js'],
  ['confetti','https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.js','assets/vendor/confetti.browser.js'],
  ['Swiper','https://cdn.jsdelivr.net/npm/swiper@11.2.6/swiper-bundle.min.js','assets/vendor/swiper-bundle.min.js'],
  ['Swal','https://cdn.jsdelivr.net/npm/sweetalert2@11.17.2/dist/sweetalert2.all.min.js','assets/vendor/sweetalert2.all.min.js']
 ];
 async function script(url,timeout=1800){return new Promise(resolve=>{const el=document.createElement('script');let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);if(!ok)el.remove();resolve(ok)};el.src=url;el.async=true;el.onload=()=>finish(true);el.onerror=()=>finish(false);const timer=setTimeout(()=>finish(false),timeout);document.head.append(el)})}
 await Promise.all(list.map(async([key,cdn,local])=>{if(source==='local'){await script(local,4000);return}if(!await script(cdn,1300))await script(local,4000);if(!window[key])console.warn('Library unavailable:',key)}));
 return true;
})();

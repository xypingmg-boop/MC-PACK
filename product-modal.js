(function(){
var allProducts=[];
var API='https://508mc-production.up.railway.app';
function getLang(){return['de','en','es'].find(function(l){return document.body.classList.contains('lang-'+l);})||'zh';}
function getTrans(p){var lang=getLang();return(p.translations||[]).find(function(t){return t.lang===lang;})||(p.translations||[]).find(function(t){return t.lang==='zh';})||{};}
async function loadProducts(){try{var res=await fetch(API+'/api/products');var data=await res.json();allProducts=data.filter(function(p){return p.visible!==false;}).sort(function(a,b){return(a.sort||99)-(b.sort||99);});bindCards();}catch(e){console.warn('api err',e);}}
function bindCards(){document.querySelectorAll('.product-card').forEach(function(card,idx){var p=allProducts[idx];if(!p)return;card.style.cursor='pointer';card.addEventListener('click',function(){openPdp(p);});});}
function openPdp(p){
  var lang=getLang();
  var trans=getTrans(p);
  var labels={zh:{badge:'米彩包装',brand:'品牌：米彩包装（温州）有限公司',rating:'4.9 · 500+ 品牌客户好评',priceLabel:'定制报价起',priceNote:'工厂直销价，支持小批量定制',about:'关于本产品',specs:'可选规格',detail:'产品详情',ship:'24小时内专属顾问跟进 · 7天打样',cta1:'立即获取定制报价',cta2:'联系我们了解更多'},en:{badge:'MICAI Packaging',brand:'Brand: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ satisfied brand clients',priceLabel:'Custom Quote from',priceNote:'Factory direct · Low MOQ available',about:'About this item',specs:'Available Options',detail:'Product Details',ship:'Dedicated consultant within 24h · 7-day sampling',cta1:'Request a Custom Quote',cta2:'Contact Us to Learn More'},de:{badge:'MICAI Verpackung',brand:'Marke: MICAI Packaging (Wenzhou) GmbH',rating:'4.9 · 500+ zufriedene Markenkunden',priceLabel:'Angebot ab',priceNote:'Werksverkauf · Kleine Mengen möglich',about:'Über dieses Produkt',specs:'Verfügbare Optionen',detail:'Produktdetails',ship:'Berater innerhalb 24h · Muster in 7 Tagen',cta1:'Angebot anfordern',cta2:'Kontaktieren Sie uns'},es:{badge:'MICAI Packaging',brand:'Marca: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ clientes satisfechos',priceLabel:'Cotización desde',priceNote:'Venta directa de fábrica · MOQ bajo',about:'Sobre este producto',specs:'Opciones disponibles',detail:'Detalles del producto',ship:'Asesor en 24h · Muestra en 7 días',cta1:'Solicitar cotización',cta2:'Contáctenos'}};
  var L=labels[lang]||labels.zh;
  document.getElementById('pdpBadge').textContent=L.badge;
  document.getElementById('pdpBreadName').textContent=trans.name||p.slug||'';
  document.getElementById('pdpTitle').textContent=trans.name||p.slug||'';
  document.getElementById('pdpBrand').textContent=L.brand;
  document.getElementById('pdpRatingText').textContent=L.rating;
  var pb=document.getElementById('pdpPricebox');
  if(p.price){pb.style.display='block';document.getElementById('pdpPriceLabel').textContent=L.priceLabel;document.getElementById('pdpPrice').textContent='¥'+p.price;document.getElementById('pdpPriceNote').textContent=L.priceNote;var oe=document.getElementById('pdpOrig'),de2=document.getElementById('pdpDisc');if(p.originalPrice&&parseFloat(p.originalPrice)>parseFloat(p.price)){oe.textContent='¥'+p.originalPrice;oe.style.display='inline';de2.textContent='(-'+Math.round((1-parseFloat(p.price)/parseFloat(p.originalPrice))*100)+'%)';de2.style.display='inline';}else{oe.style.display='none';de2.style.display='none';}}else{pb.style.display='none';}
  document.getElementById('pdpAboutTitle').textContent=L.about;
  var ul=document.getElementById('pdpBullets');ul.innerHTML='';(trans.bulletPoints||[]).filter(Boolean).forEach(function(bp){var li=document.createElement('li');li.textContent=bp;ul.appendChild(li);});
  document.getElementById('pdpDesc').textContent=trans.description||'';
  var sw=document.getElementById('pdpSpecsWrap');
  var vv=p.variants?p.variants.filter(function(v){return v.visible!==false;}):[];
  if(vv.length){sw.style.display='block';document.getElementById('pdpSpecsTitle').textContent=L.specs;var h='';vv.forEach(function(v){h+='<div class="pdp-spec-row"><span class="pdp-spec-key">'+v.label+'</span><span class="pdp-spec-val">'+(v.price?'¥'+v.price:'')+(v.sku?' · '+v.sku:'')+'</span></div>';});document.getElementById('pdpSpecsBody').innerHTML=h;}else{sw.style.display='none';}
  var ds=document.getElementById('pdpDetailSection');
  if(trans.detail){ds.style.display='block';document.getElementById('pdpDetailTitle').textContent=L.detail;document.getElementById('pdpDetailBody').innerHTML=trans.detail;}else{ds.style.display='none';}
  document.getElementById('pdpShip').textContent=L.ship;
  document.getElementById('pdpCTA').textContent=L.cta1;
  document.getElementById('pdpCTA2').textContent=L.cta2;
  var imgs=(p.images&&p.images.filter(Boolean).length)?p.images.filter(Boolean):(p.imageUrl?[p.imageUrl]:[]);
  var mi=document.getElementById('pdpMainImg'),me=document.getElementById('pdpMainEmoji'),th=document.getElementById('pdpThumbs');
  th.innerHTML='';
  if(imgs.length){mi.src=imgs[0];mi.style.display='block';me.style.display='none';imgs.forEach(function(url,i){var d=document.createElement('div');d.className='pdp-thumb'+(i===0?' active':'');d.innerHTML='<img src="'+url+'" />';d.addEventListener('click',function(){mi.src=url;th.querySelectorAll('.pdp-thumb').forEach(function(t){t.classList.remove('active');});d.classList.add('active');});th.appendChild(d);});}else{mi.style.display='none';me.style.display='flex';me.textContent=p.icon||'📦';}
  var pdp=document.getElementById('pdp');
  pdp.style.display='block';
  document.body.style.overflow='hidden';
  pdp.scrollTop=0;
}
window.closePdp=function(){document.getElementById('pdp').style.display='none';document.body.style.overflow='';};
window.closeModal=window.closePdp;
window.openLightbox=function(src){if(!src||src.endsWith('undefined'))return;document.getElementById('pdpLightboxImg').src=src;document.getElementById('pdpLightbox').classList.add('open');};
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.getElementById('pdpLightbox').classList.remove('open');closePdp();}});
loadProducts();
})();

(function(){
var allProducts=[];
var API='https://508mc-production.up.railway.app';
function getLang(){return['de','en','es'].find(function(l){return document.body.classList.contains('lang-'+l);})||'zh';}
function getTrans(p,field){var lang=getLang();var t=(p.translations||[]).find(function(t){return t.lang===lang;})||(p.translations||[]).find(function(t){return t.lang==='zh';})||{};return t[field]||'';}
async function loadProducts(){try{var res=await fetch(API+'/api/products');var data=await res.json();allProducts=data.filter(function(p){return p.visible!==false;}).sort(function(a,b){return(a.sort||99)-(b.sort||99);});bindCards();}catch(e){console.warn('api err',e);}}
function bindCards(){document.querySelectorAll('.product-card').forEach(function(card,idx){var p=allProducts[idx];if(!p)return;card.style.cursor='pointer';card.addEventListener('click',function(){openModal(p);});});}
function openModal(p){
  var lang=getLang();
  var trans=(p.translations||[]).find(function(t){return t.lang===lang;})||(p.translations||[]).find(function(t){return t.lang==='zh';})||{};
  var badge=document.getElementById('modalBadge');
  var badgeLabels={zh:'米彩包装',en:'MICAI Packaging',de:'MICAI Verpackung',es:'MICAI Packaging'};
  badge.textContent=badgeLabels[lang]||'MICAI';badge.style.display='inline-block';
  document.getElementById('modalTitle').textContent=trans.name||p.slug||'';
  var brandLabels={zh:'品牌：米彩包装（温州）有限公司',en:'Brand: MICAI Packaging (Wenzhou) Co., Ltd.',de:'Marke: MICAI Packaging (Wenzhou)',es:'Marca: MICAI Packaging (Wenzhou)'};
  document.getElementById('modalBrand').textContent=brandLabels[lang]||'';
  var pa=document.getElementById('modalPriceArea');
  if(p.price){
    pa.style.display='block';
    var priceLabelMap={zh:'定制报价起',en:'Custom Quote from',de:'Angebot ab',es:'Cotizacion desde'};
    document.getElementById('modalPriceLabel').textContent=priceLabelMap[lang]||'';
    document.getElementById('modalPrice').textContent='Y'+p.price;
    var oe=document.getElementById('modalOrigPrice'),de2=document.getElementById('modalDiscount');
    if(p.originalPrice&&parseFloat(p.originalPrice)>parseFloat(p.price)){
      oe.textContent='Y'+p.originalPrice;oe.style.display='inline';
      de2.textContent='(-'+Math.round((1-parseFloat(p.price)/parseFloat(p.originalPrice))*100)+'%)';de2.style.display='inline';
    }else{oe.style.display='none';de2.style.display='none';}
  }else{pa.style.display='none';}
  var aboutMap={zh:'关于本产品',en:'About this item',de:'Ueber dieses Produkt',es:'Sobre este producto'};
  document.getElementById('modalAboutTitle').textContent=aboutMap[lang]||'';
  var ul=document.getElementById('modalBulletList');ul.innerHTML='';
  (trans.bulletPoints||[]).filter(Boolean).forEach(function(bp){var li=document.createElement('li');li.textContent=bp;ul.appendChild(li);});
  document.getElementById('modalDesc').textContent=trans.description||'';
  var sp=document.getElementById('modalSpecs');
  var visiVariants=p.variants?p.variants.filter(function(v){return v.visible!==false;}):[];
  if(visiVariants.length){
    sp.style.display='block';
    var optMap={zh:'可选规格',en:'Available Options',de:'Verfuegbare Optionen',es:'Opciones disponibles'};
    document.getElementById('modalSpecsTitle').textContent=optMap[lang]||'';
    var html='';
    visiVariants.forEach(function(v){html+='<div class="m-spec-row"><span class="m-spec-key">'+v.label+'</span><span class="m-spec-val">'+(v.price?'Y'+v.price:'')+(v.sku?' - '+v.sku:'')+'</span></div>';});
    document.getElementById('modalSpecsBody').innerHTML=html;
  }else if(trans.detail){
    sp.style.display='block';
    var detMap={zh:'产品详情',en:'Product Details',de:'Produktdetails',es:'Detalles del producto'};
    document.getElementById('modalSpecsTitle').textContent=detMap[lang]||'';
    document.getElementById('modalSpecsBody').innerHTML='<div style="font-size:13px;color:#333;line-height:1.8;">'+trans.detail+'</div>';
  }else{sp.style.display='none';}
  var cta1Map={zh:'立即获取定制报价',en:'Request a Custom Quote',de:'Angebot anfordern',es:'Solicitar cotizacion'};
  var cta2Map={zh:'联系我们了解更多',en:'Contact Us to Learn More',de:'Kontaktieren Sie uns',es:'Contactenos'};
  document.getElementById('modalCTA').textContent=cta1Map[lang]||'';
  document.getElementById('modalCTA2').textContent=cta2Map[lang]||'';
  var imgs=(p.images&&p.images.filter(Boolean).length)?p.images.filter(Boolean):(p.imageUrl?[p.imageUrl]:[]);
  var mi=document.getElementById('modalMainImg'),me=document.getElementById('modalMainImgEmoji'),th=document.getElementById('modalThumbnails');
  th.innerHTML='';
  if(imgs.length){
    mi.src=imgs[0];mi.style.display='block';me.style.display='none';
    imgs.forEach(function(url,i){
      var d=document.createElement('div');d.className='m-thumb'+(i===0?' active':'');
      d.innerHTML='<img src="'+url+'" />';
      d.addEventListener('click',function(){mi.src=url;th.querySelectorAll('.m-thumb').forEach(function(t){t.classList.remove('active');});d.classList.add('active');});
      th.appendChild(d);
    });
  }else{mi.style.display='none';me.style.display='flex';me.textContent=p.icon||'box';}
  var modal=document.getElementById('productModal'),box=document.getElementById('modalBox');
  modal.style.display='block';document.body.style.overflow='hidden';
  requestAnimationFrame(function(){requestAnimationFrame(function(){box.style.opacity='1';box.style.transform='translateY(0)';});});
}
window.closeModal=function(){
  var box=document.getElementById('modalBox');
  box.style.opacity='0';box.style.transform='translateY(24px)';
  setTimeout(function(){document.getElementById('productModal').style.display='none';document.body.style.overflow='';},320);
};
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
loadProducts();
})();

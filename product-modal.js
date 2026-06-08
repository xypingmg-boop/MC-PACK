(function(){
var allProducts=[];
var API='https://508mc-production.up.railway.app';
function getLang(){return['de','en','es'].find(function(l){return document.body.classList.contains('lang-'+l);})||'zh';}
function getTrans(p){var lang=getLang();return(p.translations||[]).find(function(t){return t.lang===lang;})||(p.translations||[]).find(function(t){return t.lang==='zh';})||{};}

async function loadProducts(){
  try{
    var res=await fetch(API+'/api/products');
    var data=await res.json();
    allProducts=data.filter(function(p){return p.visible!==false;}).sort(function(a,b){return(a.sort||99)-(b.sort||99);});
    bindCards();
  }catch(e){console.warn('api err',e);}
}

function bindCards(){
  document.querySelectorAll('.product-card').forEach(function(card,idx){
    var p=allProducts[idx];
    if(!p)return;
    card.style.cursor='pointer';
    card.addEventListener('click',function(){openPdp(p);});
  });
}

// 侧边栏分类数据
var CATS={
  zh:['天地盖礼盒','磁吸翻盖礼盒','抽屉式礼盒','异形创意礼盒','茶叶/食品礼盒','节日主题礼盒'],
  en:['Rigid Lid & Base Box','Magnetic Closure Box','Drawer Slide Box','Custom Shape Box','Tea & Food Gift Box','Seasonal Gift Box'],
  de:['Starre Deckel-Boden-Box','Box mit Magnetverschluss','Schubladen-Geschenkbox','Sonderform-Box','Tee- & Lebensmittel-Box','Saisonale Geschenkbox'],
  es:['Caja Tapa y Base','Caja Cierre Magnético','Caja Cajón','Caja Forma Especial','Caja Té y Alimentos','Caja Estacional']
};
var FEATS={
  zh:[['🏭','自有工厂·全程可控'],['📦','最低起订300套'],['🌿','FSC认证·环保材质'],['✈️','支持海运/空运出口'],['⏱️','7天打样·15-20天交货']],
  en:[['🏭','Owned factory · Full control'],['📦','MOQ from 300 units'],['🌿','FSC certified · Eco materials'],['✈️','Sea & air freight export'],['⏱️','7-day sample · 15-20 day lead']],
  de:[['🏭','Eigene Fabrik · Volle Kontrolle'],['📦','Mindestmenge ab 300 Stück'],['🌿','FSC-zertifiziert · Öko-Materialien'],['✈️','See- & Luftfracht Export'],['⏱️','Muster in 7 Tagen · 15-20 Tage']],
  es:[['🏭','Fábrica propia · Control total'],['📦','MOQ desde 300 unidades'],['🌿','Certificado FSC · Eco materiales'],['✈️','Exportación marítima y aérea'],['⏱️','Muestra 7 días · Entrega 15-20 días']]
};
var SIDETITLES={zh:'产品分类',en:'Product Categories',de:'Produktkategorien',es:'Categorías'};
var SIDEFEATTITLES={zh:'核心优势',en:'Why MICAI',de:'Warum MICAI',es:'Por qué MICAI'};
var SIDECONTACT={zh:'需要专业建议？',en:'Need expert advice?',de:'Fachberatung gewünscht?',es:'¿Necesita asesoría?'};
var SIDEBTN={zh:'免费咨询顾问',en:'Free Consultation',de:'Kostenlose Beratung',es:'Consulta gratuita'};

function buildSidebar(currentProduct){
  var lang=getLang();
  var cats=CATS[lang]||CATS.zh;
  var feats=FEATS[lang]||FEATS.zh;
  var currentIdx=allProducts.indexOf(currentProduct);

  var catHtml='';
  cats.forEach(function(cat,i){
    var active=i===currentIdx?' active':'';
    catHtml+='<a class="pdp-side-cat'+active+'" onclick="switchProduct('+i+')" href="#">'+cat+'</a>';
  });

  var featHtml='';
  feats.forEach(function(f){
    featHtml+='<div class="pdp-side-feat"><span class="pdp-side-feat-icon">'+f[0]+'</span><span>'+f[1]+'</span></div>';
  });

  return '<div id="pdpSidebar">'+
    '<div id="pdpSidebarTitle">'+( SIDETITLES[lang]||'Categories')+'</div>'+
    catHtml+
    '<div id="pdpSideFeatures">'+
      '<div id="pdpSideFeatTitle">'+(SIDEFEATTITLES[lang]||'Why MICAI')+'</div>'+
      featHtml+
    '</div>'+
    '<div id="pdpSideContact">'+
      '<div id="pdpSideContactText">'+(SIDECONTACT[lang]||'Need advice?')+'</div>'+
      '<a id="pdpSideContactBtn" href="#contact" onclick="closePdp()">'+(SIDEBTN[lang]||'Free Consultation')+'</a>'+
    '</div>'+
  '</div>';
}

window.switchProduct=function(idx){
  var p=allProducts[idx];
  if(p) openPdp(p);
};

function openPdp(p){
  var lang=getLang();
  var trans=getTrans(p);
  var L={
    zh:{badge:'米彩包装',brand:'品牌：米彩包装（温州）有限公司',rating:'4.9 · 500+ 品牌客户好评',priceLabel:'定制报价起',priceNote:'工厂直销 · 支持小批量定制',about:'关于本产品',specs:'可选规格',detail:'产品详情',ship:'24小时内专属顾问跟进 · 7天打样',cta1:'立即获取定制报价',cta2:'联系我们了解更多'},
    en:{badge:'MICAI Packaging',brand:'Brand: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ satisfied brand clients',priceLabel:'Custom Quote from',priceNote:'Factory direct · Low MOQ available',about:'About this item',specs:'Available Options',detail:'Product Details',ship:'Dedicated consultant within 24h · 7-day sampling',cta1:'Request a Custom Quote',cta2:'Contact Us to Learn More'},
    de:{badge:'MICAI Verpackung',brand:'Marke: MICAI Packaging (Wenzhou) GmbH',rating:'4.9 · 500+ zufriedene Markenkunden',priceLabel:'Angebot ab',priceNote:'Werksverkauf · Kleine Mengen möglich',about:'Über dieses Produkt',specs:'Verfügbare Optionen',detail:'Produktdetails',ship:'Berater innerhalb 24h · Muster in 7 Tagen',cta1:'Angebot anfordern',cta2:'Kontaktieren Sie uns'},
    es:{badge:'MICAI Packaging',brand:'Marca: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ clientes satisfechos',priceLabel:'Cotización desde',priceNote:'Venta directa · MOQ bajo',about:'Sobre este producto',specs:'Opciones disponibles',detail:'Detalles del producto',ship:'Asesor en 24h · Muestra en 7 días',cta1:'Solicitar cotización',cta2:'Contáctenos'}
  }[lang]||{};

  // sidebar
  document.getElementById('pdpLayoutInner').innerHTML=buildSidebar(p)+'<div id="pdpMain"></div>';
  var main=document.getElementById('pdpMain');

  // bread
  document.getElementById('pdpBreadName').textContent=trans.name||p.slug||'';

  // build main content
  var imgs=(p.images&&p.images.filter(Boolean).length)?p.images.filter(Boolean):(p.imageUrl?[p.imageUrl]:[]);

  var thumbsHtml='';
  imgs.forEach(function(url,i){
    thumbsHtml+='<div class="pdp-thumb'+(i===0?' active':'')+'" data-url="'+url+'"><img src="'+url+'" /></div>';
  });

  var bulletsHtml='';
  (trans.bulletPoints||[]).filter(Boolean).forEach(function(bp){
    bulletsHtml+='<li>'+bp+'</li>';
  });

  var priceHtml='';
  if(p.price){
    var discHtml='';
    if(p.originalPrice&&parseFloat(p.originalPrice)>parseFloat(p.price)){
      var pct=Math.round((1-parseFloat(p.price)/parseFloat(p.originalPrice))*100);
      discHtml='<span style="font-size:14px;color:#565959;text-decoration:line-through;margin-left:10px;font-family:Arial,sans-serif;">¥'+p.originalPrice+'</span><span style="font-size:14px;color:#B12704;margin-left:8px;font-family:Arial,sans-serif;">(-'+pct+'%)</span>';
    }
    priceHtml='<div style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:4px;padding:18px 20px;margin-bottom:16px;">'+
      '<div style="font-size:12px;color:#565959;font-family:Arial,sans-serif;margin-bottom:4px;">'+L.priceLabel+'</div>'+
      '<span style="font-size:32px;color:#B12704;font-family:Arial,sans-serif;">¥'+p.price+'</span>'+discHtml+
      '<div style="font-size:12px;color:#007600;margin-top:6px;font-family:Arial,sans-serif;">'+L.priceNote+'</div>'+
    '</div>';
  }

  var specsHtml='';
  var vv=p.variants?p.variants.filter(function(v){return v.visible!==false;}):[];
  if(vv.length){
    specsHtml='<div style="margin-top:8px;"><div style="font-size:16px;font-weight:700;color:#0F1111;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e8e8e8;font-family:Arial,sans-serif;">'+L.specs+'</div>';
    vv.forEach(function(v){
      specsHtml+='<div style="display:grid;grid-template-columns:160px 1fr;font-size:14px;padding:8px 0;border-bottom:1px solid #f5f5f5;font-family:Arial,sans-serif;"><span style="color:#565959;">'+v.label+'</span><span style="color:#0F1111;">'+(v.price?'¥'+v.price:'')+(v.sku?' · '+v.sku:'')+'</span></div>';
    });
    specsHtml+='</div>';
  }

  var detailHtml='';
  if(trans.detail){
    detailHtml='<div style="margin:0 24px 48px;"><hr style="border:none;border-top:1px solid #e8e8e8;margin-bottom:28px;"/>'+
      '<div style="font-size:18px;font-weight:700;color:#0F1111;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #e77600;font-family:Arial,sans-serif;display:inline-block;">'+L.detail+'</div>'+
      '<div style="font-size:14px;color:#333;line-height:1.9;font-family:Arial,sans-serif;">'+trans.detail+'</div></div>';
  }

  main.innerHTML=
    '<div style="display:grid;grid-template-columns:80px 1fr 380px;gap:0 24px;padding:28px 0 28px 24px;">'+
      // thumbs
      '<div id="pdpThumbs" style="display:flex;flex-direction:column;gap:8px;padding-top:4px;">'+thumbsHtml+'</div>'+
      // main img
      '<div>'+
        '<img id="pdpMainImg" src="'+(imgs[0]||'')+'" style="width:100%;aspect-ratio:1/1;object-fit:contain;border:1px solid #e8e8e8;background:#fff;cursor:zoom-in;display:'+(imgs.length?'block':'none')+';" onclick="openLightbox(this.src)"/>'+
        '<div id="pdpMainEmoji" style="width:100%;aspect-ratio:1/1;display:'+(imgs.length?'none':'flex')+';align-items:center;justify-content:center;font-size:120px;background:#f9f9f9;border:1px solid #e8e8e8;">'+(imgs.length?'':(p.icon||'📦'))+'</div>'+
        '<div style="font-size:11px;color:#007185;text-align:center;margin-top:6px;font-family:Arial,sans-serif;cursor:pointer;" onclick="openLightbox(document.getElementById(\'pdpMainImg\').src)">'+
          '<span class="zh">🔍 点击查看大图</span><span class="en">🔍 Click to enlarge</span><span class="de">🔍 Vergrößern</span><span class="es">🔍 Ampliar</span>'+
        '</div>'+
      '</div>'+
      // right panel
      '<div style="padding-right:0;">'+
        '<div style="display:inline-block;background:#c45500;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:2px;margin-bottom:10px;font-family:Arial,sans-serif;">'+L.badge+'</div>'+
        '<div style="font-size:22px;font-weight:400;line-height:1.4;color:#0F1111;margin-bottom:6px;font-family:Arial,sans-serif;">'+(trans.name||p.slug||'')+'</div>'+
        '<div style="font-size:13px;color:#007185;margin-bottom:10px;font-family:Arial,sans-serif;">'+L.brand+'</div>'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;"><span style="color:#e77600;font-size:16px;">★★★★★</span><span style="font-size:13px;color:#007185;font-family:Arial,sans-serif;">'+L.rating+'</span></div>'+
        '<hr style="border:none;border-top:1px solid #e8e8e8;margin:0 0 14px;"/>'+
        priceHtml+
        '<div style="font-size:16px;font-weight:700;color:#0F1111;margin:20px 0 10px;font-family:Arial,sans-serif;padding-bottom:6px;border-bottom:1px solid #e8e8e8;">'+L.about+'</div>'+
        '<ul style="padding-left:0;margin:0 0 16px;list-style:none;">'+bulletsHtml+'</ul>'+
        '<p style="font-size:14px;color:#333;line-height:1.8;font-family:Arial,sans-serif;margin-bottom:20px;">'+(trans.description||'')+'</p>'+
        specsHtml+
        '<div style="border:1px solid #ddd;border-radius:8px;padding:20px;margin-top:16px;">'+
          '<a href="#contact" onclick="closePdp()" style="display:block;width:100%;padding:11px;background:linear-gradient(to bottom,#f7dfa5,#f0c14b);border:1px solid #a88734;border-radius:20px;font-size:14px;font-weight:700;color:#111;cursor:pointer;text-align:center;text-decoration:none;font-family:Arial,sans-serif;margin-bottom:10px;">'+L.cta1+'</a>'+
          '<a href="#contact" onclick="closePdp()" style="display:block;width:100%;padding:11px;background:linear-gradient(to bottom,#f5f5f5,#e8e8e8);border:1px solid #adb1b8;border-radius:20px;font-size:14px;color:#111;text-align:center;text-decoration:none;font-family:Arial,sans-serif;">'+L.cta2+'</a>'+
          '<div style="font-size:12px;color:#007600;margin-top:12px;font-family:Arial,sans-serif;text-align:center;">'+L.ship+'</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    detailHtml;

  // bind thumbs
  var thumbEls=main.querySelectorAll('.pdp-thumb');
  var mainImgEl=main.querySelector('#pdpMainImg');
  thumbEls.forEach(function(d){
    d.addEventListener('click',function(){
      mainImgEl.src=d.getAttribute('data-url');
      thumbEls.forEach(function(t){t.classList.remove('active');});
      d.classList.add('active');
    });
  });

  var pdp=document.getElementById('pdp');
  pdp.style.display='block';
  document.body.style.overflow='hidden';
  pdp.scrollTop=0;
}

window.closePdp=function(){document.getElementById('pdp').style.display='none';document.body.style.overflow='';};
window.closeModal=window.closePdp;
window.openLightbox=function(src){if(!src||src.endsWith('undefined')||src===window.location.href)return;document.getElementById('pdpLightboxImg').src=src;document.getElementById('pdpLightbox').classList.add('open');};
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.getElementById('pdpLightbox').classList.remove('open');if(document.getElementById('pdp').style.display!=='none')closePdp();}});
loadProducts();
})();

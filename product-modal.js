(function(){
var allProducts=[];
var API='https://508mc-production.up.railway.app';

function getLang(){return['de','en','es'].find(function(l){return document.body.classList.contains('lang-'+l);})||'zh';}
function getTrans(p){var lang=getLang();return(p.translations||[]).find(function(t){return t.lang===lang;})||(p.translations||[]).find(function(t){return t.lang==='zh';})||{};}

var CATS={
  zh:['天地盖礼盒','磁吸翻盖礼盒','抽屉式礼盒','异形创意礼盒','茶叶/食品礼盒','节日主题礼盒'],
  en:['Rigid Lid & Base Box','Magnetic Closure Box','Drawer Slide Box','Custom Shape Box','Tea & Food Gift Box','Seasonal Gift Box'],
  de:['Starre Deckel-Boden-Box','Magnetverschluss-Box','Schubladen-Box','Sonderform-Box','Tee & Lebensmittel-Box','Saisonale Geschenkbox'],
  es:['Caja Tapa y Base','Caja Cierre Magnético','Caja Cajón','Caja Forma Especial','Caja Té y Alimentos','Caja Estacional']
};

async function loadProducts(){
  try{
    var res=await fetch(API+'/api/products');
    var data=await res.json();
    allProducts=data.filter(function(p){return p.visible!==false;}).sort(function(a,b){return(a.sort||99)-(b.sort||99);});
    bindCards();
    injectPdpShell();
  }catch(e){console.warn('api err',e);}
}

function injectPdpShell(){
  if(document.getElementById('pdpOverlay'))return;
  var style=document.createElement('style');
  style.textContent=[
    '#pdpOverlay{display:none;position:fixed;inset:0;z-index:2000;background:#fff;overflow-y:auto;font-family:Arial,sans-serif;}',
    '#pdpOverlay *{box-sizing:border-box;}',
    '#pdpTopBar{background:#131921;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;}',
    '#pdpTopBar .brand{color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px;}',
    '#pdpTopBar .brand em{color:#febd69;font-style:normal;}',
    '#pdpTopBar .back-btn{background:none;border:1px solid rgba(255,255,255,0.4);color:#fff;padding:6px 16px;cursor:pointer;font-size:13px;border-radius:3px;}',
    '#pdpTopBar .back-btn:hover{background:rgba(255,255,255,0.1);}',
    '#pdpBread{background:#232f3e;padding:7px 20px;font-size:12px;color:rgba(255,255,255,0.6);}',
    '#pdpBread span{color:#febd69;}',
    '#pdpWrap{display:flex;max-width:1400px;margin:0 auto;}',
    '#pdpSide{width:210px;flex-shrink:0;padding:20px 12px 20px 20px;border-right:1px solid #e8e8e8;}',
    '#pdpSide h3{font-size:15px;font-weight:700;color:#0F1111;border-bottom:2px solid #e77600;padding-bottom:7px;margin:0 0 8px;}',
    '.pcat{display:block;font-size:13px;color:#0F1111;padding:7px 10px;border-left:3px solid transparent;text-decoration:none;line-height:1.4;cursor:pointer;}',
    '.pcat:hover{background:#f5f5f5;color:#c45500;}',
    '.pcat.on{color:#c45500;font-weight:700;border-left-color:#e77600;background:#fff8f0;}',
    '#pdpSideBox{margin-top:18px;background:#f9f9f9;border:1px solid #e8e8e8;border-radius:4px;padding:12px;}',
    '#pdpSideBox h4{font-size:12px;font-weight:700;color:#0F1111;margin:0 0 8px;}',
    '.pfeat{display:flex;gap:8px;font-size:12px;color:#444;margin-bottom:7px;line-height:1.4;}',
    '.pfeat i{font-size:15px;flex-shrink:0;font-style:normal;}',
    '#pdpSideCta{margin-top:14px;background:#131921;border-radius:4px;padding:12px;text-align:center;}',
    '#pdpSideCta p{font-size:11px;color:rgba(255,255,255,0.6);margin:0 0 8px;}',
    '#pdpSideCta a{display:block;background:#febd69;color:#111;font-size:12px;font-weight:700;padding:7px;border-radius:3px;text-decoration:none;}',
    '#pdpContent{flex:1;min-width:0;padding:24px;}',
    '#pdpGrid{display:grid;grid-template-columns:72px 1fr 360px;gap:0 20px;}',
    '#pdpThumbs{display:flex;flex-direction:column;gap:8px;}',
    '.pthumb{width:64px;height:64px;border:2px solid #ddd;cursor:pointer;overflow:hidden;border-radius:2px;flex-shrink:0;}',
    '.pthumb:hover,.pthumb.on{border-color:#e77600;}',
    '.pthumb img{width:100%;height:100%;object-fit:cover;}',
    '#pdpImgBox{position:relative;}',
    '#pdpImg{width:100%;aspect-ratio:1/1;object-fit:contain;border:1px solid #e8e8e8;cursor:zoom-in;background:#fff;}',
    '#pdpEmoji{width:100%;aspect-ratio:1/1;display:none;align-items:center;justify-content:center;font-size:120px;background:#f9f9f9;border:1px solid #e8e8e8;}',
    '#pdpZoomHint{font-size:11px;color:#007185;text-align:center;margin-top:5px;cursor:pointer;}',
    '#pdpInfo{}',
    '#pdpBadge{display:inline-block;background:#c45500;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:2px;margin-bottom:8px;}',
    '#pdpTitle{font-size:21px;font-weight:400;line-height:1.4;color:#0F1111;margin-bottom:6px;}',
    '#pdpBrandLine{font-size:13px;color:#007185;margin-bottom:10px;}',
    '#pdpRating{display:flex;align-items:center;gap:8px;margin-bottom:12px;}',
    '#pdpRating .stars{color:#e77600;font-size:16px;}',
    '#pdpRating .rtxt{font-size:13px;color:#007185;}',
    '#pdpPriceBox{background:#f9f9f9;border:1px solid #e8e8e8;border-radius:4px;padding:16px;margin-bottom:14px;}',
    '#pdpPriceBox .plabel{font-size:12px;color:#565959;margin-bottom:3px;}',
    '#pdpPriceBox .pprice{font-size:30px;color:#B12704;}',
    '#pdpPriceBox .porig{font-size:14px;color:#565959;text-decoration:line-through;margin-left:8px;}',
    '#pdpPriceBox .pdisc{font-size:14px;color:#B12704;margin-left:6px;}',
    '#pdpPriceBox .pnote{font-size:12px;color:#007600;margin-top:5px;}',
    '#pdpAboutH{font-size:15px;font-weight:700;color:#0F1111;border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin:14px 0 8px;}',
    '#pdpBullets{padding:0;margin:0 0 10px;list-style:none;}',
    '#pdpBullets li{font-size:13px;color:#0F1111;line-height:1.7;padding:2px 0 2px 16px;position:relative;}',
    '#pdpBullets li::before{content:"\\25AA";position:absolute;left:0;color:#e77600;}',
    '#pdpDescTxt{font-size:13px;color:#444;line-height:1.8;margin-bottom:12px;}',
    '#pdpSpecH{font-size:15px;font-weight:700;color:#0F1111;border-bottom:1px solid #e8e8e8;padding-bottom:6px;margin:14px 0 8px;}',
    '.psrow{display:grid;grid-template-columns:150px 1fr;font-size:13px;padding:7px 0;border-bottom:1px solid #f5f5f5;}',
    '.psrow .pk{color:#565959;}.psrow .pv{color:#0F1111;}',
    '#pdpBuyBox{border:1px solid #ddd;border-radius:8px;padding:18px;}',
    '#pdpCta1{display:block;width:100%;padding:10px;background:linear-gradient(to bottom,#f7dfa5,#f0c14b);border:1px solid #a88734;border-radius:20px;font-size:14px;font-weight:700;color:#111;text-align:center;text-decoration:none;margin-bottom:8px;}',
    '#pdpCta1:hover{filter:brightness(0.96);}',
    '#pdpCta2{display:block;width:100%;padding:10px;background:linear-gradient(to bottom,#f5f5f5,#e8e8e8);border:1px solid #adb1b8;border-radius:20px;font-size:14px;color:#111;text-align:center;text-decoration:none;}',
    '#pdpCta2:hover{filter:brightness(0.96);}',
    '#pdpShipNote{font-size:12px;color:#007600;text-align:center;margin-top:10px;}',
    '#pdpDetailSec{margin-top:32px;padding-top:24px;border-top:1px solid #e8e8e8;}',
    '#pdpDetailH{font-size:17px;font-weight:700;color:#0F1111;border-bottom:2px solid #e77600;display:inline-block;padding-bottom:6px;margin-bottom:14px;}',
    '#pdpDetailBody{font-size:14px;color:#333;line-height:1.9;}',
    '#pdpLightbox{display:none;position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.93);align-items:center;justify-content:center;cursor:zoom-out;}',
    '#pdpLightbox.on{display:flex;}',
    '#pdpLightbox img{max-width:90vw;max-height:90vh;object-fit:contain;}',
    '@media(max-width:960px){#pdpSide{display:none;}#pdpGrid{grid-template-columns:60px 1fr;}#pdpInfo{grid-column:1/-1;margin-top:16px;}}'
  ].join('');
  document.head.appendChild(style);

  var overlay=document.createElement('div');
  overlay.id='pdpOverlay';
  overlay.innerHTML=
    '<div id="pdpTopBar">'+
      '<div class="brand">MICAI <em>Packaging</em></div>'+
      '<button class="back-btn" onclick="closePdp()">'+
        '&#x2715; <span class="zh">返回</span><span class="en">Back</span><span class="de">Zurück</span><span class="es">Volver</span>'+
      '</button>'+
    '</div>'+
    '<div id="pdpBread"><span class="zh">产品中心</span><span class="en">Products</span><span class="de">Produkte</span><span class="es">Productos</span> › <span id="pdpBreadCrumb"></span></div>'+
    '<div id="pdpWrap">'+
      '<div id="pdpSide"><h3 id="pdpCatH"></h3><div id="pdpCats"></div><div id="pdpSideBox"><h4 id="pdpFeatH"></h4><div id="pdpFeats"></div></div><div id="pdpSideCta"><p id="pdpSideCtaP"></p><a href="#contact" id="pdpSideCtaA" onclick="closePdp()"></a></div></div>'+
      '<div id="pdpContent">'+
        '<div id="pdpGrid">'+
          '<div id="pdpThumbs"></div>'+
          '<div id="pdpImgBox"><img id="pdpImg" src="" alt="" onclick="openLightbox(this.src)"/><div id="pdpEmoji"></div><div id="pdpZoomHint" onclick="openLightbox(document.getElementById(\'pdpImg\').src)"><span class="zh">🔍 点击放大</span><span class="en">🔍 Click to zoom</span><span class="de">🔍 Vergrößern</span><span class="es">🔍 Ampliar</span></div></div>'+
          '<div id="pdpInfo">'+
            '<div id="pdpBadge"></div>'+
            '<div id="pdpTitle"></div>'+
            '<div id="pdpBrandLine"></div>'+
            '<div id="pdpRating"><span class="stars">★★★★★</span><span class="rtxt" id="pdpRtxt"></span></div>'+
            '<hr style="border:none;border-top:1px solid #e8e8e8;margin:10px 0;"/>'+
            '<div id="pdpPriceBox" style="display:none;"><div class="plabel" id="pdpPlabel"></div><span class="pprice" id="pdpPrice"></span><span class="porig" id="pdpOrig" style="display:none;"></span><span class="pdisc" id="pdpDisc" style="display:none;"></span><div class="pnote" id="pdpPnote"></div></div>'+
            '<div id="pdpAboutH"></div>'+
            '<ul id="pdpBullets"></ul>'+
            '<p id="pdpDescTxt"></p>'+
            '<div id="pdpSpecH" style="display:none;"></div>'+
            '<div id="pdpSpecBody"></div>'+
            '<div id="pdpBuyBox">'+
              '<a id="pdpCta1" href="#contact" onclick="closePdp()"></a>'+
              '<a id="pdpCta2" href="#contact" onclick="closePdp()"></a>'+
              '<div id="pdpShipNote"></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div id="pdpDetailSec" style="display:none;"><div id="pdpDetailH"></div><div id="pdpDetailBody"></div></div>'+
      '</div>'+
    '</div>'+
    '<div id="pdpLightbox" onclick="this.classList.remove(\'on\')"><img id="pdpLbImg" src=""/></div>';

  document.body.appendChild(overlay);
  document.addEventListener('keydown',function(e){
    var lb=document.getElementById('pdpLightbox');
    if(e.key==='Escape'){lb.classList.remove('on');if(document.getElementById('pdpOverlay').style.display!=='none')closePdp();}
    if(lb.classList.contains('on')){
      if(e.key==='ArrowLeft')lbPrev(e);
      if(e.key==='ArrowRight')lbNext(e);
    }
  });
}

function bindCards(){
  document.querySelectorAll('.product-card').forEach(function(card,idx){
    var p=allProducts[idx];
    if(!p)return;
    card.style.cursor='pointer';
    card.addEventListener('click',function(){openPdp(p);});
  });
}

window.switchProduct=function(idx){if(allProducts[idx])openPdp(allProducts[idx]);};

window.openPdp=function(p){
  var lang=getLang();
  var trans=getTrans(p);
  var L={
    zh:{cat:'产品分类',feat:'核心优势',feats:[['🏭','自有工厂·全程可控'],['📦','最低起订300套'],['🌿','FSC认证·环保材质'],['✈️','支持出口·全球发货'],['⏱️','7天打样·快速交货']],ctaP:'需要专业建议？',ctaA:'免费咨询顾问',badge:'米彩包装',brand:'品牌：米彩包装（温州）有限公司',rating:'4.9 · 500+ 品牌客户好评',plabel:'定制报价起',pnote:'工厂直销 · 支持小批量定制',about:'关于本产品',specs:'可选规格',detail:'产品详情',ship:'24小时内顾问跟进 · 7天完成打样',cta1:'立即获取定制报价',cta2:'联系我们了解更多'},
    en:{cat:'Product Categories',feat:'Why MICAI',feats:[['🏭','Owned factory · Full control'],['📦','MOQ from 300 units'],['🌿','FSC certified materials'],['✈️','Global export shipping'],['⏱️','7-day sample · Fast delivery']],ctaP:'Need expert advice?',ctaA:'Free Consultation',badge:'MICAI Packaging',brand:'Brand: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ satisfied brand clients',plabel:'Custom Quote from',pnote:'Factory direct · Low MOQ available',about:'About this item',specs:'Available Options',detail:'Product Details',ship:'Consultant within 24h · 7-day sampling',cta1:'Request a Custom Quote',cta2:'Contact Us to Learn More'},
    de:{cat:'Produktkategorien',feat:'Warum MICAI',feats:[['🏭','Eigene Fabrik · Volle Kontrolle'],['📦','Mindestmenge ab 300 Stück'],['🌿','FSC-zertifizierte Materialien'],['✈️','Weltweiter Exportversand'],['⏱️','Muster in 7 Tagen']],ctaP:'Fachberatung gewünscht?',ctaA:'Kostenlose Beratung',badge:'MICAI Verpackung',brand:'Marke: MICAI Packaging (Wenzhou) GmbH',rating:'4.9 · 500+ zufriedene Markenkunden',plabel:'Angebot ab',pnote:'Werksverkauf · Kleine Mengen möglich',about:'Über dieses Produkt',specs:'Verfügbare Optionen',detail:'Produktdetails',ship:'Berater in 24h · Muster in 7 Tagen',cta1:'Angebot anfordern',cta2:'Kontaktieren Sie uns'},
    es:{cat:'Categorías',feat:'Por qué MICAI',feats:[['🏭','Fábrica propia · Control total'],['📦','MOQ desde 300 unidades'],['🌿','Materiales certificados FSC'],['✈️','Envío de exportación global'],['⏱️','Muestra 7 días · Entrega rápida']],ctaP:'¿Necesita asesoría?',ctaA:'Consulta gratuita',badge:'MICAI Packaging',brand:'Marca: MICAI Packaging (Wenzhou) Co., Ltd.',rating:'4.9 · 500+ clientes satisfechos',plabel:'Cotización desde',pnote:'Venta directa · MOQ bajo',about:'Sobre este producto',specs:'Opciones disponibles',detail:'Detalles del producto',ship:'Asesor en 24h · Muestra en 7 días',cta1:'Solicitar cotización',cta2:'Contáctenos'}
  }[lang]||{};

  // sidebar cats
  document.getElementById('pdpCatH').textContent=L.cat||'';
  var cats=CATS[lang]||CATS.zh;
  var currentIdx=allProducts.indexOf(p);
  var catsHtml='';
  cats.forEach(function(c,i){catsHtml+='<a class="pcat'+(i===currentIdx?' on':'')+'" onclick="switchProduct('+i+');return false;" href="#">'+c+'</a>';});
  document.getElementById('pdpCats').innerHTML=catsHtml;

  // sidebar feats
  document.getElementById('pdpFeatH').textContent=L.feat||'';
  var featsHtml='';
  (L.feats||[]).forEach(function(f){featsHtml+='<div class="pfeat"><i>'+f[0]+'</i><span>'+f[1]+'</span></div>';});
  document.getElementById('pdpFeats').innerHTML=featsHtml;
  document.getElementById('pdpSideCtaP').textContent=L.ctaP||'';
  document.getElementById('pdpSideCtaA').textContent=L.ctaA||'';

  // breadcrumb & badge & title
  document.getElementById('pdpBreadCrumb').textContent=trans.name||p.slug||'';
  document.getElementById('pdpBadge').textContent=L.badge||'';
  document.getElementById('pdpTitle').textContent=trans.name||p.slug||'';
  document.getElementById('pdpBrandLine').textContent=L.brand||'';
  document.getElementById('pdpRtxt').textContent=L.rating||'';

  // price
  var pb=document.getElementById('pdpPriceBox');
  if(p.price){
    pb.style.display='block';
    document.getElementById('pdpPlabel').textContent=L.plabel||'';
    document.getElementById('pdpPrice').textContent='¥'+p.price;
    document.getElementById('pdpPnote').textContent=L.pnote||'';
    var oe=document.getElementById('pdpOrig'),de2=document.getElementById('pdpDisc');
    if(p.originalPrice&&parseFloat(p.originalPrice)>parseFloat(p.price)){
      oe.textContent='¥'+p.originalPrice;oe.style.display='inline';
      de2.textContent='(-'+Math.round((1-parseFloat(p.price)/parseFloat(p.originalPrice))*100)+'%)';de2.style.display='inline';
    }else{oe.style.display='none';de2.style.display='none';}
  }else{pb.style.display='none';}

  // about & bullets
  document.getElementById('pdpAboutH').textContent=L.about||'';
  var ul=document.getElementById('pdpBullets');ul.innerHTML='';
  (trans.bulletPoints||[]).filter(Boolean).forEach(function(bp){var li=document.createElement('li');li.textContent=bp;ul.appendChild(li);});
  document.getElementById('pdpDescTxt').textContent=trans.description||'';

  // specs / variants
  var sh=document.getElementById('pdpSpecH'),sb=document.getElementById('pdpSpecBody');
  var vv=p.variants?p.variants.filter(function(v){return v.visible!==false;}):[];
  if(vv.length){
    sh.style.display='block';sh.textContent=L.specs||'';
    var h='';vv.forEach(function(v){h+='<div class="psrow"><span class="pk">'+v.label+'</span><span class="pv">'+(v.price?'¥'+v.price:'')+(v.sku?' · '+v.sku:'')+'</span></div>';});
    sb.innerHTML=h;
  }else{sh.style.display='none';sb.innerHTML='';}

  // buy box
  document.getElementById('pdpCta1').textContent=L.cta1||'';
  document.getElementById('pdpCta2').textContent=L.cta2||'';
  document.getElementById('pdpShipNote').textContent=L.ship||'';

  // detail
  var ds=document.getElementById('pdpDetailSec');
  if(trans.detail){
    ds.style.display='block';
    document.getElementById('pdpDetailH').textContent=L.detail||'';
    document.getElementById('pdpDetailBody').innerHTML=trans.detail;
  }else{ds.style.display='none';}

  // images
  var imgs=(p.images&&p.images.filter(Boolean).length)?p.images.filter(Boolean):(p.imageUrl?[p.imageUrl]:[]);
  window._lbImgs=imgs;
  var imgEl=document.getElementById('pdpImg'),emojiEl=document.getElementById('pdpEmoji');
  var th=document.getElementById('pdpThumbs');th.innerHTML='';
  if(imgs.length){
    imgEl.src=imgs[0];imgEl.style.display='block';emojiEl.style.display='none';
    imgs.forEach(function(url,i){
      var d=document.createElement('div');d.className='pthumb'+(i===0?' on':'');
      d.innerHTML='<img src="'+url+'" />';
      d.addEventListener('click',function(){
        imgEl.src=url;
        th.querySelectorAll('.pthumb').forEach(function(t){t.classList.remove('on');});
        d.classList.add('on');
      });
      th.appendChild(d);
    });
  }else{
    imgEl.style.display='none';emojiEl.style.display='flex';emojiEl.textContent=p.icon||'📦';
  }

  var ov=document.getElementById('pdpOverlay');
  ov.style.display='block';
  document.body.style.overflow='hidden';
  ov.scrollTop=0;
};

window.closePdp=function(){
  var ov=document.getElementById('pdpOverlay');
  if(ov)ov.style.display='none';
  document.body.style.overflow='';
};
window.closeModal=window.closePdp;
window._lbImgs=[];
window._lbIdx=0;
window.openLightbox=function(src){
  if(!src||src===window.location.href)return;
  var imgs=window._lbImgs;
  var idx=imgs.indexOf(src);
  window._lbIdx=idx>=0?idx:0;
  document.getElementById('pdpLbImg').src=imgs[window._lbIdx]||src;
  document.getElementById('pdpLightbox').classList.add('on');
};
window.lbPrev=function(e){e.stopPropagation();var imgs=window._lbImgs;if(!imgs.length)return;window._lbIdx=(window._lbIdx-1+imgs.length)%imgs.length;document.getElementById('pdpLbImg').src=imgs[window._lbIdx];};
window.lbNext=function(e){e.stopPropagation();var imgs=window._lbImgs;if(!imgs.length)return;window._lbIdx=(window._lbIdx+1)%imgs.length;document.getElementById('pdpLbImg').src=imgs[window._lbIdx];};

loadProducts();
})();

/* High End Communities, shared engine part 2 of 5: Flyers and catalogue export (image, PDF). Load order matters: core, export, data, business, ui. */
/* ===================== Flyers & catalogue export ===================== */
let lastL = null, shownItems = [];
const MAIN_LOGO = "/assets/logo-main.png";
const LOGO_SRC = () => MAIN_LOGO;
const BRAND_LOGOS = {
  moto:"/assets/brand-moto.jpg",
  car:"/assets/brand-car.jpg",
  watch:"/assets/brand-watch.jpg",
  boat:"/assets/brand-boat.jpg",
  equine:"/assets/brand-equine.jpg"
};
function logoFor(type){ return BRAND_ART; }  /* one brand everywhere: the engraved crest */
function isPhoto(p){ return typeof p==="string" && (p.startsWith("data:image/") || /^https:\/\//.test(p)); }
async function loadPhotoImgs(list, n){ const out=await Promise.all((list||[]).filter(isPhoto).slice(0,n||99).map(p=>loadSrc(p).catch(()=>null))); return out.filter(Boolean); }

const imgCache = {};
function loadSrc(src){
  if (!imgCache[src]) imgCache[src] = new Promise((res,rej)=>{ const i=new Image(); if (/^https?:/.test(src)) i.crossOrigin="anonymous"; i.onload=()=>res(i); i.onerror=rej; i.src=src; });
  return imgCache[src];
}
function pdfSafe(s){ return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[–—]/g,"-").replace(/[^\x20-\x7E\xA0-\xFF]/g,"").trim(); }
let aliasN = 0; const aliasMap = new Map();
function aliasOf(src){ if(!aliasMap.has(src)) aliasMap.set(src,"im"+(aliasN++)); return aliasMap.get(src); }

function pdfPainter(doc){
  const setF = o => { doc.setFont(o.serif?"times":"helvetica", o.bold?"bold":"normal"); doc.setFontSize(o.size); };
  return {
    rect(x,y,w,h,c,r){ doc.setFillColor(c); if(r) doc.roundedRect(x,y,w,h,r,r,"F"); else doc.rect(x,y,w,h,"F"); },
    img(im,x,y,w,h){ const fmt = (im.src.startsWith("data:image/png")||/\.png(\?|$)/i.test(im.src))?"PNG":"JPEG"; doc.addImage(im.src.startsWith("data:")?im.src:im,fmt,x,y,w,h,aliasOf(im.src),fmt==="PNG"?"FAST":"NONE"); },
    text(s,x,y,o){ setF(o); doc.setTextColor(o.color||"#2b2b2b"); doc.text(pdfSafe(s),x,y,{align:o.align||"left"}); },
    width(s,o){ setF(o); return doc.getTextWidth(pdfSafe(s)); },
    link(x,y,w,h,url){ doc.link(x,y,w,h,{url}); }
  };
}
function canvasPainter(ctx,k){
  const font = o => `${o.bold?700:400} ${o.size*0.3528*k}px ${o.serif?'"Roboto Slab",Georgia,serif':'Inter,Arial,sans-serif'}`;
  return {
    rect(x,y,w,h,c,r){ ctx.fillStyle=c; ctx.beginPath(); if(r&&ctx.roundRect) ctx.roundRect(x*k,y*k,w*k,h*k,r*k); else ctx.rect(x*k,y*k,w*k,h*k); ctx.fill(); },
    img(im,x,y,w,h){ ctx.drawImage(im,x*k,y*k,w*k,h*k); },
    text(s,x,y,o){ ctx.font=font(o); ctx.fillStyle=o.color||"#2b2b2b"; ctx.textAlign=o.align||"left"; ctx.textBaseline="alphabetic"; ctx.fillText(String(s),x*k,y*k); },
    width(s,o){ ctx.font=font(o); return ctx.measureText(String(s)).width/k; },
    link(){}
  };
}
function wrapText(P,s,o,maxW,maxLines){
  const words = String(s).split(/\s+/).filter(Boolean); const lines=[]; let cur="";
  for (const w of words){ const t = cur?cur+" "+w:w; if (P.width(t,o)<=maxW || !cur) cur=t; else { lines.push(cur); cur=w; } }
  if (cur) lines.push(cur);
  if (lines.length>maxLines){ lines.length=maxLines; let l=lines[maxLines-1]; while(l && P.width(l+"...",o)>maxW) l=l.slice(0,-1); lines[maxLines-1]=l+"..."; }
  return lines;
}
function clip(P,s,o,maxW){ return wrapText(P,s,o,maxW,1)[0]||""; }
const PAPER = "#f7f3e8";   // flyer background = the crest logo's cream
function checker(P,x,y,w,sq){ const n=Math.ceil(w/sq); P.rect(x,y,w,sq*2,PAPER); for(let r=0;r<2;r++) for(let i=0;i<n;i++) if((i+r)%2===0) P.rect(x+i*sq,y+r*sq,Math.min(sq,x+w-(x+i*sq)),sq,"#2b2b2b"); }
const _fillCache = new Map();
let FILL_PXMM = 5.2;   // photo pixels per mm in flyers (raised for the HD flyer)
async function filledPhoto(im, w, h){
  // w, h in mm → small canvas (about 5 px/mm) so files stay light
  const key = im.src.length + ":" + im.src.slice(-60) + ":" + Math.round(w*10) + "x" + Math.round(h*10) + "@" + FILL_PXMM;
  if (_fillCache.has(key)) return _fillCache.get(key);
  const k = FILL_PXMM, cw = Math.max(40, Math.round(w*k)), ch = Math.max(30, Math.round(h*k));
  const c = document.createElement("canvas"); c.width=cw; c.height=ch; const ctx = c.getContext("2d");
  // background: the photo scaled to cover, blurred by shrinking it to a few pixels and stretching back
  const sc = Math.max(cw/im.naturalWidth, ch/im.naturalHeight);
  const t = document.createElement("canvas"); t.width=24; t.height=Math.max(8, Math.round(24*ch/cw));
  const tctx = t.getContext("2d"); tctx.imageSmoothingEnabled = true;
  const bw = im.naturalWidth*sc, bh = im.naturalHeight*sc;
  tctx.drawImage(im, (cw-bw)/2*t.width/cw, (ch-bh)/2*t.height/ch, bw*t.width/cw, bh*t.height/ch);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  ctx.drawImage(t, 0, 0, cw, ch);
  ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(0,0,cw,ch);
  // the whole photo on top
  const r = Math.min(cw/im.naturalWidth, ch/im.naturalHeight), iw = im.naturalWidth*r, ih = im.naturalHeight*r;
  ctx.drawImage(im, (cw-iw)/2, (ch-ih)/2, iw, ih);
  const out = await loadSrc(c.toDataURL("image/jpeg", FILL_PXMM>6 ? 0.88 : 0.72));
  _fillCache.set(key, out);
  return out;
}
async function fitImg(P,im,x,y,w,h){
  if (P.dry) return;
  let f = im;
  try{ f = await filledPhoto(im, w, h); }catch(e){}
  if (f === im){ P.rect(x,y,w,h,"#efece5"); const r=Math.min(w/im.naturalWidth,h/im.naturalHeight), iw=im.naturalWidth*r, ih=im.naturalHeight*r; P.img(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih); return; }
  P.img(f, x, y, w, h);
}
function masarStrip(P,img,x,y,w,h,sp){
  if (!sp || !img) return;   // no sponsor for this category: leave the strip out
  P.rect(x,y,w,h,"#1d2733",2);
  const s=h-4; P.rect(x+2,y+2,s,s,"#ffffff",1.5);
  const r=Math.min((s-0.6)/img.naturalWidth,(s-0.6)/img.naturalHeight), iw=img.naturalWidth*r, ih=img.naturalHeight*r;
  P.img(img,x+2+(s-iw)/2,y+2+(s-ih)/2,iw,ih);
  P.text("SPONSORED",x+s+5,y+h*0.32,{size:5.5,bold:1,color:"#f07a1a"});
  P.text(clip(P,sp.name,{size:11,bold:1,serif:1},w-s-10),x+s+5,y+h*0.62,{size:11,bold:1,serif:1,color:"#f07a1a"});
  if (sp.tagline) P.text(clip(P,sp.tagline,{size:6.5},w-s-10),x+s+5,y+h*0.86,{size:6.5,color:"#d6dbe2"});
  if (sp.link && /^https:\/\//.test(sp.link)) P.link(x,y,w,h,sp.link);
}

function drawQR(P, text, x, y, size){
  if (typeof window.qrcode !== "function") return false;
  try{
    const qr = window.qrcode(0, "M"); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), q = 2, cell = size/(n+2*q);
    P.rect(x, y, size, size, "#ffffff", 1);
    for (let r=0;r<n;r++){ let c=0; while(c<n){ if (qr.isDark(r,c)){ let e=c; while(e+1<n && qr.isDark(r,e+1)) e++; P.rect(x+(c+q)*cell, y+(r+q)*cell, (e-c+1)*cell+0.01, cell+0.01, "#111111"); c=e+1; } else c++; } }
    P.link(x, y, size, size, text);
    return true;
  }catch(e){ return false; }
}
const FW = 150, FH = 228; // flyer size in mm (portrait, phone friendly)
async function drawFlyer(P, L, id){
  const SP = flyerSponsor({market:marketOf(L), group:GROUP[L.type]||""}); const logo = await loadSrc(logoFor(L.type)), masar = SP ? await loadSrc(SP.image) : null;
  const ph = await loadPhotoImgs(L.photos, MAX_PHOTOS);
  const M = 8, W = FW-2*M;
  P.rect(0,0,FW,FH,PAPER);
  checker(P,0,0,FW,2);
  const lr = Math.min(34/logo.naturalWidth, 20/logo.naturalHeight);   // small branding: the product leads
  const lw = logo.naturalWidth*lr, lh = logo.naturalHeight*lr; P.img(logo,(FW-lw)/2,6,lw,lh);
  if (drawQR(P, hdLink(id), FW-8-21, 6, 21)) P.text("Scan for the original HD ad", FW-8-10.5, 6+21+3, {size:4.6, color:"#77736b", align:"center"});
  let y = 6+Math.max(lh,24)+3;
  // the photo takes whatever room the text leaves (title on 1 line / no add-ons → a taller photo)
  const _pw = P.width(priceStr(L.f),{size:19,bold:1,serif:1});
  const _tl = wrapText(P,titleOf(L),{size:15,bold:1,serif:1},W-_pw-6,2).length;
  const _al = L.f.addons ? wrapText(P,L.f.addons,{size:8.5},W-16,2).length : 0;
  const photoH = Math.min(106, 90 + (2-_tl)*6 + (L.f.addons ? (2-_al)*4.4 : 8));
  if (ph.length){ await fitImg(P,ph[0],M,y,W,photoH); y+=photoH; }
  if (ph.length>1){ const tw=(W-2*3)/3, th=16; y+=2; let i=0; for (const im of ph.slice(1,4)){ await fitImg(P,im,M+i*(tw+3),y,tw,th); i++; } y+=th; }
  y += 6;
  const badge = (LABELS[L.type] + (L.f.category?" - "+L.f.category:"")).toUpperCase();
  P.text(badge,M,y,{size:7,bold:1,color:"#77736b"}); y+=6.5;
  const priceTxt = priceStr(L.f), po={size:19,bold:1,serif:1};
  const pw = P.width(priceTxt,po);
  const tl = wrapText(P,titleOf(L),{size:15,bold:1,serif:1},W-pw-6,2);
  P.text(priceTxt,FW-M,y,{...po,align:"right"});
  tl.forEach((l,i)=>P.text(l,M,y+i*6,{size:15,bold:1,serif:1})); y += (tl.length-1)*6 + 4;
  P.rect(M,y,W,0.3,"#dedad2"); y+=5;
  const SKIP = ["Add-ons","Options & extras","Item type","Accessory type","Type","Part type","Property type"];
  const det = rows(L).filter(([k])=>!SKIP.includes(k));
  const cw = W/2;
  det.slice(0,4).forEach(([k,v],i)=>{
    const cx = M + (i%2)*cw, cy = y + Math.floor(i/2)*5.2;
    P.text(k+":",cx,cy,{size:8,color:"#77736b"});
    const kw = P.width(k+": ",{size:8});
    P.text(clip(P,v,{size:8.5,bold:1},cw-kw-3),cx+kw,cy,{size:8.5,bold:1});
  });
  y += Math.ceil(Math.min(det.length,4)/2)*5.2;
  if (L.f.addons){ y+=1; P.text(L.type==="car"?"Options:":"Add-ons:",M,y,{size:8,color:"#77736b"}); const al=wrapText(P,L.f.addons,{size:8.5},W-16,2); al.forEach((l,i)=>P.text(l,M+14,y+i*4.4,{size:8.5})); y+=al.length*4.4; }
  // contact bar + sponsor anchored to the bottom
  const by = FH-37;
  P.rect(M,by,W,11,"#2b2b2b",2);
  P.text(contactBarText(L),FW/2,by+7.3,{size:12,bold:1,color:"#ffffff",align:"center"});
  P.link(M,by,W,11,contactBarLink(L,id));
  P.text("More listings: "+baseUrl().replace(/^https?:\/\//,""),FW/2,by+15.3,{size:7.5,bold:1,color:"#2b2b2b",align:"center"});
  P.link(M,by+12,W,4.5,linkFor(id));
  wrapText(P,DISCLAIMER,{size:5.6},W,2).forEach((l,i)=>P.text(l,FW/2,by+18.5+i*2.6,{size:5.6,color:"#9a958c",align:"center"}));
  masarStrip(P,masar,M,FH-14,W,11,SP);
  checker(P,0,FH-2,FW,1);
}
function fileBase(L){ return pdfSafe(titleOf(L)).replace(/[^A-Za-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,50) || "listing"; }


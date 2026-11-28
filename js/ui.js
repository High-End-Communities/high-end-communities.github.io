/* High End Communities, shared engine part 5 of 5: Shared page pieces, pickers, HD flyer, photo viewer, intro, ratings, menu, terms. Load order matters: core, export, data, business, ui. */
/* ===================== Shared page pieces ===================== */
const BRAND_ART = "brand.jpg";   // the engraved community crest (motorcycle story, all categories around it)
function initHeader(){
  const m=$("#mainLogo"); if (m){ m.onerror=()=>{ m.onerror=null; m.src=MAIN_LOGO; }; m.src = BRAND_ART; m.classList.add("crest"); }
  const b=$("#brands"); if (b){ b.innerHTML=""; [["moto","Motorcycles"],["car","Cars"],["watch","Watches"],["boat","Marine Market"],["equine","Equine Haven"]].forEach(([k,n])=>{ const i=document.createElement("img"); i.src=BRAND_LOGOS[k]; i.alt="High End "+n; b.appendChild(i); }); }
  document.querySelectorAll("img[data-brand]").forEach(i=>{ i.src = BRAND_LOGOS[i.dataset.brand] || BRAND_ART; });   // no logo of its own: the crest
}
function fmtDate(t){ return new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); }
// Builds a listing card. Photos load in full only when the viewer asks for them.
function buildCard(item, mode){
  const {id, L} = item;
  const sold = L.status==="sold";
  const card=document.createElement("article"); card.className="item"+(sold?" sold":""); card.dataset.lid=id;
  if (mode!=="admin" && safeId(id)) card.id="l-"+id;
  if (sold || L.status==="pending" || L.status==="rejected"){
    const r=document.createElement("div"); r.className="ribbon"+(L.status==="pending"?" pend":"");
    r.textContent = sold?"SOLD":L.status==="pending"?"PENDING":"REJECTED"; card.appendChild(r);
  }
  const gw=document.createElement("div"); gw.className="gwrap";
  const gal=document.createElement("div"); gal.className="gallery";
  const first = L.thumb || (L.photos||[])[0];
  if (first){ const im=document.createElement("img"); im.src=first; im.alt="listing photo"; im.loading="lazy"; gal.appendChild(im); }
  gw.appendChild(gal);
  const np = Number(L.f._np)||0;
  if (np>0){
    const mb=document.createElement("button"); mb.type="button"; mb.className="morephotos"; mb.textContent = np>1?np+" photos":"1 photo";
    mb.onclick=(e)=>{ e.stopPropagation(); openViewer(item, 0, mb); };
    gw.appendChild(mb);
  }
  // tap the photo → full screen viewer with all photos
  if (first){ gal.classList.add("tappable"); gal.onclick=()=>openViewer(item, 0);
    const z=document.createElement("span"); z.className="zoomhint"; z.textContent="⤢"; z.setAttribute("aria-hidden","true"); gw.appendChild(z); }
  card.appendChild(gw);
  const body=document.createElement("div"); body.className="body";
  const badge=document.createElement("div"); badge.className="badge";
  badge.textContent = LABELS[L.type] + (L.f.category?" · "+L.f.category:"") + (L.f.condition?" · "+L.f.condition:"") + (mode==="admin" && marketOf(L)!=="EG" ? " · "+marketName(marketOf(L)) : "");
  const h=document.createElement("h3"); h.textContent=titleOf(L);
  const pr=document.createElement("div"); pr.className="price"; if (sold) pr.textContent="Sold"; else { const ps=priceStr(L.f), m=ps.match(/^(.*?)\s*([A-Z]{3})$/); if (m){ pr.textContent=m[1]+" "; const u=document.createElement("small"); u.textContent=m[2]; pr.appendChild(u); } else pr.textContent=ps; }
  const tags=document.createElement("div"); tags.className="tags";
  if (!sold && isFeatured(L)){ card.classList.add("featured"); const t=document.createElement("span"); t.className="tag feat"; t.textContent="Featured"; tags.appendChild(t); }
  if (!sold && L.discount){ const t=document.createElement("span"); t.className="tag disc"; t.textContent=`${L.discount}% off with code`; tags.appendChild(t); }
  if (!sold && L.stock!==null && L.stock!==undefined){ const t=document.createElement("span"); t.className="tag stock"+(L.stock<=2?" low":""); t.textContent = L.stock>0 ? `${L.stock} in stock` : "Out of stock"; tags.appendChild(t); }
  const dl=document.createElement("dl");
  for (const [k,v] of rows(L)){ const dt=document.createElement("dt"); dt.textContent=k; const dd=document.createElement("dd"); dd.textContent=v; dl.append(dt,dd); }
  const c=document.createElement("div"); c.className="contact";
  const phone=phoneOf(L).replace(/[^\d]/g,"");
  if (!sold){
    const hello=`Hello, I'm interested in "${titleOf(L)}" listed on ${MARKET_NAME}.`;
    const wa=document.createElement("a"); wa.className="wa"; wa.target="_blank"; wa.rel="noopener"; wa.textContent="WhatsApp";
    const tel=document.createElement("a"); tel.className="tel";
    if (phone){ wa.href="https://wa.me/"+waNum(phone)+"?text="+encodeURIComponent(hello); tel.href="tel:"+phone; tel.textContent=phone; tel.setAttribute("aria-label","Call "+phone); }
    else { hiddenContact(wa,"listing",id,p=>"https://wa.me/"+waNum(p)+"?text="+encodeURIComponent(hello)); hiddenContact(tel,"listing",id,p=>"tel:+"+waNum(p)); tel.textContent="Call"; tel.setAttribute("aria-label","Call the seller"); }
    c.append(wa,tel);
    if (mode!=="pending"){
      const sh=document.createElement("a"); sh.href=waHref(shareText(L,id)); sh.target="_blank"; sh.rel="noopener"; sh.textContent="↗ Share";
      const bI=document.createElement("button"); bI.type="button"; bI.textContent="Image"; bI.onclick=()=>exportImage(L,id);
      const bP=document.createElement("button"); bP.type="button"; bP.textContent="PDF"; bP.onclick=()=>exportPdf(L,id);
      const bH=document.createElement("button"); bH.type="button"; bH.textContent="HD image"; bH.onclick=()=>exportHD(L,id,false);
      const bHP=document.createElement("button"); bHP.type="button"; bHP.textContent="HD PDF"; bHP.onclick=()=>exportHD(L,id,true);
      c.append(sh,bI,bP,bH,bHP);
    }
  }
  if (mode==="public"){
    // tidy card: 3 key facts on one line, full details + extra tools folded away
    const r = rows(L), spec=document.createElement("div"); spec.className="spec";
    const tl=titleOf(L).toLowerCase();
    spec.textContent = r.filter(x=>!tl.includes(String(x[1]).toLowerCase())).slice(0,3).map(x=>x[1]).join("  ·  ");
    // full details, photos and tools open on the listing's own page
    const det=document.createElement("a"); det.className="more moredetails"; det.href=itemHref(id);
    det.innerHTML='<span>More details</span><i class="chev" aria-hidden="true"></i>';
    [...c.querySelectorAll("a:not(.wa):not([href^='tel:']),button")].forEach(e=>e.remove());
    const ha=document.createElement("a"); ha.href=itemHref(id); ha.className="tlink"; ha.textContent=h.textContent; h.textContent=""; h.appendChild(ha);
    body.append(badge,h,pr); if (tags.childNodes.length) body.appendChild(tags);
    if (L.type==="watch"){
      const ws=watchSpecs(L).slice(0,4);
      if (ws.length){ const g=document.createElement("div"); g.className="wspec";
        ws.forEach(([k,v])=>{ const c=document.createElement("div"); const a=document.createElement("span"); a.textContent=k; const b=document.createElement("b"); b.textContent=v; c.append(a,b); g.appendChild(c); });
        body.appendChild(g); }
      if (!FX_DAY) {}
      else if (L.f.price_unit!=="USD" && priceEGP(L.f)) { const u=document.createElement("div"); u.className="usd"; u.textContent="≈ $"+fmt(Math.round(priceEGP(L.f)/USD_TO_EGP))+fxNote(); pr.after(u); }
      else if (L.f.price_unit==="USD") { const u=document.createElement("div"); u.className="usd"; u.textContent="≈ "+fmt(Math.round(priceEGP(L.f)))+" EGP"+fxNote(); pr.after(u); }
    } else if (spec.textContent) body.appendChild(spec);
    body.appendChild(det);
    body.appendChild(c);
    if (!sold){ const se=checkSlotEl(L); if (se) body.appendChild(se); }
    if (!sold && INSPECT_TYPES.includes(L.type)){ const ib=document.createElement("button"); ib.type="button"; ib.className="inspect"; ib.textContent=inspectLabel(L); ib.onclick=()=>openInspect(item); body.appendChild(ib); }
    card.appendChild(body);
    const meta=document.createElement("div"); meta.className="muted meta";
    meta.textContent = (L.at?fmtDate(L.at):"") + (sold&&L.soldAt?" · Sold "+fmtDate(L.soldAt):"");
    const v=document.createElement("span"); v.className="views"; v.textContent="  ·  "+fmtViews(L.views)+(Number(L.views)===1?" view":" views"); meta.appendChild(v);
    return {card, body, meta, more:det};
  }
  body.append(badge,h,pr); if (tags.childNodes.length) body.appendChild(tags); body.append(dl,c);
  if (!sold){ const se=checkSlotEl(L); if (se) body.appendChild(se); }
  const meta=document.createElement("div"); meta.className="muted";
  meta.textContent = (L.at?"Posted "+fmtDate(L.at):"") + (sold&&L.soldAt?" · Sold "+fmtDate(L.soldAt):"");
  if (L.status!=="pending"){ const v=document.createElement("span"); v.className="views"; v.textContent="  ·  "+fmtViews(L.views)+(Number(L.views)===1?" view":" views"); meta.appendChild(v); }
  card.appendChild(body);
  return {card, body, meta};
}

async function ensureFonts(){ try{ await Promise.all([document.fonts.load('700 20px "Roboto Slab"'),document.fonts.load('400 20px Inter'),document.fonts.load('700 20px Inter')]); }catch(e){} }

async function exportImage(L,id){
  await ensureFonts(); if (!L.photos || !L.photos.length) L.photos = await loadPhotos({id,L});
  const k = 1080/FW; const c=document.createElement("canvas"); c.width=1080; c.height=Math.round(FH*k);
  const ctx=c.getContext("2d"); FLYER_IMAGE=true; try{ await drawFlyer(canvasPainter(ctx,k),L,id); } finally{ FLYER_IMAGE=false; }
  const blob = await new Promise(r=>c.toBlob(r,"image/jpeg",0.82));
  await saveFile(fileBase(L)+".jpg", blob, c.toDataURL("image/jpeg",0.82));
}
async function exportPdf(L,id){
  if (!window.jspdf){ toast("PDF tool didn't load - check your connection."); return; }
  if (!L.photos || !L.photos.length) L.photos = await loadPhotos({id,L});
  const doc = new jspdf.jsPDF({unit:"mm",format:[FW,FH],compress:true});
  aliasMap.clear();
  await drawFlyer(pdfPainter(doc),L,id);
  doc.setProperties({title:pdfSafe(titleOf(L))+" - "+MARKET_NAME});
  await saveFile(fileBase(L)+".pdf", doc.output("blob"));
}
async function exportCatalogue(){
  if (!window.jspdf){ toast("PDF tool didn't load - check your connection."); return; }
  const items = shownItems.filter(x=>x.L&&x.L.f&&SCHEMAS[x.L.type]);
  if (!items.length) return;
  const doc = new jspdf.jsPDF({unit:"mm",format:"a4",compress:true}); aliasMap.clear();
  const P = pdfPainter(doc), PW=210, PH=297, M=10, G=6, CW=(PW-2*M-G)/2, CH=70;
  const logo = await loadSrc(LOGO_SRC()), CSP = flyerSponsor(), masar = CSP ? await loadSrc(CSP.image) : null;
  let y, col=0, page=0;
  const footer = ()=>{ P.text(DISCLAIMER,PW/2,PH-19,{size:6,color:"#77736b",align:"center"}); masarStrip(P,masar,M,PH-17,PW-2*M,11,CSP); P.text("Page "+(page),PW-M,PH-3,{size:6,color:"#77736b",align:"right"}); P.text(baseUrl().replace(/^https?:\/\//,""),M,PH-3,{size:6,color:"#77736b"}); P.link(M,PH-6,80,4,baseUrl()); checker(P,0,PH-1.5,PW,0.75); };
  const newPage = ()=>{
    if (page>0){ footer(); doc.addPage(); }
    page++; checker(P,0,0,PW,1.5);
    if (page===1){
      const lw=46, lh=lw*logo.naturalHeight/logo.naturalWidth; P.img(logo,(PW-lw)/2,7,lw,lh);
      y = 7+lh+5;
      P.text(CAT_TITLE ? pdfSafe(CAT_TITLE).toUpperCase()+" CATALOGUE" : "CATALOGUE",PW/2,y,{size:13,bold:1,serif:1,align:"center"});
      const site = baseUrl().replace(/^https?:\/\//,"");
      P.text("Live catalogue: "+site,PW/2,y+5.5,{size:9,bold:1,color:"#2b2b2b",align:"center"});
      P.link(PW/2-45,y+1.5,90,5.5,baseUrl()+"/");
      P.text(items.length+(items.length===1?" listing - ":" listings - ")+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),PW/2,y+9.5,{size:7,color:"#77736b",align:"center"});
      if (drawQR(P, baseUrl()+"/", PW-M-26, 7, 26)) P.text("Scan to open the site", PW-M-13, 7+26+3, {size:5.5, color:"#77736b", align:"center"});
      y += 10;
    } else y = 8;
  };
  newPage();
  const sections = bySection(items), many = sections.length>1;
  const flat = [];
  for (const [t,xs] of sections) xs.forEach((it,i)=>flat.push({...it, head: many && i===0 ? [t, xs.length] : null}));
  for (const {id,L,head} of flat){
    if (head){
      if (col===1){ col=0; y+=CH; }
      if (y+9+CH > PH-20) newPage();
      const [t,n]=head, ic=GROUP[t];
      P.text(pdfSafe(SECTION_NAMES[t]||LABELS[t]).toUpperCase(),M,y+5,{size:11,bold:1,serif:1});
      P.text(n+(n===1?" listing":" listings"),PW-M,y+5,{size:7.5,color:"#77736b",align:"right"});
      P.rect(M,y+7,PW-2*M,0.4,"#2b2b2b");
      y+=10;
    }
    if (col===0 && y+CH > PH-20) newPage();
    const x = M + col*(CW+G);
    P.rect(x,y,CW,CH-4,"#f6f5f2",2);
    const ph = L.thumb || (L.photos||[]).find(isPhoto);
    let phi=null; if (ph) try{ phi=await loadSrc(ph); }catch(e){}
    if (phi) await fitImg(P,phi,x,y,CW,42); else P.rect(x,y,CW,42,"#dedad2");
    let ty = y+46.5;
    P.text((LABELS[L.type]+(L.f.category?" - "+L.f.category:"")).toUpperCase(),x+3,ty,{size:6.5,bold:1,color:"#77736b"});
    ty+=5.5;
    const pt=priceStr(L.f), pw=P.width(pt,{size:12,bold:1,serif:1});
    P.text(clip(P,titleOf(L),{size:11,bold:1,serif:1},CW-pw-9),x+3,ty,{size:11,bold:1,serif:1});
    P.text(pt,x+CW-3,ty,{size:12,bold:1,serif:1,align:"right"});
    ty+=5;
    const facts = rows(L).filter(([k])=>!["Brand","Builder / brand","Item type","Accessory type","Type","Part type","Add-ons","Options & extras"].includes(k)).map(([k,v])=>v).join("  |  ");
    P.text(clip(P,facts,{size:7.5},CW-6),x+3,ty,{size:7.5,color:"#4a463f"});
    ty+=6.5;
    P.rect(x+3,ty-4.2,CW-6,6,"#2b2b2b",1.5);
    P.text(phoneOf(L)?"Call / WhatsApp  "+phoneOf(L):"Contact via the listing page",x+CW/2,ty,{size:8.5,bold:1,color:"#ffffff",align:"center"});
    P.link(x+3,ty-4.2,CW-6,6,contactBarLink(L,id));
    P.link(x,y,CW,42,linkFor(id));
    col++; if (col===2){ col=0; y+=CH; }
  }
  footer();
  doc.setProperties({title:MARKET_NAME+" - Catalogue"});
  const slug = CAT_TITLE ? "-"+pdfSafe(CAT_TITLE).replace(/[^A-Za-z0-9]+/g,"-").replace(/^-|-$/g,"") : "";
  await saveFile("High-End"+slug+"-Catalogue.pdf", doc.output("blob"));
}

/* ===================== Motorcycle brand & model pickers ===================== */
// A real dropdown (works on iPhone) above the text box. "Other" lets the seller type anything.
function setupBikePickers(DB){ DB = DB || DB;
  const br=$("#f_brand"), md=$("#f_model"); if (!br || !md) return;
  const OTHER="__other";
  const mk=(id,first)=>{ const s=document.createElement("select"); s.id=id; s.className="picker"; const o=document.createElement("option"); o.value=""; o.textContent=first; s.appendChild(o); return s; };
  const sb=mk("p_brand","Choose the brand…"), sm=mk("p_model","Choose the model…");
  Object.keys(DB).sort((a,b)=>a.localeCompare(b)).forEach(b=>{ const o=document.createElement("option"); o.value=b; o.textContent=b; sb.appendChild(o); });
  const ob=document.createElement("option"); ob.value=OTHER; ob.textContent="Other brand (type it)"; sb.appendChild(ob);
  (br.closest(".unitrow")||br).before(sb); (md.closest(".unitrow")||md).before(sm);
  const wb=sb.parentElement, wm=sm.parentElement;
  if (wb && wm && wb!==wm && (wm.compareDocumentPosition(wb) & Node.DOCUMENT_POSITION_FOLLOWING)) wm.before(wb);
  const keyOf=v=>Object.keys(DB).find(b=>b.toLowerCase()===String(v||"").trim().toLowerCase());
  const fillModels=()=>{
    const key=keyOf(br.value); sm.innerHTML=""; const f=document.createElement("option"); f.value=""; f.textContent= key ? `Choose the ${key} model…` : "Choose the brand first"; sm.appendChild(f);
    (key?DB[key]:[]).forEach(m=>{ const o=document.createElement("option"); o.value=m; o.textContent=m; sm.appendChild(o); });
    const om=document.createElement("option"); om.value=OTHER; om.textContent="Other model (type it)"; sm.appendChild(om);
    sm.disabled = !key && !br.value;
  };
  const show=(input, on)=>{ input.hidden=!on; (input.closest(".unitrow")||input).hidden=!on; };
  window.syncBikePickers = ()=>{
    const key=keyOf(br.value);
    sb.value = key || (br.value ? OTHER : ""); if (key) br.value=key;
    show(br, sb.value===OTHER);
    fillModels();
    const m=(DB[key]||[]).find(x=>x.toLowerCase()===String(md.value).trim().toLowerCase());
    sm.value = m || (md.value ? OTHER : ""); if (m) md.value=m;
    show(md, sm.value===OTHER || (!key && !!br.value));
  };
  sb.addEventListener("change", ()=>{
    if (sb.value===OTHER){ br.value=""; show(br,true); br.focus(); }
    else { br.value=sb.value; show(br,false); }
    md.value=""; fillModels(); sm.value=""; show(md, sb.value===OTHER);
    br.dispatchEvent(new Event("input",{bubbles:true}));
  });
  sm.addEventListener("change", ()=>{
    if (sm.value===OTHER){ md.value=""; show(md,true); md.focus(); }
    else { md.value=sm.value; show(md,false); }
    md.dispatchEvent(new Event("input",{bubbles:true}));
  });
  br.addEventListener("input", ()=>{ if (sb.value===OTHER) fillModels(); });
  syncBikePickers();
}

/* ===================== Watches section (filters, sort, reference search) ===================== */
function priceEGP(f){ const n=Number(String(f.price||"").replace(/[^\d.]/g,""))||0; return toEGP(n, f.price_unit||"EGP"); }
function watchSpecs(L){
  const f=L.f, out=[];
  if (f.ref) out.push(["Ref.", f.ref]);
  if (f.year) out.push(["Year", f.year]);
  if (f.size) out.push(["Case", f.size+" mm"]);
  if (f.papers) out.push(["Box & papers", f.papers]);
  if (f.movement) out.push(["Movement", f.movement]);
  if (f.material) out.push(["Material", f.material]);
  return out;
}
const WF = {q:"", brand:"", min:"", max:"", papers:"", cond:"", move:"", sort:"featured"};
function watchFilterApply(items){
  const q=WF.q.trim().toLowerCase().replace(/\s+/g," ");
  const min=Number(String(WF.min).replace(/\D/g,""))||0, max=Number(String(WF.max).replace(/\D/g,""))||0;
  let xs=items.filter(({L})=>{
    const f=L.f;
    if (q && ![f.brand,f.model,f.ref,f.material].join(" ").toLowerCase().replace(/[\s\-]+/g,"").includes(q.replace(/[\s\-]+/g,""))) return false;
    if (WF.brand && String(f.brand||"").toLowerCase()!==WF.brand.toLowerCase()) return false;
    const p=priceEGP(f); if (min && p<min) return false; if (max && p>max) return false;
    if (WF.papers==="full" && f.papers!=="Full set") return false;
    if (WF.papers && WF.papers!=="full" && f.papers!==WF.papers) return false;
    if (WF.cond && f.condition!==WF.cond) return false;
    if (WF.move && f.movement!==WF.move) return false;
    return true;
  });
  const by={ "price_asc":(a,b)=>priceEGP(a.L.f)-priceEGP(b.L.f), "price_desc":(a,b)=>priceEGP(b.L.f)-priceEGP(a.L.f),
    "newest":(a,b)=>(b.L.at||0)-(a.L.at||0), "year":(a,b)=>(Number(b.L.f.year)||0)-(Number(a.L.f.year)||0) }[WF.sort];
  return by ? xs.slice().sort(by) : xs;
}
function drawWatchFilters(box, items, onChange){
  const brands=[...new Set(items.map(x=>String(x.L.f.brand||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const opt=(v,t)=>`<option value="${v.replace(/"/g,"&quot;")}">${t}</option>`;
  box.innerHTML = `
    <div class="wf-row"><input id="wfQ" type="search" placeholder="Search brand, model or reference (e.g. 126610)" autocomplete="off"></div>
    <div class="wf-row">
      <select id="wfBrand">${opt("","All brands")}${brands.map(b=>opt(b,b)).join("")}</select>
      <select id="wfSort">${opt("featured","Sort: Featured")}${opt("price_asc","Price: low to high")}${opt("price_desc","Price: high to low")}${opt("newest","Newest listed")}${opt("year","Year: newest")}</select>
    </div>
    <details class="wf-more"><summary>More filters</summary>
      <div class="wf-row"><input id="wfMin" inputmode="numeric" placeholder="Min price EGP"><input id="wfMax" inputmode="numeric" placeholder="Max price EGP"></div>
      <div class="wf-row">
        <select id="wfPapers">${opt("","Box & papers: any")}${opt("full","Full set only")}${opt("Box only","Box only")}${opt("Papers only","Papers only")}${opt("None","No box or papers")}</select>
        <select id="wfCond">${opt("","New or used")}${opt("New","New")}${opt("Used","Used")}</select>
      </div>
      <div class="wf-row"><select id="wfMove">${opt("","Any movement")}${["Automatic","Manual winding","Quartz","Smart"].map(m=>opt(m,m)).join("")}</select>
        <button type="button" class="btn ghost small" id="wfReset">Clear filters</button></div>
    </details>
    <div class="wf-count" id="wfCount"></div>`;
  const map={wfQ:"q",wfBrand:"brand",wfSort:"sort",wfMin:"min",wfMax:"max",wfPapers:"papers",wfCond:"cond",wfMove:"move"};
  for (const [id,k] of Object.entries(map)){ const el=box.querySelector("#"+id); el.value=WF[k];
    el.addEventListener(el.tagName==="SELECT"?"change":"input", ()=>{ if (id==="wfMin"||id==="wfMax"){ const d=el.value.replace(/\D/g,""); el.value=d?fmt(d):""; } WF[k]=el.value; onChange(); }); }
  if (WF.min||WF.max||WF.papers||WF.cond||WF.move) box.querySelector(".wf-more").open=true;
  box.querySelector("#wfReset").onclick=()=>{ Object.assign(WF,{q:"",brand:"",min:"",max:"",papers:"",cond:"",move:"",sort:"featured"}); drawWatchFilters(box,items,onChange); onChange(); };
}

/* ===================== HD flyer (all photos + all details + QR) ===================== */
// HD photo from the owner's original file (with the High End watermark), for the post page
async function hdPhoto(file, edge, withMark){
  const img = await loadImage(file); let mark=null; try{ mark=await loadSrc(watermarkSrc()); }catch(e){}
  const s = Math.min(1, edge/Math.max(img.naturalWidth,img.naturalHeight));
  const w=Math.round(img.naturalWidth*s), h=Math.round(img.naturalHeight*s);
  const c=document.createElement("canvas"); c.width=w; c.height=h; const x=c.getContext("2d"); x.imageSmoothingQuality="high"; x.drawImage(img,0,0,w,h);
  if (withMark) drawWatermark(x,w,h,mark);
  return loadSrc(c.toDataURL("image/jpeg",0.9));
}
function dryPainter(){
  const ctx=document.createElement("canvas").getContext("2d"), cp=canvasPainter(ctx,4);
  return {dry:true, rect(){}, img(){}, text(){}, link(){}, width:cp.width};
}
async function drawFlyerHD(P, L, id, ph){
  const SP = flyerSponsor({market:marketOf(L), group:GROUP[L.type]||""});
  const logo = P.dry ? null : await loadSrc(logoFor(L.type)), masar = (P.dry || !SP) ? null : await loadSrc(SP.image);
  const M = 8, W = FW-2*M;
  if (!P.dry){ P.rect(0,0,FW,9999,PAPER); checker(P,0,0,FW,2); }
  // header: logo, QR to the listing, reference
  const lh = 30; if (logo){ const r=lh/logo.naturalHeight, lw=logo.naturalWidth*r; P.img(logo,(FW-lw)/2,6,lw,lh); }
  if (!P.dry && drawQR(P, linkFor(id), FW-M-24, 6, 24)) P.text("Scan to open the listing", FW-M-12, 6+24+3, {size:5,color:"#77736b",align:"center"});
  P.text("REF  HE-"+String(id||"").replace(/-/g,"").slice(0,8).toUpperCase(), M, 10, {size:6.5,bold:1,color:"#77736b"});
  P.text(new Date(L.at||Date.now()).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}), M, 14, {size:6.5,color:"#77736b"});
  let y = 6+lh+8;
  // title + price
  const badge = (LABELS[L.type] + (L.f.category?" - "+L.f.category:"") + (L.f.condition?" - "+L.f.condition:"")).toUpperCase();
  P.text(badge,M,y,{size:7.5,bold:1,color:"#77736b"}); y+=7;
  const tl = wrapText(P,titleOf(L),{size:17,bold:1,serif:1},W,3);
  tl.forEach((l,i)=>P.text(l,M,y+i*7,{size:17,bold:1,serif:1})); y += tl.length*7;
  P.text(priceStr(L.f),M,y+3,{size:22,bold:1,serif:1});
  const eg = priceEGP(L.f);
  if (eg && FX_DAY){ const alt = (L.f.price_unit==="USD" ? "≈ "+fmt(Math.round(eg))+" EGP" : "≈ $"+fmt(Math.round(eg/USD_TO_EGP))) + fxNote(); P.text(alt, M+P.width(priceStr(L.f),{size:22,bold:1,serif:1})+4, y+3, {size:9,color:"#77736b"}); }
  y += 10;
  // photos: main big, the rest two per row
  if (ph.length){ const h=W*0.72; await fitImg(P,ph[0],M,y,W,h); y+=h+3; }
  const rest = ph.slice(1), tw=(W-3)/2, th=tw*0.75;
  for (let i=0;i<rest.length;i+=2){
    await fitImg(P,rest[i],M,y,tw,th);
    if (rest[i+1]) await fitImg(P,rest[i+1],M+tw+3,y,tw,th);
    y += th+3;
  }
  if (ph.length) P.text(ph.length+(ph.length===1?" photo":" photos"), FW-M, y+1, {size:6,color:"#9a958c",align:"right"});
  y += 6;
  // every detail the owner entered
  P.text("DETAILS",M,y,{size:8,bold:1,color:"#2b2b2b"}); P.rect(M,y+2,W,0.3,"#dedad2"); y+=7;
  const det = rows(L).filter(([k])=>k!=="Add-ons" && k!=="Options & extras");
  const cw = W/2;
  for (let i=0;i<det.length;i+=2){
    let rh=0;
    for (let j=0;j<2 && det[i+j];j++){
      const [k,v]=det[i+j], cx=M+j*cw;
      P.text(k,cx,y,{size:6.8,color:"#77736b"});
      const vl=wrapText(P,String(v),{size:9.5,bold:1},cw-4,3);
      vl.forEach((l,n)=>P.text(l,cx,y+4.4+n*4.2,{size:9.5,bold:1}));
      rh=Math.max(rh, 4.4+vl.length*4.2);
    }
    y += rh+3;
  }
  if (L.f.addons){
    P.text(L.type==="car"?"OPTIONS & EXTRAS":"ADD-ONS",M,y,{size:6.8,color:"#77736b"}); y+=4.4;
    const al=wrapText(P,L.f.addons,{size:9.5},W,12); al.forEach((l,n)=>P.text(l,M,y+n*4.4,{size:9.5})); y+=al.length*4.4+2;
  }
  if (L.f.notes || L.f.desc){ const t=L.f.notes||L.f.desc; P.text("NOTES",M,y,{size:6.8,color:"#77736b"}); y+=4.4; const nl=wrapText(P,t,{size:9.5},W,14); nl.forEach((l,n)=>P.text(l,M,y+n*4.4,{size:9.5})); y+=nl.length*4.4+2; }
  y += 4;
  // contact + footer
  P.rect(M,y,W,12,"#2b2b2b",2);
  P.text(contactBarText(L),FW/2,y+7.8,{size:12.5,bold:1,color:"#ffffff",align:"center"});
  P.link(M,y,W,12,contactBarLink(L,id));
  y += 17;
  P.text("More listings: "+baseUrl().replace(/^https?:\/\//,""),FW/2,y,{size:7.5,bold:1,color:"#2b2b2b",align:"center"}); P.link(M,y-3.5,W,4.5,linkFor(id));
  y += 4;
  const dl = wrapText(P,DISCLAIMER,{size:5.6},W,3); dl.forEach((l,i)=>P.text(l,FW/2,y+i*2.6,{size:5.6,color:"#9a958c",align:"center"})); y += dl.length*2.6+2;
  if (!P.dry) masarStrip(P,masar,M,y,W,11,SP);
  y += 14;
  if (!P.dry) checker(P,0,y-2,FW,1);
  return y;
}
// sources: optional list of images (the owner's HD originals on the post page); otherwise the listing's photos
/* "Download now": the original, highest-definition copy of the ad (item page) */
const DL_ICON='<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 12v20M15 24l9 9 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function hdTxt(){ const l=window.HE_LANG;
  return l==="ar" ? {btn:"حمّل الآن", sub:"الإعلان الأصلي بأعلى جودة", h:"الإعلان الأصلي — أعلى جودة", p:"دي النسخة الأصلية من الإعلان بأعلى دقة، مباشرة من High End Communities.", img:"صورة HD", pdf:"ملف PDF HD", close:"إغلاق"}
       : l==="fr" ? {btn:"Télécharger", sub:"Annonce originale en haute définition", h:"Annonce originale — haute définition", p:"Voici la copie originale de cette annonce, dans la plus haute définition, directement de High End Communities.", img:"Image HD", pdf:"PDF HD", close:"Fermer"}
       : {btn:"Download now", sub:"Original ad · highest definition", h:"Original ad — highest definition", p:"This is the original, highest-definition copy of this ad, straight from High End Communities.", img:"HD image", pdf:"HD PDF", close:"Close"}; }
function hdPopup(L, id){
  const t=hdTxt(); document.getElementById("hdModal")?.remove();
  const ov=document.createElement("div"); ov.className="modal hd-modal"; ov.id="hdModal"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label",t.h);
  const c=document.createElement("div"); c.className="card";
  const ic=document.createElement("div"); ic.className="hd-ic"; ic.innerHTML=DL_ICON;
  const h=document.createElement("h3"); h.textContent=t.h; h.setAttribute("data-noi18n","");
  const p=document.createElement("p"); p.textContent=t.p; p.setAttribute("data-noi18n","");
  const row=document.createElement("div"); row.className="hd-row";
  const bi=document.createElement("button"); bi.type="button"; bi.className="btn primary"; bi.textContent="⬇ "+t.img; bi.setAttribute("data-noi18n","");
  const bp=document.createElement("button"); bp.type="button"; bp.className="btn ghost"; bp.textContent="⬇ "+t.pdf; bp.setAttribute("data-noi18n","");
  const bx=document.createElement("button"); bx.type="button"; bx.className="btn ghost small"; bx.textContent=t.close; bx.setAttribute("data-noi18n","");
  bi.onclick=()=>{ ov.remove(); exportHD(L,id,false); }; bp.onclick=()=>{ ov.remove(); exportHD(L,id,true); };
  bx.onclick=()=>ov.remove(); ov.onclick=e=>{ if (e.target===ov) ov.remove(); };
  row.append(bi,bp); c.append(ic,h,p,row,bx); ov.appendChild(c); document.body.appendChild(ov); bi.focus();
}
function hdCta(L, id){
  const t=hdTxt(); const b=document.createElement("button"); b.type="button"; b.className="hd-cta"; b.setAttribute("data-noi18n","");
  b.innerHTML=DL_ICON; const x=document.createElement("span"); const s1=document.createElement("b"); s1.textContent=t.btn; const s2=document.createElement("small"); s2.textContent=t.sub;
  x.append(s1,s2); b.appendChild(x); b.onclick=()=>hdPopup(L,id); return b;
}
async function exportHD(L, id, asPdf, sources){
  if (asPdf && !window.jspdf){ toast("PDF tool didn't load - check your connection."); return; }
  toast("Making your HD flyer…");
  await ensureFonts();
  let ph = sources;
  if (!ph || !ph.length){ if (!L.photos || !L.photos.length) L.photos = await loadPhotos({id,L});
    ph = await loadPhotoImgs(L.photos); }
  FLYER_HD = true; let H; try{ H = Math.ceil(await drawFlyerHD(dryPainter(), L, id, ph)); } finally{ FLYER_HD = false; }
  const old = FILL_PXMM; FILL_PXMM = asPdf ? 9 : 14;
  try{
    FLYER_HD = true;
    if (asPdf){
      const doc = new jspdf.jsPDF({unit:"mm",format:[FW,H],compress:true}); aliasMap.clear();
      await drawFlyerHD(pdfPainter(doc), L, id, ph);
      doc.setProperties({title:pdfSafe(titleOf(L))+" - "+MARKET_NAME});
      await saveFile(fileBase(L)+"-HD.pdf", doc.output("blob"));
    } else {
      const k = 2160/FW, c=document.createElement("canvas"); c.width=2160; c.height=Math.round(H*k);
      FLYER_IMAGE=true; try{ await drawFlyerHD(canvasPainter(c.getContext("2d"),k), L, id, ph); } finally{ FLYER_IMAGE=false; }
      const blob = await new Promise(r=>c.toBlob(r,"image/jpeg",0.9));
      await saveFile(fileBase(L)+"-HD.jpg", blob);
    }
  } finally { FILL_PXMM = old; FLYER_HD = false; }
}

/* ===================== Full screen photo viewer ===================== */
async function openViewer(item, start, btn){
  const old=btn?btn.textContent:null; if (btn) btn.textContent="Loading…";
  let ps=[]; try{ ps=(await loadPhotos(item)).filter(isPhoto); }catch(e){}
  if (btn) btn.textContent=old;
  if (!ps.length && item.L.thumb) ps=[item.L.thumb];
  if (!ps.length) return;
  try{ queueView(item.id); }catch(e){}
  const ov=document.createElement("div"); ov.className="viewer"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Photos");
  ov.innerHTML=`<div class="v-top"><span class="v-title"></span><span class="v-count"></span><button type="button" class="v-close" aria-label="Close">×</button></div>
    <div class="v-track"></div>
    <button type="button" class="v-nav v-prev" aria-label="Previous photo">‹</button><button type="button" class="v-nav v-next" aria-label="Next photo">›</button>
    <div class="v-dots"></div>`;
  ov.querySelector(".v-title").textContent=titleOf(item.L);
  const tr=ov.querySelector(".v-track"), dots=ov.querySelector(".v-dots");
  ps.forEach((src,i)=>{ const f=document.createElement("figure"); const im=document.createElement("img"); im.src=src; im.alt=`photo ${i+1}`; f.appendChild(im); tr.appendChild(f);
    const d=document.createElement("button"); d.type="button"; d.setAttribute("aria-label",`Photo ${i+1}`); d.onclick=()=>go(i); dots.appendChild(d); });
  if (ps.length<2){ ov.querySelectorAll(".v-nav,.v-dots").forEach(e=>e.hidden=true); }
  let cur=0;
  const mark=()=>{ cur=Math.round(tr.scrollLeft/Math.max(1,tr.clientWidth)); ov.querySelector(".v-count").textContent=ps.length>1?`${cur+1} / ${ps.length}`:"";
    [...dots.children].forEach((d,i)=>d.classList.toggle("on",i===cur)); ov.querySelector(".v-prev").disabled=cur===0; ov.querySelector(".v-next").disabled=cur===ps.length-1; };
  const go=(i)=>{ i=Math.max(0,Math.min(ps.length-1,i)); tr.scrollTo({left:i*tr.clientWidth,behavior:"smooth"}); };
  tr.addEventListener("scroll",()=>{ clearTimeout(tr._t); tr._t=setTimeout(mark,60); });
  ov.querySelector(".v-prev").onclick=()=>go(cur-1); ov.querySelector(".v-next").onclick=()=>go(cur+1);
  const close=()=>{ ov.remove(); document.body.style.overflow=""; document.removeEventListener("keydown",key); };
  const key=(e)=>{ if(e.key==="Escape") close(); else if(e.key==="ArrowRight") go(cur+1); else if(e.key==="ArrowLeft") go(cur-1); };
  ov.querySelector(".v-close").onclick=close;
  tr.addEventListener("click",(e)=>{ if (e.target===tr || e.target.tagName==="FIGURE") close(); });
  document.addEventListener("keydown",key);
  document.body.appendChild(ov); document.body.style.overflow="hidden";
  requestAnimationFrame(()=>{ tr.scrollLeft=(start||0)*tr.clientWidth; mark(); });
}

/* Watermark only the main photo (added when publishing, so the owner can still change the main photo) */
async function watermarkUrl(url){
  try{
    const im=await loadSrc(url), mark=await loadSrc(watermarkSrc());
    const c=document.createElement("canvas"); c.width=im.naturalWidth; c.height=im.naturalHeight;
    const x=c.getContext("2d"); x.drawImage(im,0,0); drawWatermark(x,c.width,c.height,mark);
    return c.toDataURL("image/jpeg",0.6);
  }catch(e){ return url; }
}

/* ===================== Intro video + countdown (catalogue, once per visit) ===================== */
// The intro ends on "Why High End?": the site's features appear one by one while the countdown runs.
const INTRO_COUNT = 8;
const INTRO_FEATS = {
  ar:{h:"ليه High End؟", f:[["swap","من المالك للمشتري","من غير وسيط ولا عمولة"],["tag","اعرض بسعرك","مفيش فصال في الأسعار"],["lock","رقمك محمي","مش ظاهر على الموقع، والتواصل بزرار واتساب"],
    ["dl","حمّل الأصل بأعلى جودة","صورة فخمة تليق بقطع قيمتها عالية"],["doc","ملف PDF واحد بكل الصور","بلينكات شغالة، وبيوفر باقة الموبايل"],["gift","أول إعلان مجاناً","جرّب من غير أي مخاطرة"]]},
  en:{h:"Why High End?", f:[["swap","Owner to buyer","No middleman, no commission"],["tag","Your price, no haggling","The price you list is the price"],["lock","Your number stays private","Not shown on the site; buyers reach you by WhatsApp"],
    ["dl","Download the HD original","A premium image worthy of high-value pieces"],["doc","One PDF with every photo","With live links, light on mobile data"],["gift","First listing free","Try it with no risk"]]},
  fr:{h:"Pourquoi High End ?", f:[["swap","Du propriétaire à l'acheteur","Sans intermédiaire ni commission"],["tag","Votre prix, sans marchandage","Le prix affiché est le prix"],["lock","Votre numéro protégé","Absent du site ; contact par WhatsApp"],
    ["dl","L'original en haute définition","Une image digne d'objets de grande valeur"],["doc","Un seul PDF avec toutes les photos","Liens actifs, peu de données mobiles"],["gift","Première annonce gratuite","Essayez sans risque"]]}
};
const INTRO_ICON = {
  swap:"<path d='M7 7h11l-3-3M17 17H6l3 3' fill='none' stroke-linecap='round' stroke-linejoin='round'/>",
  tag:"<path d='M3 12V4h8l10 10-8 8z' fill='none' stroke-linejoin='round'/><circle cx='7.5' cy='8.5' r='1.4'/>",
  lock:"<rect x='5' y='11' width='14' height='10' rx='2' fill='none'/><path d='M8 11V8a4 4 0 0 1 8 0v3' fill='none'/>",
  dl:"<circle cx='12' cy='12' r='9' fill='none'/><path d='M12 7v9M8 12l4 4 4-4' fill='none' stroke-linecap='round' stroke-linejoin='round'/>",
  doc:"<path d='M6 3h8l4 4v14H6z' fill='none' stroke-linejoin='round'/><path d='M9 12h6M9 16h6'/>",
  gift:"<rect x='4' y='9' width='16' height='12' rx='1' fill='none'/><path d='M4 13h16M12 9v12M12 9c-3 0-5-1.5-4-3.5S12 6 12 9zm0 0c3 0 5-1.5 4-3.5S12 6 12 9z' fill='none'/>"
};
function introFeats(){
  const L = INTRO_FEATS[window.HE_LANG] || INTRO_FEATS.en;
  return `<div class="intro-feats" data-noi18n><h2>${esc(L.h)}</h2><ul>${L.f.map(([ic,a,b],i)=>`<li style="--i:${i}"><span class="ifi"><svg viewBox="0 0 24 24" aria-hidden="true">${INTRO_ICON[ic]}</svg></span><span><b>${esc(a)}</b><small>${esc(b)}</small></span></li>`).join("")}</ul></div>`;
}
function runIntro(key){ key = key || "he_intro";
  try{
    if (/[?&]nointro\b/.test(location.search) || /^#l-/.test(location.hash)) return;   // shared listing links go straight in
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key,"1");
  }catch(e){}
  const END_AT = 6;    // short opening ("A moment for you · Pause · Breathe"), then the features with the countdown
  const ov=document.createElement("div"); ov.className="intro"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Welcome");
  ov.innerHTML=`<video class="intro-vid" playsinline muted preload="auto" poster="intro-poster.jpg"><source src="intro.mp4" type="video/mp4"></video>
    <div class="intro-btns"><button type="button" class="intro-sound" aria-label="Sound off"></button><button type="button" class="intro-skip">Skip ›</button></div>
    <button type="button" class="intro-gate" hidden><span><svg viewBox='0 0 24 24' width='34' height='34' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'><path d='M4 9h4l5-4v14l-5-4H4z'/><path d='M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11'/></svg></span>Tap to enter</button>
    <div class="intro-end" hidden>
      <div class="intro-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="r-bg"/><circle cx="60" cy="60" r="54" class="r-fg"/></svg>
        <img src="${BRAND_ART}" alt="High End Communities">
        <span class="intro-num">8</span>
      </div>
      ${introFeats()}
    </div>`;
  document.body.appendChild(ov); document.body.style.overflow="hidden";
  const v=ov.querySelector("video"), snd=ov.querySelector(".intro-sound"), gate=ov.querySelector(".intro-gate");
  const music=new Audio("intro-music.m4a"); music.preload="auto";      // the music plays from its own file, with sound from the start
  v.muted=true;                                                       // the picture is silent, so it may always start by itself
  let done=false, counting=false, started=false;
  const SND_ON="<svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='1.75' stroke-linejoin='round' stroke-linecap='round'><path d='M4 9h4l5-4v14l-5-4H4z'/><path d='M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11'/></svg>";
  const SND_OFF="<svg viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' fill='none' stroke='currentColor' stroke-width='1.75' stroke-linejoin='round' stroke-linecap='round'><path d='M4 9h4l5-4v14l-5-4H4z'/><path d='M17 9.5l5 5M22 9.5l-5 5'/></svg>";
  const setSnd=()=>{ snd.innerHTML = music.muted ? SND_OFF : SND_ON; snd.setAttribute("aria-label", music.muted?"Sound on":"Sound off"); };
  const fadeOut=()=>{ const t=setInterval(()=>{ music.volume=Math.max(0,music.volume-0.1); if (music.volume<=0.05){ clearInterval(t); try{ music.pause(); }catch(e){} } },60); };
  const finish=()=>{ if (done) return; done=true; window.__introMuted=null; try{ v.pause(); }catch(e){} fadeOut(); ov.classList.add("out"); setTimeout(()=>{ ov.remove(); document.body.style.overflow=""; },600); };
  const countdown=()=>{                         // the music keeps playing under the countdown
    if (counting) return; counting=true; gate.hidden=true;
    ov.querySelector(".intro-end").hidden=false; ov.classList.add("ending");
    const num=ov.querySelector(".intro-num"); let n=INTRO_COUNT; num.textContent=n;
    const t=setInterval(()=>{ n--; if (n>0){ num.textContent=n; num.classList.remove("pop"); void num.offsetWidth; num.classList.add("pop"); } else { clearInterval(t); finish(); } },1000);
  };
  const start=()=>{                              // picture and music together, from the top
    started=true; gate.hidden=true;
    try{ v.currentTime=0; music.currentTime=0; }catch(e){}
    v.play().catch(()=>countdown());
    music.muted=false; music.volume=1; music.play().catch(()=>{}); setSnd();
  };
  v.addEventListener("timeupdate", ()=>{ if (v.currentTime >= END_AT) countdown(); });
  v.addEventListener("ended", countdown);
  v.addEventListener("error", countdown, true);
  ov.querySelector(".intro-skip").onclick=(e)=>{ e.stopPropagation(); finish(); };
  snd.onclick=(e)=>{ e.stopPropagation(); if (!started){ start(); return; } music.muted=!music.muted; if (!music.muted && music.paused && !done) music.play().catch(()=>{}); setSnd(); };
  gate.onclick=(e)=>{ e.stopPropagation(); start(); };
  // the admin can make the intro start silent (Settings → "Intro starts with the sound off"); visitors tap to hear it
  let touched=false; const startSilent=()=>{ if (!started) start(); if (!touched){ music.muted=true; setSnd(); } };
  snd.addEventListener("click",()=>{ touched=true; });
  window.__introMuted=(m)=>{ if (done) return; if (m) startSilent(); };
  let silent=false; try{ silent = localStorage.getItem("he_intro_muted")==="1"; }catch(e){}
  if (silent) startSilent();
  // otherwise try to start with sound straight away; when the browser asks for a tap first, show "Tap to enter" instead of playing silently
  else music.play().then(()=>{ if (!started) { music.pause(); start(); } }).catch(()=>{ if (!started) gate.hidden=false; });
  setTimeout(()=>{ if (!started && !counting) start(); }, 12000);     // nobody tapped: go ahead (silent if the browser insists)
  setTimeout(()=>{ if (!counting) countdown(); }, 26000);              // never stay stuck
}


/* ===================== Ratings: sellers and businesses (every rating waits for an admin) ===================== */
function starText(avg){ const n=Math.round(Number(avg)||0); return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n); }
function ratingLine(avg, n){
  const d=document.createElement("span"); d.className="rating";
  if (!n){ d.classList.add("none"); d.textContent="No ratings yet"; return d; }
  const st=document.createElement("b"); st.className="stars"; st.setAttribute("aria-hidden","true"); st.setAttribute("data-noi18n",""); st.textContent=starText(avg);
  const v=document.createElement("span"); v.setAttribute("data-noi18n",""); v.textContent=` ${Number(avg).toFixed(1)} `;
  const c=document.createElement("small"); c.textContent=n===1?"(1 rating)":`(${n} ratings)`;
  d.setAttribute("aria-label",`${Number(avg).toFixed(1)} out of 5, ${n} ratings`); d.append(st,v,c); return d;
}
function reviewList(list){
  const box=document.createElement("div"); box.className="reviews";
  (list||[]).forEach(r=>{ const it=document.createElement("div"); it.className="review";
    const h=document.createElement("div"); h.className="rh";
    const st=document.createElement("b"); st.className="stars"; st.setAttribute("data-noi18n",""); st.textContent=starText(r.stars);
    const nm=document.createElement("span"); nm.setAttribute("data-noi18n",""); nm.setAttribute("dir","auto"); nm.textContent=r.name||"";
    const dt=document.createElement("small"); dt.className="muted"; dt.setAttribute("data-noi18n",""); try{ dt.textContent=new Date(r.at).toLocaleDateString(document.documentElement.lang==="ar"?"ar-EG":"en-GB",{day:"numeric",month:"short",year:"numeric"}); }catch(e){}
    h.append(st,nm,dt); it.appendChild(h);
    if (r.comment){ const p=document.createElement("p"); p.setAttribute("dir","auto"); p.setAttribute("data-noi18n",""); p.textContent=r.comment; it.appendChild(p); }
    box.appendChild(it); });
  return box;
}
// opts: {target:"seller", listingId, title, market} or {target:"provider", providerId, title, market}
function openRate(opts){
  let ov=$("#rateModal"); if (ov) ov.remove();
  ov=document.createElement("div"); ov.className="modal rate-modal"; ov.id="rateModal";
  ov.innerHTML=`<div class="card"><h3 id="rateH"></h3><p class="muted" id="rateFor" style="margin:0 0 10px;font-size:14px" dir="auto" data-noi18n></p>
    <div id="rateAsk">
      <div class="starpick" role="radiogroup" aria-label="Stars">${[1,2,3,4,5].map(i=>`<button type="button" role="radio" aria-checked="false" aria-label="${i}" data-s="${i}">☆</button>`).join("")}</div>
      <label for="rateTxt">Your review (optional)</label><textarea id="rateTxt" maxlength="400" rows="3"></textarea>
      <label for="rateName">Your name</label><input id="rateName" maxlength="60" autocomplete="name">
      <label for="ratePhone">Your WhatsApp number</label><input id="ratePhone" type="tel" inputmode="tel">
      <div class="hint">Not shown on the page. Only your first name is shown.</div>
      <div class="actions"><button type="button" class="btn primary" id="rateGo">Send rating</button><button type="button" class="btn ghost" data-close>Close</button></div>
    </div>
    <div id="rateDone" hidden><p>Thank you! Your rating has been sent.</p><div class="actions"><button type="button" class="btn primary" data-close>Done</button></div></div>
    <div class="msg" id="rateMsg"></div></div>`;
  document.body.appendChild(ov);
  $("#rateH").textContent = opts.target==="seller" ? "Rate the seller" : "Rate this business";
  $("#rateFor").textContent = opts.title||"";
  const mk=opts.market||MARKET; $("#ratePhone").placeholder=(MARKET_BY_ID[mk]||MARKET_BY_ID.EG).local;
  try{ const p=localStorage.getItem("mm_phone"); if (p) $("#ratePhone").value=p; const n=localStorage.getItem("mm_name"); if (n) $("#rateName").value=n; }catch(e){}
  let stars=0; const btns=[...ov.querySelectorAll(".starpick button")];
  const paint=()=>btns.forEach(b=>{ const on=+b.dataset.s<=stars; b.textContent=on?"★":"☆"; b.classList.toggle("on",on); b.setAttribute("aria-checked", +b.dataset.s===stars?"true":"false"); });
  btns.forEach(b=>b.onclick=()=>{ stars=+b.dataset.s; paint(); });
  const close=()=>ov.remove(); ov.querySelectorAll("[data-close]").forEach(b=>b.onclick=close); ov.onclick=e=>{ if(e.target===ov) close(); };
  $("#rateGo").onclick=async()=>{
    const ph=anyPhone($("#ratePhone").value, mk), name=$("#rateName").value.trim();
    if (!stars) return showMsg("Tap the stars to choose 1 to 5.","err",$("#rateMsg"));
    if (name.length<2) return showMsg("Write your name.","err",$("#rateMsg"));
    if (!ph) return showMsg(PHONE_HELP,"err",$("#rateMsg"));
    const row={target:opts.target, stars, comment:$("#rateTxt").value.trim()||null, rater_name:name, rater_phone:ph};
    if (opts.target==="seller") row.listing_id=opts.listingId; else row.provider_id=opts.providerId;
    $("#rateGo").disabled=true;
    try{
      const {error}=await sb.from("ratings").insert(row); if (error) throw error;
      try{ localStorage.setItem("mm_phone",ph); localStorage.setItem("mm_name",name); }catch(e){}
      $("#rateAsk").hidden=true; $("#rateDone").hidden=false; showMsg("","info",$("#rateMsg"));
    }catch(e){ showMsg(niceError(e),"err",$("#rateMsg")); }
    finally{ $("#rateGo").disabled=false; }
  };
  ov.hidden=false; setTimeout(()=>btns[0].focus(),50);
}

/* ===================== Menu: About High End + how-to videos ===================== */
const HOWTO_VIDEOS = [
  {file:"videos/howto-moto.mp4",   ar:"الموتوسيكلات", en:"Motorcycles", fr:"Motos"},
  {file:"videos/howto-cars.mp4",   ar:"العربيات",     en:"Cars",        fr:"Voitures"},
  {file:"videos/howto-marine.mp4", ar:"المراكب واليخوت", en:"Boats & yachts", fr:"Bateaux & yachts"},
  {file:"videos/howto-equine.mp4", ar:"الخيل",        en:"Equine",      fr:"Équitation"},
  {file:"videos/howto-boutique.mp4", ar:"البوتيك: الشنط والإكسسوارات الفاخرة", en:"The Boutique", fr:"La Boutique", boutique:true}   // only while the Boutique is switched on
];
function menuTxt(){
  const l = window.HE_LANG;
  if (l==="ar") return {
    menu:"القائمة", about:"عن High End", howto:"طريقة الاستخدام", post:"اعرض منتجك", wanted:"اطلب حاجة مش لاقيها", admin:"كلّم الأدمن", contact:"تواصل معنا", close:"إغلاق", back:"رجوع",
    aboutTitle:"عن High End Communities",
    aboutLead:"سوق للقطع اللي قيمتها عالية: موتوسيكلات وساعات وعربيات ومراكب وخيل وعربيات الصحرا. البيع من المالك للمشتري مباشرة.",
    points:[
      ["من المالك للمشتري","من غير وسيط ولا عمولة: البايع بياخد سعره كامل، والمشتري بيدفع أقل."],
      ["اعرض بسعرك","السعر المكتوب هو السعر. مريح للبائع والمشتري اللي مش بيحبوا الفصال."],
      ["أول إعلان مجاناً","جرّب من غير أي مخاطرة."],
      ["رقمك محمي","رقمك مش ظاهر على الموقع. المشتري بيكلمك بزرار واتساب أو اتصال، ومحدش يقدر يسحب الأرقام بالجملة."],
      ["ملف PDF واحد بكل الصور","كل الصور في ملف PDF واحد فيه لينكات شغالة، فبتبعت ملف واحد بدل صور كتير وبتوفر باقة الموبايل. ولو اخترت، رقمك بيظهر على ملف الـHD بتاعك إنت بس."],
      ["حمّل الأصل بأعلى جودة","النسخة الأصلية من الإعلان: صورة فخمة تليق بقطع قيمتها عالية."],
      ["اطلب اللي مش لاقيه","واللي عنده هو اللي يكلمك. وممكن نطلبلك قطع من بره."],
      ["تقييمات حقيقية","التقييمات بتتراجع قبل ما تظهر، والمزيفة بتتشال."],
      ["أكتر من دولة و3 لغات","مصر والسعودية والإمارات وغيرهم، بالعربي والإنجليزي والفرنساوي."]
    ],
    howtoLead:"فيديو قصير لكل قسم: إزاي تتفرج وتشتري وتعرض في دقيقة.", soon:"الفيديوهات هتنزل قريب."
  };
  if (l==="fr") return {
    menu:"Menu", about:"À propos", howto:"Mode d'emploi", post:"Publier une annonce", wanted:"Demander un article", admin:"Contacter l'admin", contact:"Nous contacter", close:"Fermer", back:"Retour",
    aboutTitle:"À propos de High End Communities",
    aboutLead:"Un marché pour les objets de grande valeur : motos, montres, voitures, bateaux, chevaux et véhicules du désert. Directement du propriétaire à l'acheteur.",
    points:[
      ["Du propriétaire à l'acheteur","Sans intermédiaire ni commission : le vendeur garde tout son prix ; l'acheteur paie moins."],
      ["Votre prix, sans marchandage","Le prix affiché est le prix. Idéal pour ceux qui n'aiment pas négocier."],
      ["Première annonce gratuite","Essayez sans risque."],
      ["Votre numéro protégé","Il n'apparaît pas sur le site : l'acheteur vous contacte par un bouton WhatsApp ou appel, et personne ne peut copier les numéros en masse."],
      ["Un seul PDF avec toutes les photos","Toutes les photos dans un PDF avec des liens actifs : un fichier au lieu de nombreuses photos, moins de données mobiles. Si vous le choisissez, votre numéro figure sur votre propre flyer HD uniquement."],
      ["L'original en haute définition","La copie originale de l'annonce, digne d'objets de grande valeur."],
      ["Demandez ce que vous cherchez","Demandez ce que vous cherchez ; ceux qui l'ont vous contactent."],
      ["Avis vérifiés","Les avis sont contrôlés avant d'apparaître ; les faux sont supprimés."],
      ["Plusieurs pays, 3 langues","Égypte, Arabie saoudite, Émirats et plus, en arabe, anglais et français."]
    ],
    howtoLead:"Une courte vidéo par rubrique : regarder, acheter et publier en une minute.", soon:"Les vidéos arrivent bientôt."
  };
  return {
    menu:"Menu", about:"About High End", howto:"How to use", post:"List an item", wanted:"Ask for an item", admin:"Contact the admin", contact:"Contact us", close:"Close", back:"Back",
    aboutTitle:"About High End Communities",
    aboutLead:"A market for high-value pieces: motorcycles, watches, cars, boats, horses and desert rides. Sold owner to owner.",
    points:[
      ["Owner to buyer","No middleman, no commission: the seller keeps the full price; the buyer pays less."],
      ["Your price, no haggling","The price you list is the price, easy for people who don't like to bargain."],
      ["First listing free","Try it with no risk."],
      ["Your number stays protected","It isn't shown on the site: buyers reach you with a WhatsApp or call button, and nobody can harvest the numbers in bulk."],
      ["One PDF with every photo","All photos in one PDF with live links: one file instead of many photos, so it saves mobile data. If you choose, your number shows on your own HD flyer only."],
      ["Download the HD original","The original copy of the ad, a premium image worthy of high-value pieces."],
      ["Ask for what you can't find","Ask for what you can't find and whoever has it contacts you."],
      ["Real ratings","Ratings are checked before they show; fake ones are removed."],
      ["Several countries, 3 languages","Egypt, Saudi Arabia, the UAE and more, in Arabic, English and French."]
    ],
    howtoLead:"One short video per section: browse, buy and list in a minute.", soon:"The videos are coming soon."
  };
}
const MENU_ICON = {
  info:"<circle cx='12' cy='12' r='9' fill='none'/><path d='M12 11v6M12 7.5v.5' fill='none' stroke-linecap='round'/>",
  play:"<circle cx='12' cy='12' r='9' fill='none'/><path d='M10 8.5l6 3.5-6 3.5z' stroke-linejoin='round'/>",
  plus:"<path d='M12 5v14M5 12h14' fill='none' stroke-linecap='round'/>",
  mail:"<rect x='3.5' y='6' width='17' height='12' rx='1.5' fill='none'/><path d='M4 7l8 6 8-6' fill='none' stroke-linejoin='round'/>",
  wa:"<path d='M5 19l1.2-3.6A7.5 7.5 0 1 1 9 18.6z' fill='none' stroke-linejoin='round'/>"
};
// Contact us: the site's email (forwarded to the owner) and WhatsApp to the admin. The address is put together on click so bots scraping the page don't find it.
const CONTACT_EMAIL = ["info","highendcommunities.com"];   // [name, domain], e.g. ["info","highendcommunities.com"]; empty = email hidden until set
function contactTxt(){ const l=window.HE_LANG;
  if (l==="ar") return {t:"تواصل معنا", lead:"عندك سؤال أو اقتراح أو عايز تعلن معانا؟ ابعتلنا وهنرد عليك في أقرب وقت.", mail:"ابعت إيميل", wa:"واتساب", subj:"High End Communities: استفسار", close:"إغلاق"};
  if (l==="fr") return {t:"Nous contacter", lead:"Une question, une idée ou une publicité à proposer ? Écrivez-nous, nous répondons au plus vite.", mail:"Envoyer un e-mail", wa:"WhatsApp", subj:"High End Communities : demande", close:"Fermer"};
  return {t:"Contact us", lead:"A question, an idea or an ad to place? Write to us and we'll reply as soon as we can.", mail:"Email us", wa:"WhatsApp", subj:"High End Communities: enquiry", close:"Close"};
}
function contactSheet(){
  const t=contactTxt(); document.getElementById("contactSheet")?.remove();
  const ov=document.createElement("div"); ov.className="modal hemenu"; ov.id="contactSheet"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label",t.t); ov.setAttribute("data-noi18n","");
  const c=document.createElement("div"); c.className="card"; ov.appendChild(c);
  const top=document.createElement("div"); top.className="hm-top"; const h=document.createElement("h3"); h.textContent=t.t;
  const x=document.createElement("button"); x.type="button"; x.className="hm-x"; x.setAttribute("aria-label",t.close); x.textContent="×"; top.append(h,x); c.appendChild(top);
  const p=document.createElement("p"); p.className="hm-lead"; p.textContent=t.lead; c.appendChild(p);
  const nav=document.createElement("nav"); nav.className="hm-nav";
  const row=(label,ic,href,extra)=>{ const a=document.createElement("a"); a.href=href; if (/^https:/.test(href)){ a.target="_blank"; a.rel="noopener"; }
    a.innerHTML=`<span class="hm-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${MENU_ICON[ic]}</svg></span>`; const s1=document.createElement("span"); s1.textContent=label; a.appendChild(s1);
    if (extra){ const s2=document.createElement("small"); s2.className="hm-sub"; s2.textContent=extra; s2.dir="ltr"; a.appendChild(s2); } nav.appendChild(a); };
  if (CONTACT_EMAIL[0] && CONTACT_EMAIL[1]){ const addr=CONTACT_EMAIL[0]+"@"+CONTACT_EMAIL[1]; row(t.mail,"mail","mailto:"+addr+"?subject="+encodeURIComponent(t.subj), addr); }
  try{ row(t.wa,"wa",adminHref("")); }catch(e){}
  c.appendChild(nav);
  const close=()=>{ ov.remove(); document.removeEventListener("keydown",esc); }; const esc=e=>{ if (e.key==="Escape") close(); };
  x.onclick=close; ov.onclick=e=>{ if (e.target===ov) close(); }; document.addEventListener("keydown",esc);
  document.body.appendChild(ov); x.focus();
}
function closeHeMenu(){ document.getElementById("heMenu")?.remove(); }
function openHeMenu(view){
  const t = menuTxt(); closeHeMenu();
  const ov=document.createElement("div"); ov.className="modal hemenu"; ov.id="heMenu"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label",t.menu); ov.setAttribute("data-noi18n","");
  const c=document.createElement("div"); c.className="card"; ov.appendChild(c);
  const top=document.createElement("div"); top.className="hm-top";
  const h=document.createElement("h3"); const x=document.createElement("button"); x.type="button"; x.className="hm-x"; x.setAttribute("aria-label",t.close); x.textContent="×"; x.onclick=closeHeMenu;
  top.append(h,x); c.appendChild(top);
  const body=document.createElement("div"); body.className="hm-body"; c.appendChild(body);
  const backBtn=()=>{ const b=document.createElement("button"); b.type="button"; b.className="btn ghost small hm-back"; b.textContent="‹ "+t.back; b.onclick=()=>openHeMenu(); return b; };
  if (view==="about"){
    h.textContent=t.aboutTitle;
    const p=document.createElement("p"); p.className="hm-lead"; p.textContent=t.aboutLead; body.appendChild(p);
    const ul=document.createElement("ul"); ul.className="hm-points";
    t.points.forEach(([a,b])=>{ const li=document.createElement("li"); const s=document.createElement("b"); s.textContent=a; const d=document.createElement("span"); d.textContent=b; li.append(s,d); ul.appendChild(li); });
    body.append(ul, backBtn());
  } else if (view==="howto"){
    h.textContent=t.howto;
    const p=document.createElement("p"); p.className="hm-lead"; p.textContent=t.howtoLead; body.appendChild(p);
    const vids=HOWTO_VIDEOS.filter(v=>!v.boutique || (SITE_ST && SITE_ST.boutique_on));
    const grid=document.createElement("div"); grid.className="hm-videos"; let ok=vids.length;
    const soon=document.createElement("p"); soon.className="hm-lead"; soon.textContent=t.soon; soon.hidden=true;
    vids.forEach(v=>{
      const f=document.createElement("figure"); const vid=document.createElement("video");
      vid.controls=true; vid.preload="metadata"; vid.playsInline=true; vid.src="/"+v.file+"#t=0.5";
      vid.onerror=()=>{ f.remove(); if (--ok<=0) soon.hidden=false; };
      const cap=document.createElement("figcaption"); cap.textContent=v[window.HE_LANG]||v.en; f.append(vid,cap); grid.appendChild(f);
    });
    body.append(grid, soon, backBtn());
  } else {
    h.textContent=t.menu;
    const nav=document.createElement("nav"); nav.className="hm-nav";
    const item=(label,fn,href,ic)=>{ const a=document.createElement(href?"a":"button"); if (href){ a.href=href; if (/^https:/.test(href)){ a.target="_blank"; a.rel="noopener"; } } else { a.type="button"; a.onclick=fn; }
      a.innerHTML=`<span class="hm-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${MENU_ICON[ic]||""}</svg></span>`; const sp=document.createElement("span"); sp.textContent=label; a.appendChild(sp); nav.appendChild(a); };
    item(t.about, ()=>openHeMenu("about"), null, "info");
    item(t.howto, ()=>openHeMenu("howto"), null, "play");
    item(t.post, null, "/post.html", "plus");
    item(t.contact, ()=>{ closeHeMenu(); contactSheet(); }, null, "mail");
    body.appendChild(nav);
  }
  ov.onclick=e=>{ if (e.target===ov) closeHeMenu(); };
  document.addEventListener("keydown", function esc(e){ if (e.key==="Escape"){ closeHeMenu(); document.removeEventListener("keydown",esc); } });
  document.body.appendChild(ov); x.focus();
}
function addHeMenuButton(){
  if (ADMIN_PAGE) return;
  const mast=document.querySelector("header.mast"); if (!mast || document.getElementById("heMenuBtn")) return;
  const b=document.createElement("button"); b.type="button"; b.id="heMenuBtn"; b.className="menubtn"; b.setAttribute("data-noi18n","");
  b.setAttribute("aria-label", menuTxt().menu); b.innerHTML='<span></span><span></span><span></span>';
  b.onclick=()=>openHeMenu(); mast.appendChild(b);
  if (/[?&]menu=(about|howto)/.test(location.search)) openHeMenu(location.search.match(/menu=(about|howto)/)[1]);
}
if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", addHeMenuButton); else addHeMenuButton();


/* ===================== Terms of use: one copy, shown when needed ===================== */
// Sellers accept once (the post form remembers it); buyers see the terms once, the first time they contact a seller.
const TERMS_V = "1";
const TERMS_OL = "<ol><li><b>Listing platform only.</b> High End Communities is a place where members advertise items. We do not own, inspect, verify, value or guarantee any item, and we are not a party to any sale.</li><li><b>No responsibility.</b> High End Communities, its admins and sponsors are not responsible for any product promoted here, its condition, legality, ownership, description or price, or for any loss or dispute arising from a sale.</li><li><b>Due diligence is yours.</b> Buyers must inspect the item, verify the seller's identity, and confirm the seller owns it and can legally sell it.</li><li><b>Check the papers with a lawyer.</b> Before paying, consult a lawyer or the relevant authority for the ownership and transfer papers the item needs, for example: vehicle or motorcycle licence and traffic records; boat registration and marina papers; property title deed, registration and contract; horse passport, pedigree and vet certificate; watch box &amp; papers, or a certificate of authenticity for art.</li><li><b>Seller's responsibility.</b> Sellers confirm they own the item or are authorised to sell it, that the description and photos are true, and that the item is legal to sell.</li><li><b>Payments and meetings</b> are arranged directly between buyer and seller at their own risk. Meet in safe places and never pay before checking the item and its papers.</li><li>Admins may remove any listing at any time.</li></ol>";
function termsSeen(who){ try{ return localStorage.getItem("he_terms_"+who)===TERMS_V; }catch(e){ return false; } }
function termsAccepted(who){ try{ localStorage.setItem("he_terms_"+who, TERMS_V); }catch(e){} }
function termsSheet(opt){
  opt = opt || {};
  document.getElementById("termsSheet")?.remove();
  const ov=document.createElement("div"); ov.className="modal terms-sheet"; ov.id="termsSheet"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true");
  const c=document.createElement("div"); c.className="card"; ov.appendChild(c);
  const h=document.createElement("h3"); h.textContent = opt.title || "Terms of use"; c.appendChild(h);
  if (opt.lead){ const p=document.createElement("p"); p.className="ts-lead"; p.textContent=opt.lead; c.appendChild(p); }
  const body=document.createElement("div"); body.className="ts-body"; body.innerHTML=TERMS_OL; c.appendChild(body);
  const act=document.createElement("div"); act.className="actions";
  const close=()=>{ ov.remove(); document.removeEventListener("keydown",esc); if (opt.back) opt.back.focus?.(); };
  const esc=e=>{ if (e.key==="Escape") close(); };
  if (opt.onOk){
    const ok=document.createElement("button"); ok.type="button"; ok.className="btn primary"; ok.textContent=opt.okText||"I understand, continue";
    ok.onclick=()=>{ close(); opt.onOk(); };
    const no=document.createElement("button"); no.type="button"; no.className="btn ghost"; no.textContent="Cancel"; no.onclick=close;
    act.append(ok,no);
  } else { const x=document.createElement("button"); x.type="button"; x.className="btn primary"; x.textContent="Close"; x.onclick=close; act.appendChild(x); }
  c.appendChild(act);
  ov.onclick=e=>{ if (e.target===ov) close(); };
  document.addEventListener("keydown",esc);
  document.body.appendChild(ov); act.querySelector("button").focus();
}
// any [data-terms] button opens the terms to read
document.addEventListener("click", e=>{ const b=e.target.closest && e.target.closest("[data-terms]"); if (!b) return; e.preventDefault(); termsSheet({back:b}); });
// one "Terms of use" link in every footer
function addTermsLink(){
  document.querySelectorAll("footer").forEach(f=>{ if (f.querySelector(".termslink")) return;
    const p=document.createElement("p"); p.className="termslink"; const b=document.createElement("button"); b.type="button"; b.className="linkbtn"; b.setAttribute("data-terms",""); b.textContent="Terms of use"; p.appendChild(b);
    const ct=document.createElement("button"); ct.type="button"; ct.className="linkbtn"; ct.setAttribute("data-noi18n",""); ct.textContent=contactTxt().t; ct.onclick=()=>contactSheet(); p.appendChild(ct);
    const cp=f.querySelector(".copyr"); if (cp) cp.after(p); else f.appendChild(p); });
}
if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", addTermsLink); else addTermsLink();
// post form: ticked and folded away once the seller has accepted before
function sellerTermsUi(){
  const t=document.getElementById("terms"), w=document.getElementById("termsWrap"); if (!t || !w) return;
  const seen = ADMIN_PAGE || termsSeen("seller");
  if (ADMIN_PAGE) return;
  t.checked = seen || t.checked; w.hidden = seen;
  const more=document.getElementById("termsMore"), ok=document.getElementById("termsOk");
  if (more) more.hidden = seen; if (ok) ok.hidden = !seen;
}
if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", sellerTermsUi); else sellerTermsUi();

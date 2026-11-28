/* High End Communities, shared engine part 4 of 5: Sponsors, seller tools, payments, limits, maintenance, files, view counters. Load order matters: core, export, data, business, ui. */
/* ===================== Sponsors: rotating ads by date, day and hour ===================== */
const DEFAULT_SPONSOR = { id:"masar", name:"MASAR", tagline:"Plan rides, track your routes and ride together with the community.",
  link: MASAR_URL || "", image: MASAR_IMG, weight:1, slots:["banner","feed","flyer"] };
let SPONSORS = [];
function cairoNow(){
  const p = new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Cairo",weekday:"short",hour:"numeric",hour12:false}).formatToParts(new Date());
  const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf((p.find(x=>x.type==="weekday")||{}).value);
  return { day: wd<0?new Date().getDay():wd, hour: (+((p.find(x=>x.type==="hour")||{}).value||0))%24 };
}
function sponsorOnNow(s, now){
  now = now || cairoNow();
  if (s.active===false) return false;
  if (Array.isArray(s.days) && s.days.length && !s.days.includes(now.day)) return false;
  const a = s.hour_from ?? 0, b = s.hour_to ?? 24;
  return a <= b ? (now.hour >= a && now.hour < b) : (now.hour >= a || now.hour < b);   // overnight windows like 20 → 2
}
// Which country and category the visitor is looking at (set by the catalogue page).
// A sponsor with no countries / no categories ticked shows everywhere.
const AD_CTX = { market:"", group:"" };
function sponsorFits(s, market, group){
  const mk = s.markets||[], gr = s.groups||[];
  return (!market || !mk.length || mk.includes(market)) && (!group || !gr.length || gr.includes(group));
}
function sponsorsFor(slot, opt){
  opt = opt || {};
  const now = cairoNow(), market = opt.market ?? AD_CTX.market, group = (opt.group ?? AD_CTX.group) || (window.FIXED_GROUP || "");
  let list = SPONSORS.filter(s=>(!s.slots || s.slots.includes(slot)) && sponsorOnNow(s,now) && sponsorFits(s, market, group));
  if (opt.only) list = list.filter(s=>(s.groups||[]).includes(group));       // just the ads made for this category
  if (opt.general) list = list.filter(s=>!(s.groups||[]).length);           // ads not tied to one category
  return list.length || opt.only ? list : (houseSponsorOn(group) ? [DEFAULT_SPONSOR] : []);
}
// The house sponsor (MASAR) fills a slot only where no paid sponsor is booked, and only in the places the admin ticked.
// Until the admin saves a choice it shows everywhere except The Boutique.
const HOUSE_DEFAULT = ["home","moto","watch","car","boat","desert","equine","art","estate"];
function houseSponsorOn(group){
  const g = group || (window.FIXED_GROUP || "home");
  const on = (SITE_ST && Array.isArray(SITE_ST.house_sponsor_groups)) ? SITE_ST.house_sponsor_groups : HOUSE_DEFAULT;
  return on.includes(g);
}
function pickWeighted(list, seed){
  const total = list.reduce((a,s)=>a+(s.weight||1),0);
  let r = ((seed ?? Math.random()) % 1) * total;
  for (const s of list){ r -= (s.weight||1); if (r < 0) return s; }
  return list[0];
}
async function loadSponsors(){
  if (!sb) return;
  const {data,error} = await sb.from("sponsors").select("*").order("created_at",{ascending:true});
  if (!error && Array.isArray(data)) SPONSORS = data.filter(s=>s.image && /^data:image\//.test(s.image));
}
function fillSponsorBox(box, s){
  box.innerHTML = "";
  const img=document.createElement("img"); img.alt=s.name; img.src=s.image;
  const d=document.createElement("div");
  const tag=document.createElement("div"); tag.className="tag"; tag.textContent="Sponsored";
  const t=document.createElement("div"); t.className="t"; t.textContent=s.name;
  const p=document.createElement("p"); p.textContent=s.tagline||"";
  d.append(tag,t,p);
  if (s.link && /^https:\/\//.test(s.link)){ const a=document.createElement("a"); a.href=s.link; a.target="_blank"; a.rel="noopener sponsored"; a.textContent="Learn more"; d.appendChild(a); }
  box.append(img,d);
}
let bannerTimer=null, bannerIdx=0;
const SPONSOR_SLOTS = 3;   // the banner is a row of up to 3 small sponsor tiles side by side
function sponsorTile(s){
  const el=document.createElement(s.link && /^https:\/\//.test(s.link) ? "a" : "div"); el.className="sp-tile";
  if (el.tagName==="A"){ el.href=s.link; el.target="_blank"; el.rel="noopener sponsored"; }
  const img=document.createElement("img"); img.alt=""; img.src=s.image; img.loading="lazy";
  const d=document.createElement("div"); d.className="sp-txt";
  const tag=document.createElement("small"); tag.textContent="Sponsored";
  const t=document.createElement("b"); t.textContent=s.name;
  const p=document.createElement("span"); p.textContent=s.tagline||"";
  d.append(tag,t,p); el.append(img,d); return el;
}
function startBannerRotation(){
  const boxes=[...document.querySelectorAll(".sponsor-banner")]; if (!boxes.length) return;
  const tick=()=>{
    const list = sponsorsFor("banner");
    boxes.forEach(b=>{ b.classList.remove("masar"); b.classList.add("sp-row"); });
    if (!list.length){ boxes.forEach(b=>{ b.innerHTML=""; b.hidden=true; }); return; }
    // weighted round-robin over distinct sponsors; with 3 or fewer they all stay put
    const seq = list.flatMap(s=>Array(s.weight||1).fill(s));
    const pickN = [];
    for (let k=0; pickN.length<Math.min(SPONSOR_SLOTS, list.length) && k<seq.length*2; k++){ const s=seq[(bannerIdx+k)%seq.length]; if (!pickN.includes(s)) pickN.push(s); }
    if (list.length>SPONSOR_SLOTS) bannerIdx++;
    boxes.forEach(b=>{ const same = b.dataset.ids===pickN.map(s=>s.id).join(",");
      if (same) return;
      b.classList.add("fade"); setTimeout(()=>{ b.innerHTML=""; b.hidden=false; b.dataset.ids=pickN.map(s=>s.id).join(",");
        b.style.setProperty("--n", pickN.length); b.dataset.n=pickN.length; pickN.forEach(s=>b.appendChild(sponsorTile(s))); b.classList.remove("fade"); },180); });
  };
  clearInterval(bannerTimer); tick(); bannerTimer=setInterval(tick, 8000);
}
function feedSponsorCard(i, opt){
  const list = sponsorsFor("feed", opt);
  if (!list.length) return null;
  const seq = list.flatMap(s=>Array(s.weight||1).fill(s));
  return sponsorCard(seq[i % seq.length]);
}
// a slim row of up to 3 sponsor tiles (between listings and under a category row)
function sponsorRow(list){ const box=document.createElement("aside"); box.className="sp-row feedad"; const l=list.slice(0,SPONSOR_SLOTS);
  box.dataset.n=l.length; box.style.setProperty("--n", l.length); l.forEach(s=>box.appendChild(sponsorTile(s))); return box; }
function sponsorCard(s){ return sponsorRow([s]); }
function flyerSponsor(opt){ const l=sponsorsFor("flyer", opt); return l.length ? pickWeighted(l) : null; }


/* ===================== Seller tools & discount codes (catalogue and listing pages) ===================== */
const SELLER_MODALS = "<div class=\"modal\" id=\"soldModal\" hidden>\n  <div class=\"card\">\n    <h3>Seller tools</h3>\n    <p class=\"muted\" id=\"soldTitle\" style=\"font-size:14px\"></p>\n    <label for=\"soldCode\">Your 6-digit seller code</label>\n    <input id=\"soldCode\" inputmode=\"numeric\" maxlength=\"12\" placeholder=\"e.g. 482913\">\n    <div class=\"hint\">You got it when you posted. Lost it? Ask the admin on WhatsApp.</div>\n    <div id=\"stockBox\" hidden style=\"margin-top:10px\">\n      <label for=\"stockIn\">Quantity in stock now</label>\n      <div class=\"unitrow\"><input id=\"stockIn\" inputmode=\"numeric\" placeholder=\"e.g. 12\"><button type=\"button\" class=\"btn ghost small\" id=\"stockGo\">Update stock</button></div>\n      <div class=\"hint\">Put 0 when everything is sold.</div>\n    </div>\n    <div class=\"actions\">\n      <button type=\"button\" class=\"btn primary\" id=\"soldEdit\">Edit my listing</button>\n      <button type=\"button\" class=\"btn ghost\" id=\"soldGo\">Mark as sold</button>\n      <a class=\"btn ghost\" id=\"soldAsk\" target=\"_blank\" rel=\"noopener\">Ask the admin</a>\n      <button type=\"button\" class=\"btn ghost\" id=\"soldClose\">Close</button>\n    </div>\n    <div class=\"msg\" id=\"soldMsg\"></div>\n  </div>\n</div>\n<div class=\"modal\" id=\"discModal\" hidden>\n  <div class=\"card\">\n    <h3>\ud83c\udff7\ufe0f Get your discount code</h3>\n    <p class=\"muted\" id=\"discTitle\" style=\"font-size:14px\"></p>\n    <div id=\"discAsk\">\n      <label for=\"discPhone\">Your mobile number</label>\n      <input id=\"discPhone\" type=\"tel\" inputmode=\"tel\" placeholder=\"01xxxxxxxxx\">\n      <div class=\"actions\"><button type=\"button\" class=\"btn primary\" id=\"discGo\">Get my code</button><button type=\"button\" class=\"btn ghost\" id=\"discClose\">Close</button></div>\n    </div>\n    <div id=\"discDone\" hidden style=\"text-align:center\">\n      <div class=\"code\" id=\"discCode\"></div>\n      <p style=\"font-size:14px;margin:6px 0 10px\">Send this code to High End on WhatsApp to get <b id=\"discPct\"></b> off. The code works once and only for this item.</p>\n      <a class=\"btn wa\" id=\"discSend\" target=\"_blank\" rel=\"noopener\">Send code on WhatsApp</a>\n      <div class=\"actions\" style=\"justify-content:center\"><button type=\"button\" class=\"btn ghost small\" id=\"discClose2\">Close</button></div>\n    </div>\n    <div class=\"msg\" id=\"discMsg\"></div>\n  </div>\n</div>";
function ensureSellerModals(){
  if (document.getElementById("soldModal")) return;
  const w=document.createElement("div"); w.innerHTML=SELLER_MODALS; while (w.firstElementChild) document.body.appendChild(w.firstElementChild);
  $("#discClose").onclick = $("#discClose2").onclick = ()=>{ $("#discModal").hidden = true; };
  $("#soldClose").onclick = ()=>{ $("#soldModal").hidden = true; };
}
function openSold(item){
  ensureSellerModals();
  $("#soldTitle").textContent = titleOf(item.L);
  $("#soldCode").value = ""; showMsg("","info",$("#soldMsg"));
  $("#soldAsk").href = adminHref(`*Please mark as SOLD*\n\n${titleOf(item.L)}\nRef: ${item.id}\n\nI'm the seller${phoneOf(item.L)?" (listed number "+phoneOf(item.L)+")":""}. I lost my seller code.`);
  $("#soldGo").onclick = async ()=>{
    const code = $("#soldCode").value.replace(/\D/g,"");
    if (code.length<4){ showMsg("Enter your seller code.","err",$("#soldMsg")); return; }
    $("#soldGo").disabled = true;
    try{
      const {data, error} = await sb.rpc("seller_mark_sold",{p_id:item.id, p_code:code});
      if (error) throw error;
      const m = {ok:"Done — your listing is marked as sold. Thank you!", wrong:"That code is not right. Please check it.", locked:"Too many wrong tries. Ask the admin to mark it sold.", no_code:"This listing has no seller code. Ask the admin.", not_found:"This listing can't be changed any more."}[data] || "Something went wrong.";
      showMsg(m, data==="ok"?"ok":"err", $("#soldMsg"));
      if (data==="ok"){ item.L.status="sold"; item.L.soldAt=Date.now(); (window.onItemChanged||(()=>{}))(item); setTimeout(()=>$("#soldModal").hidden=true, 1500); }
    }catch(e){ showMsg(niceError(e),"err",$("#soldMsg")); }
    finally{ $("#soldGo").disabled = false; }
  };
  $("#soldEdit").onclick = ()=>sellerOpenEdit(item.id, $("#soldCode").value, $("#soldMsg"), $("#soldEdit"));
  const hasStock = item.L.stock!==null && item.L.stock!==undefined;
  $("#stockBox").hidden = !hasStock; if (hasStock) $("#stockIn").value = item.L.stock;
  $("#stockGo").onclick = async ()=>{
    const code = $("#soldCode").value.replace(/\D/g,""), n = parseInt($("#stockIn").value,10);
    if (code.length<4){ showMsg("Enter your seller code.","err",$("#soldMsg")); return; }
    if (isNaN(n) || n<0){ showMsg("Enter the quantity (0 or more).","err",$("#soldMsg")); return; }
    $("#stockGo").disabled = true;
    try{
      const {data, error} = await sb.rpc("seller_update_stock",{p_id:item.id, p_code:code, p_stock:n});
      if (error) throw error;
      const m = {ok:"Stock updated. Thank you!", wrong:"That code is not right.", locked:"Too many wrong tries. Ask the admin.", no_code:"This listing has no seller code. Ask the admin.", not_found:"This listing can't be changed.", bad_number:"Enter a number between 0 and 99,999."}[data] || "Something went wrong.";
      showMsg(m, data==="ok"?"ok":"err", $("#soldMsg"));
      if (data==="ok"){ item.L.stock=n; if (n===0){ item.L.status="sold"; item.L.soldAt=Date.now(); } (window.onItemChanged||(()=>{}))(item); }
    }catch(e){ showMsg(niceError(e),"err",$("#soldMsg")); }
    finally{ $("#stockGo").disabled = false; }
  };
  $("#soldModal").hidden = false;
}
/* ---- the seller edits their own listing with the seller code ---- */
const EDIT_MSGS = {wrong:"That code is not right. Please check it.", locked:"Too many wrong tries. Ask the admin.", no_code:"This listing has no seller code. Ask the admin.",
  sold:"This listing is sold. Sold listings can't be edited.", not_found:"This listing can't be changed any more.", expired:"This edit session has ended. Enter your seller code again.",
  too_many:"Too many saves. Enter your seller code again.", bad_photos:"A photo couldn't be used. Please add it again.", bad:"Something went wrong."};
async function sellerOpenEdit(id, codeIn, msgEl, btn){
  const code = String(codeIn||"").replace(/\D/g,"");
  if (code.length<4){ showMsg("Enter your seller code.","err",msgEl); return null; }
  if (btn) btn.disabled = true; showMsg("Opening your listing…","info",msgEl);
  try{
    const {data, error} = await sb.rpc("seller_open_edit",{p_id:id, p_code:code});
    if (error) throw error;
    const d = typeof data==="string" ? JSON.parse(data) : data;
    if (!d || d.r!=="ok"){ showMsg(EDIT_MSGS[d&&d.r]||"Something went wrong.","err",msgEl); return null; }
    try{ sessionStorage.setItem("he_edit", JSON.stringify({...d, id, at:Date.now()})); }catch(e){}
    if (!/post\.html$/.test(location.pathname)) location.href = "post.html#edit="+id;
    return d;
  }catch(e){ showMsg(niceError(e),"err",msgEl); return null; }
  finally{ if (btn) btn.disabled = false; }
}
// the WhatsApp message to the admin about a new or edited listing, with its link, in the language it was posted in
function adminListingMsg(L, id, kind){
  const lang = (L.f && L.f._lang) || window.HE_LANG || "en";
  const live = kind==="live" || L.status==="live";           // a listing waiting for review has no public page yet
  const review = baseUrl()+"/admin.html?review="+id;           // opens it in the admin Review tab
  const link = linkFor(id);
  if (lang==="ar"){
    const t = window.T_LANG || (x=>x);
    const head = kind==="edit" ? "✏️ *إعلان اتعدّل*" : kind==="live" ? "🆕 *إعلان جديد اتنشر*" : "🆕 *إعلان جديد مستني المراجعة*";
    let b = `${head}\n\n${t(LABELS[L.type])}: ${titleOf(L)}\n`;
    for (const [k,v] of rows(L)) b += `${t(k)}: ${t(v)}\n`;
    b += `السعر: ${priceStr(L.f)}` + (phoneOf(L) ? `\nرقم الموبايل: ${phoneOf(L)}` : "");
    return b + `\n\nللمراجعة والموافقة: ${review}` + (live ? `\nالإعلان: ${link}` : "") + `\nRef: ${id}`;
  }
  const head = kind==="edit" ? "✏️ *Listing edited by the seller*" : kind==="live" ? "🆕 *New listing is live*" : "🆕 *New listing waiting for review*";
  return `${head}\n\n${listingText(L)}\n\nReview & approve: ${review}` + (live ? `\nListing: ${link}` : "") + `\nRef: ${id}`;
}
function openDiscount(item){
  ensureSellerModals();
  $("#discTitle").textContent = `${titleOf(item.L)} — ${item.L.discount}% off`;
  $("#discAsk").hidden=false; $("#discDone").hidden=true; showMsg("","info",$("#discMsg"));
  try{ const p=localStorage.getItem("mm_phone"); if (p) $("#discPhone").value=p; }catch(e){}
  $("#discPhone").placeholder = MARKET_BY_ID[marketOf(item.L)].local;
  $("#discGo").onclick = async ()=>{
    const ph = anyPhone($("#discPhone").value, marketOf(item.L));
    if (!ph){ showMsg(PHONE_HELP,"err",$("#discMsg")); return; }
    $("#discGo").disabled=true;
    try{
      const {data, error} = await sb.rpc("request_discount",{p_id:item.id, p_phone:ph});
      if (error) throw error;
      if (data && data.code){
        try{ localStorage.setItem("mm_phone", ph); }catch(e){}
        $("#discCode").textContent=data.code; $("#discPct").textContent=data.pct+"%";
        $("#discSend").href = adminHref(`*Discount code request*\n\n${titleOf(item.L)}\nPrice: ${priceStr(item.L.f)}\nDiscount: ${data.pct}%\nMy code: *${data.code}*\nMy number: ${ph}\nRef: ${item.id}`);
        $("#discAsk").hidden=true; $("#discDone").hidden=false; showMsg("","info",$("#discMsg"));
      } else {
        const m={no_discount:"This item has no discount right now.", sold_out:"Sorry, this item is sold out.", too_many:"You already asked for codes for this item today. Use the one you have.", bad_phone:"Check your mobile number.", try_again:"Please try again."}[(data||{}).error] || "Something went wrong.";
        showMsg(m,"err",$("#discMsg"));
      }
    }catch(e){ showMsg(niceError(e),"err",$("#discMsg")); }
    finally{ $("#discGo").disabled=false; }
  };
  $("#discModal").hidden = false;
}


/* ===================== Payments: promote a listing, membership, extra vehicles =====================
   No gateway yet: shows the payment link / InstaPay / wallet the admin saved (Admin → Stats → Payments),
   and always a WhatsApp message to the admin with the reference. When a gateway (Paymob, Kashier, Fawry…)
   is ready, its payment page link goes in "Payment link" and appears here first. */
function payModal(title, intro, waText){
  const st = SITE_ST || {};
  let m = document.getElementById("payModal");
  if (!m){ m=document.createElement("div"); m.className="modal"; m.id="payModal"; document.body.appendChild(m);
    m.addEventListener("click", e=>{ if (e.target===m || e.target.hasAttribute("data-close")) m.hidden=true; }); }
  const opts = [];
  if (st.pay_link && /^https:\/\//.test(st.pay_link)) opts.push(`<a class="btn primary" href="${esc(st.pay_link)}" target="_blank" rel="noopener">Pay online (card / wallet)</a>`);
  if (st.pay_instapay) opts.push(`<div class="payrow"><span>InstaPay</span><b>${esc(st.pay_instapay)}</b></div>`);
  if (st.pay_wallet) opts.push(`<div class="payrow"><span>Mobile wallet</span><b>${esc(st.pay_wallet)}</b></div>`);
  m.innerHTML = `<div class="card"><h3>${esc(title)}</h3><p class="muted" style="font-size:14px">${esc(intro)}</p>
    ${opts.join("")}
    <div class="actions"><a class="btn wa" href="${adminHref(waText)}" target="_blank" rel="noopener">${opts.length ? "Send the receipt on WhatsApp" : "Arrange it on WhatsApp"}</a>
    <button type="button" class="btn ghost" data-close>Close</button></div></div>`;
  m.hidden = false;
}
function paymentsOn(){ return !!(SITE_ST && SITE_ST.pay_enabled); }
function openPromote(item){
  const st = SITE_ST || {};
  payModal("Promote this listing",
    "Featured listings show first in their category with a Featured mark." + (st.promo_price ? " Price: " + st.promo_price + "." : ""),
    `*Promote my listing*\n\n${titleOf(item.L)}\nRef: ${item.id}\n${linkFor(item.id)}`);
}
/* ===================== Membership: verified WhatsApp, unlimited bikes & cars =====================
   1) the site gives a 6-digit code, the seller sends it FROM that number to the admin's WhatsApp
   2) the seller pays (InstaPay / wallet / link), sends the receipt; the admin presses "Add membership". */
function fmtMoney(n){ return Number(n||0).toLocaleString("en-US")+" EGP"; }
async function vehicleQuota(phone){ try{ const {data,error}=await sb.rpc("vehicle_quota",{p_phone:phone}); return error?null:data; }catch(e){ return null; } }
function openMembership(prefill){
  const st = SITE_ST || {};
  let m=document.getElementById("memberModal");
  if (!m){ m=document.createElement("div"); m.className="modal"; m.id="memberModal"; document.body.appendChild(m);
    m.addEventListener("click", e=>{ if (e.target===m || e.target.hasAttribute("data-close")) m.hidden=true; }); }
  const price = Number(st.member_price||0), days = Number(st.member_days||365);
  m.innerHTML = `<div class="card"><h3>Membership</h3>
    <p class="muted" style="font-size:14px">Members post as many motorcycles and cars as they like. Without membership the first ${Number(st.free_vehicles??1)} vehicle is free and each extra one is ${fmtMoney(st.extra_vehicle_fee??1000)}.</p>
    <div class="payrow"><span>Membership</span><b>${price?fmtMoney(price):"Ask the admin"} / ${days>=365&&days%365===0?(days/365>1?days/365+" years":"year"):days+" days"}</b></div>
    <label class="fl">Your WhatsApp number<input id="mbPhone" inputmode="tel" autocomplete="tel" placeholder="01xxxxxxxxx"></label>
    <label class="fl">Name<input id="mbName" maxlength="80" autocomplete="name"></label>
    <p class="muted" id="mbMsg" style="font-size:13px;min-height:1em"></p>
    <div class="actions" style="flex-wrap:wrap">
      <button type="button" class="btn wa" id="mbVerify">1 · Verify my WhatsApp</button>
      <button type="button" class="btn primary" id="mbPay">2 · Pay</button>
      <button type="button" class="btn ghost" data-close>Close</button></div></div>`;
  const ph=$("#mbPhone"), nm=$("#mbName"), msg=$("#mbMsg");
  try{ ph.value = prefill || localStorage.getItem("mm_phone") || ""; }catch(e){}
  const num=()=>{ const n=normPhone(ph.value, getMarket()); if(!n){ msg.textContent="Enter a valid WhatsApp number."; ph.focus(); } return n; };
  const showQ=async()=>{ const n=normPhone(ph.value,getMarket()); if(!n) return; const q=await vehicleQuota(n); if(!q) return;
    msg.textContent = q.member ? `Member until ${new Date(q.member_until).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}.` : q.verified ? "WhatsApp verified. Step 2: pay to start the membership." : ""; };
  ph.addEventListener("change", showQ); showQ();
  $("#mbVerify").onclick = async ()=>{
    const n=num(); if(!n) return;
    const w = window.open("about:blank","_blank");
    const {data,error} = await sb.rpc("request_verify",{p_phone:n, p_name:nm.value.trim()});
    if (error||!data){ if(w) w.close(); msg.textContent = niceError(error||"Try again later."); return; }
    if (data==="VERIFIED"){ if(w) w.close(); msg.textContent="This number is already verified. Step 2: pay."; return; }
    try{ localStorage.setItem("mm_phone", n); }catch(e){}
    const u = adminHref(`*Verify my WhatsApp — High End*\n\nCode: ${data}\nNumber: ${n}${nm.value.trim()?"\nName: "+nm.value.trim():""}`);
    if (w){ try{ w.opener=null; }catch(e){} w.location.href=u; } else location.href=u;
    msg.textContent = `Send the message with code ${data} from ${n} (don't change it). The admin confirms it.`;
  };
  $("#mbPay").onclick = ()=>{ const n=num(); if(!n) return; m.hidden=true;
    payModal("Membership", `${price?fmtMoney(price)+" — ":""}unlimited motorcycles and cars for ${days} days. Pay, then send the receipt; the admin starts your membership.`,
      `*Membership payment*\n\nNumber: ${n}${nm.value.trim()?"\nName: "+nm.value.trim():""}${price?"\nAmount: "+fmtMoney(price):""}`); };
  m.hidden=false;
}
/* ===================== Extra listings: every section can have a free limit, then a fee =====================
   The admin sets free listings + fee per section, a sale (% off for a period), discount codes and packs. */
const FEE_GROUPS = {vehicle:"Motorcycles & cars", moto:"Motorcycle gear & accessories", car:"Car parts & accessories", watch:"Watches", desert:"Dune Riders (desert)",
  boat:"Marine", equine:"Horses & equine", art:"Modern & art", estate:"Real estate", bag:"Ladies boutique"};
const FEE_ICON = {desert:"", vehicle:"", moto:"", car:"", watch:"", boat:"", equine:"", art:"", estate:"", bag:""};
async function listingQuota(phone, type){ try{ const {data,error}=await sb.rpc("listing_quota",{p_phone:phone, p_type:type}); return error?null:data; }catch(e){ return null; } }
function feeNeeded(q){ return !!(q && q.pay_enabled && !(q.member && q.grp==="vehicle") && q.free!=null && Number(q.fee)>0 && q.used>=q.free && !(q.credits>0)); }
function feeAfter(fee, pct){ return Math.round(Number(fee||0)*(100-Number(pct||0))/100); }
function saleLine(q){ if(!(q.sale_pct>0)) return ""; const u=q.sale_until?new Date(q.sale_until).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"";
  return `${q.sale_note?q.sale_note+": ":""}${q.sale_pct}% off extra listings${u?" until "+u:""}.`; }
function packsHtml(q){ return (q.packs||[]).filter(p=>Number(p.n)>0&&Number(p.price)>0).map(p=>{
    const each=Math.round(Number(p.price)/Number(p.n)), save=Number(q.fee)>0?Math.round(100-100*each/Number(q.fee)):0;
    return `<button type="button" class="btn ghost small" data-pack="${Number(p.n)}" data-price="${Number(p.price)}" data-days="${packDays(p)}">${Number(p.n)} listings ${packPer(p)} · ${fmtMoney(p.price)}${save>0?" (save "+save+"%)":""}</button>`; }).join(""); }
function packDays(p){ return Number(p.days)>0?Number(p.days):30; }
function packPer(p){ const d=packDays(p); return d===30?"a month":d===365?"a year":"for "+d+" days"; }
async function openListingFee(row){
  const q = await listingQuota(row.phone, row.type) || {grp:"vehicle", fee:(SITE_ST||{}).extra_vehicle_fee??1000, free:(SITE_ST||{}).free_vehicles??1, sale_pct:0, packs:[]};
  const g=q.grp, sec=FEE_GROUPS[g]||"this section", free=Number(q.free||0);
  let pct = Number(q.sale_pct||0), code="";
  const amt=()=>feeAfter(q.fee, Math.max(pct, 0));
  const wa=()=>`${FEE_ICON[g]||""} *Extra listing fee*\n\n${titleOf(row)}\nNumber: ${row.phone}\nRef: ${row.id}\nAmount: ${fmtMoney(amt())}${code?"\nCode: "+code:""}${pct&&!code?"\nSale: "+pct+"% off":""}`;
  payModal(`${FEE_ICON[g]||""} Extra listing fee`, `${sec}: the first ${free} listing${free===1?" is":"s are"} free for each number. Pay the fee and send the receipt: the listing goes live when the admin confirms.`, wa());
  const card=document.querySelector("#payModal .card"), acts=card.querySelector(".actions"), waBtn=acts.querySelector("a.btn.wa");
  const box=document.createElement("div"); box.className="feebox";
  const price=document.createElement("div"); price.className="payrow";
  const sale=document.createElement("p"); sale.className="muted"; sale.style.fontSize="13px"; sale.textContent=saleLine(q);
  const draw=()=>{ price.innerHTML=`<span>To pay</span><b>${amt()<Number(q.fee)?`<s class="muted">${fmtMoney(q.fee)}</s> `:""}${fmtMoney(amt())}</b>`; waBtn.href=adminHref(wa()); };
  const cr=document.createElement("div"); cr.className="dlrow";
  const ci=document.createElement("input"); ci.placeholder="Discount code"; ci.maxLength=20; ci.style.cssText="flex:1;min-width:0;text-transform:uppercase";
  const cb=document.createElement("button"); cb.type="button"; cb.className="btn ghost small"; cb.textContent="Apply";
  const cm=document.createElement("small"); cm.className="muted";
  cb.onclick=async()=>{ const c=ci.value.trim().toUpperCase(); if(!c) return; cb.disabled=true;
    const {data,error}=await sb.rpc("fee_code_check",{p_code:c, p_listing:row.id}); cb.disabled=false;
    if(error||!data){ cm.textContent="This code isn't valid for this listing."; return; }
    code=c; pct=Math.max(Number(data), Number(q.sale_pct||0)); cm.textContent=`${data}% off`; draw(); };
  cr.append(ci,cb);
  box.append(price); if(sale.textContent) box.append(sale); box.append(cr, cm);
  const ph=packsHtml(q);
  if (ph){ const pk=document.createElement("div"); pk.className="packs"; pk.innerHTML=`<p class="muted" style="font-size:13px;margin:10px 0 6px">Posting more? Take a monthly pack: this listing uses one and the rest are ready for your next ones.</p><div class="dlrow" style="flex-wrap:wrap">${ph}</div>`;
    pk.querySelectorAll("[data-pack]").forEach(b=>b.onclick=()=>{ waBtn.href=adminHref(`*Listings pack*\n\n${b.dataset.pack} ${sec} listings ${packPer({days:b.dataset.days})} for ${fmtMoney(b.dataset.price)}\nNumber: ${row.phone}\nFirst one: ${titleOf(row)} (Ref: ${row.id})`);
      price.innerHTML=`<span>Pack: ${b.dataset.pack} listings</span><b>${fmtMoney(b.dataset.price)}</b>`; pk.querySelectorAll("[data-pack]").forEach(x=>x.classList.toggle("on",x===b)); });
    box.append(pk); }
  card.insertBefore(box, acts); draw();
}
function openVehicleFee(row){ return openListingFee(row); }
document.addEventListener("click", e=>{ const b=e.target.closest && e.target.closest("[data-member]"); if (b && paymentsOn()){ e.preventDefault(); openMembership(); } });

/* ===================== Maintenance page ===================== */
// Shown when the admin switches maintenance on, or when the database can't be reached / is overloaded.
function showMaintenance(kind, msg){
  if (document.getElementById("maint")) return;
  const d = document.createElement("div"); d.id="maint"; d.className="maint";
  const img = document.createElement("img"); img.onerror=()=>{ img.onerror=null; img.src=MAIN_LOGO; }; img.src = BRAND_ART; img.alt = "High End Communities";
  const h = document.createElement("h2"); h.className="slab"; h.textContent = "Website under maintenance";
  const ar = document.createElement("div"); ar.className="ar"; ar.textContent = kind==="manual" ? "الموقع تحت الصيانة — هنرجع قريب" : "الموقع عليه ضغط أو مش متاح دلوقتي — جرّب كمان شوية";
  const p = document.createElement("p");
  p.textContent = kind==="manual" ? (msg || "We're updating the site. Please check back soon.")
                                  : "The site is very busy or temporarily unavailable. Please try again in a few minutes.";
  const row = document.createElement("div"); row.className="actions"; row.style.justifyContent="center";
  const again = document.createElement("button"); again.type="button"; again.className="btn primary"; again.textContent="Try again";
  again.onclick = ()=>location.reload();
  const wa = document.createElement("a"); wa.className="btn wa"; wa.target="_blank"; wa.rel="noopener"; wa.textContent="WhatsApp us";
  wa.href = "https://wa.me/"+adminWaNum();
  row.append(again, wa);
  const t = document.createElement("div"); t.className="muted"; t.style.marginTop="10px"; t.textContent="This page checks again by itself every minute.";
  d.append(img, h, ar, p, row, t);
  document.body.appendChild(d);
  document.body.style.overflow = "hidden";
  setInterval(async ()=>{ if (await siteCheck(null, true)) location.reload(); }, 60000);
}
// true = site is fine. Database down, overloaded (429/5xx) or too slow → maintenance page.
let SITE_ST = null;   // public settings (value-style price, payment details…)
function esc(t){ return String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
async function siteCheck(page, quiet){
  if (!sb) return true;
  const slow = new Promise(r=>setTimeout(()=>r({slow:true}), 10000));
  let res;
  try{ res = await Promise.race([sb.from("settings").select("*").eq("id",1).maybeSingle(), slow]); }
  catch(e){ res = {error:e, status:0}; }
  const down = res.slow || (res.error && ((res.status||0)===0 || res.status>=500 || res.status===429 ||
               /Failed to fetch|NetworkError|Load failed|fetch failed|timed? ?out/i.test(String(res.error.message||res.error))));
  if (down){ if (!quiet) showMaintenance("down"); return false; }
  const st = res.data || {};
  SITE_ST = st;
  if (page!=="admin" && document.querySelector(".sponsor-banner")) setTimeout(startBannerRotation,0);   // house-sponsor choice arrives with the settings
  try{ localStorage.setItem("he_intro_muted", st.intro_muted?"1":"0"); }catch(e){}
  if (window.__introMuted) window.__introMuted(!!st.intro_muted);
  document.querySelectorAll(".supportwrap").forEach(e=>e.hidden=!st.pay_enabled);   // payments stay hidden until the admin switches them on
  document.querySelectorAll("footer .socials").forEach(e=>{ e.innerHTML="";
    [[st.social_fb,/^https:\/\/(www\.|m\.)?(facebook|fb)\.com\//,"Facebook"],[st.social_ig,/^https:\/\/(www\.)?instagram\.com\//,"Instagram"]].forEach(([u,re,n])=>{
      if (u && re.test(u)){ const a=document.createElement("a"); a.href=u; a.target="_blank"; a.rel="noopener"; a.textContent=n; e.appendChild(a); } });
    e.hidden=!e.childElementCount; });
  // The Boutique (ladies section) shows only when the admin switches it on
  document.querySelectorAll("[data-boutique]").forEach(e=>e.hidden=!st.boutique_on);
  if (window.FIXED_GROUP==="bag" && !st.boutique_on && !/[?&]preview=1/.test(location.search)){
    const s=document.getElementById("boutiqueSoon"); if (s){ s.hidden=false; [...document.querySelectorAll("main > *")].forEach(e=>{ if(e!==s && !e.classList.contains("ladyhero")) e.hidden=true; }); }
    return false; }
  // the admin moved the site to a new address: every page forwards there (the admin page stays here so it can be undone)
  if (st.redirect_url && page!=="admin" && /^https:\/\//.test(st.redirect_url)){
    const to = st.redirect_url.replace(/\/+$/,"") + location.pathname + location.search + location.hash;
    if (!to.startsWith(location.origin)){ location.replace(to); return false; } }
  if (st.maintenance && page!=="admin"){ if (!quiet) showMaintenance("manual", st.maintenance_msg); return false; }
  return true;
}

/* ===================== Saving / sharing files on a phone ===================== */
function isTouchDevice(){ const ua=navigator.userAgent||"";
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints>1); }
async function saveFile(filename, blob, fallbackImgUrl){
  const type = /\.pdf$/i.test(filename) ? "application/pdf" : /\.json$/i.test(filename) ? "application/json" : "image/jpeg";
  try{
    const file = new File([blob], filename, {type});
    // phones/tablets: the share sheet (save to Photos, send on WhatsApp); computers: a normal download
    if (isTouchDevice() && navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:filename}); return; }
  }catch(e){ if (e && e.name==="AbortError") return; }
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 30000);
}
function toast(t){ const el = document.querySelector("#msg") || document.querySelector("#listMsg"); if (el) showMsg(t,"info",el); }

/* ===================== View counters ===================== */
function countPage(page){
  if (!sb) return;
  try{ const k="he_pv_"+page+"_"+new Date().toDateString(); if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k,"1"); }catch(e){}
  sb.rpc("count_view",{p_page:page, p_ids:[]}).then(()=>{},()=>{});
}
let viewQueue = [], viewTimer = null;
function queueView(id){
  if (!sb || !id) return;
  try{ const k="he_lv_"+id; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k,"1"); }catch(e){}
  viewQueue.push(id);
  clearTimeout(viewTimer);
  viewTimer = setTimeout(()=>{ const ids=viewQueue.splice(0,60); if (ids.length) sb.rpc("count_view",{p_page:null, p_ids:ids}).then(()=>{},()=>{}); }, 2000);
}
const viewObserver = ("IntersectionObserver" in window) ? new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const el=e.target;
    if (e.isIntersecting){ el._vt = setTimeout(()=>{ queueView(el.dataset.lid); viewObserver.unobserve(el); }, 1000); }
    else clearTimeout(el._vt);
  });
},{threshold:0.5}) : null;
function fmtViews(n){ n=Number(n)||0; return n>=1000 ? (n/1000).toFixed(n>=10000?0:1)+"k" : String(n); }


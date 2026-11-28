if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.documentElement.innerHTML = ""; } }
/* High End Communities — shared code. Settings live in config.js */
/* ===== Settings you can adjust ===== */
const MARKET_NAME = "High End Communities";
const DISCLAIMER = "High End Communities only lists items and is not responsible for any product promoted. Buyers must do their own due diligence and check ownership papers with a lawyer.";
const PHOTO_MAX_EDGE = 480;      // longest side in pixels (very low resolution)
const PHOTO_MAX_BYTES = 35000;   // target size per photo (~35 KB)
const MAX_PHOTOS = 4;
const SMALL_TYPES = ["gear","acc","carpart","boatpart","equinepart","dunepart"];   // small items & spare parts: 2 photos, up to 20 per seller
const BULK_TYPES = ["watch", "bag", ...SMALL_TYPES];                          // up to 20 listings per seller
function maxPhotos(t){ return SMALL_TYPES.includes(t || type) ? 3 : MAX_PHOTOS; }
function photoRuleText(){ return SMALL_TYPES.includes(type)
  ? "Choose your best 3 photos, then tap the best one to make it the main photo. Only 3 go online — any extra photos are dropped from the listing (they stay only in your HD flyer)."
  : "Choose your best 4 photos, then tap the best one to make it the main photo. Only 4 go online — any extra photos are dropped from the listing (they stay only in your HD flyer)."; }
const BIKE_RANGE = [100000, 2000000];
const GEAR_RANGES = {            // EGP
  "Helmet":[1500,80000], "Jacket":[2000,60000], "Gloves":[500,20000], "Boots":[2000,40000],
  "Pants":[1500,40000], "Body armor / back protector":[1500,40000], "Intercom":[2000,40000], "Other gear":[500,80000]
};
const ACC_RANGES = {
  "Exhaust":[5000,100000], "Tyres":[1500,80000], "LED lights":[1000,60000], "Crash bars / frame sliders":[1500,40000],
  "Luggage / top box / panniers":[3000,80000], "Seat":[2000,50000], "Windscreen":[1500,30000],
  "Mirrors":[500,15000], "Phone holder / mount":[300,8000], "Grips / levers / tank pad":[300,15000],
  "Cleaning & care products":[100,20000], "Oils & lubricants":[200,30000], "Filters":[100,20000],
  "Other accessory":[500,100000]
};
const WATCH_RANGE = [4000, 2000000];
const CAR_RANGE = [300000, 50000000];
const HORSE_RANGE = [20000, 20000000];
const DUNE_RANGES = { "Dune buggy / UTV":[150000,15000000], "ATV / quad":[50000,3000000], "Sand / dirt bike":[50000,3000000], "Sand rail":[200000,10000000], "Other":[30000,15000000] };
const DUNEPART_RANGES = { "Helmet & goggles":[500,80000], "Riding gear":[300,80000], "Sand tires & wheels":[1000,200000], "Whip flag & lights":[200,50000], "Recovery gear":[300,100000], "GPS & radio":[500,150000], "Parts":[100,500000], "Other":[100,500000] };
const EQUINE_RANGES = { "Saddle":[2000,500000], "Bridle & tack":[300,100000], "Rugs & blankets":[300,50000], "Grooming":[100,30000],
  "Riding wear & helmets":[300,100000], "Stable & yard equipment":[500,500000], "Horse trailer / box":[30000,3000000], "Other":[100,500000] };
const CARPART_RANGES = { "Wheels & tyres":[1000,500000], "Body parts":[500,300000], "Engine & mechanical":[500,1000000], "Lights":[300,150000],
  "Interior":[300,300000], "Electronics & audio":[300,200000], "Performance parts":[1000,1000000], "Accessories":[100,200000], "Oils, filters & care":[100,30000], "Other":[100,1000000] };
const BAG_RANGES = { "Handbag":[5000,5000000], "Shoulder bag":[5000,3000000], "Tote":[5000,2000000], "Clutch & evening bag":[3000,2000000],
  "Backpack":[3000,1000000], "Wallet & card holder":[1500,300000], "Belt":[1500,200000], "Scarf & shawl":[1000,150000],
  "Sunglasses":[1500,150000], "Jewelry":[2000,10000000], "Other":[1000,2000000] };
const BOATPART_RANGES = { "Engine & outboard":[5000,5000000], "Electronics & navigation":[1000,1000000], "Safety equipment":[200,200000],
  "Deck hardware":[200,500000], "Water sports gear":[500,500000], "Covers & upholstery":[500,300000], "Trailer":[10000,1500000], "Other":[200,5000000] };
let USD_TO_EGP = (typeof USD_RATE !== "undefined" && USD_RATE > 0) ? USD_RATE : 52;   // used only to check USD prices against the EGP ranges
/* ---- marketplaces (countries) ---- */
const MARKETS = [
  {id:"EG", name:"Egypt", cur:["EGP","USD"], dial:["20"], local:"01xxxxxxxxx", tz:["Africa/Cairo"], cc:["EG"]},
  {id:"SA", name:"Saudi Arabia", cur:["SAR","USD"], dial:["966"], local:"05xxxxxxxx", tz:["Asia/Riyadh"], cc:["SA"]},
  {id:"AE", name:"UAE", cur:["AED","USD"], dial:["971"], local:"05xxxxxxxx", tz:["Asia/Dubai"], cc:["AE"]},
  {id:"QA", name:"Qatar", cur:["QAR","USD"], dial:["974"], local:"3xxxxxxx", tz:["Asia/Qatar"], cc:["QA"]},
  {id:"BH", name:"Bahrain", cur:["BHD","USD"], dial:["973"], local:"3xxxxxxx", tz:["Asia/Bahrain"], cc:["BH"]},
  {id:"MA", name:"Morocco", cur:["MAD","EUR","USD"], dial:["212"], local:"06xxxxxxxx", tz:["Africa/Casablanca","Africa/El_Aaiun"], cc:["MA"]},
  {id:"DZ", name:"Algeria", cur:["DZD","EUR","USD"], dial:["213"], local:"05xxxxxxxx", tz:["Africa/Algiers"], cc:["DZ"]},
  {id:"TN", name:"Tunisia", cur:["TND","EUR","USD"], dial:["216"], local:"xx xxx xxx", tz:["Africa/Tunis"], cc:["TN"]},
  {id:"LY", name:"Libya", cur:["LYD","USD"], dial:["218"], local:"09x xxx xxxx", tz:["Africa/Tripoli"], cc:["LY"]},
  {id:"TR", name:"Turkey", cur:["TRY","USD","EUR"], dial:["90"], local:"05xx xxx xx xx", tz:["Europe/Istanbul"], cc:["TR"]}
];
const MARKET_BY_ID = Object.fromEntries(MARKETS.map(m=>[m.id,m]));
// how many of each currency one US dollar buys (only used to check price ranges and show "≈" prices)
const PER_USD = Object.assign({USD:1, EGP:USD_TO_EGP, SAR:3.75, AED:3.6725, QAR:3.64, BHD:0.376, EUR:0.87, TRY:50, MAD:9.3, TND:2.95, DZD:134, LYD:4.9},
  (typeof RATES_PER_USD!=="undefined" && RATES_PER_USD) || {});
/* Daily exchange rates (free feed, refreshed once a day, cached on the device).
   FX_DAY is set only when today's or yesterday's rates loaded; printed flyers/PDFs show "≈" prices only then. */
let FX_DAY = null;
function fxApply(o){ if (!o || !o.rates || !(o.rates.EGP>0)) return false;
  Object.keys(PER_USD).forEach(k=>{ if (o.rates[k]>0) PER_USD[k]=o.rates[k]; }); USD_TO_EGP=o.rates.EGP; PER_USD.EGP=o.rates.EGP;
  FX_DAY=o.day; return true; }
const FX_READY = (async()=>{
  const today=new Date().toISOString().slice(0,10), fresh=d=>d && (Date.parse(today)-Date.parse(d))<=2*864e5;
  let c=null; try{ c=JSON.parse(localStorage.getItem("he_fx")||"null"); }catch(e){}
  if (c && c.day===today) return fxApply(c);
  try{
    const r=await fetch("https://open.er-api.com/v6/latest/USD",{cache:"no-store"}); const j=await r.json();
    if (j && j.result==="success" && j.rates){ const day=new Date((j.time_last_update_unix||Date.now()/1000)*1000).toISOString().slice(0,10);
      const o={day, rates:j.rates}; try{ localStorage.setItem("he_fx", JSON.stringify({...o, day:today, src:day})); }catch(e){}
      return fxApply({...o, day:today}); }
  }catch(e){}
  if (c && fresh(c.day)) return fxApply(c);
  return false;
})();
function fxNote(){ if (!FX_DAY) return ""; const d=new Date(FX_DAY+"T12:00:00Z"); return " · rate "+d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function toEGP(n, cur){ return Number(n||0) / (PER_USD[cur]||1) * USD_TO_EGP; }
function fromEGP(n, cur){ return Number(n||0) / USD_TO_EGP * (PER_USD[cur]||1); }
function marketOf(L){ const c = L && L.f && (L.f.country==="NA" ? "MA" : L.f.country); return MARKET_BY_ID[c] ? c : "EG"; }   // old "NA" listings → Morocco
function marketName(id){ return (MARKET_BY_ID[id]||MARKET_BY_ID.EG).name; }
function getMarket(){ try{ const m=localStorage.getItem("he_market"); if (MARKET_BY_ID[m]) return m; }catch(e){} return guessMarket(); }
function guessMarket(){ try{ const tz=Intl.DateTimeFormat().resolvedOptions().timeZone; const m=MARKETS.find(x=>x.tz.includes(tz)); if (m) return m.id; }catch(e){} return "EG"; }
function setMarket(id, chosen){ try{ localStorage.setItem("he_market", id); if (chosen) localStorage.setItem("he_market_chosen","1"); }catch(e){} }
// one quiet look-up of the visitor's country from their IP (first visit only, never overrides a choice)
async function detectMarketByIP(){
  try{ if (localStorage.getItem("he_market_chosen") || localStorage.getItem("he_market_ip")) return null; }catch(e){}
  try{
    const ctl = new AbortController(); setTimeout(()=>ctl.abort(), 3500);
    const r = await fetch("https://get.geojs.io/v1/ip/country.json", {signal:ctl.signal, referrerPolicy:"no-referrer"});
    const j = await r.json(); const cc = String(j.country||"").toUpperCase();
    const m = MARKETS.find(x=>x.cc.includes(cc));
    try{ localStorage.setItem("he_market_ip", cc||"?"); }catch(e){}
    if (m){ setMarket(m.id, false); return m.id; }
  }catch(e){}
  return null;
}
function formMarket(){ const s=document.getElementById("f_market"); return (s && MARKET_BY_ID[s.value]) ? s.value : getMarket(); }
function initMarketPicker(){
  const s=document.getElementById("f_market"); if (!s) return;
  MARKETS.forEach(m=>{ const o=document.createElement("option"); o.value=m.id; o.textContent=m.name; s.appendChild(o); });
  s.value=getMarket();
  s.onchange=()=>{ setMarket(s.value,true); renderFields(); };
  detectMarketByIP().then(id=>{ if (id && !s.dataset.touched){ s.value=id; renderFields(); } });
  s.addEventListener("change",()=>s.dataset.touched="1");
}
// any supported number: tries the preferred country first, then Egypt, then the rest
function anyPhone(v, prefer){
  const order=[prefer||"EG","EG"].concat(MARKETS.map(m=>m.id));
  for (const id of order){ const p=normPhone(v,id); if (p) return p; }
  return null;
}
const PHONE_HELP = "Enter your WhatsApp number: Egypt 01xxxxxxxxx, or with the country code (+966, +971, +973, +90, +212, +213, +216, +218).";
/* ---- inspection partners: workshops check vehicles, experts authenticate luxury items ---- */
const INSPECT = {moto:"workshop", car:"workshop", boat:"workshop", watch:"expert", bag:"expert", art:"expert", equine:"expert", estate:"expert"};
const INSPECT_TYPES = ["bike","car","boat","watch","bag","art","equine","estate"];   // whole items, not parts or gear
const INSPECT_GROUPS = [["moto","Motorcycles"],["car","Cars"],["watch","Watches"],["bag","The Boutique"],["art","Modern & art"],["boat","Marine"],["equine","Equine"],["estate","Real estate"]];
let EXPERTS = null;
async function loadExperts(force){
  if (EXPERTS && !force) return EXPERTS;
  if (!sb) return (EXPERTS = []);
  const {data, error} = await sb.from("experts").select("id,kind,groups,market,city,name,phone,note,sort,active").order("sort").order("name");
  return (EXPERTS = error ? [] : (data||[]));
}
function checkSlotText(L){ return [L.checkWhen,L.checkWhere].filter(Boolean).join(" · "); }
function checkSlotEl(L){
  const t=checkSlotText(L); if (!t) return null;
  const d=document.createElement("div"); d.className="checkslot";
  const a=document.createElement("span"); a.textContent="See it & check"; const b=document.createElement("b"); b.setAttribute("data-noi18n",""); b.setAttribute("dir","auto"); b.textContent=t;
  d.append(a,b); return d;
}
function inspectLabel(L){ return INSPECT[GROUP[L.type]]==="workshop" ? "Inspect before you buy" : "Authenticate before you buy"; }
async function openInspect(item){
  const L=item.L, g=GROUP[L.type], kind=INSPECT[g]||"expert", mk=marketOf(L), ar = window.HE_LANG==="ar";
  const list = (await loadExperts()).filter(e=>e.active!==false && e.kind===kind && (e.groups||[]).includes(g) && e.market===mk);
  const title = titleOf(L), link = linkFor(item.id);
  const msg = ar ? `مرحبًا، أريد ${kind==="workshop"?"فحصًا فنيًا":"التأكد من أصالة"} "${title}" المعروض على ${MARKET_NAME}: ${link}`
                 : `Hello, I'd like ${kind==="workshop"?"a pre-purchase inspection of":"you to authenticate"} "${title}" listed on ${MARKET_NAME}: ${link}`;
  const slot = checkSlotText(L); const msgS = slot ? msg + (ar ? `\nالمعاينة: ${slot}` : `\nIt can be seen: ${slot}`) : msg;
  const ov=document.createElement("div"); ov.className="modal inspect-modal";
  const c=document.createElement("div"); c.className="card";
  const h=document.createElement("h3"); h.textContent = kind==="workshop" ? "Technical inspection" : "Expert authentication";
  const p=document.createElement("p"); p.className="inspect-intro";
  p.textContent = kind==="workshop"
    ? "Before you pay, have it checked by an independent workshop: engine, chassis and engine numbers, accident history and papers."
    : "Before you pay, have an independent expert confirm it is authentic and in the condition described.";
  c.append(h,p); const se=checkSlotEl(L); if (se) c.appendChild(se);
  const box=document.createElement("div"); box.className="inspect-list";
  if (list.length){
    list.forEach(e=>{
      const r=document.createElement("div"); r.className="inspect-row";
      const x=document.createElement("div"); x.className="x";
      const b=document.createElement("b"); b.textContent=e.name; b.setAttribute("data-noi18n","");
      const sp=document.createElement("span"); sp.setAttribute("data-noi18n",""); sp.textContent=[e.city,e.note].filter(Boolean).join(" · ");
      x.append(b,sp);
      const wa=document.createElement("a"); wa.className="btn primary small"; wa.target="_blank"; wa.rel="noopener"; wa.href="https://wa.me/"+waNum(e.phone)+"?text="+encodeURIComponent(msgS); wa.textContent="WhatsApp";
      const tel=document.createElement("a"); tel.className="btn ghost small"; tel.href="tel:+"+waNum(e.phone); tel.textContent="Call";
      r.append(x,wa,tel); box.appendChild(r);
    });
  } else {
    const e=document.createElement("p"); e.className="muted"; e.textContent=`No partner listed in ${marketName(mk)} yet. Ask High End and we'll suggest one.`;
    const a=document.createElement("a"); a.className="btn primary small"; a.target="_blank"; a.rel="noopener"; a.href=adminHref(msgS); a.textContent="Ask High End on WhatsApp";
    box.append(e,a);
  }
  const note=document.createElement("p"); note.className="hint";
  note.textContent="Partners are independent. High End Communities suggests them but doesn't guarantee their work. Agree the fee with them directly.";
  const cl=document.createElement("button"); cl.type="button"; cl.className="btn ghost small"; cl.textContent="Close"; cl.onclick=()=>ov.remove();
  c.append(box,note,cl); ov.appendChild(c);
  ov.onclick=ev=>{ if (ev.target===ov) ov.remove(); };
  document.body.appendChild(ov);
}
function waNum(p){ p=String(p||"").replace(/\D/g,""); return /^01[0125]\d{8}$/.test(p) ? "2"+p : p; }
function normPhone(v, mk){
  const m = MARKET_BY_ID[mk]||MARKET_BY_ID.EG; let d = String(v||"").replace(/[^\d+]/g,"");
  const eg = d.replace(/^(\+|00)?20(?=1)/,"0");
  if (/^01[0125]\d{8}$/.test(eg)) return eg;          // an Egyptian number is accepted in every marketplace
  if (m.id==="EG") return null;
  d = d.replace(/^\+/,"").replace(/^00/,"");
  if (!m.dial.some(c=>d.startsWith(c))){ if (m.dial.length>1) return null; d = m.dial[0] + d.replace(/^0/,""); }
  return /^\d{10,13}$/.test(d) ? d : null;
}
const BOAT_RANGES = { "Yacht":[1000000,300000000], "Speedboat":[300000,30000000], "Sailboat":[300000,50000000],
  "Jet ski":[150000,3000000], "Fishing boat":[100000,20000000], "Other":[50000,300000000] };
const ESTATE_RANGES = { "Apartment":[500000,200000000], "Villa":[2000000,1000000000], "Townhouse / twin house":[1500000,500000000],
  "Chalet":[500000,200000000], "Penthouse / duplex":[1000000,500000000], "Land":[200000,2000000000],
  "Commercial / office":[500000,1000000000], "Other":[100000,2000000000] };
const ART_RANGES = { "Painting":[1000,50000000], "Sculpture":[2000,50000000], "Photography":[1000,5000000],
  "Print":[500,2000000], "Furniture & design":[2000,20000000], "Collectible":[500,20000000], "Other":[500,50000000] };
/* =================================== */
const MASAR_IMG = "/assets/sponsor-masar.jpg";

const thisYear = new Date().getFullYear();
// tyre production date by half-year: three years ahead (stock produced / arriving later) back to six years ago
function tyreHalves(){ const y=new Date().getFullYear(), o=[""]; for (let i=y+3;i>=y-6;i--){ o.push({group:String(i)+(i===y?" (this year)":i>y?" (upcoming)":""), items:["2nd half "+i, "1st half "+i]}); } return o; }
// a schema with the current category's swaps applied (alt) and category-only fields (only) kept or dropped
function schemaFor(type, cat){
  return (SCHEMAS[type]||[]).filter(f=>!f.only || f.only===cat).map(f=>(f.alt && f.alt[cat]) ? {...f, ...f.alt[cat]} : f);
}
function countLabel(c){ const l=window.HE_LANG; return l==="ar" ? `${c} إعلان` : l==="fr" ? `${c} annonce${c>1?"s":""}` : `${c} listing${c===1?"":"s"}`; }
function curCat(){ const c=document.getElementById("f_category"); return c ? c.value : ""; }
const SCHEMAS = {
  bike: [
    {k:"model", l:"Model name", req:1, ph:"e.g. Street Glide Special"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Harley-Davidson"},
    {k:"year", l:"Model year", req:1, type:"number", min:1960, max:thisYear+1, ph:String(thisYear-3)},
    {k:"engine", l:"Engine size", req:1, type:"number", min:50, max:3000, ph:"e.g. 1868 or 114", units:["cc","ci"], unitRange:{cc:[50,3000], ci:[3,200]}},
    {k:"mileage", l:"Mileage", req:1, type:"number", min:0, max:500000, ph:"e.g. 12000", units:["km","mi"], unitRange:{km:[0,500000], mi:[0,310000]}},
    {k:"paint", l:"Original paint", type:"select", opts:["Yes","No"], def:"Yes"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"addons", l:"Add-ons", type:"textarea", full:1, ph:"Exhaust, crash bars, luggage…"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  gear: [
    {k:"category", l:"Item type", req:1, type:"select", opts:Object.keys(GEAR_RANGES), def:"Helmet"},
    {k:"name", l:"Item name", req:1, ph:"e.g. RF-1400"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Shoei"},
    {k:"size", l:"Size", req:1, type:"select", opts:["XS","S","M","L","XL","XXL","3XL","One size"], def:"M"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"color", l:"Color", req:1, ph:"e.g. Matte black"},
    {k:"certs", l:"Certifications", type:"checks", opts:["DOT","ECE","SNELL","None"], full:1},
    {k:"prodDate", l:"Production date", type:"month", hint:"Check the label inside the helmet"},
    {k:"buyDate", l:"Date of purchase", type:"month"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  acc: [
    {k:"category", l:"Accessory type", req:1, type:"select", opts:Object.keys(ACC_RANGES), def:"Exhaust"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Akrapovič", alt:{Tyres:{ph:"e.g. Michelin, Pirelli, Metzeler"}}},
    {k:"name", l:"Item name", req:1, ph:"e.g. Slip-on muffler", alt:{Tyres:{l:"Type", ph:"e.g. Road 6"}}},
    {k:"tyre_size", l:"Size", req:1, only:"Tyres", ph:"e.g. 190/60 ZR17"},
    {k:"load_index", l:"Load rating", only:"Tyres", type:"number", min:20, max:130, ph:"e.g. 75"},
    {k:"speed_rating", l:"Speed rating", only:"Tyres", type:"select", opts:["","H","V","W","(W)","Y","Z / ZR","T","S","R","Q","P","M","L","J"], def:"", hint:"The letter after the load rating, e.g. 75W → W"},
    {k:"tyre_made", l:"Production year", only:"Tyres", type:"select", opts:tyreHalves(), def:"", hint:"From the DOT date on the sidewall"},
    {k:"compat", l:"Compatible with", req:1, ph:"e.g. BMW R1250GS 2019–2023", alt:{Tyres:{req:0, ph:"e.g. rear, 17-inch sport-touring bikes"}}},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"color", l:"Color", ph:"e.g. Titanium"},
    {k:"packaging", l:"Original packaging", type:"select", opts:["Yes","No"], def:"No"},
    {k:"stock", l:"Quantity in stock", type:"number", min:1, max:9999, ph:"leave empty if you have 1", hint:"For oils, filters, parts you have several of"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  watch: [
    {k:"model", l:"Model", req:1, ph:"e.g. Submariner Date"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Rolex"},
    {k:"ref", l:"Reference number", ph:"e.g. 126610LN"},
    {k:"year", l:"Year", type:"number", min:1900, max:thisYear+1, ph:String(thisYear-2)},
    {k:"size", l:"Case size (mm)", type:"number", min:15, max:65, ph:"e.g. 41"},
    {k:"movement", l:"Movement", type:"select", opts:["Automatic","Manual winding","Quartz","Smart"], def:"Automatic"},
    {k:"material", l:"Case material", ph:"e.g. Steel, gold, titanium"},
    {k:"papers", l:"Box & papers", type:"select", opts:["Full set","Box only","Papers only","None"], def:"Full set"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  car: [
    {k:"model", l:"Model", req:1, ph:"e.g. 911 Carrera S"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Porsche"},
    {k:"year", l:"Model year", req:1, type:"number", min:1920, max:thisYear+1, ph:String(thisYear-3)},
    {k:"engine", l:"Engine size (cc)", type:"number", min:500, max:9000, ph:"e.g. 2981"},
    {k:"mileage", l:"Mileage (km)", req:1, type:"number", min:0, max:1000000, ph:"e.g. 35000"},
    {k:"gearbox", l:"Transmission", type:"select", opts:["Automatic","Manual"], def:"Automatic"},
    {k:"fuel", l:"Fuel", type:"select", opts:["Petrol","Diesel","Hybrid","Electric"], def:"Petrol"},
    {k:"drive", l:"Drive", type:"select", opts:["2WD","4x4 / AWD"], def:"2WD"},
    {k:"color", l:"Color", ph:"e.g. GT Silver"},
    {k:"paint", l:"Original paint", type:"select", opts:["Yes","No"], def:"Yes"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"addons", l:"Options & extras", type:"textarea", full:1, ph:"Sport Chrono, ceramic brakes, service history…"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  equine: [
    {k:"name", l:"Horse name", req:1, ph:"e.g. Desert Star"},
    {k:"breed", l:"Breed", req:1, ph:"e.g. Arabian"},
    {k:"gender", l:"Gender", type:"select", opts:["Mare","Stallion","Gelding","Filly","Colt"], def:"Mare"},
    {k:"age", l:"Age (years)", type:"number", min:0, max:40, ph:"e.g. 7"},
    {k:"height", l:"Height (cm)", type:"number", min:70, max:210, ph:"e.g. 152"},
    {k:"color", l:"Color", ph:"e.g. Grey"},
    {k:"discipline", l:"Discipline", type:"select", opts:["Show","Endurance","Racing","Show jumping","Dressage","Leisure","Breeding","—"], def:"Show"},
    {k:"papers", l:"Pedigree / registration papers", type:"select", opts:["Yes","No"], def:"Yes"},
    {k:"vet", l:"Vet check available", type:"select", opts:["Yes","No"], def:"Yes"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  boat: [
    {k:"category", l:"Type", req:1, type:"select", opts:Object.keys(BOAT_RANGES), def:"Yacht"},
    {k:"model", l:"Model", req:1, ph:"e.g. Azimut 55"},
    {k:"brand", l:"Builder / brand", req:1, ph:"e.g. Azimut"},
    {k:"year", l:"Year built", req:1, type:"number", min:1950, max:thisYear+1, ph:String(thisYear-5)},
    {k:"length", l:"Length (ft)", req:1, type:"number", min:5, max:400, ph:"e.g. 55"},
    {k:"engines", l:"Engine(s)", ph:"e.g. 2 x Volvo IPS 800"},
    {k:"hours", l:"Engine hours", type:"number", min:0, max:100000, ph:"e.g. 600"},
    {k:"location", l:"Location / marina", ph:"e.g. Marina El Gouna"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  art: [
    {k:"category", l:"Type", req:1, type:"select", opts:Object.keys(ART_RANGES), def:"Painting"},
    {k:"name", l:"Title / item name", req:1, ph:"e.g. Nile at Dusk"},
    {k:"artist", l:"Artist / designer", req:1, ph:"e.g. Artist's name"},
    {k:"year", l:"Year", ph:"e.g. 1998 or c. 1960s"},
    {k:"dims", l:"Dimensions", ph:"e.g. 120 x 80 cm"},
    {k:"medium", l:"Medium / material", ph:"e.g. Oil on canvas, bronze"},
    {k:"signed", l:"Signed", type:"select", opts:["Yes","No"], def:"Yes"},
    {k:"coa", l:"Certificate of authenticity", type:"select", opts:["Yes","No"], def:"No"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"state", l:"State", type:"select", opts:["Excellent","Good","Fair","Needs restoration"], def:"Excellent"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  estate: [
    {k:"deal", l:"For sale or rent", req:1, type:"select", opts:["For sale","For rent"], def:"For sale"},
    {k:"category", l:"Property type", req:1, type:"select", opts:Object.keys(ESTATE_RANGES), def:"Apartment"},
    {k:"name", l:"Compound / project", req:1, ph:"e.g. compound or building name"},
    {k:"location", l:"City / area", req:1, ph:"e.g. New Cairo, 5th Settlement"},
    {k:"area", l:"Area (m²)", req:1, type:"number", min:20, max:1000000, ph:"e.g. 180"},
    {k:"bedrooms", l:"Bedrooms", type:"number", min:0, max:30, ph:"e.g. 3"},
    {k:"bathrooms", l:"Bathrooms", type:"number", min:0, max:30, ph:"e.g. 2"},
    {k:"floor", l:"Floor", ph:"e.g. 3rd, ground with garden"},
    {k:"finishing", l:"Finishing", type:"select", opts:["Fully finished","Furnished","Semi-finished","Core & shell"], def:"Fully finished"},
    {k:"delivery", l:"Delivery", type:"select", opts:["Ready to move","Under construction"], def:"Ready to move"},
    {k:"payment", l:"Payment", type:"select", opts:["Cash","Installments","Cash or installments"], def:"Cash"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used", hint:"New = first sale from the developer · Used = resale"},
    {k:"rent_period", l:"Rent is per", type:"select", opts:["Month","Year","Day"], def:"Month", hint:"Only for rent"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  carpart: [
    {k:"category", l:"Part type", req:1, type:"select", opts:Object.keys(CARPART_RANGES), def:"Wheels & tyres"},
    {k:"name", l:"Item name", req:1, ph:"e.g. 20-inch alloy wheels"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. BBS, Bosch, original"},
    {k:"compat", l:"Compatible with", req:1, ph:"e.g. Mercedes G-Class 2019–2024"},
    {k:"oem", l:"Original or aftermarket", type:"select", opts:["Original (OEM)","Aftermarket"], def:"Original (OEM)"},
    {k:"stock", l:"Quantity in stock", type:"number", min:1, max:9999, ph:"leave empty if you have 1", hint:"For oils, filters, parts you have several of"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  boatpart: [
    {k:"category", l:"Part type", req:1, type:"select", opts:Object.keys(BOATPART_RANGES), def:"Engine & outboard"},
    {k:"name", l:"Item name", req:1, ph:"e.g. 150 HP outboard engine"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Yamaha, Garmin"},
    {k:"compat", l:"Fits / compatible with", ph:"e.g. boats 18–24 ft"},
    {k:"hours", l:"Engine hours", type:"number", min:0, max:100000, ph:"if it's an engine"},
    {k:"stock", l:"Quantity in stock", type:"number", min:1, max:9999, ph:"leave empty if you have 1", hint:"For oils, filters, parts you have several of"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  bag: [
    {k:"category", l:"Item type", req:1, type:"select", opts:Object.keys(BAG_RANGES), def:"Handbag"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Hermès, Chanel, Louis Vuitton", list:"BAG_BRANDS"},
    {k:"model", l:"Model", req:1, ph:"e.g. Birkin 30, Classic Flap, Neverfull MM"},
    {k:"color", l:"Color", ph:"e.g. Black, Gold hardware"},
    {k:"material", l:"Material", ph:"e.g. Togo leather, Caviar, Canvas"},
    {k:"size", l:"Size", ph:"e.g. 30 cm, Medium"},
    {k:"year", l:"Year", type:"number", min:1950, max:thisYear+1, ph:"e.g. 2022"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"set", l:"Box, dust bag & papers", type:"select", opts:["Full set","Dust bag only","Box only","None"], def:"Full set"},
    {k:"receipt", l:"Receipt / certificate", type:"select", opts:["Yes","No"], def:"No"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  dune: [
    {k:"category", l:"Type", req:1, type:"select", opts:Object.keys(DUNE_RANGES), def:"Dune buggy / UTV"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Polaris, Can-Am, Yamaha, Honda, KTM, CFMoto, Segway"},
    {k:"model", l:"Model", req:1, ph:"e.g. RZR Pro R, Maverick X3, YFZ450R"},
    {k:"year", l:"Model year", type:"number", min:1980, max:thisYear+1, ph:"e.g. 2022"},
    {k:"cc", l:"Engine (cc)", type:"number", min:50, max:3000, ph:"e.g. 999"},
    {k:"hours", l:"Engine hours", type:"number", min:0, max:100000, ph:"e.g. 120"},
    {k:"seats", l:"Seats", type:"select", opts:["1","2","4","6"], def:"2"},
    {k:"papers", l:"Licence / papers", type:"select", opts:["Licensed","Customs cleared, not licensed","No papers"], def:"Licensed"},
    {k:"addons", l:"Add-ons", ph:"e.g. roof, winch, sand tires, LED bar, GPS"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  dunepart: [
    {k:"category", l:"Item type", req:1, type:"select", opts:Object.keys(DUNEPART_RANGES), def:"Helmet & goggles"},
    {k:"name", l:"Item name", req:1, ph:"e.g. Paddle sand tires 30x11-14"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Fox, Maxxis, Sandcraft"},
    {k:"compat", l:"Fits / compatible with", ph:"e.g. Polaris RZR, Can-Am X3"},
    {k:"size", l:"Size", ph:"e.g. L, 30x11-14"},
    {k:"stock", l:"Quantity in stock", type:"number", min:1, max:9999, ph:"leave empty if you have 1", hint:"For oils, filters, parts you have several of"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ],
  equinepart: [
    {k:"category", l:"Item type", req:1, type:"select", opts:Object.keys(EQUINE_RANGES), def:"Saddle"},
    {k:"name", l:"Item name", req:1, ph:"e.g. Dressage saddle 17.5\""},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Stübben, Kentucky"},
    {k:"size", l:"Size", ph:"e.g. 17.5\", Full, M"},
    {k:"color", l:"Color", ph:"e.g. Brown"},
    {k:"stock", l:"Quantity in stock", type:"number", min:1, max:9999, ph:"leave empty if you have 1", hint:"For oils, filters, parts you have several of"},
    {k:"condition", l:"Condition", req:1, type:"select", opts:["New","Used"], def:"Used"},
    {k:"price", l:"Price", req:1, type:"price", units:["EGP","USD"]},
    {k:"phone", l:"Phone number", req:1, type:"phone"}
  ]
};
const LABELS = {bike:"Motorcycle", gear:"Safety gear", acc:"Moto accessory", watch:"Watch", car:"Car", carpart:"Car part / accessory", equine:"Horse", equinepart:"Equine accessory", boatpart:"Marine part / accessory", bag:"Boutique item", boat:"Marine", art:"Modern & art", estate:"Real estate", dune:"Buggy / ATV / sand bike", dunepart:"Desert gear & parts"};
const ICONS = {bag:"", bike:"", gear:"", acc:"", watch:"", car:"", carpart:"", equinepart:"", boatpart:"", equine:"", boat:"", art:"", estate:"", dune:"", dunepart:""};
const GROUP = {bag:"bag", bike:"moto", gear:"moto", acc:"moto", watch:"watch", car:"car", carpart:"car", equinepart:"equine", boatpart:"boat", equine:"equine", boat:"boat", art:"art", estate:"estate", dune:"desert", dunepart:"desert"};
const RANGES = {bag:BAG_RANGES, bike:BIKE_RANGE, gear:GEAR_RANGES, acc:ACC_RANGES, watch:WATCH_RANGE, car:CAR_RANGE, carpart:CARPART_RANGES, equine:HORSE_RANGE, equinepart:EQUINE_RANGES, boatpart:BOATPART_RANGES, boat:BOAT_RANGES, art:ART_RANGES, estate:ESTATE_RANGES, dune:DUNE_RANGES, dunepart:DUNEPART_RANGES};
const SUBTYPES = {
  moto:  [["bike","","Motorcycle"],["gear","","Safety gear"],["acc","","Accessory"]],
  car:   [["car","","Car"],["carpart","","Parts & accessories"]],
  boat:  [["boat","","Boats, yachts & jet skis"],["boatpart","","Parts & accessories"]],
  equine:[["equine","","Horse"],["equinepart","","Saddles, tack & accessories"]],
  desert:[["dune","","Buggies, ATVs & sand bikes"],["dunepart","","Gear & parts"]]
};
const SECTION_NAMES = {bike:"Motorcycles", gear:"Safety gear & helmets", acc:"Motorcycle accessories & parts", watch:"Watches",
  car:"Cars", carpart:"Car parts & accessories", boat:"Boats, yachts & jet skis", boatpart:"Marine parts & accessories",
  equine:"Horses", equinepart:"Equine accessories", art:"Modern & art", estate:"Real estate", bag:"The Boutique", "4x4":"4x4 & off-road", dune:"Buggies, ATVs & sand bikes", dunepart:"Desert gear & parts"};
// 4x4 is a view of the cars, not its own type: the seller's "Drive" answer, or 4x4 words in the ad
function is4x4(L){ const f=L.f||{}; if (L.type!=="car") return false;
  if (/4x4|awd/i.test(f.drive||"")) return true;
  return /\b(4x4|4wd|awd|off[- ]?road|g[- ]?class|g ?63|wrangler|defender|land cruiser|prado|patrol|hilux|raptor|bronco|4matic|xdrive|quattro)\b/i.test([f.model,f.brand,f.addons].join(" ")); }
const GROUP_NAMES = {moto:"High End Motorcycles Community", car:"High End Cars Community", boat:"High End Marine Community", equine:"EQUINE HAVEN Community",
  watch:"High End Watches", art:"Modern & art", estate:"Real estate", bag:"The Boutique", desert:"High End Dune Riders"};
const GROUP_ORDER=["moto","watch","car","boat","desert","equine","art","estate","bag"];
const TYPE_ORDER = GROUP_ORDER.flatMap(g => SUBTYPES[g] ? SUBTYPES[g].map(x=>x[0]) : Object.keys(GROUP).filter(t=>GROUP[t]===g));
function bySection(items){ return TYPE_ORDER.map(t=>[t, items.filter(x=>x.L.type===t)]).filter(([,xs])=>xs.length); }
/* ---------- announcements the admin posts to a category (or to everyone) ---------- */
let ANN = null;
async function loadAnnouncements(){
  if (ANN || !sb) return ANN||[]; ANN=[];
  try{ const {data}=await sb.from("announcements").select("id,grp,market,title,body,link,expires_at,created_at").eq("active",true).order("created_at",{ascending:false}).limit(40);
    const now=Date.now(); ANN=(data||[]).filter(r=>!r.expires_at || Date.parse(r.expires_at)>now); }catch(e){}
  return ANN;
}
function annFor(g, market){
  const a=(ANN||[]).filter(r=>r.grp===g && (!r.market || r.market===market)); if (!a.length) return null;
  const box=document.createElement("div"); box.className="annbox";
  a.slice(0,3).forEach(r=>{ const d=document.createElement("div"); d.className="ann";
    d.innerHTML=`<b>${esc(r.title)}</b>`+(r.body?`<p>${esc(r.body).replace(/\n/g,"<br>")}</p>`:"");
    if (r.link && /^https:\/\//.test(r.link)){ const l=document.createElement("a"); l.className="btn ghost small"; l.href=r.link; l.target="_blank"; l.rel="noopener"; l.textContent="Open"; d.appendChild(l); }
    box.appendChild(d); });
  return box;
}
let CAT_TITLE = "";        // set by the catalogue page to the section being shown
const CI_TO_CC = 16.387, KM_PER_MI = 1.609344;
// Best-selling and most popular motorcycles worldwide (suggestions only — sellers can still type anything)
const CAR_DB = {"Mercedes-Benz": ["A 200","C 180","C 200","C 300","E 180","E 200","E 300","S 450","S 500","S 580","CLA 200","GLA 200","GLB 200","GLC 200","GLC 300","GLC Coupé","GLE 450","GLE Coupé","GLS 580","G 500","G 63 AMG","AMG GT","EQS","Maybach S 580","Maybach GLS 600"],"BMW": ["118i","218i Gran Coupé","320i","330i","520i","530i","540i","730Li","740Li","760Li","X1","X2","X3","X4","X5","X6","X7","M2","M3","M4","M5","M8","XM","iX","i4","i7","Z4"],"Audi": ["A3","A4","A5","A6","A7","A8","Q2","Q3","Q5","Q7","Q8","RS3","RS6","RS Q8","e-tron GT","R8","TT"],"Porsche": ["911 Carrera","911 Carrera S","911 Turbo S","911 GT3","911 Targa","718 Boxster","718 Cayman","Cayenne","Cayenne Coupé","Macan","Panamera","Taycan"],"Land Rover": ["Range Rover","Range Rover Sport","Range Rover Velar","Range Rover Evoque","Defender 90","Defender 110","Defender 130","Discovery","Discovery Sport"],"Jaguar": ["XE","XF","XJ","F-Pace","E-Pace","F-Type"],"Volvo": ["S60","S90","XC40","XC60","XC90"],"Lexus": ["ES","IS","LS","NX","RX","GX","LX 600"],"Toyota": ["Corolla","Yaris","Belta","C-HR","Camry","RAV4","Rush","Fortuner","Hilux","Land Cruiser","Land Cruiser Prado","Supra"],"Hyundai": ["i10","Accent RB","Accent HCI","Verna","Elantra HD","Elantra AD","Elantra CN7","Bayon","Creta","Tucson","Santa Fe"],"Kia": ["Picanto","Pegas","Rio","Cerato","K5","Sonet","Seltos","Sportage","Sorento"],"Nissan": ["Sunny","Sentra","Juke","Qashqai","X-Trail","Patrol"],"Chevrolet": ["Lanos","Aveo","Optra","Cruze","Captiva","Tahoe","Camaro","Corvette"],"Mitsubishi": ["Attrage","Lancer","Eclipse Cross","Xpander","Outlander","Pajero"],"Skoda": ["Fabia","Scala","Octavia","Superb","Kamiq","Karoq","Kodiaq"],"Volkswagen": ["Polo","Golf","Golf GTI","Golf R","Passat","T-Roc","Tiguan","Touareg"],"Peugeot": ["301","308","408","508","2008","3008","5008"],"Renault": ["Logan","Sandero","Taliant","Megane","Duster","Kadjar","Austral"],"Fiat": ["128","Tipo","500","500X"],"Suzuki": ["Alto","S-Presso","Swift","Dzire","Ciaz","Ertiga","Vitara","Jimny"],"MG": ["MG 4","MG 5","MG 6","MG ZS","MG One","MG HS","MG RX5"],"Chery": ["Arrizo 5","Tiggo 3","Tiggo 4 Pro","Tiggo 7 Pro","Tiggo 8 Pro"],"BYD": ["F3","Seal","Atto 3","Song Plus"],"Geely": ["Emgrand","Coolray","Tugella","Okavango"],"Haval": ["Jolion","H6","Dargo"],"Jetour": ["Dashing","X70","X90"],"Jeep": ["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler"],"Ford": ["Fiesta","Focus","EcoSport","Kuga","Explorer","Ranger","Mustang"],"Honda": ["City","Civic","Accord","HR-V","CR-V"],"Opel": ["Corsa","Astra","Insignia","Mokka","Crossland","Grandland"],"Cupra": ["Leon","Ateca","Formentor","Born"],"SEAT": ["Ibiza","Leon","Arona","Ateca"],"Mini": ["Cooper","Cooper S","John Cooper Works","Countryman"],"Alfa Romeo": ["Giulia","Stelvio","Tonale"],"Tesla": ["Model 3","Model Y","Model S","Model X"],"Cadillac": ["CT5","Escalade"],"GMC": ["Yukon","Sierra"],"Dodge": ["Charger","Challenger","Durango"],"Infiniti": ["QX50","QX60","QX80"],"Lada": ["2107","Granta","Vesta","Niva"],"Daewoo": ["Lanos","Nubira"],"Maserati": ["Ghibli","Quattroporte","Levante","Grecale","MC20"],"Bentley": ["Continental GT","Flying Spur","Bentayga"],"Rolls-Royce": ["Ghost","Phantom","Wraith","Dawn","Cullinan","Spectre"],"Ferrari": ["Roma","Portofino M","F8 Tributo","296 GTB","SF90 Stradale","812 Superfast","Purosangue"],"Lamborghini": ["Huracán","Urus","Aventador","Revuelto"],"Aston Martin": ["Vantage","DB11","DB12","DBS","DBX"],"McLaren": ["GT","Artura","720S","750S"]};
const WATCH_DB = {
  "Rolex":["Submariner Date","Submariner (no date)","Daytona","GMT-Master II","Datejust 41","Datejust 36","Day-Date 40","Oyster Perpetual","Explorer","Explorer II","Sea-Dweller","Deepsea","Yacht-Master","Sky-Dweller","Air-King","Milgauss","Cellini","Lady-Datejust"],
  "Patek Philippe":["Nautilus","Aquanaut","Calatrava","Complications","Grand Complications","Twenty~4","Gondolo","Golden Ellipse"],
  "Audemars Piguet":["Royal Oak","Royal Oak Offshore","Royal Oak Chronograph","Royal Oak Concept","Code 11.59","Millenary"],
  "Omega":["Speedmaster Moonwatch","Speedmaster","Seamaster Diver 300M","Seamaster Planet Ocean","Seamaster Aqua Terra","Constellation","De Ville","Railmaster"],
  "Cartier":["Santos","Tank","Ballon Bleu","Panthère","Pasha","Calibre de Cartier","Drive de Cartier","Ronde"],
  "Richard Mille":["RM 011","RM 035","RM 055","RM 067","RM 07-01","RM 030","RM 65-01"],
  "Vacheron Constantin":["Overseas","Patrimony","Traditionnelle","Fiftysix","Historiques"],
  "Tudor":["Black Bay 58","Black Bay","Black Bay GMT","Pelagos","Ranger","Royal","1926"],
  "TAG Heuer":["Carrera","Monaco","Aquaracer","Formula 1","Autavia","Connected"],
  "Breitling":["Navitimer","Superocean","Chronomat","Avenger","Premier","Top Time","Endurance Pro"],
  "IWC":["Portugieser","Pilot's Watch","Portofino","Aquatimer","Ingenieur","Da Vinci"],
  "Panerai":["Luminor","Luminor Marina","Radiomir","Submersible","Luminor Due"],
  "Hublot":["Big Bang","Classic Fusion","Spirit of Big Bang","Square Bang","MP"],
  "Jaeger-LeCoultre":["Reverso","Master Ultra Thin","Polaris","Master Control","Rendez-Vous"],
  "Zenith":["El Primero","Chronomaster","Defy","Pilot"],
  "Grand Seiko":["Heritage","Evolution 9","Sport","Elegance","Snowflake"],
  "Seiko":["Prospex","Presage","5 Sports","Astron","King Seiko"],
  "Longines":["HydroConquest","Master Collection","Spirit","Legend Diver","Conquest","DolceVita"],
  "Chopard":["Alpine Eagle","Happy Sport","Mille Miglia","L.U.C"],
  "Bvlgari":["Octo Finissimo","Serpenti","Bvlgari Bvlgari","Aluminium"],
  "A. Lange & Söhne":["Lange 1","Saxonia","Zeitwerk","Odysseus","1815"],
  "Breguet":["Classique","Marine","Type XX","Tradition","Reine de Naples"],
  "Blancpain":["Fifty Fathoms","Villeret","Air Command"],
  "Tissot":["PRX","Seastar","Le Locle","Gentleman"],
  "Apple":["Watch Ultra","Watch Series","Watch SE"]
};
const BIKE_DB = {
  "Harley-Davidson":["Street Glide","Road Glide","Road King","Electra Glide","Ultra Limited","CVO Street Glide","CVO Road Glide","Fat Boy","Fat Bob","Heritage Classic","Breakout","Low Rider S","Low Rider ST","Street Bob","Softail Standard","Sportster S","Nightster","Iron 883","Forty-Eight","Pan America 1250"],
  "Honda":["CBR1000RR-R Fireblade","CBR650R","CB650R","CBR500R","CB750 Hornet","CB1000 Hornet","CRF1100L Africa Twin","XL750 Transalp","NX500","NC750X","Gold Wing","Rebel 1100","Rebel 500","X-ADV","Forza 750","PCX 160"],
  "Yamaha":["YZF-R1","YZF-R7","YZF-R3","MT-10","MT-09","MT-07","MT-03","Tracer 9 GT","Ténéré 700","XSR900","XSR700","TMAX 560","XMAX 300","NMAX 155"],
  "Kawasaki":["Ninja ZX-10R","Ninja ZX-6R","Ninja H2","Ninja 650","Ninja 500","Z H2","Z900","Z900RS","Z650","Versys 1000","Versys 650","Vulcan S","KLR 650"],
  "Suzuki":["Hayabusa","GSX-R1000R","GSX-R750","GSX-S1000","GSX-8S","GSX-8R","V-Strom 1050","V-Strom 800DE","V-Strom 650","SV650","Burgman 400"],
  "BMW":["R 1300 GS","R 1250 GS","R 1250 GS Adventure","R 1300 GS Adventure","R 1250 RT","K 1600 GTL","S 1000 RR","M 1000 RR","S 1000 R","S 1000 XR","F 900 GS","F 800 GS","F 900 R","F 900 XR","R nineT","R 18","G 310 GS","G 310 R","C 400 X"],
  "Ducati":["Panigale V4","Panigale V2","Streetfighter V4","Streetfighter V2","Monster","Multistrada V4","Multistrada V2","DesertX","Diavel V4","XDiavel","Hypermotard 950","SuperSport 950","Scrambler Icon"],
  "KTM":["1390 Super Duke R","1290 Super Duke R","990 Duke","890 Duke","390 Duke","1290 Super Adventure","890 Adventure","390 Adventure","690 SMC R","RC 390"],
  "Triumph":["Bonneville T120","Bonneville T100","Speed Twin 1200","Thruxton RS","Scrambler 1200","Street Triple 765","Speed Triple 1200","Trident 660","Tiger 900","Tiger 1200","Rocket 3","Speed 400","Scrambler 400 X"],
  "Indian":["Chief","Chief Dark Horse","Chieftain","Roadmaster","Springfield","Challenger","Pursuit","Scout","Scout Bobber","FTR"],
  "Royal Enfield":["Classic 350","Bullet 350","Meteor 350","Hunter 350","Himalayan 450","Interceptor 650","Continental GT 650","Super Meteor 650","Shotgun 650"],
  "Aprilia":["RSV4","Tuono V4","RS 660","Tuono 660","Tuareg 660"],
  "MV Agusta":["Brutale","Dragster","F3","Turismo Veloce"],
  "Benelli":["TRK 502","TRK 702","Leoncino 500","302S"],
  "CFMoto":["800MT","700CL-X","450SR","450MT"],
  "Vespa":["GTS 300","Primavera","Sprint"]
};
const BAG_BRANDS = ["Hermès","Chanel","Louis Vuitton","Dior","Gucci","Prada","Saint Laurent","Fendi","Bottega Veneta","Celine","Balenciaga","Givenchy","Valentino","Loewe","Burberry","Goyard","Miu Miu","Versace","Dolce & Gabbana","Chloé","Cartier","Tiffany & Co.","Van Cleef & Arpels","Bulgari","Michael Kors","Coach","Tory Burch"];
const UNITS = {mileage:" km", size:" mm", length:" ft", hours:" h", height:" cm", age:" yrs", area:" m²"};

let type = "bike";
let photos = []; // {url, bytes, w, h}
const $ = s => document.querySelector(s);
const fmt = n => Number(n).toLocaleString("en-US");

const RENT_RANGE = [500, 50000000];   // rent per day, month or year; the lowest is set in Admin → Stats → Real estate rent
function priceRange(){
  if (type==="estate" && ($("#f_deal")||{}).value==="For rent"){
    const lo = SITE_ST && SITE_ST.rent_min!=null ? Number(SITE_ST.rent_min) : RENT_RANGE[0];
    return [isNaN(lo) ? RENT_RANGE[0] : lo, RENT_RANGE[1]]; }
  const r = RANGES[type];
  if (Array.isArray(r)) return r;
  const cat = ($("#f_category")||{}).value;
  return (r && r[cat]) || [0, 1e9];
}

// Remember what's in the form so switching category doesn't wipe it.
function snapshotForm(){
  const box = $("#fields"); if (!box) return null;
  const v = {};
  box.querySelectorAll("[id^=f_]").forEach(el=>{
    const k = el.id.slice(2);
    if (el.classList.contains("checks")) v[k] = [...el.querySelectorAll("input:checked")].map(c=>c.value);
    else if (el.value!=="" && el.value!=null) v[k] = el.value;
  });
  box.querySelectorAll("select.unit").forEach(u=>{ v[u.id] = u.value; });
  return v;
}
function restoreForm(v){
  if (!v) return;
  for (const f of SCHEMAS[type]){
    const el = $("#f_"+f.k); if (!el) continue;
    let val = v[f.k];
    if (val==null && f.k==="model") val = v.name;       // model ↔ name carry over between categories
    if (val==null && f.k==="name") val = v.model;
    if (val==null || val==="") continue;
    if (f.type==="checks"){ const vs=[].concat(val); el.querySelectorAll("input").forEach(c=>c.checked=vs.includes(c.value)); continue; }
    if (el.tagName==="SELECT"){ if ([...el.options].some(o=>o.value===val)) el.value = val; continue; }
    el.value = val;
    const u = $("#u_"+f.k); if (u && v["u_"+f.k] && [...u.options].some(o=>o.value===v["u_"+f.k])) u.value = v["u_"+f.k];
  }
}
function renderFields(clear){
  const keep = clear===true ? null : snapshotForm();
  const pr = $("#photoRule"); if (pr) pr.textContent = photoRuleText();
  if (typeof photos!=="undefined" && photos.length > maxPhotos()){
    renderThumbs();   // extra photos stay for the HD flyer
    const h=$("#photoHint"); if (h) h.textContent = `Only ${maxPhotos()} photos go online for this category — the others stay in your HD flyer.`;
  }
  const box = $("#fields");
  const cat0 = (keep && keep.category) || curCat() || ((SCHEMAS[type]||[]).find(x=>x.k==="category")||{}).def || "";
  box.innerHTML = "";
  for (const f of schemaFor(type, cat0)){
    const wrap = document.createElement("div");
    wrap.className = "field" + (f.full?" full":"");
    wrap.dataset.k = f.k;
    const lab = document.createElement("label");
    lab.htmlFor = "f_"+f.k;
    lab.innerHTML = f.l + (f.req?' <span class="req">*</span>':"");
    wrap.appendChild(lab);
    let el;
    if (f.type==="select"){
      el = document.createElement("select");
      for (const o of f.opts){
        if (o && typeof o==="object"){ const g=document.createElement("optgroup"); g.label=o.group;
          o.items.forEach(v=>{ const op=document.createElement("option"); op.value=op.textContent=v; if(v===f.def) op.selected=true; g.appendChild(op); }); el.appendChild(g); continue; }
        const op=document.createElement("option"); op.value=op.textContent=o; if(o===f.def) op.selected=true; el.appendChild(op); }
    } else if (f.type==="textarea"){
      el = document.createElement("textarea");
    } else if (f.type==="checks"){
      el = document.createElement("div"); el.className="checks";
      for (const o of f.opts){ const l=document.createElement("label"); l.innerHTML=`<input type="checkbox" value="${o}"> ${o}`; el.appendChild(l); }
    } else {
      el = document.createElement("input");
      el.type = f.type==="price"||f.type==="number" ? "text" : f.type==="phone" ? "tel" : f.type==="month" ? "month" : "text";
      if (f.type==="price"||f.type==="number") el.inputMode="numeric";
      if (f.type==="phone"){ el.placeholder=MARKET_BY_ID[formMarket()].local; el.inputMode="tel"; }
    }
    el.id = "f_"+f.k;
    if (f.ph) el.placeholder = f.ph;
    const sugg = ((type==="bike"||type==="watch") && f.k==="brand") ? Object.keys(type==="watch"?WATCH_DB:BIKE_DB) : (f.list==="BAG_BRANDS" ? BAG_BRANDS : null);
    if (sugg || (type==="bike" && f.k==="model")){
      const dl=document.createElement("datalist"); dl.id="dl_"+f.k; el.setAttribute("list", dl.id); el.autocomplete="off";
      (sugg||[]).forEach(v=>{ const o=document.createElement("option"); o.value=v; dl.appendChild(o); });
      wrap.appendChild(dl);
    }
    if (f.units){
      const row=document.createElement("div"); row.className="unitrow";
      const us=document.createElement("select"); us.id="u_"+f.k; us.className="unit";
      (f.k==="price" ? MARKET_BY_ID[formMarket()].cur : f.units).forEach(u=>{ const o=document.createElement("option"); o.value=u; o.textContent=u.toUpperCase(); us.appendChild(o); });
      try{ const last = f.k==="price" ? localStorage.getItem("mm_cur") : null; if (last && f.units.includes(last)) us.value=last; }catch(e){}
      us.addEventListener("change", ()=>{ if (f.k==="price"){ updatePriceHint(); try{ localStorage.setItem("mm_cur", us.value); }catch(e){} } else updateUnitHint(f); });
      row.append(el, us); wrap.appendChild(row);
    } else wrap.appendChild(el);
    const h = document.createElement("div"); h.className="hint"; h.id="h_"+f.k;
    h.textContent = f.hint || "";
    wrap.appendChild(h);
    box.appendChild(wrap);
    if (f.type==="price"){
      el.addEventListener("input", ()=>{ const d=el.value.replace(/[^\d]/g,""); el.value = d?fmt(d):""; });
    }
  }
  const cat = $("#f_category");
  if (cat){ if ([...cat.options].some(o=>o.value===cat0)) cat.value=cat0;
    cat.addEventListener("change", ()=>{ const needs=(SCHEMAS[type]||[]).some(x=>x.only||x.alt); if (needs) renderFields(); else updatePriceHint(); }); }
  if (type==="bike"){
    const br=$("#f_brand"), dl=$("#dl_model");
    const fill=()=>{ if(!dl) return; dl.innerHTML=""; const key=Object.keys(BIKE_DB).find(b=>b.toLowerCase()===String(br.value).trim().toLowerCase());
      (key?BIKE_DB[key]:[]).forEach(m=>{ const o=document.createElement("option"); o.value=m; dl.appendChild(o); }); };
    if (br){ br.addEventListener("input", fill); br.addEventListener("change", fill); fill(); }
  }
  restoreForm(keep);
  if (type==="bike") setupBikePickers(BIKE_DB);
  if (type==="watch") setupBikePickers(WATCH_DB);
  if (type==="car") setupBikePickers(CAR_DB);
  updatePriceHint();
  // Remember phone for convenience
  try{ const p=localStorage.getItem("mm_phone"); if(p && !$("#f_phone").value) $("#f_phone").value=p; }catch(e){}
}
function updatePriceHint(){
  const [lo,hi] = priceRange();
  const cur = ($("#u_price")||{}).value || "EGP";
  const h = $("#h_price"); if (!h) return;
  h.textContent = cur==="EGP" ? `Allowed range: ${fmt(lo)} – ${fmt(hi)} EGP`
    : `Allowed range: about ${fmt(Math.ceil(fromEGP(lo,cur)))} – ${fmt(Math.floor(fromEGP(hi,cur)))} ${cur}`;
}
function updateUnitHint(f){
  const u = ($("#u_"+f.k)||{}).value; const h=$("#h_"+f.k); if (!h || !f.unitRange) return;
  const [a,b] = f.unitRange[u]; h.textContent = u==="ci" ? `Cubic inches (${a}–${b}). Harley 107 ci ≈ 1,753 cc, 114 ci ≈ 1,868 cc` : `Cubic centimetres (${fmt(a)}–${fmt(b)})`;
}
function priceStr(f){ const c=f.price_unit||"EGP"; const p = c==="USD" ? "$"+fmt(f.price) : c==="EUR" ? "€"+fmt(f.price) : fmt(f.price)+" "+c;
  return f.deal==="For rent" ? p+" / "+({Year:"year",Day:"day"}[f.rent_period]||"month") : p; }
function unitStr(f, k, v){
  const u = f[k+"_unit"];
  if (k==="mileage"){
    if (u==="mi") return `${fmt(v)} mi (${fmt(Math.round(v*KM_PER_MI))} km)`;
    return `${fmt(v)} km (${fmt(Math.round(v/KM_PER_MI))} mi)`;
  }
  if (k==="engine"){
    if (u==="ci") return `${fmt(v)} ci (${fmt(Math.round(v*CI_TO_CC))} cc)`;
    return `${fmt(v)} cc` + (v>=600 ? ` (${fmt(Math.round(v/CI_TO_CC))} ci)` : "");
  }
  return null;
}

let CAT_PICKED = false;      // true once the person taps a category themselves
function initCategoryPicker(){
  const lastSub = {moto:"bike", car:"car", boat:"boat", equine:"equine", desert:"dune"};
  const box = $("#types");
  function drawSubs(group){
    const subs = SUBTYPES[group];
    box.hidden = !subs;
    if (!subs) return;
    box.innerHTML = "";
    subs.forEach(([t,ic,label])=>{
      const b=document.createElement("button"); b.type="button"; b.dataset.t=t; b.className = t===type?"on":"";
      if (ic) b.innerHTML = `<span class="ic">${ic}</span>`; b.appendChild(document.createTextNode(label));
      b.onclick = (e)=>{
        if (e && e.isTrusted) CAT_PICKED = true;
        type = t; lastSub[group] = t;
        box.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
        renderFields(); showMsg("");
      };
      box.appendChild(b);
    });
  }
  document.querySelectorAll("#mains button").forEach(b=>b.onclick=(e)=>{
    if (e && e.isTrusted) CAT_PICKED = true;
    document.querySelectorAll("#mains button").forEach(x=>x.classList.toggle("on",x===b));
    const m = b.dataset.m;
    type = SUBTYPES[m] ? lastSub[m] : m;
    drawSubs(m);
    renderFields();
    showMsg(""); const d=$("#done"); if (d) d.classList.remove("show");
  });
  drawSubs(GROUP[type] || "moto");
}
/* ---- Photos: shrink to very low resolution ---- */
function initPhotoInputs(){
$("#camBtn").onclick = ()=>$("#camInput").click();
$("#galBtn").onclick = ()=>$("#galInput").click();
$("#camInput").onchange = e=>addFiles(e.target.files, e.target);
$("#galInput").onchange = e=>addFiles(e.target.files, e.target);
}

function loadImage(file){
  return new Promise((res,rej)=>{
    const u = URL.createObjectURL(file); const img = new Image();
    img.onload = ()=>{ URL.revokeObjectURL(u); res(img); };
    img.onerror = ()=>{ URL.revokeObjectURL(u); rej(new Error("Could not read image")); };
    img.src = u;
  });
}
function watermarkSrc(){ return MAIN_LOGO; }
function drawWatermark(ctx, w, h, mark){
  if (!mark || !mark.naturalWidth) return;
  const mw = Math.round(Math.max(44, w*0.13)), mh = Math.round(mw*mark.naturalHeight/mark.naturalWidth);   // small
  const pad = Math.round(mw*0.06), x = w - mw - Math.round(w*0.025) - pad, y = h - mh - Math.round(h*0.025) - pad;
  ctx.save();
  ctx.globalAlpha = 0.30; ctx.fillStyle = "#ffffff";
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x-pad, y-pad, mw+2*pad, mh+2*pad, pad*1.5); else ctx.rect(x-pad, y-pad, mw+2*pad, mh+2*pad); ctx.fill();
  ctx.globalAlpha = 0.55; ctx.drawImage(mark, x, y, mw, mh);   // see-through
  ctx.restore();
}
async function shrink(file){
  const img = await loadImage(file);
  let edge = PHOTO_MAX_EDGE, q = 0.5, url;
  for (let i=0;i<8;i++){
    const s = Math.min(1, edge/Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth*s), h = Math.round(img.naturalHeight*s);
    const c = document.createElement("canvas"); c.width=w; c.height=h;
    const ctx = c.getContext("2d"); ctx.imageSmoothingQuality="medium"; ctx.drawImage(img,0,0,w,h);
    url = c.toDataURL("image/jpeg", q);
    const bytes = Math.round((url.length - 23) * 3/4);
    if (bytes <= PHOTO_MAX_BYTES) return {url, bytes, w, h, orig: file.size, file, score: photoScore(img)};
    if (q > 0.3) q -= 0.08; else edge = Math.round(edge*0.85);
  }
  return {url, bytes: Math.round(url.length*3/4), w:0, h:0, orig:file.size, file, score: photoScore(img)};
}
const FLYER_MAX_PHOTOS = 10;   // the owner can add up to 10: the first ones go online, all go in the HD flyer
let mainPicked = false;        // true once the owner chose the main photo themselves
// How good is this photo as the main one? Sharp, well lit, landscape, high resolution.
function photoScore(img){
  try{
    const W=320, H=Math.max(8,Math.round(320*img.naturalHeight/img.naturalWidth));
    const c=document.createElement("canvas"); c.width=W; c.height=H; const x=c.getContext("2d"); x.drawImage(img,0,0,W,H);
    const d=x.getImageData(0,0,W,H).data, g=new Float32Array(W*H); let sum=0;
    for (let i=0;i<W*H;i++){ g[i]=(0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2])/255; sum+=g[i]; }
    const mean=sum/(W*H); let lv=0, n=0, cs=0;
    for (let yy=1;yy<H-1;yy++) for (let xx=1;xx<W-1;xx++){ const i=yy*W+xx; const l=4*g[i]-g[i-1]-g[i+1]-g[i-W]-g[i+W]; lv+=l*l; n++; cs+=(g[i]-mean)*(g[i]-mean); }
    const sharp=Math.log(1+ (lv/n)*1000), contrast=Math.sqrt(cs/n);
    const light = 1-Math.min(1,Math.abs(mean-0.5)*2.2);
    const land = img.naturalWidth>=img.naturalHeight ? 0.6 : 0;
    const res = Math.min(1,(img.naturalWidth*img.naturalHeight)/3e6)*0.4;
    return sharp + light*1.2 + contrast*2 + land + res;
  }catch(e){ return 0; }
}
function bestPhotoIndex(){ let b=0; photos.forEach((p,i)=>{ if ((p.score||0)>(photos[b].score||0)) b=i; }); return b; }
function makeMain(i){ if (i<=0 || i>=photos.length) return; const [p]=photos.splice(i,1); photos.unshift(p); }
async function addFiles(list, input){
  const files = [...list].filter(f=>f.type.startsWith("image/"));
  input.value = "";
  for (const f of files){
    if (photos.length >= FLYER_MAX_PHOTOS){ $("#photoHint").textContent = `Maximum ${FLYER_MAX_PHOTOS} photos.`; break; }
    try{ photos.push(await shrink(f)); }catch(e){ $("#photoHint").textContent = e.message; }
  }
  if (!mainPicked && photos.length > 1) makeMain(bestPhotoIndex());   // suggest the best main photo automatically
  renderThumbs();
}
function renderThumbs(){
  const t = $("#thumbs"); t.innerHTML="";
  const online = maxPhotos(), best = photos.length>1 ? bestPhotoIndex() : 0;
  // big preview of the main photo, the way buyers see it in the catalogue
  let pv = $("#mainPreview");
  if (!pv){ pv=document.createElement("div"); pv.id="mainPreview"; t.before(pv); }
  pv.innerHTML = "";
  if (photos.length){
    const fig=document.createElement("div"); fig.className="mp-card";
    const im=document.createElement("img"); im.src=photos[0].url; im.alt="Main photo preview";
    const cap=document.createElement("div"); cap.className="mp-cap";
    let title="", price=""; try{ const f={}; (SCHEMAS[type]||[]).forEach(x=>{ const el=$("#f_"+x.k); if(el) f[x.k]=el.value; }); const pu=$("#u_price"); if(pu) f.price_unit=pu.value;
      title=titleOf({type,f}); price=f.price?priceStr({...f,price:String(f.price).replace(/\D/g,"")}):""; }catch(e){}
    cap.innerHTML = `<span class="mp-tag">★ Main photo</span><b></b><i></i>`;
    cap.querySelector("b").textContent = title || "Your listing title"; cap.querySelector("i").textContent = price;
    fig.append(im, cap); pv.appendChild(fig);
    const note=document.createElement("div"); note.className="mp-note";
    note.textContent = mainPicked ? "You chose this main photo. Tap any photo below to change it."
                                  : "We picked the clearest, best-lit photo as the main one. Tap any photo below to choose another.";
    pv.appendChild(note);
    if (best!==0){ const ub=document.createElement("button"); ub.type="button"; ub.className="btn ghost small"; ub.textContent="Use the suggested photo";
      ub.onclick=()=>{ makeMain(best); mainPicked=true; renderThumbs(); }; pv.appendChild(ub); }
  }
  photos.forEach((p,i)=>{
    const d = document.createElement("div"); d.className="thumb"+(i===0?" main":"")+(i>=online?" extra":"");
    d.innerHTML = `<img alt="photo ${i+1}"><button type="button" aria-label="Remove">×</button><small></small>`;
    d.querySelector("img").src = p.url;
    d.querySelector("small").textContent = i===0 ? "★ Main" : (i>=online ? "HD flyer only" : (i===best ? "Suggested" : "Tap = main"));
    d.querySelector("img").onclick = ()=>{ if (i===0) return; makeMain(i); mainPicked=true; renderThumbs(); };
    d.querySelector("button").onclick = (e)=>{ e.stopPropagation(); photos.splice(i,1); if (i===0) mainPicked=false; renderThumbs(); };
    t.appendChild(d);
  });
  if (photos.length){
    const saved = photos.reduce((a,p)=>a+p.orig,0), now = photos.slice(0,online).reduce((a,p)=>a+p.bytes,0);
    $("#photoHint").textContent = `${Math.min(photos.length,online)}/${online} photos go online` + (saved ? ` (reduced from ${(saved/1048576).toFixed(1)} MB to ${Math.round(now/1024)} KB)` : "")
      + (photos.length>online ? ` · all ${photos.length} go in your HD flyer` : ` · add up to ${FLYER_MAX_PHOTOS} for the HD flyer`);
  } else $("#photoHint").textContent = "";
  $(".photos").classList.remove("bad");
}

/* ---- Validation ---- */
function collect(){
  const data = {}; let ok = true;
  document.querySelectorAll(".field").forEach(w=>w.classList.remove("bad"));
  const fail = (k,msg)=>{ ok=false; const w=document.querySelector(`.field[data-k="${k}"]`); if(w){w.classList.add("bad"); $("#h_"+k).textContent=msg;} };
  for (const f of schemaFor(type, curCat())){
    const el = $("#f_"+f.k); if (!el) continue;
    let v;
    if (f.type==="checks") v = [...el.querySelectorAll("input:checked")].map(x=>x.value).join(", ");
    else v = (el.value||"").trim();
    if (f.hint) $("#h_"+f.k).textContent = f.hint; else if (f.type!=="price") $("#h_"+f.k).textContent = "";
    if (f.req && !v){ fail(f.k, "Required"); continue; }
    if (f.type==="number" && v){
      const n = Number(v.replace(/[^\d]/g,""));
      const u = f.units ? ($("#u_"+f.k)||{}).value : null;
      const [mn,mx] = (f.unitRange && u) ? f.unitRange[u] : [f.min, f.max];
      if (isNaN(n) || n<mn || n>mx){ fail(f.k, `Enter a number between ${fmt(mn)} and ${fmt(mx)}${u?" "+u:""}`); continue; }
      v = n; if (u) data[f.k+"_unit"] = u;
    }
    if (f.type==="price"){
      const n = Number(v.replace(/[^\d]/g,"")); const [lo,hi] = priceRange();
      const cur = ($("#u_price")||{}).value || "EGP";
      const egp = toEGP(n, cur);
      if (!n || egp<lo*0.9 || egp>hi*1.1){ fail(f.k, cur==="EGP"
          ? `Price must be between ${fmt(lo)} and ${fmt(hi)} EGP for this item`
          : `Price must be about ${fmt(Math.ceil(fromEGP(lo,cur)))} – ${fmt(Math.floor(fromEGP(hi,cur)))} ${cur} for this item`); continue; }
      updatePriceHint(); v = n; data.price_unit = cur;
    }
    if (f.type==="phone"){
      const mk = formMarket(), p = normPhone(v, mk);
      if (!p){ fail(f.k, mk==="EG" ? "Enter an Egyptian mobile number: 11 digits starting 010, 011, 012 or 015"
          : `Enter a ${marketName(mk)} mobile number with WhatsApp (country code ${MARKET_BY_ID[mk].dial.map(d=>"+"+d).join(" / ")})`); continue; }
      v = p; data.country = mk;
    }
    if (v!=="" && v!=null) data[f.k] = v;
  }
  const sp = $("#showPhone"); if (sp && sp.checked) data.show_phone = true;
  data._lang = window.HE_LANG || "en";   // the language it was posted in: admin messages use it   // the seller allows their number on the flyer image the admin shares
  const tw = $("#termsWrap");
  if (!$("#terms").checked){ ok=false; tw.classList.add("bad"); } else tw.classList.remove("bad");
  if (!photos.length){ ok=false; $(".photos").classList.add("bad"); $("#photoHint").textContent = "Add at least one photo."; }
  return ok ? data : null;
}

function titleOf(L){
  const f = L.f||{};
  const withBrand = (b, rest) => { b=(b||"").trim(); rest=(rest||"").trim(); return (b && rest.toLowerCase().startsWith(b.toLowerCase())) ? rest : `${b} ${rest}`.trim(); };
  if (f.model) return withBrand(f.brand, `${f.model}${f.year?" "+f.year:""}`);
  if (L.type==="estate") return `${f.deal==="For rent"?"For rent: ":""}${f.category||""} — ${f.name||""}${f.location?", "+f.location:""}`;
  if (L.type==="art") return `${f.name||""}${f.artist?" — "+f.artist:""}`;
  if (L.type==="equine") return `${f.name||""}${f.breed?" — "+f.breed:""}`;
  if (L.type==="acc" && f.category==="Tyres") return withBrand(f.brand, `${f.name||""} ${f.tyre_size||""}`);
  return withBrand(f.brand, f.name);
}
function rows(L){
  const out = [];
  for (const f of schemaFor(L.type, (L.f||{}).category)){
    if (["price","phone","model","name","stock","rent_period"].includes(f.k)) continue;   // rent period shows in the price
    let v = L.f[f.k]; if (v===undefined||v==="") continue;
    const us = unitStr(L.f, f.k, v);
    const num = !isNaN(Number(String(v).replace(/,/g,"")));
    if (num && us) v = us; else if (num && UNITS[f.k]) v = (f.k==="year"?v:fmt(v)) + UNITS[f.k];
    out.push([f.l.replace(/ \(.*\)/,""), String(v)]);
  }
  return out;
}
function listingText(L){
  const tf = schemaFor(L.type, (L.f||{}).category).find(f=>f.k==="model"||f.k==="name");
  let t = `${LABELS[L.type]} for sale\n${tf.l}: ${L.f[tf.k]}\n`;
  for (const [k,v] of rows(L)) t += `${k}: ${v}\n`;
  t += `Price: ${priceStr(L.f)}` + (phoneOf(L) ? `\nPhone number: ${phoneOf(L)}` : "");
  return t;
}

function safeId(id){ return /^[A-Za-z0-9-]{1,60}$/.test(id) ? id : null; }
let SHORT_URL = "", INCLUDE_LINK = true;
function baseUrl(){ return (SHORT_URL || SITE_URL).replace(/\/$/,""); }
function hdLink(id){ const s=safeId(id); return s ? baseUrl()+"/item.html?id="+s+"&hd=1" : baseUrl()+"/"; }
function linkFor(id){ const s=safeId(id); return s ? baseUrl()+"/item.html?id="+s : baseUrl()+"/"; }
function itemHref(id){ const s=safeId(id); return s ? "item.html?id="+s : "./"; }
function waHref(text){ return "https://wa.me/?text="+encodeURIComponent(text); }
function shareText(L,id){
  const icon = ICONS[L.type] || "";
  return `${icon} *${MARKET_NAME}*${isFeatured(L)?"":""}\n\n${listingText(L)}` + (L.discount ? `\n*${L.discount}% off* — get your discount code on the site` : "") + (INCLUDE_LINK ? `\n\nPhotos & details: ${linkFor(id)}` : "") + `\n\n_${DISCLAIMER}_`;
}
function catalogueText(items){
  const groups = {bike:"*Motorcycles*", gear:"*Safety gear*", acc:"*Moto accessories*", watch:"*Watches*", car:"*Cars*", carpart:"*Car parts & accessories*", bag:"*The Boutique*", equinepart:"*Equine accessories*", boatpart:"*Marine parts & accessories*", dune:"*Buggies, ATVs & sand bikes*", dunepart:"*Desert gear & parts*", equine:"*Equine*", boat:"*Marine: boats, yachts & jet skis*", art:"*Modern & art*", estate:"*Real estate*"};
  let t = `*${MARKET_NAME} — ${CAT_TITLE ? CAT_TITLE+" catalogue" : "Catalogue"}*\n`;
  let n = 0;
  for (const [g, all] of bySection(items)){
    const xs = all.slice(0,40);
    t += `\n${groups[g]}\n`;
    for (const {L} of xs){ n++; t += `${n}. ${titleOf(L)} — ${priceStr(L.f)} ${phoneOf(L)?" — "+phoneOf(L):""}\n`; }
  }
  if (INCLUDE_LINK) t += `\nPhotos & full details: ${baseUrl()}`;
  t += `\n\n_${DISCLAIMER}_`;
  return t;
}

function showMsg(text, kind="info", el=$("#msg")){
  el.textContent = text; el.className = "msg" + (text?" show "+kind:"");
}

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

/* ===================== Database (Supabase) ===================== */
const sb = (window.supabase && SUPABASE_URL && !/YOUR-PROJECT/.test(SUPABASE_URL))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {auth:{persistSession:true}})
  : null;
const LIST_COLS = "id,created_at,status,type,f,thumb,sold_at,views,promoted,promoted_until,stock,discount_pct,check_when,check_where";
/* ---------- Seller numbers are hidden: they are fetched one at a time when a buyer taps WhatsApp / Call ---------- */
function phoneOf(L){ return String((L&&L.f&&L.f.phone)||"").trim(); }
const CONTACT_CACHE={};
async function contactPhone(kind,id){
  const k=kind+":"+id; if (CONTACT_CACHE[k]) return CONTACT_CACHE[k];
  CONTACT_LIMIT=false;
  try{ const {data,error}=await sb.rpc("contact_phone",{p_kind:kind,p_id:id}); if(error){ CONTACT_LIMIT=/too many/i.test(error.message||""); return null; } if(!data) return null; return (CONTACT_CACHE[k]=String(data)); }catch(e){ return null; }
}
let CONTACT_LIMIT=false;
const LIMIT_MSG="Too many contact requests from this connection. Please try again in a few minutes.";
function hiddenContact(a, kind, id, mk){
  a.href=itemHref(kind==="listing"?id:"");
  a.onclick=async ev=>{
    ev.preventDefault();
    // first contact on this device: show the terms once, then go on
    if (!ADMIN_PAGE && !termsSeen("buyer")){ termsSheet({title:"Before you contact a seller", lead:"High End only lists items. Please read this once.", back:a, onOk:()=>{ termsAccepted("buyer"); a.click(); }}); return; }
    const w = a.target==="_blank" ? window.open("about:blank","_blank") : null;
    const p = await contactPhone(kind,id);
    if (!p){ if (w) w.close(); toast(CONTACT_LIMIT?LIMIT_MSG:"This contact is not available any more."); return; }
    const u=mk(p);
    if (w){ try{ w.opener=null; }catch(e){} w.location.href=u; } else location.href=u;
  };
}
async function adminPhones(kind, list, idOf, put){
  const ids=list.map(idOf).filter(Boolean); if(!ids.length) return;
  for (let i=0;i<ids.length;i+=400){
    const {data,error}=await sb.rpc("admin_phones",{p_kind:kind,p_ids:ids.slice(i,i+400)}); if(error||!data) return;
    const m=new Map(data.map(r=>[r.id,r.phone])); list.forEach(x=>{ const ph=m.get(idOf(x)); if(ph) put(x,ph); });
  }
}
// The seller's number goes on a flyer only when the seller ticked "Show my number" AND it is the image made in the admin page.
// PDFs, the seller's own flyer and the public site never show it.
let FLYER_IMAGE = false;
const ADMIN_PAGE = /admin\.html$/.test(location.pathname);
let FLYER_HD = false;
const POST_PAGE = /post\.html$/.test(location.pathname);
// the seller's number goes on a flyer only when they ticked "show my number":
// on admin's group-share image, and on the uploader's own HD image / HD PDF right after posting
function flyerPhone(L){ const p=phoneOf(L); if (!(L && L.f && L.f.show_phone && p)) return "";
  return ((FLYER_IMAGE && ADMIN_PAGE) || (FLYER_HD && POST_PAGE)) ? p : ""; }
function contactBarText(L){ const p=flyerPhone(L); return p ? "Call / WhatsApp   "+p : "Contact the seller: "+baseUrl().replace(/^https?:\/\//,""); }
function contactBarLink(L,id){ const p=flyerPhone(L); return p ? "https://wa.me/"+waNum(p) : linkFor(id); }
function rowToItem(r){
  return { id:r.id, L:{ type:r.type, f:r.f||{}, thumb:r.thumb||null, photos:Array.isArray(r.photos)?r.photos:null,
    at:Date.parse(r.created_at)||Date.now(), status:r.status, views:r.views||0, soldAt:r.sold_at?Date.parse(r.sold_at):null, note:r.note||null,
    promoted:!!r.promoted, promotedUntil:r.promoted_until?Date.parse(r.promoted_until):null,
    stock:(r.stock===null||r.stock===undefined)?null:Number(r.stock), discount:r.discount_pct||null,
    checkWhen:r.check_when||null, checkWhere:r.check_where||null } };
}
async function loadPhotos(item){
  if (item.L.photos && item.L.photos.length) return item.L.photos;
  if (!sb) return item.L.thumb ? [item.L.thumb] : [];
  const {data,error} = await sb.from("listings").select("photos").eq("id",item.id).maybeSingle();
  if (!error && data && Array.isArray(data.photos)) item.L.photos = data.photos;
  return item.L.photos || (item.L.thumb ? [item.L.thumb] : []);
}
/* ---------- photos as files in Supabase Storage (fast, cached); the database keeps only the links ---------- */
const PHOTO_BUCKET = "listing-photos";
function dataUrlBlob(u){ const [h,b]=u.split(","); const bin=atob(b); const a=new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) a[i]=bin.charCodeAt(i); return new Blob([a],{type:(h.match(/data:([^;]+)/)||[])[1]||"image/jpeg"}); }
async function storePhoto(path, dataUrl){
  const {error} = await sb.storage.from(PHOTO_BUCKET).upload(path, dataUrlBlob(dataUrl), {contentType:"image/jpeg", cacheControl:"31536000", upsert:false});
  if (error && !/exists|Duplicate/i.test(error.message||"")) throw error;
  return sb.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
// returns {photos:[urls], thumb:url}, or null if the photo folder isn't ready (then photos stay inside the listing as before)
async function storeListingPhotos(id, pics, thumb){
  if (!sb || !sb.storage || !safeId(id)) return null;
  try{
    const photos = [];
    for (let i=0;i<pics.length;i++) photos.push(/^data:/.test(pics[i]) ? await storePhoto(`${id}/${i}.jpg`, pics[i]) : pics[i]);
    const t = thumb && /^data:/.test(thumb) ? await storePhoto(`${id}/t.jpg`, thumb) : thumb;
    return {photos, thumb:t};
  }catch(e){ console.warn("photo storage not available", e); return null; }
}
function photoPaths(L){ return [...(L.photos||[]), L.thumb||""].map(u=>{ const m=String(u).match(/\/object\/public\/listing-photos\/(.+)$/); return m?decodeURIComponent(m[1]):null; }).filter(Boolean); }
function isSold(id,L){ return L.status==="sold"; }
function isFeatured(L){ return !!L.promoted && (!L.promotedUntil || L.promotedUntil > Date.now()) && L.status==="live"; }
function sortListings(list){ return list.slice().sort((a,b)=>(isFeatured(b.L)-isFeatured(a.L)) || ((b.L.at||0)-(a.L.at||0))); }
function niceError(e){
  const m = (e && (e.message||e.error_description||e.msg)) || String(e||"");
  if (/queue is full|already has|can post|a month|already rated|rate yourself|cannot be rated|Too many ratings|Ratings are paused/i.test(m)) return m;
  if (/Failed to fetch|NetworkError|network/i.test(m)) return "No connection — check your internet and try again.";
  if (/Invalid login/i.test(m)) return "Wrong email or password.";
  return "Something went wrong: " + m;
}
function newSellerCode(){ const a=new Uint32Array(1); crypto.getRandomValues(a); return String(100000 + (a[0] % 900000)); }
function uuid(){ return (crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))); }
// a photo from the phone made small enough to send with a request (max 700px, JPEG)
function smallPhoto(file, max=700){
  return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onerror=rej; fr.onload=async()=>{ try{
    const im=await loadSrc(fr.result); let q=0.7, m=max, out="";
    for (let i=0;i<4;i++){ const r=Math.min(1, m/Math.max(im.naturalWidth, im.naturalHeight)); const c=document.createElement("canvas");
      c.width=Math.round(im.naturalWidth*r); c.height=Math.round(im.naturalHeight*r); c.getContext("2d").drawImage(im,0,0,c.width,c.height);
      out=c.toDataURL("image/jpeg",q); if (out.length<=190000) break; m=Math.round(m*0.75); q=0.6; }
    res(out); }catch(e){ rej(e); } }; fr.readAsDataURL(file); });
}
function photoPicker(id){
  const w=document.createElement("div"); w.className="rqphoto";
  w.innerHTML=`<label class="btn ghost small" for="${id}">Add a photo (optional)</label><input id="${id}" type="file" accept="image/*" hidden><img alt="" hidden><button type="button" class="btn ghost small" hidden>✕</button>`;
  const inp=w.querySelector("input"), img=w.querySelector("img"), x=w.querySelector("button"); w.value=null;
  inp.onchange=async()=>{ const f=inp.files&&inp.files[0]; if(!f) return; try{ w.value=await smallPhoto(f); img.src=w.value; img.hidden=false; x.hidden=false; }catch(e){ w.value=null; } inp.value=""; };
  x.onclick=()=>{ w.value=null; img.hidden=true; x.hidden=true; };
  w.reset=()=>x.onclick();
  return w;
}
async function makeThumb(dataUrl){
  const im = await loadSrc(dataUrl); const max=260;
  const r = Math.min(1, max/Math.max(im.naturalWidth, im.naturalHeight));
  const c=document.createElement("canvas"); c.width=Math.round(im.naturalWidth*r); c.height=Math.round(im.naturalHeight*r);
  c.getContext("2d").drawImage(im,0,0,c.width,c.height);
  return c.toDataURL("image/jpeg",0.55);
}
// the admin's WhatsApp: set in Admin → Settings (falls back to config.js)
function adminWaNum(){ const v=String((typeof SITE_ST!=="undefined"&&SITE_ST&&SITE_ST.admin_wa)||ADMIN_WA).replace(/\D/g,""); return /^0/.test(v)?"2"+v:v; }
function adminHref(text){ return "https://wa.me/"+adminWaNum()+"?text="+encodeURIComponent(text); }

/* ===================== Quick dump: paste a WhatsApp message, the form fills itself ===================== */
const KEYWORDS = {
  bag:["handbag","hand bag","birkin","kelly","neverfull","speedy","flap bag","tote","clutch","crossbody","hermes","hermès","chanel","louis vuitton","dior","goyard","bottega","celine","saint laurent","ysl","شنطة","شنطه","حقيبة"],
  watch:["rolex","omega","patek","audemars","royal oak","cartier","tag heuer","breitling","tudor","hublot","iwc","panerai","longines","seiko","grand seiko","richard mille","vacheron","jaeger","zenith","watch","chronograph","ساعة","ساعه"],
  car:["bmw x","x5","x6","x7","g class","g-class","g63","amg","range rover","sedan","hatchback","mercedes","porsche","audi","toyota","lexus","range rover","land rover","jeep","ferrari","lamborghini","bentley","maserati","nissan","hyundai","kia","chevrolet","ford","volvo","peugeot","car","sedan","suv","coupe","سيارة","عربية","عربيه"],
  bike:["harley","davidson","ducati","triumph","ktm","kawasaki","yamaha","suzuki","aprilia","mv agusta","indian","royal enfield","benelli","gs 1250","r1250","s1000","motorcycle","motorbike","موتوسيكل","موتوسكل","موتور"],
  gear:["helmet","jacket","gloves","boots","intercom","sena","cardo","shoei","arai","agv","hjc","alpinestars","dainese","rev'it","revit","klim","خوذة","خوذه","جاكيت"],
  acc:["tyre","tyres","tire","tires","michelin","pirelli","metzeler","bridgestone","dunlop","continental","avon","كاوتش","كاوتشات","إطار","اطار","exhaust","akrapovic","akrapovič","vance","slip-on","muffler","led","fog light","crash bar","slider","top box","pannier","windscreen","windshield","mirror","grips","backrest","sissy bar","saddlebag",
       "oil filter","air filter","filter","engine oil","motor oil","motul","castrol","liqui moly","chain lube","chain","sprocket","spark plug","brake pads","battery","cleaner","polish","wax","hiflo","hiflofiltro","k&n",
       "شكمان","فلتر","زيت","شمع","منظف","بطارية","جنزير"],
  boat:["yacht","boat","jet ski","jetski","sea-doo","seadoo","azimut","ferretti","sunseeker","princess","riva","sailboat","speedboat","marina","يخت","مركب","لانش"],
  equine:["horse","mare","stallion","gelding","filly","colt","arabian","حصان","فرس","مهر"],
  dune:["buggy","dune buggy","utv","atv","quad","sand rail","sand bike","rzr","maverick","can-am","polaris","yfz","raptor 700","banshee","بيتش باجي","باجي","كواد","بيتش","رملي"],
  dunepart:["sand tires","paddle tires","whip flag","sand flag","recovery boards","goggles","tow strap","كاوتش رملي"],
  equinepart:["saddle","bridle","girth","stirrup","horse rug","numnah","saddle pad","riding boots","riding helmet","horse trailer","horse box","سرج","لجام","ركاب"],
  carpart:["tyre","tyres","tire","tires","rim","rims","wheels","bumper","headlight","tail light","spare part","spare parts","car part","brake","exhaust system","قطع غيار","كاوتش","جنط","كشاف"],
  boatpart:["outboard","propeller","fishfinder","fish finder","chartplotter","life jacket","anchor","boat trailer","marine","bimini","wakeboard","water ski","موتور بحري","رفاص"],
  art:["painting","sculpture","canvas","artist","oil on","acrylic","bronze","print","lithograph","antique","collectible","لوحة","لوحه","تمثال"],
  estate:["apartment","villa","chalet","flat","duplex","penthouse","townhouse","twin house","compound","sqm","m2","m²","bedroom","land","office","شقة","شقه","فيلا","شاليه","أرض","متر"]
};
const BRANDS = ["Harley-Davidson","Ducati","Triumph","KTM","Kawasaki","Yamaha","Suzuki","Honda","BMW","Aprilia","MV Agusta","Indian","Royal Enfield","Benelli",
  "Rolex","Omega","Patek Philippe","Audemars Piguet","Cartier","TAG Heuer","Breitling","Tudor","Hublot","IWC","Panerai","Longines","Seiko","Richard Mille",
  "Mercedes-Benz","Mercedes","Porsche","Audi","Toyota","Lexus","Range Rover","Land Rover","Jeep","Ferrari","Lamborghini","Bentley","Maserati","Nissan","Hyundai","Kia","Volvo",
  "Shoei","Arai","AGV","HJC","Sena","Cardo","Alpinestars","Dainese","Klim","Akrapovic","Vance & Hines","SW-Motech","Givi",
  "Azimut","Ferretti","Sunseeker","Princess","Riva","Sea-Doo","Yamaha WaveRunner","Mercury","Evinrude","Garmin","Raymarine","Lowrance","Simrad",
  "BBS","Vossen","Brembo","Bosch","Michelin","Pirelli","Bridgestone","Continental","Recaro","Akrapovic","Bilstein","KW","Eibach","Hella","Bose",
  "Stübben","Stubben","Kentucky","Prestige","Passier","Kieffer","Pessoa","Equiline","Samshield","Cavallo"].concat(Object.keys(CAR_DB)).filter((b,i,a)=>a.indexOf(b)===i);
function toLatinDigits(t){ return t.replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d)); }
function parseDump(raw, forced){
  const t0 = toLatinDigits(String(raw||"")).replace(/[*_~]/g,"");
  const low = t0.toLowerCase();
  const out = {type:null, vals:{}};
  // 1) "Watch for sale" style header
  for (const [k,v] of Object.entries(LABELS)) if (low.includes(v.toLowerCase()+" for sale")) out.type=k;
  // 2) keyword score — an item for a vehicle mentions the vehicle, so item words weigh more than brand words
  if (forced && SCHEMAS[forced]) out.type = forced;
  if (!out.type){
    const PART = ["acc","gear","carpart","boatpart","equinepart","dunepart"], VEH = ["bike","car","boat","equine","dune"];
    const sc = {};
    const has = w => new RegExp("(^|[^\\p{L}])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[^\\p{L}])","iu").test(low);
    for (const [k,words] of Object.entries(KEYWORDS)){
      let v=0; for (const w of words) if (has(w)) v += (PART.includes(k) ? 3 : (w.length>3?2:1));
      sc[k]=v;
    }
    const fits = /\b(for|fits|fit|compatible|suits?)\b|يركب|مناسب ل|لـ ?(موتوسيكل|عربية)/.test(low);
    const usage = /\d[\d.,]*\s*(km|kilo|miles?|mi\b|كم|كيلو|ميل)/.test(low);
    const engine = /\d{2,4}\s*(cc|ci)\b/.test(low);
    if (usage) { sc.bike=(sc.bike||0)+4; sc.car=(sc.car||0)+4; sc.boat=(sc.boat||0)+2; }
    if (engine) sc.bike=(sc.bike||0)+2;
    if (fits) PART.forEach(k=>{ if (sc[k]) sc[k]+=3; });
    const partBest = PART.reduce((a,k)=>sc[k]>(sc[a]||0)?k:a, PART[0]);
    // an exhaust, LED or "oil filter" can be for a bike or a car: decide by the vehicle it mentions
    if ((partBest==="acc"||partBest==="carpart") && sc[partBest]>0){
      const bikeCtx = sc.bike||0, carCtx = sc.car||0;
      const pick = carCtx>bikeCtx ? "carpart" : bikeCtx>carCtx ? "acc" : partBest;
      sc[pick] = Math.max(sc.acc||0, sc.carpart||0);
    }
    let best=0;
    for (const [k,v] of Object.entries(sc)) if (v>best){ best=v; out.type=k; }
    // a part word wins over the vehicle when there is no mileage (a used bike or car always has km)
    const p2 = PART.reduce((a,k)=>sc[k]>(sc[a]||0)?k:a, PART[0]);
    if (VEH.includes(out.type) && sc[p2]>=3 && !usage) out.type = p2;
    if (!out.type) out.type="bike";
    // BMW / Honda can be a car or a bike
    if (out.type==="car" && /\br ?1[0-3][0-9]0|\bgs\b|gs\b|\bs ?1000|\bf ?[789][05]0|\bk ?1600|\brt\b|adventure|africa twin|gold ?wing|\bcbr|\bducati|\bharley/i.test(t0)) out.type="bike";
  }
  const sch = SCHEMAS[out.type];
  // 3) "Label: value" lines
  const lines = t0.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  for (const l of lines){
    const i=l.search(/[:：-]\s/); if (i<1) continue;
    const key=l.slice(0,i).trim().toLowerCase(), val=l.slice(i+1).replace(/^[:：-]\s*/,"").trim();
    const f = sch.find(f=>f.l.toLowerCase()===key || f.l.replace(/ \(.*\)/,"").toLowerCase()===key || f.k===key);
    if (f && val) out.vals[f.k]=val;
  }
  // 4) free text
  const phone = t0.replace(/[\s-]/g,"").match(/(?:\+?20|0)1[0125]\d{8}/);
  if (phone && !out.vals.phone) out.vals.phone = phone[0].replace(/^\+?20/,"0");
  if (!out.vals.price){
    const noPhone = low.replace(/(?:\+?20|0)1[0125][\d\s-]{8,11}/g," ");
    let m, p = null;
    if ((m = noPhone.match(/\$\s*([\d][\d.,]*)\s*(m|k)?\b/) || noPhone.match(/\b([\d][\d.,]*)\s*(m|k)?\s*(?:\$|usd\b|dollars?\b|دولار)/))){
      p = parseFloat(m[1].replace(/,/g,"")); if (m[2]==="k") p*=1e3; if (m[2]==="m") p*=1e6;
    }
    else if ((m = noPhone.match(/\b(\d+(?:[.,]\d+)?)\s*(?:m|mil|million|مليون)(?![a-z])/))) p = parseFloat(m[1].replace(",","."))*1e6;
    else if ((m = noPhone.match(/\b(\d+(?:[.,]\d+)?)\s*(?:k\b|الف|ألف|آلاف)/))) p = parseFloat(m[1].replace(",","."))*1e3;
    else if ((m = noPhone.match(/(?:\bprice\b|السعر|سعر|\begp\b|\ble\b|\bl\.e\b|جنيه|ج\.م)[^\d]{0,12}([\d][\d.,]{2,})/) || noPhone.match(/\b([\d][\d.,]{2,})\s*(?:egp\b|le\b|l\.e\b|جنيه|ج\b)/)))
      p = parseInt(m[1].replace(/[.,]/g,""),10);
    else {
      // last resort: the biggest "12,345"-style number that isn't km, cc, a year or a size
      const nums = [...noPhone.matchAll(/\b(\d{1,3}(?:,\d{3})+|\d{4,})\b(?!\s*(?:km|cc|ci|mm|kg|m2|sqm|ft|hp|h\b|inch|"))/g)]
        .map(x=>parseInt(x[1].replace(/,/g,""),10)).filter(n=>!(n>=1950 && n<=2035));
      if (nums.length) p = Math.max(...nums);
    }
    if (p) out.vals.price = String(Math.round(p));
  }
  const yr = t0.match(/\b(19[5-9]\d|20[0-3]\d)\b/); if (yr && !out.vals.year) out.vals.year = yr[1];
  const km = low.match(/([\d.,]+)\s*(?:km|kilo|كم|كيلو)/); if (km && !out.vals.mileage) out.vals.mileage = km[1].replace(/[.,]/g,"");
  const cc = low.match(/(\d{2,4})\s*cc\b/); if (cc && !out.vals.engine){ out.vals.engine = cc[1]; out.vals.engine_unit = "cc"; }
  const ci = low.match(/(\d{2,3})\s*(?:ci|cu\.?\s*in|cubic inch(?:es)?)\b/); if (ci && !out.vals.engine){ out.vals.engine = ci[1]; out.vals.engine_unit = "ci"; }
  if (/\$|\busd\b|dollars?\b|دولار/.test(low)) out.vals.price_unit = "USD";
  const mi = low.match(/([\d.,]+)\s*(?:mi\b|miles?\b|ميل)/); if (mi && !out.vals.mileage){ out.vals.mileage = mi[1].replace(/[.,]/g,""); out.vals.mileage_unit = "mi"; }
  const mm = low.match(/(\d{2})\s*mm\b/); if (mm && !out.vals.size) out.vals.size = mm[1];
  const ar = low.match(/(\d{2,6})\s*(?:m2|m²|sqm|متر)/); if (ar && !out.vals.area) out.vals.area = ar[1];
  const bd = low.match(/(\d{1,2})\s*(?:bed|bedroom|rooms|غرف|غرفة)/); if (bd && !out.vals.bedrooms) out.vals.bedrooms = bd[1];
  const ft = low.match(/(\d{1,3})\s*(?:ft|feet|foot|قدم)/); if (ft && !out.vals.length) out.vals.length = ft[1];
  if (!out.vals.condition){ if (/\b(new|brand new|زيرو|جديد)\b|زيرو|جديد/.test(low)) out.vals.condition="New"; else if (/\bused\b|مستعمل/.test(low)) out.vals.condition="Used"; }
  const norm = x=>x.toLowerCase().replace(/[-_]/g," ").replace(/\s+/g," ");
  const lowN = norm(t0);
  if (!out.vals.brand){
    let b=null, at=1e9;
    for (const c of BRANDS.slice().sort((x,y)=>y.length-x.length)){
      let i = lowN.search(new RegExp("\\b"+norm(c).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b"));
      if (i<0 && c==="Harley-Davidson") i = lowN.search(/\bharley\b/);
      if (i>=0 && i<at){ at=i; b=c; }
    }
    if (b) out.vals.brand = b==="Mercedes"?"Mercedes-Benz":(b==="Range Rover" && out.type==="car")?"Land Rover":b;
  }
  // Title/model: first meaningful line when not given
  const nameKey = sch.find(f=>f.k==="model") ? "model" : "name";
  // known model for the brand (motorcycles, watches, cars): pick the longest one written in the message
  const MDB = {bike:typeof BIKE_DB!=="undefined"?BIKE_DB:null, watch:typeof WATCH_DB!=="undefined"?WATCH_DB:null, car:typeof CAR_DB!=="undefined"?CAR_DB:null}[out.type];
  if (!out.vals[nameKey] && MDB && out.vals.brand){
    const key = Object.keys(MDB).find(b=>b.toLowerCase()===out.vals.brand.toLowerCase());
    const squash = x=>String(x).toLowerCase().replace(/[^a-z0-9\u00c0-\u024f]/g,"");
    const hay = squash(t0);
    const hit = key && MDB[key].slice().sort((a,b)=>squash(b).length-squash(a).length).find(m=>squash(m).length>=2 && hay.includes(squash(m)));
    if (hit) out.vals[nameKey] = hit;
  }
  if (!out.vals[nameKey]){
    const first = lines.find(l=>!/for sale|^📞|^\+?\d[\d\s]{8,}$/i.test(l) && !/:\s/.test(l));
    if (first){
      let n = first.replace(/(?:\+?20|0)1[0125][\d\s-]{8,11}/g," ").replace(/\$\s*[\d.,]+\s*[km]?/gi," ")
        .replace(/\b\d+(?:[.,]\d+)*\s*(mm|cc|ci|km|kg|hp|ft|inch|in|k|m|egp|le|usd)\b/ig," ").replace(/\b\d{1,3}(?:,\d{3})+\b/g," ")
        .replace(/[^\p{L}\p{N}\s&.'\-\/]/gu," ").replace(/\s+/g," ").trim();
      if (out.vals.brand){
        const parts = [out.vals.brand, ...out.vals.brand.split(/[-\s]+/)].filter(w=>w.length>1);
        for (const w of parts) n = n.replace(new RegExp("\\b"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b","ig"),"").trim();
        n = n.replace(/\s+/g," ").trim();
      }
      n = n.replace(/(?:\+?20|0)1[0125][\d\s-]{8,11}/g," ").replace(/\$\s*[\d.,]+\s*[km]?/gi," ")
           .replace(/\b(19|20)\d\d\b/,"").replace(/\b\d+(?:[.,]\d+)?\s*(mm|cc|ci|km|kg|hp|ft|inch|in|k|m|egp|le|usd|\$)\b/ig,"")
           .replace(/\b\d{1,3}(?:[.,]\d{3})+\b/g,"").replace(/\b\d{3,}\b/g,"")
           .replace(/\b(full set|box (and|&) papers|brand new|new|used|original paint|for sale)\b/ig,"").replace(/(زيرو|جديد|مستعمل|للبيع)/g,"")
           .replace(/\s+/g," ").trim();
      n = n.replace(/\s+/g," ").trim().split(" ").slice(0,7).join(" ");
      if (n) out.vals[nameKey] = n.slice(0,50);
    }
  }
  return out;
}
function applyDump(raw){
  const kept = CAT_PICKED;      // the person already chose the category → fill that one, don't switch
  const {type:tp, vals} = parseDump(raw, kept ? type : null);
  if (!kept){
    const mainBtn = document.querySelector(`#mains button[data-m="${GROUP[tp]}"]`); if (mainBtn) mainBtn.click();
    if (SUBTYPES[GROUP[tp]]){ const b=document.querySelector(`#types button[data-t="${tp}"]`); if (b) b.click(); }
  }
  let n=0;
  for (const k of ["engine","price","mileage"]){ const u=$("#u_"+k); if (u && vals[k+"_unit"] && [...u.options].some(o=>o.value===vals[k+"_unit"])){ u.value=vals[k+"_unit"]; u.dispatchEvent(new Event("change")); } }
  const order = SCHEMAS[tp].slice().sort((a,b)=>(a.k==="category"?-1:0)-(b.k==="category"?-1:0));
  for (const f of order){
    let v = vals[f.k]; if (v==null || v==="") continue;
    const el = $("#f_"+f.k); if (!el) continue;
    if (f.type==="checks"){ const vs=String(v).split(/,\s*/); el.querySelectorAll("input").forEach(c=>c.checked=vs.includes(c.value)); n++; continue; }
    if (f.type==="price"||f.type==="number") v = String(v).replace(/[^\d]/g,"");
    if (f.type==="price") v = v?fmt(v):"";
    if (f.type==="select"){ const o=[...el.options].find(o=>o.value.toLowerCase()===String(v).toLowerCase()); if(!o) continue; v=o.value; }
    el.value = v; if (f.k==="category") el.dispatchEvent(new Event("change")); n++;
  }
  if (window.syncBikePickers) syncBikePickers();
  return {type:tp, n, kept};
}

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

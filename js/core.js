/* High End Communities, shared engine part 1 of 5: Settings, catalogue model, listing cards and forms. Load order matters: core, export, data, business, ui. */
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


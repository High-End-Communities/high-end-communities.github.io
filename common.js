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
  ? "(1–3 photos go online, up to 10 for your HD flyer — tap a photo to make it the main one)"
  : "(1–4 photos go online, up to 10 for your HD flyer — tap a photo to make it the main one)"; }
const BIKE_RANGE = [100000, 2000000];
const GEAR_RANGES = {            // EGP
  "Helmet":[1500,80000], "Jacket":[2000,60000], "Gloves":[500,20000], "Boots":[2000,40000],
  "Pants":[1500,40000], "Body armor / back protector":[1500,40000], "Intercom":[2000,40000], "Other gear":[500,80000]
};
const ACC_RANGES = {
  "Exhaust":[5000,100000], "LED lights":[1000,60000], "Crash bars / frame sliders":[1500,40000],
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
const USD_TO_EGP = (typeof USD_RATE !== "undefined" && USD_RATE > 0) ? USD_RATE : 52;   // used only to check USD prices against the EGP ranges
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
  const a=document.createElement("span"); a.textContent="📍 See it & check"; const b=document.createElement("b"); b.setAttribute("data-noi18n",""); b.setAttribute("dir","auto"); b.textContent=t;
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
const MASAR_IMG = "data:image/jpeg;base64,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";

const thisYear = new Date().getFullYear();
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
    {k:"name", l:"Item name", req:1, ph:"e.g. Slip-on muffler"},
    {k:"brand", l:"Brand", req:1, ph:"e.g. Akrapovič"},
    {k:"compat", l:"Compatible with", req:1, ph:"e.g. BMW R1250GS 2019–2023"},
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
const ICONS = {bag:"👜", bike:"🏍️", gear:"🪖", acc:"🔧", watch:"⌚", car:"🚗", carpart:"🔩", equinepart:"🏇", boatpart:"⚓", equine:"🐎", boat:"🛥️", art:"🎨", estate:"🏠", dune:"🏜️", dunepart:"🧭"};
const GROUP = {bag:"bag", bike:"moto", gear:"moto", acc:"moto", watch:"watch", car:"car", carpart:"car", equinepart:"equine", boatpart:"boat", equine:"equine", boat:"boat", art:"art", estate:"estate", dune:"desert", dunepart:"desert"};
const RANGES = {bag:BAG_RANGES, bike:BIKE_RANGE, gear:GEAR_RANGES, acc:ACC_RANGES, watch:WATCH_RANGE, car:CAR_RANGE, carpart:CARPART_RANGES, equine:HORSE_RANGE, equinepart:EQUINE_RANGES, boatpart:BOATPART_RANGES, boat:BOAT_RANGES, art:ART_RANGES, estate:ESTATE_RANGES, dune:DUNE_RANGES, dunepart:DUNEPART_RANGES};
const SUBTYPES = {
  moto:  [["bike","🏍️","Motorcycle"],["gear","🪖","Safety gear"],["acc","🔧","Accessory"]],
  car:   [["car","🚗","Car"],["carpart","🔩","Parts & accessories"]],
  boat:  [["boat","🛥️","Boats, yachts & jet skis"],["boatpart","⚓","Parts & accessories"]],
  equine:[["equine","🐎","Horse"],["equinepart","🏇","Saddles, tack & accessories"]],
  desert:[["dune","🏜️","Buggies, ATVs & sand bikes"],["dunepart","🧭","Gear & parts"]]
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
    d.innerHTML=`<b>📢 ${esc(r.title)}</b>`+(r.body?`<p>${esc(r.body).replace(/\n/g,"<br>")}</p>`:"");
    if (r.link){ const l=document.createElement("a"); l.className="btn ghost small"; l.href=r.link; l.target="_blank"; l.rel="noopener"; l.textContent="Open"; d.appendChild(l); }
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

function priceRange(){
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
  const box = $("#fields"); box.innerHTML = "";
  for (const f of SCHEMAS[type]){
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
      for (const o of f.opts){ const op=document.createElement("option"); op.value=op.textContent=o; if(o===f.def) op.selected=true; el.appendChild(op); }
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
  if (cat) cat.addEventListener("change", updatePriceHint);
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
function priceStr(f){ const c=f.price_unit||"EGP"; return c==="USD" ? "$"+fmt(f.price) : c==="EUR" ? "€"+fmt(f.price) : fmt(f.price)+" "+c; }
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
      b.innerHTML = `<span class="ic">${ic}</span>`; b.appendChild(document.createTextNode(label));
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
    if (best!==0){ const ub=document.createElement("button"); ub.type="button"; ub.className="btn ghost small"; ub.textContent="✨ Use the suggested photo";
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
    $("#photoHint").textContent = `${Math.min(photos.length,online)}/${online} photos go online (reduced from ${(saved/1048576).toFixed(1)} MB to ${Math.round(now/1024)} KB)`
      + (photos.length>online ? ` · all ${photos.length} go in your HD flyer` : ` · add up to ${FLYER_MAX_PHOTOS} for the HD flyer`);
  } else $("#photoHint").textContent = "";
  $(".photos").classList.remove("bad");
}

/* ---- Validation ---- */
function collect(){
  const data = {}; let ok = true;
  document.querySelectorAll(".field").forEach(w=>w.classList.remove("bad"));
  const fail = (k,msg)=>{ ok=false; const w=document.querySelector(`.field[data-k="${k}"]`); if(w){w.classList.add("bad"); $("#h_"+k).textContent=msg;} };
  for (const f of SCHEMAS[type]){
    const el = $("#f_"+f.k);
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
  const tw = $("#termsWrap");
  if (!$("#terms").checked){ ok=false; tw.classList.add("bad"); } else tw.classList.remove("bad");
  if (!photos.length){ ok=false; $(".photos").classList.add("bad"); $("#photoHint").textContent = "Add at least one photo."; }
  return ok ? data : null;
}

function titleOf(L){
  const f = L.f||{};
  if (f.model) return `${f.brand||""} ${f.model}${f.year?" "+f.year:""}`.trim();
  if (L.type==="estate") return `${f.category||""} — ${f.name||""}${f.location?", "+f.location:""}`;
  if (L.type==="art") return `${f.name||""}${f.artist?" — "+f.artist:""}`;
  if (L.type==="equine") return `${f.name||""}${f.breed?" — "+f.breed:""}`;
  return `${f.brand||""} ${f.name||""}`.trim();
}
function rows(L){
  const out = [];
  for (const f of SCHEMAS[L.type]){
    if (["price","phone","model","name","stock"].includes(f.k)) continue;
    let v = L.f[f.k]; if (v===undefined||v==="") continue;
    const us = unitStr(L.f, f.k, v);
    const num = !isNaN(Number(String(v).replace(/,/g,"")));
    if (num && us) v = us; else if (num && UNITS[f.k]) v = (f.k==="year"?v:fmt(v)) + UNITS[f.k];
    out.push([f.l.replace(/ \(.*\)/,""), String(v)]);
  }
  return out;
}
function listingText(L){
  const tf = SCHEMAS[L.type].find(f=>f.k==="model"||f.k==="name");
  let t = `${LABELS[L.type]} for sale\n${tf.l}: ${L.f[tf.k]}\n`;
  for (const [k,v] of rows(L)) t += `${k}: ${v}\n`;
  t += `Price: ${priceStr(L.f)}` + (phoneOf(L) ? `\nPhone number: ${phoneOf(L)}` : "");
  return t;
}

function safeId(id){ return /^[A-Za-z0-9-]{1,60}$/.test(id) ? id : null; }
let SHORT_URL = "", INCLUDE_LINK = true;
function baseUrl(){ return (SHORT_URL || SITE_URL).replace(/\/$/,""); }
function linkFor(id){ const s=safeId(id); return s ? baseUrl()+"/item.html?id="+s : baseUrl()+"/"; }
function itemHref(id){ const s=safeId(id); return s ? "item.html?id="+s : "./"; }
function waHref(text){ return "https://wa.me/?text="+encodeURIComponent(text); }
function shareText(L,id){
  const icon = ICONS[L.type] || "🏷️";
  return `${icon} *${MARKET_NAME}*${isFeatured(L)?" ⭐":""}\n\n${listingText(L)}` + (L.discount ? `\n🏷️ *${L.discount}% off* — get your discount code on the site` : "") + (INCLUDE_LINK ? `\n\n📸 Photos & details: ${linkFor(id)}` : "") + `\n\n_⚠️ ${DISCLAIMER}_`;
}
function catalogueText(items){
  const groups = {bike:"🏍️ *Motorcycles*", gear:"🪖 *Safety gear*", acc:"🔧 *Moto accessories*", watch:"⌚ *Watches*", car:"🚗 *Cars*", carpart:"🔩 *Car parts & accessories*", bag:"👜 *The Boutique*", equinepart:"🏇 *Equine accessories*", boatpart:"⚓ *Marine parts & accessories*", dune:"🏜️ *Buggies, ATVs & sand bikes*", dunepart:"🧭 *Desert gear & parts*", equine:"🐎 *Equine*", boat:"🛥️ *Marine: boats, yachts & jet skis*", art:"🎨 *Modern & art*", estate:"🏠 *Real estate*"};
  let t = `📒 *${MARKET_NAME} — ${CAT_TITLE ? CAT_TITLE+" catalogue" : "Catalogue"}*\n`;
  let n = 0;
  for (const [g, all] of bySection(items)){
    const xs = all.slice(0,40);
    t += `\n${groups[g]}\n`;
    for (const {L} of xs){ n++; t += `${n}. ${titleOf(L)} — ${priceStr(L.f)} ${phoneOf(L)?" — 📞 "+phoneOf(L):""}\n`; }
  }
  if (INCLUDE_LINK) t += `\n📸 Photos & full details: ${baseUrl()}`;
  t += `\n\n_⚠️ ${DISCLAIMER}_`;
  return t;
}

function showMsg(text, kind="info", el=$("#msg")){
  el.textContent = text; el.className = "msg" + (text?" show "+kind:"");
}

/* ===================== Flyers & catalogue export ===================== */
let lastL = null, shownItems = [];
const MAIN_LOGO = "data:image/png;base64,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";
const LOGO_SRC = () => MAIN_LOGO;
const BRAND_LOGOS = {
  moto:"data:image/jpeg;base64,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",
  car:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAElAWwDASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBQYBBAkCA//EAF8QAAECBQMBBAQHCAwLBgMJAAECAwAEBQYRBxIhMQgTQVEUIjJhFRhCVnGBlCNSkZOhs9HTFiQzNjdUYnWEsbLSFyY0Q3JzdIKSorQnRGTBxPBFRoU4U1VjZYOVwuH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtTCEIBCEIBCEIBCEIBCEIBCED0gGRDMRBf2tE3phqXLU+45Rv9ilQlmyxNtpJcYdyoLUR8sD1dwHIBSRnoZVptQk6tJMT9PmmJuUmEhxp9lYWhxJ6EKHWA7UIQgEIQgEIQgEIR1apU5Gj0+YqFRmmZWUl2y6888oJQhI6kmA7WR5wzFbLg7a1AkKkqXodsztWk0r2madmBLbx98lGxRI8s7T7hEp6Va1Wvq1KumkOuy1Qlxufp8yAHUJ6bhjhSfeDxxnGRASBCGcwgEIQgEIQgEIQzmAZEAQekRTrHrrTdOm/gelFipXPMYS1KA5TL56Kdxz9CB6ysjA5zEh205UnrepblZQlFUVKMmcSj2Q8UDeB/vZgMnCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBHCukcwPSAhDWe67Om6w7YmpFKmJGmTTaJil11r10trIwTwMoUlQI8QQfWAHJiaVGo/ZzeFVoM6xc1kzKu8S+wrvpN1J+UrBJZX/KBweOVYxEw63X3adKnkWzqHZ85O0OaaD0rU5fDm1fRX3qm1JOOUknCh54iKKFQ6dR5lU9o5rBT2W3lZXRq473Ad80lKxtcOOOUA8H1oCa9Oe0VZN/huXVOCjVRWAZOeUE7leSHPZV7hwfdEp5EU5rdnNVApmbx0yqlCmV+t8NWjtfk3c9FLZCihI8SUrSTk8eEZqzKncFBSluzNT6ZU5Bv1RIT6gw4QPkJZmNqUDI6ocOfPxgLWZEMiI1ty+b57ieTcVooU7LyL04y7IKVsmFo2kMgncncoE4IWRlP1x82d2iNOrvS2luutUuaXx6LUx3CgfIKPqK+gKJgJMhHw082+2l1pxLjahlKkHII9xEfeRAD0MQP2uGa9UbLplJpDks1KTU4VTi5idalkr2Iyhvc4tIVk5O0ZJKBiJ3JGPOIn7S1p024tNpmfn6XUKkujrTNNtSL4adAJCVqBKFggIJUfV6J8IClatNb23JCbRrzoWdqVsyLjiFn+SpKSFdfAxumjlrXrbGptuzrEgZOYE602/JvzLTMwuXWoJd+4KUHFJ2FRJ2kDGT0jTCxYruxQqFzSwz6zZkWHuPIK75Hv52/VEs9mag2xWdT5R2mUmvTfwY2uaVPzL6G2mTjCMtIQeSTxlzwPBxAXST18frjmPkH6BH1kQCEMiMDc1+2tZzSnK/X6fTiBuDbzw7xQ/koHrK+oGAz2YZERjQdcafezFfes6i1GrtUhlJDykFtMy8tRCW0DBVjAJJKeAOkajdF36pTg7qZqFv2cwsbgt59tClpwSUnvFF0Kx4pbyPf4hMV03nb1l09U9cFWlaeyBlPeq9dfuSgZUo+4AxXO8+0rc1/z5tfSqkTqXHwUmc7vMyoeJQnkNJ/lqOQCD6pEak5bNuVueVMzs7dupNWKsKZpDDgb3D5Lkw4NxTz7SUDA5z1jY1Uy95eQVS/TrQ0foCuVsInUJnHhj5agouLVg9CpGR4QHXty3rO0MnE3Ff9STcd8qUXZejya+/VLOHnc4o8b+faV05KQogGLT27OztSoVPnqlJegTszLoeeld24sLUkEoJwMkZweOoirFrVrRXS2ebmaSmq3/c4V9zmUyx2Jc80BWADnooBas9DzFrKTMzU3TZSYnpT0KbeZQ49K953ncLKQVI3YG7B4zgQHchCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAgekIHpAaJrLU6VSLIem65azly0kOpE3LNgFTLZB+7DOOhwMggjcTkAGKpVS3dEbieU5RrtrlpuqP8AklWp6plCT4JCkElI/wBJSovMpIKSCAQRgg85ir2qNX0Hp9fn6fcNhV2WqbDpQ6uny6ZcHP8AnAA6lCgrqCQc5z5wEcUKyK3Q5gPWbqxbOCdwblq4uRdcHvQ4Ejp9PTmJAp7Or86EfDFIty6EA90h2cXIzislORju8OHnj2gYjqdmez+8lRl5LUhhWchKVygSfcSoq4jpsTWjLDyXJanX3MEDlE1NyKUkfW2cwFhrGsl9u5pFdSsh2hu7i6mfpsw+0lpaPWAWguLRsVgpxk54yME41rUbSrSOsXDUpuVumh0ifU8oTlPeqiJJSHs8lG8EJyckpKCDkYKPHo6bPsUeeZrdnaa3A46wHEpmHpxLDa0KyCFudwhpaR1wXCBgEdBEh6kWrL3/AGzTa+vTSl3RUHGvu6JWtiXfaI42oeQkpeSCCOVD3DPQIokdCKtSWfTLYvmu0dC8lKkS61Mnjr38m44nHvUE+8RlJe3O0JItOuW9f9PuIMclMtUG31564IfQAD7ifdH4UOk3DabqJujaSsWxsUT6XVrpeaQgZzyO9RkfQk5/DG3JvCo3PSrlnqhX7aqNao9Cmp+VFAk3FJk3W0hTa0zaj1Kv82NwUM5JAOQ0O0O01qBRq+7SLwEvNPS61IdYmZRLDpUnlTYUgpCVnBCcpUCogHAO4Wmqk829as5Py0+qSaXIuPtziWi4WElsqDgQBlRHXbjnGIp/2kqF8K6+IpsohLcxVEyTO4c7lrw2Cf8AlH1RdCUlm5KVZlmQEtMtpbQPJIGB/VAUz/ZncC+Rrra6geRupbmT9I9F4iZ+znXJ6ru11ue1BkLsU2llSWpGRUy3LA7/AFistIyVYxjnATnxirte1dv6SrlQlRc80oMTLrQOxHICyPvfdFn+yZclbuuwapUa5UXJ55NVWwguJAKQllpXgB4rgO1rxrdNaZd3TaU3K+nrl0zClzCCsgLUtKEoSCMk924SonCdo4VuxEVWrdHaJ1SkV1OkVZMnSQpSfSnGpeWa44VtVt3qA55GQCOuY7fbUoRarFt19Iz38u7JLPlsVvT+HvF/gjfKMhhixbabccal5KQs+Wn21OSfpTLEwso3PqZyAsjkjyyojxgNAc0z1IuH7nW9W35xCj67FHcm6glB8ApLSUoSfD1iB746EtoLZVNnO4uO8ZSnv9XDV6jLS7h8yJdDi1HP8p1JB6g9I2utXhd95SaJJMvZt7SO0kMUytPU6YUk+LjJdQc48NpxjiOlZ2lqajcCFTugnoe10rcmKlcbpl0c9SgpWXPo9YHx84DfzZNls6YyktZ0hM3DTJaYyhiTmnEonnlFKVvOrb5XtSFdMgYwBwMaRO21e1K+5UXTm2pQL4Q9NNIWtKs5yHZlxY8M8pBjetTatPTbE5aslY7lYt+VDKV/BVRQlSCkBXdrl0IWoJ9nCdhBxzxFd649pkw+5LVa1LrpTxXuWhh+VaWgdeEuS6VDofAZx155DPXDI6s1pss1+/qRRJbGFMv3DKy7WPLZL4B6Y6HmNTltOLCkHCu59V6Yog5W1R5J+bU554cKUgePOD+WPmXc0J7wF+X1JCE84S7JKz7j6o/rjYaLWOzjLTKA9bF7z3OR6UpGB49Gnkk/+8wG/aH1LS6VvCSpdiWjXqrUl7i7XKmlH7XaAOXBzhP3vCUkk4yYsyAfGNP0qXbE1acvP2nbq6FTZolTbTsqlhx0DjeQCSQfAk8j3YjcYBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIARkERrt5WlR7mprpqNt0yuzDTZ7hqcSkEnqEhwglGfMRsUCMiAqbW6NM06cebp/ZqbS8CfXcfdm2/HGNiQny4SSPfH5S7OrkoyJuUtax9OJIHJnnZWWkwj6VOla/rxkRZC+LSqV1yCJem3VVredQc95I7cOe5XG7/hUmKx6haV2RYFRD1/3zc9x1FxBdRKysoUuuoyerrilpA8+c9YDqelUmr1VqVr96XDqRWVLAbpdKQ56KlfXG90HKeM5bayPqyJvsaUtqs0KdsOtStuNTQdW8miScy4txjCRkLfKiVvjPrFBykKAPB5rvSLkui6Urt3SSy10KQe9R56R3OTTyf8A8+bVjan3ApHOIzVHplK0yrEpLTjrFy3q04EsSEkCuTpr3yd+3l54E4DacJBJJ9Y5IbLV9F3aNOTL1L0YFQCFFQnKrdCFS6fEqLYUhRHidxjY9Op1NUnJq3ZiryU1LvSb0rNyttS6GKLSg6naN7vBdcUralIBUclXJxxng1J3hb8zTbslJe97soyQt2jy0wJfZnGEuYWllSxxvKQdpITg8boruO1NR6+nNzSVI04saQO9TDamkMMg8EpbbO514+B4yeBjMB+WtfpdOvOytT3WFKQy7LS9SQP8xPyruXGz5Z2nb5hJMWzRU5d+kpqco4mZlnGBMtLbOQ6gp3Ag+RGPwxArV1W7e9vSz00FSTF0T/wLJytSSqYRWEtobQh57bhTT247e9R7JCd24JEbTpBLVu13Jmznky1XtuXccZYnGqgw+acvJ3SrnKVrGdwB7tKgeCMeyFfruZ0kplHol2vW1Xqgu6vSZwyoqyWxJlDmxSQQ3lQK9/XyiceytXLaqlpViVtehzlIk2J/vHETU56Spbi20gkK2jAwhPEUqnazNz9Op9PeUDL09C0MIGeAtZWrx8yYtH2TqhUaXpXccxRqT8LVNVU2S8qHm2d6u5RypSyAEjknGTjOAYD9e1tOOXNX7SsWjo9Lqrrq3y0jkpKylDYPlnCyc9AM9I3l5IoduVJqQeqy5ekSElQmJikFJmUiV5ffbQo/dEJU42hYGT6ixGp0CmSdBrDN03Jc0kaxdE+JBVVknRMvhasAsMlOWpVIGAVbnFbem3w1q5UVO/bhRJ2NPJoF22kt2npoS5nuw4224rDsqtRGVEZ3hRG4ckkYyA27N3+8ualbPs/UeUV63wlSJ5NIngf/ABCNyQF+4oPHiYk/TfTu1dN6c/ctYto2y6xylVQqonC1ng7dvqAngDAKiSR9OFsehztRmHKtqlpnJ0eekGlTLtySkw3L7toJKnUNLCirA5IyDxwBGv6k3exVm2hdqjXLSqTxcpNVpjQbclDhQwjOSVpTkONPe16xGMbSGJvdu31LFwVunvycvOPOOMXRaiyqXWtSirDjTitzK8nKkhaVFRV6pwSetTZ3UGpyyJe0dSbevyUPCafVu7E0vjopqbGf+FfMYNy2tRLBbXclmTrd0WzOg94/Itd+xMt+KZmWOSCOQcg4yfWEYmUm9Kb5fKK1SapZFTUcOP0kGYkSokDJZVlbfJwAk4gNxVJ3cHy3X+ztRZxYyCqmyLkuCMY6tqUnPHUCJX0qsGiTxVOVLRqmWwlpOWVzcwJtxas5GELQFJxzyrBGBjPUNOtEK1aypaZY1TuGapZw61KIa7tCkEZCSl1S0gYxnCQfoiZgDmAJSE4AAAHQDwjmEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCED0gGYZEU4thVLum771Rd+rFdtkSVWdbkmm6t3SVoLjmcBWeE4SOPON31UnKrYOhMguyLtrFZkJqo4ma6Jjvn0S6t2drifZG9ITkEeWRmAshkQyDFeNJ7cAu2n1fTvVV24LfLYNVpVWnFLmDnIKg3tG08ggkA5GMkRrWsWnNSsOpWumQ1AvJ5Neq6ZJ4O1BQ7pC1DlGMcjPjAWsyIZiuGslo1DSbReqGm3hcs/MTNRllelTk6outDkFKVJwQD5RxV9K7vtCxDe9ramXU5UJSRFSdkp+ZL7D6Ut71J2k44G7GQrPTjrAWPODxwfdH5vyzUygIfZbdSDnC0gjPnzGr6U3orUPT+i3M6yll6dZV3qE9A4ham14925Jx7o22Ai7UazNSrvWuk0K4qRbNAV6qlyocM04jHIJwAPoSpPvJzgRA9Z6rEeXaek9IqdauyYHcT90vslDcig+0llZ9VsnnKgTgcBSlY22wPSOlVaciq05+RdmJhht5Oxbku6WnAnxAUOU5GRkYIzwQeYCrlLbnrenGtPLMqpmKs0sT91XMh0tsSmzJ2bxj1G+SRkblDB6qSNorl32PelPk7lvS3Zus01VS+C7eCXXA9PYThx4s70NEKWAOg64I4jepbTmw7ptYW7a1Sk0W2mYzUmqPMpcXOqTght58FSsdNwzuIxyB1/aqaVMzN4Uq4VNsu022JLu6HRJdOxIeAzvUpRAByEBI6DakkwGBdZ09rWqcpLs1Miq2405KUyloli3IyTyUKcWs7UgEgAHkhI2ADnEdOzLLoVsotqSlL2Yq71Vrz9Vem2G95qT7TagW0bCUpbSSpSlEnkfygBq1F0Zu+2adVZx9sTt7XiXZRTzWVS1Il3Vbph5bnTec4ABzk+rnmN303tJbt8om5dKxbloSaqRTHHEbTOzijmamR7slSSRwSTjoYCjVRbQzUJptsYQh1YSB4AExZXs6y8qzptSqs7VUUx+RvYd0tbSlImC5KttlpRSDsCkuLAWeATzwYrpc7aWbmqzaE7UJnXkpA8AFnEWh0Ds83v2ba7RZVaJedmKk85LPdCiYQhpTaifDlIBPXEBmZ3TPT+3LPuajVe7S/QWasicYEonM3RptRLYSSndwcBI3JSOD44IyFdndKLnnbNm61S3KrUK2syspXEJVKFcyyoN/dShaFhW/aAMEc+QjGS9uT1zPrrs7SJp2nXTJpol2U9lr7vTZ9rCUTKUeKQoBXjgL3854+7V7PVYFmVuw7jm20y0tPpqVCrcsoKU24QQrKCQpPCQSnp65wcgGA6Fy6lXbNSzdelWFvzNrOmRuW2UuKUhLfrAvgEEvNrQSCVZ2lIUOMk621SJ+hoVX7VkHr40vrx/b1HA7x6SUfaSpPtJdb8HB4Abj7KjYBenCJuu0q7VzfwfdctLoYnpqSH3CfTtAW242cbkEjI6KGE8+qI+7Jt6xZaq1GrWVNyOXV91PMUudDkt3g59ZtKilCxk9Np5PnARPZujdWpD7V06Q3s9I06bO52lVhlYCSBy24MckZxykEDkK5yZ5o8nOLk2X63KUxNVA+7LkwVNlXTKSoBQ4xwenTJjJAcx9QHABB5/DHIUD0MD0iFLs0uu2/r4rM9c911KgWjJMj4MZpU6GiSANzjuQQMEKPIzyMEYgJryIZiq1ra1XXb3Zzqtcm5x2fqLNTNJpNRmU7lLSpKT3it3tFPr4KsjIAOcGO/WtGr3taxHr8Y1JuNd1yUp8JTTTkwVMKSlO9bWCTnanPXIVtxtAPAWayPOGREGTdQvzW7TWy5u2p/4Dl6otXw9Ny7vdPNJbX3aw144KkuHGfBIzjOcTp43VLA7QD+n1HuKr163/AIN9Km26i+HlSTmMg5AASSSjoBkODIOMwFiciGcxXTtA3/XbhmKraFlTr8o1b8kuqV2pS7ikFvYklEuFJIIJOMgH+yoRKOhs7M1DSa2JqcmXpmYdkkqcdeWVrWcnkk8mA3qEIQCEIQCEIQCEIQCEIQCEIQCEIQCCuhhAwFQ7Lfo1pXdfCr00qrtyCdqzrkk8i30TYQgOOZwXcYB3JPGQcRLNavi4GNMpOtabWAWpJiYWxNUGpU0svJl+dxaYaWB1PTnOc46xMQBhgwFUKfIS196yWjW9OrBrVptU+Z76tTMxKCVZU2FJKkBKSU5KQ4njBVv5HGYkXtGUmo1SpaeKkJCamxL3Ay48WGVL7pG5OVKwPVHvMTTg4xHODARB2qaZP1jSSYlKbJTU9MGdl1BmWaU4sjJycJGcRp1W1Xuy7bCNk2tppdSKlOSAprk3Py5YZZSWwhatx46ZxkpxkH3RZDBhjjEBqelNlr090+oltOvJeekmT3y0nKS4tanF4PkFLUB7o22OMEGPiYmGZZhx991tpltJWtxxQSlKRySSegA8YD7KgEk5AA8Ygu+O0dKSdZmJK36C/cdu0tQbuKpy4Jbl21ko2tqGATnnJODggffDEVvUeb7QF3PaeWTWW6Vb7TZXU6mVhMxPNAgKbYSedpzyfEdcDhU2WvY9v2fbaLcpFOZZpyUFDjagFF/cMKLh+UpQ6k+4dOICpYeqnZuvCTu21ZldbsGvhK21oV6j7RyQ0s/JeRk4Vxnn+WkW8tW6KTedBlK7RJtM1IzaN6Fp6g+KVDwUDkEeYivt32xI6Lzz9CrjCqjpPdD5bLR9Z2iTShkLSTk4GCQRzhPmn19Ntuv1vst36iQnX1VeyK1h9mZZO5D7JxtfbwcBxIICh4jHhtMBcrGceX0wAIHSOrSqnJVqny1Sp0y3NSc02HWXmzlK0kZBjt5BEB5l360hi+riabTtQiqTSUjyAdViLk9kNCU6OsFKUgqnpgqIHU5A5+oRUHVJpEvqbdzTY2oRWp1KR5APrAi5PZOQlGilKISAVTE0VEeJ75Q/qA/BAS/jGTj/AP2A4HgRH1nIiCO0brwbFlTadsul25p1ASpbYJMihQ4Ix/nTkbR4Zyfk5DCdovW2dXOHTSxFOzVZnFejTr0p6ymyrj0dGPln5RHsjjrnbh7Wqb3Z4lG7St6kuXdeE0E1O4GJYqU3IyyEn7mkp+WArrjxzjlIjC21b72jErJstMNVTVy5/uUlLOFKxRm3M/dFk5HeEEkk+8dArdYjSbS2T0zorqXHzP1yor9IqlSWSVTLpJJwTztBJx58k8kwGYsO/qDqNQWq3b84l9hfquNq4dYX94tOfVP5D1GQcxsmcxBeqNizOmM7OaqWDOytJfYT3lYpbyw3KVFoHnA6Bwk8AcknjCj62+6V6r0HVehCpUl3uppoBM5IuH7pLLI6H75J8FDg+45ADdz0isuu1+XPclzPWSi3rsk7SYdCKlOUqnKemJ9IGShBJCQg9OvPU5HqmzR5jjGfCAr9XrdkdXdEJ61rNtauW4aI40uQkqvLCWL60gkgHcd24KX6xPtEEnqYw9a1pvC6LCesSW06uVN2zsoabNLclylhAUnYt3cRkZBJ5ACd2dxxzZnBjjaePAwEB3DU7q0D0etm0rZoc5Wa48w8lc1LS6n2pJwqDjiiEjn1nSEA4B2knpg9HQupU+lKfo0nbV9IuyvIecnLjrVLDbReDa1jcsrUUoyOBg7lEZ68WLA90c4gKo1PRnVywdPbmlpW4KNPyU+hx+oMS8st6bnVL4VhZb3FWD5+JPiYl3s40m56PpjTpe5HUYwDJS3clpyVZx7DgKQd27cfoIiUY4A5gOYQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQjo12rylAos9Vp8uCUkmVvvd22Vq2JGThIBJ4EB9VisU+hUuZqdUm2ZOSlUFx591W1KEjxJ/8uueIpZ2gdeq3fxbpdLl52l2m9lbKnG1NqqgSojvCSBlvI4SPEZPOAJat2l1XtM1Bm5rkUZGwZOYUafRWncuTy0nBW+UnjBB468kDg7lSVqZpHQNSbPFvPy7MkZRGKc+y2B6EoAAbQMepgAFPQgDoQCA896JXKjbdXlaxSZtyTn5RwOsvN9Uq/R4EHgg4IxFzbb7V9pzGnK69WnAxW5UBl2ktHLkw7jhTf8g4JJPs9D4ZrtbXZ0vevX5NWm/IrkEyC/25PupJl22z0Uk/LKh7KRyfHGDi2I7Pdjo06dsduQCZdz7oZ4hJme/xw9vx7QyRjpjIxgwFK9TNUa/qnX1VWtP7WkEplZNB+5SqCfZT5k8ZUeTjyAA3HSy/6NX6CrS/UN1RoE0vNMqKjlylTB4SQfBskn3DJzwTjUbt0nui076FmuyDs3UX3AmS7hOROIJO1afcfHPTBz0MWe0v7KNvUW15lN6S7dTrFSY7tzafVkEkdGj4uA87/dgcZ3BoOml913s4Xs9YF77lW9MOhbE0kEts7jw+2SOWz8pPgQSOQQbdS7zUyy2+w6h1lxIWhxCgUrSRkEEdQR4xVis2mXS3o3qPMpS6gFVn3QtHBHgwtRIznCUlP0D7ww0N1Zq+ltyL0s1F7yVaad7mSmXlZEspXsoKuhaV1Sr5OfI+qEF6zMpY1Zu9KBgGrzSvrLhJ/KTFyey0hKNDLcUkAFZm1Kx4n0p0f1ARUDXZpDGsN2JRkJNQWv6zgn8pMWJtDVik6P8AZstmccS2/U5pmYEhI7j92cL7hKlY6IBOSffgcmA3LX3XGU0popk6etuYuSebPorHB9HT075weQ8B8ojyBxA1vSTGj1GGqF8t/CV7VgrfolLmidyFK9qafHgfWyB7x0Uco4tSmCUbd1p1U76pTM49uodJcH3SpzHyFBPg0njAxjABxjaFTJZeh/7MpSpXTq1LJqVfr7QSJU5SmlscFDbfihwY5PUdOSVlQUwrVxVW4a3MV2pzr8zUZh3vlzCletu8MEdAMAADoBxFptCO1JLVCXbtzUGeblptpOGKu8QlD6R8l09ErH33RXjg8qhTWjQ2taR1TvCXJ+gzC8StQCcYPXu3B8lY/AoDI8QJy7M/Z9FCl2L1u2TCqk8nfT5F5IPoqCMh1YP+cPgPkjryfVCH+0DrnM6p1k02luOs2zIuftdvoZpYyO+WMeR9VJ6D3kxHNo3dWrJr0vXKBOuSk8yeFDkLSeqVDopJ8Qf0RYztAdmEtmZuuwpMqRy5OUdlOSPNbCR4dSUf8PkOOzD2f1OKlr9u2TwhJDtLkXk4KjwUzCh5feg9fa8shNGkuschqPLuU+elXKLdEkgGepMykoWngfdEBQBKDke8ZwfAmRsjOIjfVPR+WvlxivUabNDu+m4XI1Vngkjo27j2kE/SRz1BIPX0b1YnL1mKna9xyPod1UA91P8AcevLu4UU70qTkJORyknzI4yAEoQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhCARwoApIVgg8HMcwOccQEAXBS5/s53Q7dlvyzszYNUeBq9LaHFMdUQA+0PBPu6fJ6bNuT1e7S9u2TQWf2NzcpW6zUGA7KpQrc0whQBC3cHI4OQjqfHAiZpqUYnZd2VmmG35d5JQ404kKStJGCCDwQR4RRbtC6FTGl9WNVo7Tj1szrmGlcqMo4ee6WfLrtPiODyOQxOnevV0Wdfj9zVCemaq3UlgVRl1efSEZ6pHRKkj2cYAHHAJi59S1gs6l2I1fD1VbVSJhG6XKOXHlkfuSUde8yCCD0wc4AJFC9OtN7g1NuBukUGV3kYU/MryGZZH3y1eHjgdT4ZizN8dkimo03l5G1pl9y4KbvmC6+4QmoKUkb0bc7Wydo246YwSc7gES1TtQ3XP6mSd3NNtNSEjvYYpfBT6Osp7xBXjO5WxJ3eBAwMcRcey79od+WsxclJnG/QnGyp0OKAVLKAypDn3pT4+GOehBjzXmpSYkph2Vm2XWJhlZbcadSUrQoHBSQeQQRjETb2ftI7t1Bk5xt2pVCj2RNrSJ0NrKPhEoPCGx0OCMFXQdOSMQEqXrPzXaZq6bTtOWZbtSlzQcnrkea3ZdTkbJbzOD18c+Axu27WfQWR1HtKWYlHnP2QUqXDUlPzTm5cwkAfc3l4yoKxnd4KJPQkGTaDQKZbFJlqRR5JmSkJVAQ0y0MBI/rJ8STkk5Jjq3hd9Hsa3puvVyaTLSUsnJJ5U4rwQkeKieAP8AyBgKG9ohlEvrTdKUZKTMpXz5qaQT+UxOGn2hsrqJTtPK5WAg0CmUNO+W3etNvl91ewjwR62VeeQB44hTtHrZd1nuB9hRU0+JV9JJB4XKtL8Ppi1OiV90GSoNo2I5MBiquW9LVBlCzgPhe/elP8pO3djyVx0OA6usOmleFzUbUe0W26pULfQAKFNJ3MuNjxYHyHADnjk4SRyMHeNNtTqFqdRfT6WtTM0we7nJB/h6Uc8UqHiM9FdD9IIG3kg8dYhvV3ROdq8xNXdp9POUK7FMLafMu53KKg2oEKSojgOHwX5gZxgKARn2mu0CJl52ybSmgpth1JqE+2Qrc4hQUG2z4bVAEqHiMeBzuugXaSlb8RL23dLrcrcQAQzMHCW6gfcAAEudPV6EnjyimdRp85Sp5+RqMq/KzjCyh1l5BQttQ6hQPIMS12etDprU2tJrFUQ9LW3T3Ap10EoVNODnukK8PAqUOg4HJBASz2m+0AKE1MWNak3tqLg7uozjR/yZJ6tIUPlnxPyQce17McaB9pGb0/cYt25nXp221Ha25grdkM+KfFTfmnqOqfI5TtB9mqatpc3dloNPzlJUouzcllTjspnJUsHqpvzzkp6nIyRAlv0CpXPWZSj0mUcmp6ccDTTSBySfH3ADkk8AAmAu7qXq1NVmakrG0wmpep3DWmg4qfl3AtqnSygCXiocbik5HiMg9SkHeNMtN6TpjbjdIpoLz6z3s5OuD7pNveK1e7yGeB5nJOH0V0epukttplm+7mKxNhK5+dA9tWPYQcZDafAePJPlEjAQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQCEIQAxj65Q6fcdIm6RVpVubkJtstPMudFJP5QR1BHIPI5jIQgK82Q8rs3Xe5ZteQ1+xKuTBepVcLYR3Tp/zMwoDk9AFE8cHhJO2cbnuikWdRJmtV2eakpCXGVuuefgkAckk9AOTHXvKzKRftuzdArksHpOZTgEY3tK+S4g/JUM8H/wAiRER2j2fq9O1aV/wlV83DRreUWaLIKOW3kZyl18eJAIG059nBJSOQ1yhaVN9oG+3dRa7QDb9sr2iWkx6kzVtp4dd8EhQ6kckYAJ9s2UkZGWpsozJyUszKyrCA20y0kJQ2gDACQOABH7IQG0hKUhKUjAA4AHlHxNTcvJSz0zMvNsMMILjrriglLaQMlRJ6AAE5gOtW6zT7fpM3VarNNykjKNl155w4CUj+vyAHJPA5ios5NXH2tdRRJyZfptnUpe4k/wCabJPrqHRTywCAOQke4En97+vC4O05frVj2cpxi2JNze5MrSdjgScGYc/k+CEHrkZwT6tnrDsSj6dW1K0CiMFuXZG5biuVvuH2lrPiT+QAAYAAgKSdpqms0nWKqyrBX3aJaTSndycJlm0D8iREnX5o1VKtpdY+oNoPTSa3SaBIqdYaWQtTaWg53jRHIWkqJwOo6cjCtC7WzCWtZ55wKOXpSWWc+Hqbf/6j8MXI03ZRL6dWsw3na3R5NKc9cBlAEBo+gGuMrqrRhI1FbTFyyKP20yAEiYT071A8um4eB9xES5kHoYq3r5o/U7Erw1V077yUdlnTMT0vLpyWFn2nkp6FsgnenoASehOJi0X1fpmrVuCbaLctVpUBE/JbuW1ffpzyUK5I8uQekBiNcNAqTqtILnpQNU+42EfcJvGEv4HDb2Bkp4wFdU+8cH8dENQpFDDenNYozNrXLRm+5+DQNrc0hI5dZPyt2Co8knO7KgSRL+c8CNF1S0lpWpkg0px1dOrcl69Pq0vw9LLByBkYynPhn3jB5gPnVnVGU03o7SWZc1Kv1FXcUylt5U5Muk4BIHO0EjPmeByYwehujLen0q/Xqy1KuXVVtzs0thtKG5RKzuLDSU+qAD128ZGBwBHxpXpHW6dXH721EqDdau1aTLS6wQpqTZT6oLfAAUrkkgDAUeMlUS2AcwAA55jmEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEMiAQhDMAhDMMiAQhCAQhmGYBCGYQCEIZEAhDI84ZzAIQhkecAIyIiLtF2Xfl+29TaFZrrCJN99QqiFvBpS0cbOfFAO4qA5J28HmJdhmA0rSfSykaT2y3SKcA9NOYXOzqk4XMueZ8kjJCU+A8ySTuphDMBDOrfZqpeqt1StwrrkzS3UtIZmm22A4H0JJxtJUNisHGcKHA465lymU5ikU6Vp0qgplpRlDDSSckISkJA/AI7WYZgPhxpDqFNuIStCgUqSoZCgfAjxEVzn+z5c9j6uU26dMnmJakzD4VOSzjoQiWbKh3je35bZGSAOQR7gYsf0hmA4A56RzCEAhCEAhDIPjDMAhCGYBCEMiAQhDIgEIZhAIQzCAQhCAQhCAHpGs39qDQ9NaImtV9x5Emp5MuCy33it6gSOPoSY2Y8iNO1S00p+qtrm36lOTUk0l9Ewh2W27gtIUBkEHI9Y8ceHMBo3xu9MP43VfsSv0x+8l2r9NahOsSbE1VC6+6lpAVJqA3KOB4+ZinmqlkJ03v6q2qieM8iRU3tmC3sK0raS4MpyeQF46+GfdEs9nTs+U3UKkM3jUa1OS6ZSoFDcpLtpGS3sUCVqzwSQMbfDrzwFy+saRqNrHaulj8izcb022ueStbPcMFzhJAOcdOojeMZGDz9MRlrLoVTNYhT3ZurTlNmaelxDKmUJWghe0nck8nlI6EeMBg/jd6X/xuq/YlfpjNWb2jLEvy5JO3KLMVBc/Ob+6S7KlCfUQpZySeOEmKEVWS+C6pOSBc730V9bO8J27tqiM48M4i3PZ17PlMozNt6jvVmcmJ92VMy1KpbShlHfNKQUq6lWErPII5xx4QEiXz2gLJ06r66FXX55udQ2h0hmWK07VdOQfdGv/AButMD/3uq/YlfpjodoDs+U29jVb3FanJKfk6epxTJbS4y4GUFQAHBBIBGcn6IpNkQHolp3rfaGqFUmabbr845MSzPpDnfy5bGzcE8E+9QiQMiIm0Z7PlN0fnZqpM1qbqc/NS/ozhW2lpoJ3BRITyc5SOqjGU1v1Xl9JrQVUkpbfqs2osU+XX7K3McrV/JSOT55AyMwG23NeFv2dIenXBWJKmMfJVMOBJWfJKeqj7gCYiWr9sLTWmulEqmt1QA4DkrKBKT+NUg/kioNQql06pXWhyaenK1Wqg4G20ZyTnJCUjohA8hgAZPEWAszsVPzMoiZu+4VSjy05MnT2wot+5TiuCfMBJHvgNtlO2pYji9szRbjZHACktMrA95+6j8mY3S3O0nphcbiGm7makH19G6g2qXx/vqGz/mjR53sUWUtkiRuC4mHfBTy2XU5+gNp/riu+tWkMxo9cMrTHKmmpy84x6QzMBnuj7RSUlOTyMA8HxgPQmWm5eel0TEo+1MMuDch1pQWlQ9xHBiG/jdaXj/vdV+xK/TGU7L3Ohds44z6X/wBW9Fc+0D2fKbpFSpCsUqtTk5LTc16L6PNNp3oOxSgd6cA+zjG0QE8Htd6Yfxuq/YlfpiS7IvSk6gW9L1+iLdXIvqWlBdb2KylRSeD7wYoJo3p03qne7FuPVFdPaWy4+t5DQcVhAyUgEgZPn+SL56cWFJaa2nKW1TpmZmpeWUtYdmCN6lLUVHoAMZPEBk7ouORtG356vVNS0yUi33rpQncoJzjgePWIp+N1ph/Gqr9iV+mJRvG15S9bYqVuzzr7MtUGSy44wQFpBOcjII8PKKH67aTMaQXNJ0qVqrtRYnJUTSVOtBCm/XUnacEg+znPHXGICz/xu9MP41VfsSv0xL1JqTFZpsnUpUqVLzjKJhoqGCUKSFDI8DgiKLdn7RGS1kmayqfq8xIS9KEvuQw0lS3i6XPlE4TgNnwOc+7m9FFpTVDpMjSpdTi2JKXblm1OEFZShISCSAATgCA7p6RpOo+rtr6VGnfskem2/hHve47hkuZ7vZuzjp7afyxux6RG2smiNM1jl6Ymfqk5T3qYXu4WwlKknvNm7ck8n9zTjBHj9Qa98bvS/wDjdV+xK/TD43el/wDG6r9iV+mKT3DSxQa9UqSXu/MjNOyve7du/Ysp3Y5xnEWB097JElfFlUi43LsmZRVRlw8WEySVhHJGM7xnp5QEr/G70v8A43VfsSv0wPa70vx/ldV+xK/TGlfEep3z2m+P/wBPT/fjSNYuzA1pjZL9zSlxvVL0d5pt1lyWDeELO3cCFH5RTxjxgLP6cau2xqr8I/saem3fg7uu/wC/ZLeO837cZ6+wr8ka/c/aY0+tG4J6hVSZqKZ2Rc7p4NypWkK46HPPWIs7DQP+O3v+D/8A1EdjtIdnymM0+5NSJWsziJrciZelHW0rbWVKSghKhgp6g87umPHIDePjdaYH/vdV+xK/TEq2vctMu+gyVdo8wJiQnW+8aWOD5EEeBBBBHgQY8w0IUtWEpJOCfVGeAMk/gieOy1rIbKuEWrWZnbQ6s4A0tZwmUmTwFe5K+En37TxgwF2SeIjm/terL01rqaLcD88icUymYAZli4naokDnz9UxIoyYhLXfs+UzUV6buxVZnJGoSkgUBAbStlaWwpQ44UCckZz5cQH6Htd6Yfxqq/YlfpjcNOdY7V1Tfn2rcdm3FSCULe79gt4CicYz19kx55UqS+FKpJyAc7r0p9DO/Gdu5QGceOMxfrRrQqmaOifdlKtO1KaqCG0PLdQlCBsKiNqRkj2j1UfCAxE92r9NKdOzEm/NVMPS7imlhMmogKScHx8xH4/G80v/AI3VfsSv0xDnaM7PtM09oz1302szswJyohtcrMoScFzerIWnHQpPBHj7uYl0osZvUi/6Xars8uQRP99mYS3vKNjK3PZyM52Y6+MBb343el5/73VfsSv0x2ZDtX6VTbgS7WpuTycZfkXcf8qVRoPxHaf895r/APj0/rIxVw9iSoS0ot6gXaxOTCRlMvOSpZCz5b0qV+VP1wFnrcu2gXfJ+m0CsSNTYHClSzoXsPkoDlJ9xwYy2Y80237u0lu5xDbk5Qq5IL2rCTg+BwRylaCMHxSoeYi8Wher8vq3a6pt1tuWrMiUtT8sg8Akeq4n+SrB48CCOcZISVCGYQCEIQFAO1H/AA7XN/RP+kZiwnY9npSW0meQ/NMNL+FHztWsJONjfPMV87Uf8O1zf0T/AKRmNVtrS69LyppqNv25PVKTDhaLzIBSFjGRyfeID0e+Fqd/H5T8cn9McGrU7+Pyn45P6Y89v8AOqHzKqv8Awp/THI0C1QHP7CqqPftT+mA1O6yFXRWFAggzz5BHj90VHoVop/BHaH81S/8AYEec01LvSb7ss+hTbzSihaD1SoHBH4Y9GdFP4I7Q/mqX/sCAyuof7wLm/mqb/MqjzLj001D/AHgXN/NU3+ZVHmXAeqnnFHO15c7tZ1WcpHeftajSrTCEDoFrSHFK+n1kj/dEXjjzv7QYd/wzXV3u7d6Zxu+92J2/kxATj2LrGl0Uuq3pMsoXMuvGQlVKGS2hIClkf6RUkZ/kHzizwiHuyaGxotTNm3d6TM95g/K709fqxExHpAM5HER1qpoZbmrs1T5muzdVlnJBC22zIuNo3BRBO7ehWenu6nzjWNe9fKno/V6VIyNGk6gmel1vKU+4pJSQrGBiIt+O7cPzSpX2hyAs7YNl0/Ty1JG2KU9NPycj3ndrmlJU6d7inDuKUpHVZxwOMRC/bZ/eBQv52H5lyJZ0jveY1H0+pV0zUo1JvT3fbmWlFSU7HltjBPPRAP1xE3bZ/eDQv52H5lyAhzskvtS2sMst51DSPQZgblqAHsjxMXi+Fqd/H5T8cn9MeZduWxWbuqQpdCpz9QnVIKwwyPWKRyTG1f4AdUPmVVf+FP6YD0K+F6d/H5T8cn9MU77aUyxNX5Q1MPNupTSwCUKCgD3rnHER0NAdUM/vKqv/AAp/TGs3TZtwWVNtSdxUqZpsw833rbb4AKkZIz+EGAsh2Gf/AJ2/+n/+oi1MVW7DP/zt/wDT/wD1EWpgEIQgPMzUL9/1y/zrN/nlRerQapSTOj1qtuTkuhaZFIKVOAEHceOsUV1B/f8AXL/Os3+dVGVo+jWoNfpkvU6ZalRm5KZTvZebSNq0+Y5gLn656tq0ysj4ZorlMnKi5NNy7LMwouIOclRKUKB9lJ8Rzj6I6dmTCu0VojtutCJMVZa23vgvLe0NP5SU95vwctp658ekUvujTK8rMkG5+4LenqbKOuhlLryRtKyCQnIPXAP4DFy+yhxolR/9fNfnlwGwaU6K2/o+aoaFOVSZ+E+577051te3u9+3bsQnH7oc5z4fX1e0h/AldP8AqGvzzcSVmI17SH8CV0/6hr883AU67PcoxUNYLekpppL0tNGYYeaWMpcbXLuJUk+4gkH6Y6+s2mM1pXe01R1ha6e9l+nvqH7owScAn75Psn3jPQiO92b/AOGy1v8AXu/mXIuLrhpXL6q2W/TUpQiqyuX6e+rja7j2CfvVjg/UfCA1Dsvayfs8t39jdYmd9epLQAW4rKpuXHCV+9SeEq/3TzkxL11kG1qz/sL/AObVHnBb1ermnN3MVOT7ySqtKmCFNuDBCkkpW2seR5SR7zF+qRfVL1G0qm7jpagGpinvh1knKpd0NkKbV7wfwjBHBEB59Wn++mjf7cx+cTHp/HmDag/xpo/+3MfnEx6fQEFdsn+CNn+dWP7DkV17Ln8O1s/0v/pHosV2yf4I2f51Y/sORXXsufw7Wz/S/wDpHoC/8DCB6QFeO2Jp/LVazWbyYaCahSFoZeWBy5LuK2gH/RWpJHkFKiDOzFdztq6uUpkOEStWJpz6c+1v/cz9IcCPqJ84tr2hVso0YuovkBJlABn74uJCf+YiKLaapdVqNaoYJ701iTCMHB3d8jH5YD0tHJjmOBgRzAIZED0jQ9ZNTf8ABNZ4uH4L+E1KmUSqWO+7rBUFHcVbVdNvTEBT3tRfw7XN/RP+kZixPY340le4/wDir/8AYbiouol7zWot5VK6J6WZlX55SMssZKEBDaUJHPJOEDJ888CJO0D7Qk7p1Ly1pLoUtUJGdnwoPB9TTranClJJ4UFAYBxgfTAXg4hkfXHAyYiHXrXZ/Rw0yXlaG3UpipNurQt2YLaGdhT1SEkq9rzEBSK7R/jTWf8Abn/zhj0I0UP/AGR2h/NUv/YEeddRnl1KoTM68EpcmXVvLCAQkKUSSBnwyYtR2bu0JN1eetzTScoTICZdcuxPtPlJCWmVLG5sg5JCMZCh16QFgdQz/iBc381Tf5lUeZmDFx+0X2hJqzJ6p2JJUFh9c3IbFzz75wlLqCk4bAByATzu+qKc554gPVEkcxR7teWu7RdVVVfuiJetSrb6VgeqXEJDa0/ThKCf9MROugfaCndXqlOUepUOXkJuTlfSVTEu8S2566U4CFDKfaz7RjcNZNKpLVq0nKS84mWn2Fd9IzRGe5dxjB80qHB+o+EBDfYvv6VNPqdjzb6UTSXjPySVH90QUgOJT70lIVj+UT4RaA88CPNa47Vu3Sq5EM1GXnKRUpZzvJeZaUQFY6LacHBHvB48fKJVtntkXtR5VuWrNOplbCAB36wpl5Y95T6p/wCH8MBbyv2dbl1BAr1BpdVLYKUKnJVDqkA9dpUCR9UUZ7Stq0SzdUJml0CntyEl6Ky73LZUUhShyRknHTpEiTnbdrTjeJOz6aw5989NLcH4AlP9cQdqJqBVtTLlduGstyjU242hru5VCktpSkYAAUon8sBdfsucaE2z/S/+rejS+2xzYNC/nUfmXI3jsyy70podbTMwy4y4BMqKHElJwZp0g4PmCD9BiretnaEm9YKfJ0wUFikyMo/6Sn7uXnVr2lPJwkAYJ4wT74Du9kTjWOW8vQZj+oRefg+UebemGok5pddrFxyMnLzrjba2lMvkhKkqGDgjoffz9EX10nv8am2TJXN8HfBxmVuoMv3vebShZT7W0ZzjPSA28jiKbdtfm/qHj/8ACh+eci1d+3Umx7Oq1yKlDOCnMF7uA5sLmCBjdg469cGKE6xatTmr9wy9Xm6bL05MrLiWaYacKzt3KVlSjjJyo9AICbOwzx+zY/zf/wCoi1OY8+dFNb5vRqbqimaNL1WWqYa75tbpaWkt79u1QBA/dFZyk+HSL7W/VRXaHTqslnuUz0q1Mhsq3bN6ArGeM4zjMBkIZED0iJdetb3dGpekiXoiKo/VQ+EKcmC2lkt93yQEkqz3nTI6QFJtQf3/AFy/zrN/nlRfPQMZ0btQHn9opH/MY8+q1VXa5WJ6qzCUIenZhyZcS2CEhS1FRxnnGTE12R2tK3ZNqUy3Ze26dMtU9kMpdceWFLGTyQPpgLXal6dU3VC1nLdqr8xLsKebeD0vt3oUk+G4EcgkdPExh5GmUzs/aTTiZVU1UpKitOzID6kpcdKllW3IGByrHSIF+O7cPzSpX2hyNa1E7VFd1Cs+ftl6gU+RZnghLjzTq1KCUrSrAB4524+gwFidF9f5XWKqVGRYoL1LMiwl4rXMh0LBVtxwkYjIdpD+BK6f9Q1+ebiC+xH++m5fD9otfnI7HaP7Qk3NOXHptLUFhphDgln51x8rUsJUleUoAATyB1JgIs7OAxrba2f/AL938y5HoQTkcR5mWJeE1YV2025ZGXZmZiQcK0tPZ2LykpIODnoTF8tE9VDq9ab9dXShS3JecXJLZD3ehSkttr3A7RjPedOenUwEL9rrR/ONQ6LLZ4S3Vmmx9SH8fgSr/dP3xiJ9DtVHbCqFSo869iiV2XXLPhR9Vh4oIbe93Jwr3HPyRF+p2Rl6jJvyU2w2/LTDamnWnBlLiFDBSR5EHEefGt+lczpTej1PCFrpM2VP058/Lazygn75GQD9R8YDUbV/fTRx/wCOY/OJj09jzCtTm6KMP/HMfnEx6eHkQEF9sgg6Rs8//FWP7DkV17Ln8O1s/wBL/wCkejP6+9oOb1FlJi0UUJmnycnPlSnlPl1x1TZUkEcJCQck458OYjHTe95jTi9KddMrKNTj0j3u1l1RSle9pbZyRzwFk/VAel0cE8cRUH47tw/NKlfaHIxNwdsq+apKLl6VTqTR1LGPSEIU66k+ad52j60mA33tj6kS0pQ5awpJ9K5ybcRMz6UnPdMpOUIV5FSsK+hHvERL2WLOdujViRnC2TKUVKp95WOAoDDac+e8g/7pjTLZs28dWrhdFMlZ2rTsw5vmZ18koQT1U64eB9ZyegBPEXo0b0okNJbVTS2HEzNQmFd7PzYGO+c8AM87Ug4H1nqTAb6AYQhAD0jCXXZtCvimJpVxU5uoSIdS8GVrUkbwCAcpIPiYzcICNfi36UfM2U/Hvf34/SW7PGl0nMtTMvaMq28ytLjaw+9lKgcg+35iJGhAcYjWLx0ytK/3ZVy56KzUlSiVJZLji07ArGfZI67RG0QgI1+LfpR8zZT8e9/fjJW5onp9aNZl63Q7al5Koy27uX0OuqKNySlXClEcpUR08Y3iEBpd06N2JetWNWuC3mJ+eUhLZeW64klKegwlQEYn4t+lHzNlPx739+JKhAalZ+lNmWFPPT9tUJmmzL7fcuONuOK3IyDjClEdQI208gwhAdGrUOmV+TVJVenylRlVe0xNMpdQf91QIzEbVXsu6V1VanP2OKknFZyZWbdQP+HcUj6h4xK8ICHZXsm6Vy5y5SJ6aGc4dnnQPo9Upjc7b0isS0XEO0W1aVLPI5S+pnvXU/Q4vKvyxt8IDjbzEa/Fv0pyP8TpX7Q9/fiS8wzARr8W/Sj5myn497+/G6Wva1Hs2jtUahSKJGQZKlIZQpSgkqOTyok9SYy0IDo1yh0+5KRNUiqyyZqRm0d28yokBafLIIMaF8W/SnP7zpT8e9/fiS8iGYCNfi36UeFnSn497+/EhSEhL0ySl5GUbDUtLNpZaQDnYhIwkc88ACOxDMAPIjWby03tTUH0P9lFGaqXoW/uO8cWnu9+3d7KhnO1PXyjZoZgI1+LfpR8zZT8e9/fh8W/Sj5myn497+/ElQgI1+LfpR8zZT8e9/fh8W/Sj5nSn497+/ElQzAapZ+l1n2DMzEzbNDZpr0ygNuqQ4tW9IOcesoxja3oTpzclWmqvVrXlpqem19488p50FavPAUAPqjfcwgI1PZv0o+Z0p+Pe/vxttoWRb9h05ym23TW6dJuvGYW0halAuFKUlWVEnolP4IzsIAeRGAu6w7bv2SZkrmpDFSYYc71tLhUChWCMgpII4PTOD9UZ+EBHMt2eNLpOZamZe0ZVt5laXG1h97KVA5B9vzESLgxzCAjmZ7PGl87MuzMxaMq488suOLLzwKlE5J4X5mPz+LfpR8zZT8e9/fiSoQEa/Fv0o+Z0p+Pe/vx2pHQHTCnLC2bLpSiDn7ulTw/AskRIEIDrSFNk6XLIlJCUl5OWR7DMu2ltCfoSBgR2QIQgEIQgEIQzAIQhAIQhAIQhAIQhAIQhAIQhAIxtwXHR7WpbtUrdSlqdJNe09MLCU58AM9SfADk+EZEnjrFHu1TeFSu3VVy2pdxbknSC3KyzCFcLfWlKlqx99lQT/uwE31Lti6ayL5al269UUg472WlEpSffhxaD+SNgsvtKad3vU5alSdQm5OoTSw2xLzssUFxR6JCk7k5+lUfhYnZpsC1KKxLVGiSdcqJbHpM3Oo7wLX47EH1Upz0wM46kxrj3ZdZkdWqbeFuzcjS6PJzMvNGmhtZIUjG7ac4GSM/WYCfciMXdFxyNo2/PV2pqcTJyLfeultO5W3OOB49YyYGMRr+oM5RJCyK3N3FLtTVJZk3FzLDnR5IHsfSTgD3kQEbfG60vz/lVVP9CP6Ylm3q7IXPRZGtUx7v5KeZS+yvGCUqGRkeBHQjwIMee1q6cz98W3eVzyLHdMUJhMylhvJSSpzKkjPJCWkuH6h5xYjsZ398JW9UbMm3svUtRm5QKPVhZ9cD3JcOf/3YCyR6Rpmo2rFtaWMyL1xuzLaJ5S0s9wyXMlIBOcdPaEbmeeIivtI2zSa1pVWp+oyLMxM0yWU/JuqyFMrJSCQQfEAZ8OIDE/G70wPSbqv2JX6Y79G7U2ltXnUShrb8ipwhKVzkqtDZJ81gEJ+lRA98V37LdlWletfrkvdkhLTrEvKtrZS86psJUV4JBChk4jvdqOwdPrKVRFWgmWlJ6YLgmZOXmFOgtgJ2uEFRKTkke/6jAXTadbebS60tLjawFJWk5CgehB8RHy/MMyzDj77qGWm0la3FqCUoSBkkk9AB4xEXZSqFTqGjlO+ES4pDEw8xKrWclTAVxj3BRUke5PlHY7UTlSb0XrXwaHMKUwmZLedwY7xO7p4dAfdnwgOlcPay0zoMy5LsTdRrCmztUqnS+5Gc+ClqQD9IJEdaldsDTSouJRMKrNMBOCublAQPee6Us/kitmhla0to9VnF6kUp6cCwj0N1TanWGeu7e2k5JPq44UODwImm69L9KtaKdJsaY1e2qVVmnu8cDSC2txnacgs8Kznac7fAwFjaTVZKt02VqdOmETEnNNpdZeQCAtChkEZ5juRgLDt1y0LMolvvvtvu06TbllOoBCVlKQCQD4Rn85gEIQgEIQgEIQgEIQgEIQgEIQgEIZhAIrRrB2cL/v3UWr3HRa7R5Snznc90zMTb6Fp2MtoOQlsgcpJ4PjFl4QFNvigap/Oi3/t81+ph8UDVP50W/wDb5r9TFyYQFNvigap/Oi3/ALfNfqYfFA1T+dFv/b5r9TFyYQFNvigap/Oi3/t81+ph8UDVP50W/wDb5r9TFyYQFNvigap/Oi3/ALfNfqYfFA1T+dFv/b5r9TFyYQFNvigap/Oi3/t81+ph8UDVP50W/wDb5r9TFyYQFNvigap/Oi3/ALfNfqYz9gdl7Ua172odbqNxUR+TkJxqYeaanJhS1oSoEgBTQBP0kRaqEBwBt+iKFdoaRmbR15qc+poqS5MMVKX3cBxJCSfq3pWn6ovsc44jQtVtGrd1bprTFXDktPSwPo0/L4DrWeqTkYUnpwfqIgNktK66PelCla5RJxqak5lAUkoVyg45QofJUOhBjvO1enMT7NOdn5RudfBLUst5IdcwMnaknJwAScDoIqcvscX1SJtRoN40sMrO1TpW/LOKT70oCgfozG36V9lSqWTeFPuqq3ah2bkXO8SzJsqIcykpUFOLIOCCQfV8YCxmQRxFae2bf3oNEptkSjv3aoKE5OpSeQyg/c0n3KWCfpbEWWxwYqvdnY/uS5rmqtZXdlP/AG9NuzCUutOKUhKlkhOfcDj6oDW9PNLddqdZzabWnJOn0estibUwt1nc6lxAGVBSCRlOOM8fTGhWbUavoNrHK/DKAw9TpgS9QbQrclTDiRuxjqNqgse8CLh6N6ZVjTSxpy3KlWk1N5yZcdYeQVhLDam0ISgBR4AKSeOOYg2Z7Fd0Tj65iZvKnPvOHK3HGnFKUfMk8mAts06h5tDrawttYCkqByCD0IjQtfSDo3dn+wq/tCPrRbTyp6ZWYLfqlVRU3UzK3W3UbtrbZSkBACugG0+7mMRrxpFWdW6bS5GmVxqltSrji30Obyh/ITtBCeuNp6+cBUzRHRv/AAyVWpSHw4aR6Cwl7f6J3+/KsYxvTj8sYW47P/waaiqoN1Sjk5JSU0gvho92ZuWKgQpBzxuT7+Dx1EWH097KFyWPeVJr4uyTUzJzLbrzLDbiFPNgglB5xg+R4iQteNCWNYJSQflZpinViSUUJmnEFSXGTklCgOeDyPLKvOAkG0fgQ2xSjbaGEUVUs2qTSyMIDRGU4zz0POec5zzHR1DvCi2Lac5Wrhl3ZimI2svNNtB0rDigjBSogEHPOfCNQ0E0irGkdNqkhU621U2ptxtbCGgsIYwFbsBXTJUOnlG1an2AxqZZk7bMxOuSKZkoWJhtAWUKQoKHqkjIyORkQELSXZ30t1ht5m7LOeq9vsTinAhoFK0IUlZSrc2okjkZACwMHoPCBtXdKKhorcUjLfDbE8ZhBmZaYlstPN7VYypGSUHPQgnofKJXHZI1Jt91xNr31IssrPKhMTEoVD3htKvIeMdqh9jSt1KqJnb2u9qYSVBTwk97rr3mO8cAx9JSYCcdD7oqN56V29W6sornphhaHnFDBcLbi295HmoICvrjEdoDTG4tUbap1MtyoSUjMS056Q4uaecbSUbFJwChKiTlQiRaNR5KgUuUpVNlky0lJtJYZaT0QhIwB7+nJ8Y7sBTb4oGqfzot/wC3zX6mHxQNU/nRb/2+a/UxcmEBTb4oGqfzot/7fNfqYfFA1T+dFv8A2+a/UxcmEBTb4oGqfzot/wC3zX6mHxQNU/nRb/2+a/UxcmEBTb4oGqfzot/7fNfqYfFA1T+dFv8A2+a/UxcmEBTb4oGqfzot/wC3zX6mHxQNU/nRb/2+a/UxcmEBTb4oGqfzot/7fNfqYfFA1T+c9vn+nTX6mLkwgNY00tqoWhYtFoVVfZmJ2Rlw086ytS0KVk8gqAJ+sRs8IQCEIQCEIQCEIQCEIQCEIQCEdOssz0zSJ5mmTSJSfcYcRLTC0b0tOlJCFlPiAcHHjiK3ab3XrVqRW7opUre1Hk3LemUyzq3aY2pLxK3U5ThPA+5Hr5iAs5uHnHOREIWrVdWJfUeWoFauGTrdGnKW/MN1ORp6RLtPgqQlKlgdUqTkjPOcRh9JL11QuXVmtWzXLmp8xI244tM4huRQkzQBUgbSEgp5wfqgLD5EMiPwm0PuSrzcs6GX1IUG3CncEKIODjxAOOIrVZt2a1XlfVy2kxe1Iln6AsocfXTGyh3Cyn1QE5HTPMBZzIhuHnEH0yf1coWoNsSFYuaQuOi1GYmWJ5dOpyUplVNN5CXFhPqEqI8fAiNw1yuGs2npvUa9QquxSpqQKXC48wHQ6CdoaAPAKlKTz4QEgZzCIH0D1Zu2v3PULUv91n4TXIy9UkFJZQ1uZcQlZSdoAJ2uIOOowvPTidzyCBAc5EMiIC7SV96iadTtInrYrEuiQqShKIkjJocd74ZJO4g5yCkY8xG7aOauyGpVmKqk241JVOmJ7urMqOxLC0gkuc9EEAkZ6YIzwYCR8iG4ecVKq3aMvm9NS5Kj2POsUih1KcTT5GYmpNLnfEKAU6SoE8lQOB0G3POYtDUW6ii25ptqosy9SEmtKJ5xsd229sOHSjptCvWx5cQGUyIZEVV0u17v127rfN4T8tNWzX5uYp0rMiVQzudRtCXBtAIG5aE8+Z8sxZe4paqzdEnWKHPM0+prbIl5l1sOIaX4Ep8RAZPMMiKx6U3XrVqvLVV+TvakSApkyJZYepjat5x7QwnpxG2WLqbe1I1Z/wAGOoPwZPzU1LmYkajIoLYcwgrwpPAwQhfgCFJ8QQQE4ZHnDIiuVxXlqtKa9S2nsnddNalKoXJyWUqnoV3Evh1YbVxkqCWinOeSQY7Wo2oGoVU1URaWl1fk50pbAnWRJNrapqgcKLrygR9Q6HjqcQFg8iGYg3W649S9N9PKTXZO55BU3K7ZepkSKCJl1ZG1aAQQkDB4wM/kjik0/W2p0Sl1ZepVvSrdSZZdaQ7TGwQXEhSUZ28q5xiAnPMMxAn7NtVzor8J9zMC7/hj0Pmnj9y7zbu7vbjb47sdPGNevK69arNvq27QmL2pEw/X1hDT7dMbCWcr2+sCnJ8+ICzgIMIiTT+b1RpuqMzbd6VRmr0r4FM8zNysgllnvu+QgI3hI9YDeduemDiJbgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgB6RUDSSw67et/alfA171S1vRKr919BST6TuemNu71h7O046+0YtpWKa3WaTO0x159lucYcl1usL2OIC0lJUlXgoZyD4GI8sLs+2tpzcYr1Gnq6qaIUHETE2FNvbgR64CRuIySM+PMBltFLRqliaaUe3qz3Xp0oZjve7XuSd8w4sHPjkKTEW6G5+MLqoef3df58xYWblxOSj0spbjYeQpsrbVtUnIxkHwPviG5fsoWVKTDszL1i7GX3iS663UQlbhJz6xCMnnzgJOcu6kNXa1aSpk/DDsmaghjYcdyF7N27GB62RjrFZ7Ls2p3lrxqSxT7rrFtrYm3VqdpysKeBeI2q6ceMTTaWglt2dWpitSVTuCZnn5NyRLs5O96UNrIJ2naCCMcc8RgJfsoWVKTDszL1i7GX3zl11uohK3MnJ3EIyfrgMhprJJ0bkkWzdFWE1Ubhr02unvJ3OLmgoJIU4ceqsgZOeMnrGndpSfqd8XdbGltvS7U9MuKNVnWFubEKSgK2IUv5IIDhP0o90brQuzpa1BuGm15uqXJOzdNd76XE7Ph1AVjHQp/94j4l+zZaUtdqbrRVLk+FBM+lFwzw9ZW7O0+rkp8MZ6cQESarzOoNn3na+qVftul0pulPNyDvwZNF7vmTuJQoHGMoLiQf5QHlFq5Cdl6lJS87Kuh2XmWkvNOJ6LQoZSR9IIjTdS9H6DqqJJuvTdWbak9xQ1KTIbQsnHKgUnJGOD4ZMZawbDp2nVATQqVMz78ohwuIM493qkZAG1JwMJGOAPMwESdrEjNg4PSuJP8AZjoas9nauVm9zVLInDTqdcf7Xr7bboQltO4KU5tyN4VtBKRzu9yjiR9Q9Cba1NrLNVrs7W0OsNpbablZsIaRgk7gkpOFc9fojeKFSG6DRpOlMPTL7UmyllDky5vdWEjAKleJgK36kWzTLN1k0eoNHYDEjJLbbbHir7uMqJ8VEkknxJiQu01ebttacO0mnEqq1xOimSzaPbKF/uhA/wBH1fpWI7N49nS1L3ud+5KpULgTPuqSpPcToShnaAB3YKSU9AevWObx7Olp31WWqvV6hcKpllptlru50AICEhIIyk4J2gkjqcmAhu/tOdSZfR2QoMxalFlJK1kenJnZOfKpjKEqLiwnHytylEDxA8osLpHfCNQ9PqPcBWDMvM93NpGPVfR6q+PAEjcB5ER+9xac065rJZs+eqFXTItNNMqfamtsw8lCdvrrwd2cetkcxrdq9ny2LOpVZpdJqVwsy1XZDD37dALYzncjCQEq8M46QEGdnyjajVOSulyx7mptIabqB71mblA8XXMHaQog4GOI2fs3o/ZdqXcdx3vPzL9+0smW9EeQltMuzju1KSkY5ByggAABWeSrIlPTnQa2NL6u7VKDOVouPNKacZmZoLaUCQclISMkY4PvMdqsaK2zV7/lb731GRrLC2lqVJzAbbmC2oEd4MHcCAEkZGQMQEP6m0Z24u1jQ6SxUpuluTdEeaTOSpAdZJl5r1k/++niOsdjQy5jo1cb+lV60yWpc7MzBdkas0nDdQKjhIUs9c9Ek9PZIBHO+1Xs12lV7rful+qXImqOzKpoONzwT3RKiraj1cpQMkAA8DiNp1F0rtnVKnsSdwyjhVLL3sTLCwh5k+ISrB4PiDkdPEAgNF7XR/7G5gf+Ol/7RjAUPRK5p+kWBWmb5qtVlpOcplUcptQdwwwygJWe7Az6yQcAeRPSN+unQK2rwoNFodVqVfXJ0dotMhM6NzgOPWcykhShgAHHHMYhvsv2qy2ltu4rzShICUpTVcBIHQAbICR7Xu6kXjKzU3RplUwzKTbkk6ooKcOtkbgM9RyORwYhDXL/AO0HpX/r0fnxExae6eUjTShLotFXOOSy5hcypU06HFlagAeQBx6ojU7w7OlqXvdD1yVSoXAifcUlSSxOhKGSkADuxtJT0B69YCUh1j6j8JOWEnKsSyVuLSy2lsLcVuUrAxknxPvj94BCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEID/2Q==",
  watch:"data:image/jpeg;base64,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",
  boat:"data:image/jpeg;base64,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",
  equine:"data:image/jpeg;base64,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"
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
  sp = sp || DEFAULT_SPONSOR;
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
  const SP = flyerSponsor({market:marketOf(L), group:GROUP[L.type]||""}); const logo = await loadSrc(logoFor(L.type)), masar = await loadSrc(SP.image);
  const ph = await loadPhotoImgs(L.photos, MAX_PHOTOS);
  const M = 8, W = FW-2*M;
  P.rect(0,0,FW,FH,PAPER);
  checker(P,0,0,FW,2);
  const lr = Math.min(52/logo.naturalWidth, 38/logo.naturalHeight);
  const lw = logo.naturalWidth*lr, lh = logo.naturalHeight*lr; P.img(logo,(FW-lw)/2,6,lw,lh);
  if (drawQR(P, linkFor(id), FW-8-21, 6, 21)) P.text("Scan for photos", FW-8-10.5, 6+21+3, {size:5.2, color:"#77736b", align:"center"});
  let y = 6+lh+3;
  if (ph.length){ await fitImg(P,ph[0],M,y,W,76); y+=76; }
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
  det.slice(0,8).forEach(([k,v],i)=>{
    const cx = M + (i%2)*cw, cy = y + Math.floor(i/2)*5.2;
    P.text(k+":",cx,cy,{size:8,color:"#77736b"});
    const kw = P.width(k+": ",{size:8});
    P.text(clip(P,v,{size:8.5,bold:1},cw-kw-3),cx+kw,cy,{size:8.5,bold:1});
  });
  y += Math.ceil(Math.min(det.length,8)/2)*5.2;
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
  try{ const {data,error}=await sb.rpc("contact_phone",{p_kind:kind,p_id:id}); if(error||!data) return null; return (CONTACT_CACHE[k]=String(data)); }catch(e){ return null; }
}
function hiddenContact(a, kind, id, mk){
  a.href=itemHref(kind==="listing"?id:"");
  a.onclick=async ev=>{
    ev.preventDefault();
    const w = a.target==="_blank" ? window.open("about:blank","_blank") : null;
    const p = await contactPhone(kind,id);
    if (!p){ if (w) w.close(); toast("This contact is not available any more."); return; }
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
function contactBarText(L){ const p=phoneOf(L); return p ? "Call / WhatsApp   "+p : "Contact the seller: "+baseUrl().replace(/^https?:\/\//,""); }
function contactBarLink(L,id){ const p=phoneOf(L); return p ? "https://wa.me/"+waNum(p) : linkFor(id); }
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
  if (/queue is full|already has|can post|a month/i.test(m)) return m;
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
  w.innerHTML=`<label class="btn ghost small" for="${id}">📷 Add a photo (optional)</label><input id="${id}" type="file" accept="image/*" hidden><img alt="" hidden><button type="button" class="btn ghost small" hidden>✕</button>`;
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
  acc:["exhaust","akrapovic","akrapovič","vance","slip-on","muffler","led","fog light","crash bar","slider","top box","pannier","windscreen","windshield","mirror","grips","backrest","sissy bar","saddlebag",
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
  const now = cairoNow(), market = opt.market ?? AD_CTX.market, group = opt.group ?? AD_CTX.group;
  let list = SPONSORS.filter(s=>(!s.slots || s.slots.includes(slot)) && sponsorOnNow(s,now) && sponsorFits(s, market, group));
  if (opt.only) list = list.filter(s=>(s.groups||[]).includes(group));       // just the ads made for this category
  if (opt.general) list = list.filter(s=>!(s.groups||[]).length);           // ads not tied to one category
  return list.length || opt.only ? list : [DEFAULT_SPONSOR];
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
function startBannerRotation(){
  const boxes=[...document.querySelectorAll(".sponsor-banner")]; if (!boxes.length) return;
  const tick=()=>{
    const list = sponsorsFor("banner");
    // weighted round-robin: repeat each sponsor "weight" times
    const seq = list.flatMap(s=>Array(s.weight||1).fill(s));
    const s = seq[bannerIdx % seq.length]; bannerIdx++;
    boxes.forEach(b=>{ b.classList.add("fade"); setTimeout(()=>{ fillSponsorBox(b,s); b.classList.remove("fade"); },180); });
  };
  clearInterval(bannerTimer); tick(); bannerTimer=setInterval(tick, 8000);
}
function feedSponsorCard(i, opt){
  const list = sponsorsFor("feed", opt);
  if (!list.length) return null;
  const seq = list.flatMap(s=>Array(s.weight||1).fill(s));
  return sponsorCard(seq[i % seq.length]);
}
function sponsorCard(s){ const box=document.createElement("aside"); box.className="masar feedad"; fillSponsorBox(box,s); return box; }
function flyerSponsor(opt){ return pickWeighted(sponsorsFor("flyer", opt)); }


/* ===================== Seller tools & discount codes (catalogue and listing pages) ===================== */
const SELLER_MODALS = "<div class=\"modal\" id=\"soldModal\" hidden>\n  <div class=\"card\">\n    <h3>Seller tools</h3>\n    <p class=\"muted\" id=\"soldTitle\" style=\"font-size:14px\"></p>\n    <label for=\"soldCode\">Your 6-digit seller code</label>\n    <input id=\"soldCode\" inputmode=\"numeric\" maxlength=\"12\" placeholder=\"e.g. 482913\">\n    <div class=\"hint\">You got it when you posted. Lost it? Ask the admin on WhatsApp.</div>\n    <div id=\"stockBox\" hidden style=\"margin-top:10px\">\n      <label for=\"stockIn\">Quantity in stock now</label>\n      <div class=\"unitrow\"><input id=\"stockIn\" inputmode=\"numeric\" placeholder=\"e.g. 12\"><button type=\"button\" class=\"btn ghost small\" id=\"stockGo\">Update stock</button></div>\n      <div class=\"hint\">Put 0 when everything is sold.</div>\n    </div>\n    <div class=\"actions\">\n      <button type=\"button\" class=\"btn primary\" id=\"soldGo\">Mark as sold</button>\n      <a class=\"btn ghost\" id=\"soldAsk\" target=\"_blank\" rel=\"noopener\">Ask the admin</a>\n      <button type=\"button\" class=\"btn ghost\" id=\"soldClose\">Close</button>\n    </div>\n    <div class=\"msg\" id=\"soldMsg\"></div>\n  </div>\n</div>\n<div class=\"modal\" id=\"discModal\" hidden>\n  <div class=\"card\">\n    <h3>\ud83c\udff7\ufe0f Get your discount code</h3>\n    <p class=\"muted\" id=\"discTitle\" style=\"font-size:14px\"></p>\n    <div id=\"discAsk\">\n      <label for=\"discPhone\">Your mobile number</label>\n      <input id=\"discPhone\" type=\"tel\" inputmode=\"tel\" placeholder=\"01xxxxxxxxx\">\n      <div class=\"actions\"><button type=\"button\" class=\"btn primary\" id=\"discGo\">Get my code</button><button type=\"button\" class=\"btn ghost\" id=\"discClose\">Close</button></div>\n    </div>\n    <div id=\"discDone\" hidden style=\"text-align:center\">\n      <div class=\"code\" id=\"discCode\"></div>\n      <p style=\"font-size:14px;margin:6px 0 10px\">Send this code to High End on WhatsApp to get <b id=\"discPct\"></b> off. The code works once and only for this item.</p>\n      <a class=\"btn wa\" id=\"discSend\" target=\"_blank\" rel=\"noopener\">Send code on WhatsApp</a>\n      <div class=\"actions\" style=\"justify-content:center\"><button type=\"button\" class=\"btn ghost small\" id=\"discClose2\">Close</button></div>\n    </div>\n    <div class=\"msg\" id=\"discMsg\"></div>\n  </div>\n</div>";
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
  $("#soldAsk").href = adminHref(`✅ *Please mark as SOLD*\n\n${titleOf(item.L)}\nRef: ${item.id}\n\nI'm the seller${phoneOf(item.L)?" (listed number "+phoneOf(item.L)+")":""}. I lost my seller code.`);
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
        $("#discSend").href = adminHref(`🏷️ *Discount code request*\n\n${titleOf(item.L)}\nPrice: ${priceStr(item.L.f)}\nDiscount: ${data.pct}%\nMy code: *${data.code}*\nMy number: ${ph}\nRef: ${item.id}`);
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
  payModal("⭐ Promote this listing",
    "Featured listings show first in their category with a Featured mark." + (st.promo_price ? " Price: " + st.promo_price + "." : ""),
    `⭐ *Promote my listing*\n\n${titleOf(item.L)}\nRef: ${item.id}\n${linkFor(item.id)}`);
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
  m.innerHTML = `<div class="card"><h3>⭐ Membership</h3>
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
    msg.textContent = q.member ? `✅ Member until ${new Date(q.member_until).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}.` : q.verified ? "✅ WhatsApp verified. Step 2: pay to start the membership." : ""; };
  ph.addEventListener("change", showQ); showQ();
  $("#mbVerify").onclick = async ()=>{
    const n=num(); if(!n) return;
    const w = window.open("about:blank","_blank");
    const {data,error} = await sb.rpc("request_verify",{p_phone:n, p_name:nm.value.trim()});
    if (error||!data){ if(w) w.close(); msg.textContent = niceError(error||"Try again later."); return; }
    if (data==="VERIFIED"){ if(w) w.close(); msg.textContent="✅ This number is already verified. Step 2: pay."; return; }
    try{ localStorage.setItem("mm_phone", n); }catch(e){}
    const u = adminHref(`✅ *Verify my WhatsApp — High End*\n\nCode: ${data}\nNumber: ${n}${nm.value.trim()?"\nName: "+nm.value.trim():""}`);
    if (w){ try{ w.opener=null; }catch(e){} w.location.href=u; } else location.href=u;
    msg.textContent = `Send the message with code ${data} from ${n} (don't change it). The admin confirms it.`;
  };
  $("#mbPay").onclick = ()=>{ const n=num(); if(!n) return; m.hidden=true;
    payModal("⭐ Membership", `${price?fmtMoney(price)+" — ":""}unlimited motorcycles and cars for ${days} days. Pay, then send the receipt; the admin starts your membership.`,
      `⭐ *Membership payment*\n\nNumber: ${n}${nm.value.trim()?"\nName: "+nm.value.trim():""}${price?"\nAmount: "+fmtMoney(price):""}`); };
  m.hidden=false;
}
/* ===================== Extra listings: every section can have a free limit, then a fee =====================
   The admin sets free listings + fee per section, a sale (% off for a period), discount codes and packs. */
const FEE_GROUPS = {vehicle:"Motorcycles & cars", moto:"Motorcycle gear & accessories", car:"Car parts & accessories", watch:"Watches", desert:"Dune Riders (desert)",
  boat:"Marine", equine:"Horses & equine", art:"Modern & art", estate:"Real estate", bag:"Ladies boutique"};
const FEE_ICON = {desert:"🏜️", vehicle:"🏍️", moto:"🪖", car:"🔧", watch:"⌚", boat:"🛥️", equine:"🐎", art:"🖼️", estate:"🏠", bag:"👜"};
async function listingQuota(phone, type){ try{ const {data,error}=await sb.rpc("listing_quota",{p_phone:phone, p_type:type}); return error?null:data; }catch(e){ return null; } }
function feeNeeded(q){ return !!(q && q.pay_enabled && !(q.member && q.grp==="vehicle") && q.free!=null && Number(q.fee)>0 && q.used>=q.free && !(q.credits>0)); }
function feeAfter(fee, pct){ return Math.round(Number(fee||0)*(100-Number(pct||0))/100); }
function saleLine(q){ if(!(q.sale_pct>0)) return ""; const u=q.sale_until?new Date(q.sale_until).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"";
  return `🎉 ${q.sale_note?q.sale_note+": ":""}${q.sale_pct}% off extra listings${u?" until "+u:""}.`; }
function packsHtml(q){ return (q.packs||[]).filter(p=>Number(p.n)>0&&Number(p.price)>0).map(p=>{
    const each=Math.round(Number(p.price)/Number(p.n)), save=Number(q.fee)>0?Math.round(100-100*each/Number(q.fee)):0;
    return `<button type="button" class="btn ghost small" data-pack="${Number(p.n)}" data-price="${Number(p.price)}" data-days="${packDays(p)}">📦 ${Number(p.n)} listings ${packPer(p)} · ${fmtMoney(p.price)}${save>0?" (save "+save+"%)":""}</button>`; }).join(""); }
function packDays(p){ return Number(p.days)>0?Number(p.days):30; }
function packPer(p){ const d=packDays(p); return d===30?"a month":d===365?"a year":"for "+d+" days"; }
async function openListingFee(row){
  const q = await listingQuota(row.phone, row.type) || {grp:"vehicle", fee:(SITE_ST||{}).extra_vehicle_fee??1000, free:(SITE_ST||{}).free_vehicles??1, sale_pct:0, packs:[]};
  const g=q.grp, sec=FEE_GROUPS[g]||"this section", free=Number(q.free||0);
  let pct = Number(q.sale_pct||0), code="";
  const amt=()=>feeAfter(q.fee, Math.max(pct, 0));
  const wa=()=>`${FEE_ICON[g]||"➕"} *Extra listing fee*\n\n${titleOf(row)}\nNumber: ${row.phone}\nRef: ${row.id}\nAmount: ${fmtMoney(amt())}${code?"\nCode: "+code:""}${pct&&!code?"\nSale: "+pct+"% off":""}`;
  payModal(`${FEE_ICON[g]||"➕"} Extra listing fee`, `${sec}: the first ${free} listing${free===1?" is":"s are"} free for each number. Pay the fee and send the receipt: the listing goes live when the admin confirms.`, wa());
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
    code=c; pct=Math.max(Number(data), Number(q.sale_pct||0)); cm.textContent=`✅ ${data}% off`; draw(); };
  cr.append(ci,cb);
  box.append(price); if(sale.textContent) box.append(sale); box.append(cr, cm);
  const ph=packsHtml(q);
  if (ph){ const pk=document.createElement("div"); pk.className="packs"; pk.innerHTML=`<p class="muted" style="font-size:13px;margin:10px 0 6px">Posting more? Take a monthly pack: this listing uses one and the rest are ready for your next ones.</p><div class="dlrow" style="flex-wrap:wrap">${ph}</div>`;
    pk.querySelectorAll("[data-pack]").forEach(b=>b.onclick=()=>{ waBtn.href=adminHref(`📦 *Listings pack*\n\n${b.dataset.pack} ${sec} listings ${packPer({days:b.dataset.days})} for ${fmtMoney(b.dataset.price)}\nNumber: ${row.phone}\nFirst one: ${titleOf(row)} (Ref: ${row.id})`);
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
  const h = document.createElement("h2"); h.className="slab"; h.textContent = "🛠 Website under maintenance";
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
async function saveFile(filename, blob, fallbackImgUrl){
  const type = /\.pdf$/i.test(filename) ? "application/pdf" : "image/jpeg";
  try{
    const file = new File([blob], filename, {type});
    if (navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:filename}); return; }
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
  document.querySelectorAll("img[data-brand]").forEach(i=>{ i.src = BRAND_LOGOS[i.dataset.brand]; });
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
    else { hiddenContact(wa,"listing",id,p=>"https://wa.me/"+waNum(p)+"?text="+encodeURIComponent(hello)); hiddenContact(tel,"listing",id,p=>"tel:+"+waNum(p)); tel.textContent="📞 Call"; tel.setAttribute("aria-label","Call the seller"); }
    c.append(wa,tel);
    if (mode!=="pending"){
      const sh=document.createElement("a"); sh.href=waHref(shareText(L,id)); sh.target="_blank"; sh.rel="noopener"; sh.textContent="↗ Share";
      const bI=document.createElement("button"); bI.type="button"; bI.textContent="🖼️ Image"; bI.onclick=()=>exportImage(L,id);
      const bP=document.createElement("button"); bP.type="button"; bP.textContent="📄 PDF"; bP.onclick=()=>exportPdf(L,id);
      const bH=document.createElement("button"); bH.type="button"; bH.textContent="⭐ HD image"; bH.onclick=()=>exportHD(L,id,false);
      const bHP=document.createElement("button"); bHP.type="button"; bHP.textContent="⭐ HD PDF"; bHP.onclick=()=>exportHD(L,id,true);
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
      if (L.f.price_unit!=="USD" && priceEGP(L.f)) { const u=document.createElement("div"); u.className="usd"; u.textContent="≈ $"+fmt(Math.round(priceEGP(L.f)/USD_TO_EGP)); pr.after(u); }
      else if (L.f.price_unit==="USD") { const u=document.createElement("div"); u.className="usd"; u.textContent="≈ "+fmt(Math.round(priceEGP(L.f)))+" EGP"; pr.after(u); }
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
  if (L.status!=="pending"){ const v=document.createElement("span"); v.className="views"; v.textContent="  ·  👁 "+fmtViews(L.views)+(Number(L.views)===1?" view":" views"); meta.appendChild(v); }
  card.appendChild(body);
  return {card, body, meta};
}

async function ensureFonts(){ try{ await Promise.all([document.fonts.load('700 20px "Roboto Slab"'),document.fonts.load('400 20px Inter'),document.fonts.load('700 20px Inter')]); }catch(e){} }

async function exportImage(L,id){
  await ensureFonts(); if (!L.photos || !L.photos.length) L.photos = await loadPhotos({id,L});
  const k = 1080/FW; const c=document.createElement("canvas"); c.width=1080; c.height=Math.round(FH*k);
  const ctx=c.getContext("2d"); await drawFlyer(canvasPainter(ctx,k),L,id);
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
  const logo = await loadSrc(LOGO_SRC()), CSP = flyerSponsor(), masar = await loadSrc(CSP.image);
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
  const logo = P.dry ? null : await loadSrc(logoFor(L.type)), masar = P.dry ? null : await loadSrc(SP.image);
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
  if (eg){ const alt = L.f.price_unit==="USD" ? "≈ "+fmt(Math.round(eg))+" EGP" : "≈ $"+fmt(Math.round(eg/USD_TO_EGP)); P.text(alt, M+P.width(priceStr(L.f),{size:22,bold:1,serif:1})+4, y+3, {size:9,color:"#77736b"}); }
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
async function exportHD(L, id, asPdf, sources){
  if (asPdf && !window.jspdf){ toast("PDF tool didn't load - check your connection."); return; }
  toast("Making your HD flyer…");
  await ensureFonts();
  let ph = sources;
  if (!ph || !ph.length){ if (!L.photos || !L.photos.length) L.photos = await loadPhotos({id,L});
    ph = await loadPhotoImgs(L.photos); }
  const H = Math.ceil(await drawFlyerHD(dryPainter(), L, id, ph));
  const old = FILL_PXMM; FILL_PXMM = asPdf ? 9 : 14;
  try{
    if (asPdf){
      const doc = new jspdf.jsPDF({unit:"mm",format:[FW,H],compress:true}); aliasMap.clear();
      await drawFlyerHD(pdfPainter(doc), L, id, ph);
      doc.setProperties({title:pdfSafe(titleOf(L))+" - "+MARKET_NAME});
      await saveFile(fileBase(L)+"-HD.pdf", doc.output("blob"));
    } else {
      const k = 2160/FW, c=document.createElement("canvas"); c.width=2160; c.height=Math.round(H*k);
      await drawFlyerHD(canvasPainter(c.getContext("2d"),k), L, id, ph);
      const blob = await new Promise(r=>c.toBlob(r,"image/jpeg",0.9));
      await saveFile(fileBase(L)+"-HD.jpg", blob);
    }
  } finally { FILL_PXMM = old; }
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
function runIntro(key){ key = key || "he_intro";
  try{
    if (/[?&]nointro\b/.test(location.search) || /^#l-/.test(location.hash)) return;   // shared listing links go straight in
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key,"1");
  }catch(e){}
  const END_AT = 11;   // the video's last seconds show the old address — hand over to the logo countdown before them
  const ov=document.createElement("div"); ov.className="intro"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-label","Welcome");
  ov.innerHTML=`<video class="intro-vid" playsinline muted preload="auto" poster="intro-poster.jpg"><source src="intro.mp4" type="video/mp4"></video>
    <div class="intro-btns"><button type="button" class="intro-sound" aria-label="Sound off">🔊</button><button type="button" class="intro-skip">Skip ›</button></div>
    <button type="button" class="intro-gate" hidden><span>🔊</span>Tap to enter</button>
    <div class="intro-end" hidden>
      <div class="intro-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="r-bg"/><circle cx="60" cy="60" r="54" class="r-fg"/></svg>
        <img src="${BRAND_ART}" alt="High End Communities">
        <span class="intro-num">3</span>
      </div>
    </div>`;
  document.body.appendChild(ov); document.body.style.overflow="hidden";
  const v=ov.querySelector("video"), snd=ov.querySelector(".intro-sound"), gate=ov.querySelector(".intro-gate");
  const music=new Audio("intro-music.m4a"); music.preload="auto";      // the music plays from its own file, with sound from the start
  v.muted=true;                                                       // the picture is silent, so it may always start by itself
  let done=false, counting=false, started=false;
  const setSnd=()=>{ snd.textContent = music.muted ? "🔇" : "🔊"; snd.setAttribute("aria-label", music.muted?"Sound on":"Sound off"); };
  const fadeOut=()=>{ const t=setInterval(()=>{ music.volume=Math.max(0,music.volume-0.1); if (music.volume<=0.05){ clearInterval(t); try{ music.pause(); }catch(e){} } },60); };
  const finish=()=>{ if (done) return; done=true; window.__introMuted=null; try{ v.pause(); }catch(e){} fadeOut(); ov.classList.add("out"); setTimeout(()=>{ ov.remove(); document.body.style.overflow=""; },600); };
  const countdown=()=>{                         // the music keeps playing under the countdown
    if (counting) return; counting=true; gate.hidden=true;
    ov.querySelector(".intro-end").hidden=false; ov.classList.add("ending");
    const num=ov.querySelector(".intro-num"); let n=3; num.textContent=n;
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
  // the admin can make the intro start silent (Settings → "Intro starts with the sound off"); visitors tap 🔇 to hear it
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

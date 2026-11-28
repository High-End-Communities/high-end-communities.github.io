/* High End Communities, shared engine part 3 of 5: Supabase calls and the WhatsApp quick-fill. Load order matters: core, export, data, business, ui. */
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


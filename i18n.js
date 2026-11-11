/* High End Communities — Arabic / English switch.
   English is written in the pages; this file swaps the interface text to Arabic
   when the visitor picks العربية. Listing titles, brands and seller text stay as written. */
(function(){
"use strict";
var qs = new URLSearchParams(location.search).get("lang");
if (qs === "ar" || qs === "en") { try { localStorage.setItem("he_lang", qs); } catch(e){} }
var LANG = "en";
try { LANG = localStorage.getItem("he_lang") === "ar" ? "ar" : "en"; } catch(e){}
window.HE_LANG = LANG;
window.setLang = function(l){ try { localStorage.setItem("he_lang", l); } catch(e){}
  var u = new URL(location.href); u.searchParams.delete("lang"); location.replace(u.toString()); };

function wireButton(){
  var b = document.getElementById("langBtn"); if (!b || b.dataset.on) return;
  b.dataset.on = "1";
  b.textContent = LANG === "ar" ? "English" : "العربية";
  b.setAttribute("lang", LANG === "ar" ? "en" : "ar");
  b.onclick = function(){ setLang(LANG === "ar" ? "en" : "ar"); };
}
if (LANG !== "ar") { document.addEventListener("DOMContentLoaded", wireButton); return; }

document.documentElement.lang = "ar";
document.documentElement.dir = "rtl";

var D = {
/* masthead & home */
"Motorcycles, watches and cars, sold owner to owner.":"موتوسيكلات وساعات وسيارات، من المالك إلى المالك مباشرة.",
"Also yachts, horses, art and real estate. New and used.":"وأيضًا يخوت وخيول وفنون وعقارات. جديد ومستعمل.",
"List an item for sale":"اعرض منتجك للبيع",
"Sponsored":"إعلان ممول",
"Plan rides, track your routes and ride together with the community.":"خطط لرحلاتك وتابع مساراتك واركب مع المجتمع.",
"All":"الكل","Motorcycles":"موتوسيكلات","Watches":"ساعات","Cars":"سيارات","Equine":"خيول",
"Yachts & boats":"يخوت وقوارب","Modern & art":"فن وتصميم معاصر","Real estate":"عقارات","Signature Bags":"شنط براندات",
"Show sold":"عرض المباع","Catalogue PDF":"الكتالوج PDF","Share catalogue on WhatsApp":"شارك الكتالوج على واتساب",
"High End Communities only lists items and is not responsible for any product promoted. Buyers must do their own due diligence and check ownership papers with a lawyer.":"High End Communities منصة عرض فقط وغير مسؤولة عن أي منتج معروض. على المشتري أن يتحقق بنفسه ويراجع أوراق الملكية مع محامٍ.",
"Read the full terms":"اقرأ الشروط كاملة",
"See all":"عرض الكل",
"No listings here yet.":"لا توجد منتجات هنا بعد.",
"High End Communities, est. 2024":"High End Communities، تأسست 2024",
"Motorcycles, gear & accessories":"موتوسيكلات ومعدات وإكسسوارات","Cars & car parts":"سيارات وقطع غيار",
"Signature Bags & Accessories":"شنط وإكسسوارات براندات","signature bags & accessories":"شنط وإكسسوارات براندات","Yachts, boats & marine parts":"يخوت وقوارب وقطع بحرية",
"Horses":"خيول","Equine accessories":"مستلزمات الخيول","Marine parts & accessories":"قطع وإكسسوارات بحرية",
"Motorcycle accessories & parts":"إكسسوارات وقطع موتوسيكلات","Safety gear & helmets":"معدات أمان وخوذ",
"Car parts & accessories":"قطع غيار وإكسسوارات سيارات","Sold":"تم البيع","SOLD":"تم البيع","PENDING":"قيد المراجعة","REJECTED":"مرفوض",
"Luxury handbags, wallets, belts, scarves, sunglasses and jewelry — new and used.":"شنط براندات ومحافظ وأحزمة وإيشاربات ونظارات شمس ومجوهرات — جديد ومستعمل.",
"Sell a bag or accessory":"اعرضي شنطة أو إكسسوار","All categories":"كل الأقسام",
"Page not found":"الصفحة غير موجودة","The link may be old or mistyped.":"ربما الرابط قديم أو مكتوب بشكل خاطئ.","Open the catalogue":"افتح الكتالوج",
/* cards */
"Motorcycle":"موتوسيكل","Used":"مستعمل","New":"جديد","Car":"سيارة","Watch":"ساعة","Safety gear":"معدات أمان",
"Moto accessory":"إكسسوار موتوسيكل","Car part / accessory":"قطعة / إكسسوار سيارة","Signature bag / accessory":"شنطة / إكسسوار براند",
"Yacht / boat":"يخت / قارب","Horse":"حصان","Equine accessory":"مستلزمات خيول","Marine part / accessory":"قطعة / إكسسوار بحري","Art / design":"فن / تصميم","Property":"عقار",
"Featured":"مميز","More details":"تفاصيل أكثر","WhatsApp":"واتساب","listing photo":"صورة المنتج","1 photo":"صورة واحدة",
"Seller? Mark as sold":"البائع؟ علّم المنتج كمباع","Seller? Update stock / mark sold":"البائع؟ حدّث الكمية / علّم كمباع",
"Share":"مشاركة","Image":"صورة","HD image":"صورة عالية الدقة","HD PDF":"PDF عالي الدقة","Out of stock":"نفدت الكمية",
"Get your discount code":"احصل على كود الخصم",
/* units */
"EGP":"ج.م","USD":"دولار","KM":"كم","MI":"ميل","CC":"سي سي",
/* field labels */
"Brand":"الماركة","Model":"الموديل","Model name":"اسم الموديل","Model year":"سنة الموديل","Year":"السنة",
"Mileage":"المسافة المقطوعة","Mileage (km)":"المسافة المقطوعة (كم)","Engine size":"سعة المحرك","Engine size (cc)":"سعة المحرك (سي سي)",
"Condition":"الحالة","Price":"السعر","Phone number":"رقم الموبايل","Your mobile number":"رقم موبايلك","Color":"اللون",
"Original paint":"دهان أصلي","Yes":"نعم","No":"لا","Add-ons":"الإضافات","Size":"المقاس","Item name":"اسم المنتج",
"Item type":"نوع المنتج","Accessory type":"نوع الإكسسوار","Part type":"نوع القطعة","Compatible with":"متوافق مع",
"Fits / compatible with":"يناسب / متوافق مع","Original or aftermarket":"أصلي أم تجاري","Original (OEM)":"أصلي (OEM)","Aftermarket":"تجاري (Aftermarket)",
"Quantity in stock":"الكمية المتاحة","Quantity in stock now":"الكمية المتاحة الآن","Movement":"الحركة","Automatic":"أوتوماتيك",
"Manual winding":"تعبئة يدوية","Quartz":"كوارتز","Smart":"ذكية","Case size (mm)":"مقاس العلبة (مم)","Case material":"خامة العلبة",
"Box & papers":"العلبة والأوراق","Full set":"كامل (علبة وأوراق)","Box only":"العلبة فقط","Papers only":"الأوراق فقط",
"No box or papers":"بدون علبة أو أوراق","None":"لا يوجد","Reference number":"الرقم المرجعي","Date of purchase":"تاريخ الشراء",
"Production date":"تاريخ الإنتاج","Transmission":"ناقل الحركة","Manual":"مانيوال","Fuel":"الوقود","Petrol":"بنزين","Diesel":"ديزل",
"Electric":"كهرباء","Hybrid":"هايبرد","Interior":"الداخلية","Options & extras":"الكماليات والإضافات","Payment":"الدفع","Cash":"كاش",
"Installments":"تقسيط","Cash or installments":"كاش أو تقسيط","Delivery":"التسليم","Property type":"نوع العقار","Apartment":"شقة","Villa":"فيلا",
"Townhouse / twin house":"تاون هاوس / توين هاوس","Penthouse / duplex":"بنتهاوس / دوبلكس","Chalet":"شاليه","Commercial / office":"تجاري / إداري",
"Land":"أرض","Area (m²)":"المساحة (م²)","Bedrooms":"غرف النوم","Bathrooms":"الحمامات","Floor":"الدور","Finishing":"التشطيب",
"Fully finished":"تشطيب كامل","Semi-finished":"نصف تشطيب","Core & shell":"على الطوب","Furnished":"مفروش","City / area":"المدينة / المنطقة",
"Compound / project":"الكمبوند / المشروع","Ready to move":"جاهز للسكن","Under construction":"تحت الإنشاء",
"New = first sale from the developer · Used = resale":"جديد = أول بيع من المطور · مستعمل = إعادة بيع",
"Builder / brand":"الشركة المصنّعة","Length (ft)":"الطول (قدم)","Year built":"سنة الصنع","Engine(s)":"المحرك / المحركات",
"Engine hours":"ساعات تشغيل المحرك","Location / marina":"الموقع / المارينا","Type":"النوع","Yacht":"يخت","Speedboat":"لانش سريع",
"Sailboat":"مركب شراعي","Fishing boat":"مركب صيد","Jet ski":"جيت سكي","Horse name":"اسم الحصان","Breed":"السلالة","Gender":"الجنس",
"Stallion":"فحل","Mare":"فرس","Gelding":"حصان مخصي","Filly":"مهرة","Age (years)":"العمر (سنوات)","Height (cm)":"الارتفاع (سم)",
"Discipline":"التخصص","Dressage":"ترويض","Show jumping":"قفز الحواجز","Endurance":"قدرة التحمل","Racing":"سباقات","Show":"عروض جمال",
"Breeding":"إكثار","Leisure":"ترفيه","Pedigree / registration papers":"شهادة النسب / التسجيل","Vet check available":"فحص بيطري متاح",
"Artist / designer":"الفنان / المصمم","Medium / material":"الوسيط / الخامة","Dimensions":"الأبعاد","Painting":"لوحة","Sculpture":"منحوتة",
"Photography":"تصوير فوتوغرافي","Furniture & design":"أثاث وتصميم","Collectible":"مقتنيات","Certificate of authenticity":"شهادة أصالة",
"Title / item name":"العنوان / اسم القطعة","Handbag":"شنطة يد","Shoulder bag":"شنطة كتف","Tote":"شنطة توت","Clutch & evening bag":"كلاتش وشنطة سواريه",
"Backpack":"شنطة ظهر","Wallet & card holder":"محفظة وحافظة كروت","Belt":"حزام","Scarf & shawl":"وشاح وشال","Sunglasses":"نظارة شمسية",
"Jewelry":"مجوهرات","Material":"الخامة","Box, dust bag & papers":"العلبة والكيس والأوراق","Dust bag only":"الكيس فقط",
"Receipt / certificate":"الفاتورة / الشهادة","Original packaging":"التغليف الأصلي","Helmet":"خوذة","Jacket":"جاكيت","Gloves":"جوانتي",
"Boots":"بوت","Pants":"بنطلون","Body armor / back protector":"واقي جسم / ظهر","Other gear":"معدات أخرى","Certifications":"الشهادات",
"Check the label inside the helmet":"راجع الملصق داخل الخوذة","One size":"مقاس واحد","Riding wear & helmets":"ملابس ركوب وخوذ",
"Exhaust":"شكمان","Crash bars / frame sliders":"حمايات / سلايدر","Luggage / top box / panniers":"شنط / بوكس خلفي / شنط جانبية","Lights":"إضاءة",
"LED lights":"إضاءة LED","Mirrors":"مرايات","Windscreen":"زجاج أمامي","Seat":"مقعد","Grips / levers / tank pad":"مقابض / ذراعات / واقي تانك",
"Phone holder / mount":"حامل موبايل","Intercom":"إنتركوم","Performance parts":"قطع أداء","Oils & lubricants":"زيوت وشحوم",
"Oils, filters & care":"زيوت وفلاتر وعناية","Cleaning & care products":"منتجات تنظيف وعناية","Other accessory":"إكسسوار آخر",
"Wheels & tyres":"جنوط وإطارات","Body parts":"قطع بودي","Engine & mechanical":"محرك وميكانيكا","Electronics & audio":"إلكترونيات وصوت",
"Covers & upholstery":"فرش وكسوة","Engine & outboard":"محرك / موتور خارجي","Electronics & navigation":"إلكترونيات وملاحة",
"Deck hardware":"تجهيزات السطح","Safety equipment":"معدات سلامة","Water sports gear":"معدات رياضات مائية","Trailer":"مقطورة",
"Saddle":"سرج","Bridle & tack":"لجام وعدة","Rugs & blankets":"بطاطين","Grooming":"عناية وتنظيف","Horse trailer / box":"مقطورة خيول",
"Stable & yard equipment":"معدات الإسطبل","Saddles, tack & accessories":"سروج وعدة وإكسسوارات","Accessories":"إكسسوارات","Accessory":"إكسسوار",
"Parts & accessories":"قطع وإكسسوارات","For oils, filters, parts you have several of":"للزيوت والفلاتر والقطع المتوفر منها أكثر من قطعة",
"leave empty if you have 1":"اتركه فارغًا لو عندك قطعة واحدة","if it's an engine":"لو كانت محركًا",
"Excellent":"ممتاز","Good":"جيد","Fair":"مقبول","Needs restoration":"يحتاج ترميم","New or used":"جديد أم مستعمل","Other":"أخرى",
"Other brand (type it)":"ماركة أخرى (اكتبها)","Other model (type it)":"موديل آخر (اكتبه)","Choose the brand…":"اختر الماركة…",
"Choose the brand first":"اختر الماركة أولًا","Choose the model…":"اختر الموديل…","Required":"مطلوب",
/* post page */
"Post a listing":"اعرض منتجًا","← Browse the catalogue":"→ تصفح الكتالوج","Quick fill":"ملء سريع","— paste your WhatsApp message":"— الصق رسالة الواتساب",
"Paste or type it any way you like, e.g.\nHarley Fat Bob 2018, 9,000 km, 1745cc, stage 1, original paint, 1.2M, 01012345678":"الصق أو اكتب بأي طريقة، مثال:\nHarley Fat Bob 2018, 9,000 km, 1745cc, stage 1, original paint, 1.2M, 01012345678",
"Fill the form for me":"املأ النموذج بدلًا مني",
"The form below fills itself. Check it, add your photos, tick the terms and send.":"النموذج بالأسفل يمتلئ تلقائيًا. راجعه وأضف صورك ووافق على الشروط ثم أرسل.",
"Photos":"الصور","Take photo":"التقط صورة","Choose from gallery":"اختر من المعرض",
"(1–4 photos go online, up to 10 for your HD flyer — tap a photo to make it the main one)":"(من 1 إلى 4 صور تُنشر، وحتى 10 صور للفلاير عالي الدقة — اضغط على صورة لتجعلها الرئيسية)",
"(1–3 photos go online, up to 10 for your HD flyer — tap a photo to make it the main one)":"(من 1 إلى 3 صور تُنشر، وحتى 10 صور للفلاير عالي الدقة — اضغط على صورة لتجعلها الرئيسية)",
"(1–4 photos, auto-reduced to low resolution)":"(من 1 إلى 4 صور، تُصغّر تلقائيًا)",
"Publish my listing":"انشر منتجي","I accept the terms: High End Communities is":"أوافق على الشروط: High End Communities",
"not responsible for any product":"غير مسؤولة عن أي منتج",
"listed. Buyers and sellers do their own due diligence and check ownership papers with a lawyer. I confirm I own this item or am authorised to sell it.":"معروض. المشترون والبائعون يتحققون بأنفسهم ويراجعون أوراق الملكية مع محامٍ. أؤكد أنني مالك هذا المنتج أو مفوَّض ببيعه.",
"Listing platform only.":"منصة عرض فقط.",
"High End Communities is a place where members advertise items. We do not own, inspect, verify, value or guarantee any item, and we are not a party to any sale.":"High End Communities مساحة يعرض فيها الأعضاء منتجاتهم. لا نملك أي منتج ولا نفحصه أو نتحقق منه أو نقيّمه أو نضمنه، ولسنا طرفًا في أي عملية بيع.",
"No responsibility.":"عدم المسؤولية.",
"High End Communities, its admins and sponsors are not responsible for any product promoted here, its condition, legality, ownership, description or price, or for any loss or dispute arising from a sale.":"High End Communities وإدارتها ورعاتها غير مسؤولين عن أي منتج معروض هنا أو حالته أو قانونيته أو ملكيته أو وصفه أو سعره، ولا عن أي خسارة أو نزاع ينتج عن البيع.",
"Due diligence is yours.":"التحقق مسؤوليتك.",
"Buyers must inspect the item, verify the seller's identity, and confirm the seller owns it and can legally sell it.":"على المشتري فحص المنتج والتحقق من هوية البائع والتأكد من أنه المالك ويحق له البيع قانونًا.",
"Check the papers with a lawyer.":"راجع الأوراق مع محامٍ.",
"Before paying, consult a lawyer or the relevant authority for the ownership and transfer papers the item needs, for example: vehicle or motorcycle licence and traffic records; boat registration and marina papers; property title deed, registration and contract; horse passport, pedigree and vet certificate; watch box & papers, or a certificate of authenticity for art.":"قبل الدفع، استشر محاميًا أو الجهة المختصة بشأن أوراق الملكية والنقل المطلوبة، مثل: رخصة السيارة أو الموتوسيكل وسجل المرور؛ تسجيل القارب وأوراق المارينا؛ عقد العقار وتسجيله؛ جواز سفر الحصان وشهادة النسب والشهادة البيطرية؛ علبة وأوراق الساعة أو شهادة أصالة القطعة الفنية.",
"Payments and meetings":"الدفع والمقابلات",
"are arranged directly between buyer and seller at their own risk. Meet in safe places and never pay before checking the item and its papers.":"تتم مباشرة بين المشتري والبائع على مسؤوليتهما. قابل في أماكن آمنة ولا تدفع قبل فحص المنتج وأوراقه.",
"Seller's responsibility.":"مسؤولية البائع.",
"Sellers confirm they own the item or are authorised to sell it, that the description and photos are true, and that the item is legal to sell.":"يؤكد البائع أنه مالك المنتج أو مفوَّض ببيعه، وأن الوصف والصور صحيحة، وأن بيع المنتج قانوني.",
"Admins may remove any listing at any time.":"يحق للإدارة حذف أي إعلان في أي وقت.",
"Please accept the terms and fix any highlighted fields.":"من فضلك وافق على الشروط وصحّح الحقول المظللة.",
"Add at least one photo.":"أضف صورة واحدة على الأقل.","Please fix the highlighted fields.":"من فضلك صحّح الحقول المظللة.",
"Check your mobile number.":"راجع رقم موبايلك.","Enter an Egyptian mobile number (11 digits, 010/011/012/015).":"أدخل رقم موبايل مصري (11 رقمًا، 010/011/012/015).",
"Enter an Egyptian mobile number: 11 digits starting 010, 011, 012 or 015":"أدخل رقم موبايل مصري: 11 رقمًا يبدأ بـ 010 أو 011 أو 012 أو 015",
"Enter an Egyptian mobile number (11 digits).":"أدخل رقم موبايل مصري (11 رقمًا).","Enter an Egyptian mobile number.":"أدخل رقم موبايل مصري.",
"Use the suggested photo":"استخدم الصورة المقترحة",
"We picked the clearest, best-lit photo as the main one. Tap any photo below to choose another.":"اخترنا أوضح صورة وأفضلها إضاءة كصورة رئيسية. اضغط على أي صورة بالأسفل لاختيار غيرها.",
"You chose this main photo. Tap any photo below to change it.":"اخترت هذه الصورة كصورة رئيسية. اضغط على أي صورة بالأسفل لتغييرها.",
"Flyer PDF":"فلاير PDF","Flyer image":"صورة الفلاير","Copy code":"انسخ الكود","Copied ✓":"تم النسخ ✓","Save code in my WhatsApp":"احفظ الكود في واتساب",
"Share to WhatsApp group":"شارك في جروب الواتساب","Tell the admin on WhatsApp (faster review)":"بلّغ الإدارة على واتساب (مراجعة أسرع)",
"Keep this seller code — you need it to mark your item as sold:":"احتفظ بكود البائع — ستحتاجه لتعليم منتجك كمباع:",
"It's in the catalogue now. The admin may still edit or remove it if something is missing.":"منتجك ظهر في الكتالوج الآن. قد تعدّله الإدارة أو تحذفه إذا كان هناك نقص.",
"The admin checks it and puts it live.":"ستراجعه الإدارة ثم تنشره.","Paste your message first.":"الصق رسالتك أولًا.",
"Learn more":"اعرف أكثر","WhatsApp us":"راسلنا على واتساب","Try again":"حاول مرة أخرى",
"Loading…":"جارٍ التحميل…","Loading listings…":"جارٍ تحميل المنتجات…","Preparing…":"جارٍ التجهيز…","Saving…":"جارٍ الحفظ…","Sending…":"جارٍ الإرسال…","Saved.":"تم الحفظ.",
"Making your HD flyer…":"جارٍ تجهيز الفلاير عالي الدقة…","PDF tool didn't load - check your connection.":"أداة PDF لم تُحمَّل — تأكد من الاتصال.",
"No connection — check your internet and try again.":"لا يوجد اتصال — تأكد من الإنترنت وحاول مرة أخرى.",
"Something went wrong.":"حدث خطأ ما.","Please try again.":"من فضلك حاول مرة أخرى.",
"The site is very busy or temporarily unavailable. Please try again in a few minutes.":"الموقع مزدحم أو غير متاح مؤقتًا. حاول مرة أخرى بعد دقائق.",
"Still loading… if this takes long, check your connection.":"ما زال التحميل جاريًا… لو طال الوقت تأكد من الاتصال.",
"This page checks again by itself every minute.":"تتحقق الصفحة تلقائيًا كل دقيقة.","Website under maintenance":"الموقع تحت الصيانة",
/* seller tools & discount */
"Seller tools":"أدوات البائع","Your 6-digit seller code":"كود البائع (6 أرقام)",
"You got it when you posted. Lost it? Ask the admin on WhatsApp.":"حصلت عليه عند نشر المنتج. فقدته؟ اسأل الإدارة على واتساب.",
"Mark as sold":"علّم كمباع","Update stock":"حدّث الكمية","Put 0 when everything is sold.":"اكتب 0 عند بيع كل الكمية.","Close":"إغلاق",
"Ask the admin":"اسأل الإدارة","Get my code":"احصل على الكود","Send code on WhatsApp":"أرسل الكود على واتساب",
"Send this code to High End on WhatsApp to get":"أرسل هذا الكود إلى High End على واتساب للحصول على",
"off. The code works once and only for this item.":"خصم. الكود يعمل مرة واحدة ولهذا المنتج فقط.",
"Done — your listing is marked as sold. Thank you!":"تم — منتجك أصبح مباعًا. شكرًا!","Stock updated. Thank you!":"تم تحديث الكمية. شكرًا!",
"Sorry, this item is sold out.":"عذرًا، نفدت الكمية.","That code is not right. Please check it.":"الكود غير صحيح. من فضلك راجعه.","That code is not right.":"الكود غير صحيح.",
"This item has no discount right now.":"لا يوجد خصم على هذا المنتج حاليًا.","This listing has no seller code. Ask the admin.":"هذا الإعلان بدون كود بائع. اسأل الإدارة.",
"Too many wrong tries. Ask the admin to mark it sold.":"محاولات خاطئة كثيرة. اطلب من الإدارة تعليمه كمباع.","Too many wrong tries. Ask the admin.":"محاولات خاطئة كثيرة. اسأل الإدارة.",
"You already asked for codes for this item today. Use the one you have.":"طلبت كودًا لهذا المنتج اليوم بالفعل. استخدم الكود الذي معك.",
"Enter a number between 0 and 99,999.":"أدخل رقمًا بين 0 و 99,999.","Enter the quantity (0 or more).":"أدخل الكمية (0 أو أكثر).","Enter your seller code.":"أدخل كود البائع.",
/* watch filters */
"Search brand, model or reference (e.g. 126610)":"ابحث بالماركة أو الموديل أو الرقم المرجعي (مثال 126610)","All brands":"كل الماركات",
"Min price EGP":"أقل سعر ج.م","Max price EGP":"أعلى سعر ج.م","More filters":"فلاتر أكثر","Any movement":"أي حركة","Box & papers: any":"العلبة والأوراق: أي",
"Full set only":"كامل فقط","Sort: Featured":"الترتيب: المميز","Newest listed":"الأحدث","Price: low to high":"السعر: من الأقل للأعلى",
"Price: high to low":"السعر: من الأعلى للأقل","Year: newest":"السنة: الأحدث","Clear filters":"مسح الفلاتر","Clear":"مسح","Filters":"فلاتر",
"No watches match these filters.":"لا توجد ساعات مطابقة لهذه الفلاتر.",
/* marketplaces */
"Marketplace":"السوق","Egypt":"مصر","Saudi Arabia":"السعودية","UAE":"الإمارات","Bahrain":"البحرين","North Africa":"شمال أفريقيا","Turkey":"تركيا",
"Where are you selling?":"أين تبيع؟",
"Your listing appears in this country's marketplace, with its currency and phone code.":"يظهر منتجك في سوق هذه الدولة، بعملتها وكود هاتفها.",
"SAR":"ر.س","AED":"د.إ","BHD":"د.ب","TRY":"ل.ت","MAD":"د.م","TND":"د.ت","DZD":"د.ج","LYD":"د.ل",
"Enter your WhatsApp number: Egypt 01xxxxxxxxx, or with the country code (+966, +971, +973, +90, +212, +213, +216, +218).":"أدخل رقم الواتساب: مصر 01xxxxxxxxx، أو بكود الدولة (+966، +971، +973، +90، +212، +213، +216، +218).",
"Inspect before you buy":"افحصها قبل الشراء","Authenticate before you buy":"تأكد من الأصالة قبل الشراء",
"Technical inspection":"فحص فني","Expert authentication":"تأكيد الأصالة من خبير",
"Before you pay, have it checked by an independent workshop: engine, chassis and engine numbers, accident history and papers.":"قبل الدفع، افحصها في ورشة مستقلة: المحرك، رقم الشاسيه والموتور، تاريخ الحوادث والأوراق.",
"Before you pay, have an independent expert confirm it is authentic and in the condition described.":"قبل الدفع، اطلب من خبير مستقل التأكد من أنها أصلية وبالحالة الموصوفة.",
"Ask High End on WhatsApp":"اسأل High End على واتساب","Call":"اتصال",
"Partners are independent. High End Communities suggests them but doesn't guarantee their work. Agree the fee with them directly.":"الشركاء مستقلون. High End Communities ترشحهم ولا تضمن عملهم. اتفق على الأتعاب معهم مباشرة.",
/* intro & viewer */
"Skip ›":"تخطي ‹","Entering":"مرحبًا بك في","Sound on":"تشغيل الصوت","Sound off":"كتم الصوت","Print":"طباعة"
};
var LOW = {}; Object.keys(D).forEach(function(k){ LOW[k.toLowerCase()] = D[k]; });
var MON = {Jan:"يناير",Feb:"فبراير",Mar:"مارس",Apr:"أبريل",May:"مايو",Jun:"يونيو",Jul:"يوليو",Aug:"أغسطس",Sep:"سبتمبر",Oct:"أكتوبر",Nov:"نوفمبر",Dec:"ديسمبر"};
var CUR = {"EGP":"ج.م","USD":"دولار","SAR":"ر.س","AED":"د.إ","BHD":"د.ب","TRY":"ل.ت","EUR":"يورو","MAD":"د.م","TND":"د.ت","DZD":"د.ج","LYD":"د.ل"};
function mk(n){ return D[n] || n; }
var P = [
  [/^No partner listed in (.+) yet\. Ask High End and we'll suggest one\.$/, function(m){ return "لا يوجد شريك مسجل في " + mk(m[1]) + " بعد. اسأل High End وسنرشح لك واحدًا."; }],
  [/^Choose the (.+) model…$/, function(m){ return "اختر موديل " + m[1] + "…"; }],
  [/^The (.+) marketplace is just opening\.$/, function(m){ return "سوق " + mk(m[1]) + " في بدايته."; }],
  [/^Be the first to list in (.+)$/, function(m){ return "كن أول من يعرض في " + mk(m[1]); }],
  [/^Enter a (.+) mobile number with WhatsApp \(country code (.+)\)$/, function(m){ return "أدخل رقم موبايل عليه واتساب في " + mk(m[1]) + " (كود الدولة " + m[2] + ")"; }],
  [/^Allowed range: about ([\d,]+) – ([\d,]+) ([A-Z]{3})$/, function(m){ return "النطاق المسموح: حوالي " + m[1] + " – " + m[2] + " " + (CUR[m[3]]||m[3]); }],
  [/^Price must be between ([\d,]+) and ([\d,]+) EGP for this item$/, function(m){ return "السعر يجب أن يكون بين " + m[1] + " و " + m[2] + " ج.م لهذا المنتج"; }],
  [/^Price must be about ([\d,]+) – ([\d,]+) ([A-Z]{3}) for this item$/, function(m){ return "السعر يجب أن يكون حوالي " + m[1] + " – " + m[2] + " " + (CUR[m[3]]||m[3]) + " لهذا المنتج"; }],
  [/^(\d+) photos$/, function(m){ return m[1] + " صور"; }],
  [/^(\d[\d,]*) views?$/, function(m){ return m[1] + " مشاهدة"; }],
  [/^Call (\S+)$/, function(m){ return "اتصل " + m[1]; }],
  [/^Allowed range: (.+) EGP$/, function(m){ return "النطاق المسموح: " + m[1] + " ج.م"; }],
  [/^Share (.+) on WhatsApp$/, function(m){ return "شارك " + (LOW[m[1]] || m[1]) + " على واتساب"; }],
  [/^(.+) PDF$/, function(m){ var t = D[m[1]]; return t ? t + " PDF" : null; }],
  [/^(\d+) watch(es)?$/, function(m){ return m[1] + " ساعة"; }],
  [/^(\d+) of (\d+) watches$/, function(m){ return m[1] + " من " + m[2] + " ساعة"; }],
  [/^(\d+)% off with code$/, function(m){ return "خصم " + m[1] + "% بالكود"; }],
  [/^(\d+) in stock$/, function(m){ return "متوفر " + m[1]; }],
  [/^Get (\d+)% discount code$/, function(m){ return "احصل على كود خصم " + m[1] + "%"; }],
  [/^Maximum (\d+) photos\.$/, function(m){ return "الحد الأقصى " + m[1] + " صور."; }],
  [/^Only (\d+) photos go online for this category — the others stay in your HD flyer\.$/, function(m){ return "تُنشر " + m[1] + " صور فقط في هذا القسم — والباقي يبقى في الفلاير عالي الدقة."; }],
  [/^HD flyer — all (\d+) photos?$/, function(m){ return "فلاير عالي الدقة — كل الصور (" + m[1] + ")"; }],
  [/^Sold (\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/, function(m){ return "بيع " + m[1] + " " + MON[m[2]] + " " + m[3]; }],
  [/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/, function(m){ return MON[m[2]] ? m[1] + " " + MON[m[2]] + " " + m[3] : null; }],
  [/^Paste or type it any way you like, e\.g\.\s*([\s\S]+)$/, function(m){ return "الصق أو اكتب بأي طريقة، مثال:\n" + m[1]; }],
  [/^e\.g\. (\d+) or (\d+)$/, function(m){ return "مثال: " + m[1] + " أو " + m[2]; }],
  [/^e\.g\. (.+)$/, function(m){ return "مثال: " + m[1]; }]
];
function T(s){
  if (!s || !/[A-Za-z]/.test(s) || /[\u0600-\u06FF]/.test(s)) return s;
  if (Object.prototype.hasOwnProperty.call(D, s)) return D[s];
  var m = s.match(/^([^\p{L}\p{N}]+)(\S.*)$/u);
  if (m){ var r = T(m[2]); if (r !== m[2]) return m[1] + r; }
  m = s.match(/^(.*\S)(\s*[.:])$/);
  if (m && Object.prototype.hasOwnProperty.call(D, m[1])) return D[m[1]] + m[2];
  for (var i = 0; i < P.length; i++){ var mm = s.match(P[i][0]); if (mm){ var o = P[i][1](mm); if (o) return o; } }
  if (/\s·\s/.test(s)){
    var parts = s.split(/(\s+·\s+)/), out = parts.map(function(p){ return /·/.test(p) ? p : T(p); }).join("");
    if (out !== s) return out;
  }
  if (/\d/.test(s) && /\b(km|mi|cc|EGP)\b/.test(s))
    return s.replace(/\bkm\b/g, "كم").replace(/\bmi\b/g, "ميل").replace(/\bcc\b/g, "سي سي").replace(/\bEGP\b/g, "ج.م");
  return s;
}
window.T_AR = T;
var SKIP = "script,style,textarea,.item h3,.v-title,[data-noi18n]";
function doText(n){
  var p = n.parentElement; if (!p || p.closest(SKIP)) return;
  var v = n.nodeValue, t = v.trim(); if (!t) return;
  var r = T(t); if (r !== t) n.nodeValue = v.replace(t, r);
}
var ATTR = ["placeholder", "title", "aria-label", "alt"];
function doEl(el){
  if (el.closest && el.closest("script,style,[data-noi18n]")) return;
  for (var i = 0; i < ATTR.length; i++){
    var a = el.getAttribute && el.getAttribute(ATTR[i]);
    if (a){ var r = T(a.trim()); if (r !== a.trim()) el.setAttribute(ATTR[i], r); }
  }
  if (el.id === "langBtn") wireButton();
}
function walk(root){
  if (root.nodeType === 3) return doText(root);
  if (root.nodeType !== 1) return;
  doEl(root);
  var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT), n;
  while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doEl(n); }
}
var mo = new MutationObserver(function(list){
  list.forEach(function(m){
    if (m.type === "childList") m.addedNodes.forEach(walk);
    else if (m.type === "characterData") doText(m.target);
    else if (m.type === "attributes") doEl(m.target);
  });
});
mo.observe(document.documentElement, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR});
document.addEventListener("DOMContentLoaded", function(){ walk(document.body); wireButton(); if (document.title) document.title = T(document.title.split(" — ")[0]) + (document.title.indexOf(" — ") > -1 ? " — High End Communities" : ""); });
var _a = window.alert, _c = window.confirm;
window.alert = function(s){ return _a.call(window, T(String(s))); };
window.confirm = function(s){ return _c.call(window, T(String(s))); };
// WhatsApp message to the seller in Arabic
document.addEventListener("click", function(e){
  var a = e.target.closest && e.target.closest("a[href*='wa.me']"); if (!a) return;
  try {
    var u = new URL(a.href), t = u.searchParams.get("text") || "";
    var m = t.match(/^Hello, I'm interested in "(.+)" listed on (.+)\.$/);
    if (m){ u.searchParams.set("text", "مرحبًا، أنا مهتم بـ \"" + m[1] + "\" المعروض على " + m[2] + "."); a.href = u.toString(); }
  } catch(err){}
}, true);
})();

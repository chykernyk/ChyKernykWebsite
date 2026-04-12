import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATA & CONSTANTS ────────────────────────────────────────────────
const SITE_PASSWORD = "MyGoodnessMyGuinness";
const ADMIN_USERS = [
  { email: "dom@domguinness.com", password: "Guinness2026!" },
  { email: "davina@davinaguinness.com", password: "Guinness2026!" },
];

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80", caption: "Portscatho from the Air" },
  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80", caption: "The House" },
  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80", caption: "The View towards Gull Rock" },
];

const BLOG_POSTS = [
  { id: "the-search", title: "The Search", date: "2024-03-15", excerpt: "How we discovered our dream property on the Roseland Peninsula, after months of searching the Cornish coastline for the perfect retreat.", content: "It all began with a winter drive along the south Cornwall coast. We'd spent weekends trawling property websites, but nothing compared to seeing the Roseland Peninsula in person. The winding lanes, the glimpses of turquoise sea through hedgerows heavy with wild garlic — we knew this was where we wanted to be.\n\nPortscatho captured our hearts immediately. A proper Cornish village with a genuine community, a wonderful store, and that extraordinary stretch of coastline. When we saw the listing for Chy Kernyk — perched above the beach with uninterrupted views towards Gull Rock — we booked a viewing within the hour.\n\nStanding in the garden that first afternoon, watching the light change across the water, we looked at each other and simply knew. This was it." },
  { id: "the-purchase", title: "The Purchase", date: "2024-05-20", excerpt: "The story of acquiring Chy Kernyk — navigating surveys, conveyancing, and the peculiarities of buying a Cornish coastal property.", content: "Buying a property in Cornwall comes with its own unique set of adventures. The survey revealed the house had good bones but needed significant updating to become the retreat we envisioned. Negotiations were straightforward — the sellers were a lovely couple who wanted to know the house would be loved.\n\nThe conveyancing threw up some interesting quirks: ancient rights of way, coastal erosion considerations, and a boundary that was defined by a granite boulder that had apparently been there since the Bronze Age. Very Cornwall.\n\nThe day we finally collected the keys, we drove straight down from London. It was raining — properly Cornish rain, horizontal and enthusiastic — but as we opened the front door and looked through to that view, the sun broke through. We took it as a sign." },
  { id: "the-design", title: "The Design", date: "2024-07-10", excerpt: "Working with our architect to reimagine the space — balancing modern comfort with coastal character, and making the most of those extraordinary views.", content: "We wanted the house to feel like it belonged to the landscape. No glass boxes or stark modernism — instead, a sensitive renovation that would enhance what was already there while making the most of the extraordinary setting.\n\nOur architect understood immediately. Natural materials — local stone, timber, lime render in soft whites — and generous windows positioned to frame specific views. The kitchen would look towards the headland. The main bedroom would wake to sunrise over the sea. The living room would open onto a terrace where you could watch storms roll in.\n\nEvery decision was guided by one question: does this bring us closer to the landscape or push us further away?" },
  { id: "west-dean-stone-carving", title: "The West Dean Adventure in Stone Carving", date: "2024-09-05", excerpt: "An unexpected detour into the world of stone carving at West Dean College, creating a piece that would become part of the house itself.", content: "Sometimes the best ideas come from the most unexpected places. A weekend course at West Dean College in stone carving was meant to be a bit of fun — a break from renovation stress. Instead, it became one of the most meaningful parts of the whole project.\n\nWorking with Portland stone, learning to read the grain, feeling the chisel find its line — there's something deeply satisfying about shaping stone. By the end of the weekend, we'd each carved a piece that would be set into the garden wall at Chy Kernyk.\n\nThe Cornish name of the house — Chy Kernyk means 'Cornish House' — felt even more appropriate with hand-carved stone becoming part of its fabric. A house made with hands as well as hearts." },
  { id: "the-build", title: "The Build", date: "2025-01-15", excerpt: "Dust, decisions, and determination — the renovation journey from stripped-back shell to the coastal retreat we'd always dreamed of.", content: "Nothing prepares you for the reality of a major renovation 300 miles from where you live. Weekly site visits became our rhythm — Friday evening drives down the A303, arriving late to a village wrapped in sea mist.\n\nThe builders were extraordinary. Local craftsmen who understood the materials and the climate. They talked about the house as if it were alive — 'she needs to breathe,' they'd say about the lime render. 'Let her settle,' about the new oak beams.\n\nThere were challenges: supply delays, a discovery of an old well beneath the kitchen floor (which became a feature rather than a problem), and a memorable week when Storm Éowyn tested every window seal. But watching the house transform — seeing our vision become reality — was worth every dusty, exhausting, wonderful moment." },
];

const FOOD_PLACES = [
  { id: "portscatho-stores", name: "Portscatho Stores", desc: "The heart of the village — exceptional deli, fresh bread daily, local produce, and everything you need. Their pasties are legendary.", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80", tags: ["deli", "groceries", "bakery"], website: "#", location: "Portscatho" },
  { id: "tregew-food-market", name: "Tregew Food Market", desc: "A beautifully curated farm shop and food market showcasing the very best of Cornish produce. Don't miss their cheese counter.", image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80", tags: ["farm shop", "local produce"], website: "#", location: "Near Froe" },
  { id: "curgurrell-farm-shop", name: "Curgurrell Farm Shop", desc: "Family-run farm shop with their own livestock and kitchen garden produce. Seasonal, honest, and utterly delicious.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", tags: ["farm shop", "meat", "seasonal"], website: "#", location: "Curgurrell" },
  { id: "hidden-hut", name: "Hidden Hut", desc: "Cornwall's most famous beach café. Their feast nights are the stuff of legend — book months ahead. By day, superb cakes and coffee on Porthcurnick Beach.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", tags: ["restaurant", "beach", "feast nights"], website: "#", location: "Porthcurnick Beach" },
  { id: "standard", name: "Standard", desc: "Contemporary dining with impeccable local sourcing. The tasting menu is a journey through Cornwall's finest ingredients.", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", tags: ["restaurant", "fine dining"], website: "#", location: "Falmouth" },
  { id: "tresanton", name: "Tresanton", desc: "Olga Polizzi's celebrated hotel restaurant in St Mawes. Mediterranean-influenced cooking with stunning harbour views.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&q=80", tags: ["restaurant", "hotel", "harbour views"], website: "#", location: "St Mawes" },
  { id: "the-meat-counter", name: "The Meat Counter", desc: "Falmouth's finest butcher and charcuterie. Dry-aged steaks, house-made sausages, and a deli counter that demands multiple visits.", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", tags: ["butcher", "deli", "charcuterie"], website: "#", location: "Falmouth" },
  { id: "scathos-scoops", name: "Scatho's Scoops", desc: "Artisan ice cream made in Portscatho. Clotted cream, Cornish strawberry, and salted caramel are unmissable on a warm afternoon.", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80", tags: ["ice cream", "treats"], website: "#", location: "Portscatho" },
];

const ACTIVITIES = [
  { id: "beaches", name: "Beaches", desc: "The Roseland Peninsula boasts some of Cornwall's most beautiful and least crowded beaches. From Porthcurnick's sheltered sands to the wild beauty of Pendower.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", tags: ["outdoors", "family"] },
  { id: "fish-n-trips", name: "Fish n Trips", desc: "Join local fisherman on a mackerel fishing trip from St Mawes harbour. Catch your supper and learn about Cornwall's maritime heritage.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", tags: ["fishing", "boat"] },
  { id: "surfing-newquay", name: "Surfing in Newquay", desc: "An hour's drive takes you to Cornwall's surf capital. Lessons available for all ages and abilities at Fistral and Watergate Bay.", image: "https://images.unsplash.com/photo-1502680390548-bdbac40b3e1c?w=800&q=80", tags: ["surfing", "adventure"] },
  { id: "heligan", name: "The Lost Gardens of Heligan", desc: "One of the most beloved gardens in England. Explore the jungle, the productive gardens, and the famous sleeping mud maid.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80", tags: ["gardens", "history"] },
  { id: "burncoose", name: "Burncoose Nurseries", desc: "One of the UK's finest nurseries set in 30 acres of woodland garden. Magnificent camellias, magnolias, and rare plants.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", tags: ["gardens", "plants"] },
  { id: "eden-project", name: "Eden Project", desc: "The iconic biomes housing the world's largest indoor rainforest. A must-visit that never disappoints, whatever the weather.", image: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=800&q=80", tags: ["attraction", "family"] },
  { id: "st-ives", name: "St Ives", desc: "The jewel of the north coast. Tate St Ives, the Barbara Hepworth Museum, cobbled lanes, and some of the best light in Britain.", image: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?w=800&q=80", tags: ["town", "art", "culture"] },
];

const WALKS = [
  { id: "nare", name: "Nare Head", desc: "A spectacular circular walk around Nare Head with panoramic views of the coast. Moderate difficulty with some steep sections.", length: "4.2 miles", difficulty: "Moderate", parking: "Park at Carne Beach car park (free for National Trust members). Can get busy in summer — arrive before 10am.", eating: "The Hidden Hut at Porthcurnick Beach is a perfect post-walk stop. Alternatively, head to Portscatho Stores for a takeaway pasty.", image: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=800&q=80" },
  { id: "curgurrell", name: "Curgurrell Creek", desc: "A gentle walk through ancient woodland and along the creek. Perfect for a peaceful morning stroll or a family outing with young children.", length: "2.8 miles", difficulty: "Easy", parking: "Limited roadside parking near Curgurrell Farm. Please park considerately and respect local residents.", eating: "Curgurrell Farm Shop for provisions, or continue to Portscatho for the full range of options.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" },
  { id: "towan", name: "Towan Beach Circuit", desc: "A beautiful coastal and inland loop taking in Towan Beach, farmland, and quiet lanes. Wonderful wildflowers in spring and early summer.", length: "3.5 miles", difficulty: "Easy-Moderate", parking: "Towan Beach car park. Honesty box payment.", eating: "Pack a picnic from Portscatho Stores — Towan Beach is a perfect lunch spot.", image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80" },
  { id: "st-anthony", name: "St Anthony Head", desc: "Walk to the lighthouse at St Anthony Head with views across Falmouth Bay. One of the finest viewpoints in Cornwall.", length: "3.0 miles", difficulty: "Easy-Moderate", parking: "National Trust car park at Place. Follow signs carefully — the lanes are narrow.", eating: "The Place restaurant (seasonal) or head to St Mawes for the Tresanton or the pub on the quay.", image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800&q=80" },
  { id: "st-mawes", name: "St Mawes Castle Walk", desc: "A gentle walk around St Mawes taking in the castle, harbour, and stunning views of the Fal estuary and Pendennis Castle opposite.", length: "2.0 miles", difficulty: "Easy", parking: "St Mawes main car park (pay and display). Free in winter months.", eating: "Spoilt for choice — the Tresanton for something special, the Watch House for fish and chips, or the Rising Sun for a proper pub lunch.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
];

const PARKRUNS = [
  { name: "Trelissick", url: "https://www.parkrun.org.uk/trelissick/", desc: "A beautiful course through the National Trust grounds at Trelissick, with views over the Fal estuary. Two laps, mostly flat with one gentle climb." },
  { name: "Lanhydrock", url: "https://www.parkrun.org.uk/lanhydrock/", desc: "Set in the stunning grounds of Lanhydrock House. A single-lap course through parkland and woodland. Undulating terrain." },
  { name: "Falmouth", url: "https://www.parkrun.org.uk/falmouth/", desc: "A scenic course along the seafront and through Gyllyngvase gardens. Flat and fast with beautiful coastal views." },
];

const REMEDIES = [
  { category: "Medical", items: [
    { name: "Roseland Surgery", detail: "St Mawes — 01326 270218", icon: "🏥" },
    { name: "Treliske Hospital (Royal Cornwall)", detail: "Truro — 01872 250000 — A&E available 24hrs", icon: "🚑" },
    { name: "NHS 111", detail: "Call 111 for non-emergency medical advice", icon: "📞" },
  ]},
  { category: "Emergency Services", items: [
    { name: "Emergency", detail: "999 — Police, Fire, Ambulance, Coastguard", icon: "🆘" },
    { name: "Coastguard", detail: "999 and ask for Coastguard", icon: "⚓" },
  ]},
  { category: "House Maintenance", items: [
    { name: "Plumber", detail: "Roseland Plumbing — 01872 XXXXXX", icon: "🔧" },
    { name: "Electrician", detail: "Portscatho Electrical — 01872 XXXXXX", icon: "⚡" },
    { name: "Stopcock Location", detail: "Under the kitchen sink, left side. Turn clockwise to close.", icon: "🚰" },
    { name: "Fusebox Location", detail: "Utility room, wall-mounted to the right of the door.", icon: "🔌" },
    { name: "Boiler", detail: "Utility room. Instructions in the red folder on the shelf. Emergency off switch is the red button.", icon: "🌡️" },
  ]},
  { category: "Useful Numbers", items: [
    { name: "Property Manager", detail: "Contact for any issues — 07XXX XXXXXX", icon: "🏠" },
    { name: "WiFi Password", detail: "Network: ChyKernyk-Guest / Password: SeaView2025", icon: "📶" },
  ]},
];

const GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", caption: "The House" },
  { id: 2, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", caption: "Living Room" },
  { id: 3, url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", caption: "Kitchen" },
  { id: 4, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", caption: "Beach View" },
  { id: 5, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", caption: "Master Bedroom" },
  { id: 6, url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80", caption: "Garden" },
  { id: 7, url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", caption: "Countryside" },
  { id: 8, url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80", caption: "Bathroom" },
  { id: 9, url: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&q=80", caption: "Local Village" },
];

// ─── STYLES ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --ocean: #1a3a4a;
    --ocean-light: #2a5a6a;
    --sand: #f5f0e8;
    --sand-dark: #e8e0d0;
    --gold: #c5a55a;
    --gold-light: #d4b86a;
    --stone: #8b8578;
    --coral: #d4856a;
    --white: #fefdfb;
    --text: #2a2a28;
    --text-light: #6b6b65;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Outfit', system-ui, sans-serif;
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  .ck-app {
    font-family: var(--font-body);
    color: var(--text);
    background: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .ck-nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    background: rgba(254,253,251,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(26,58,74,0.08);
    transition: all 0.4s ease;
  }
  .ck-nav.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.06); }
  .ck-nav-inner {
    max-width: 1400px; margin:0 auto;
    display:flex; align-items:center; justify-content:space-between;
    padding: 0.75rem 2rem;
  }
  .ck-logo {
    font-family: var(--font-display);
    font-size: 1.6rem; font-weight: 300;
    color: var(--ocean);
    letter-spacing: 0.05em;
    cursor:pointer;
    transition: opacity 0.3s;
  }
  .ck-logo:hover { opacity:0.7; }
  .ck-logo span { font-weight: 600; }

  .ck-nav-links {
    display:flex; gap:0.25rem; align-items:center; flex-wrap:wrap;
    justify-content:center;
  }
  .ck-nav-link {
    background:none; border:none; cursor:pointer;
    font-family: var(--font-body);
    font-size: 0.8rem; font-weight: 400;
    color: var(--text-light);
    padding: 0.5rem 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.3s;
    border-radius: 4px;
    white-space: nowrap;
  }
  .ck-nav-link:hover { color: var(--ocean); background: rgba(26,58,74,0.04); }
  .ck-nav-link.active { color: var(--ocean); font-weight: 500; }

  .ck-nav-auth {
    display:flex; gap:0.5rem; align-items:center;
  }
  .ck-btn-login {
    background: var(--ocean); color:white; border:none;
    padding: 0.5rem 1.2rem; border-radius:6px; cursor:pointer;
    font-family: var(--font-body); font-size:0.78rem;
    font-weight:500; letter-spacing:0.04em; text-transform:uppercase;
    transition: all 0.3s;
  }
  .ck-btn-login:hover { background: var(--ocean-light); transform: translateY(-1px); }
  .ck-btn-logout {
    background:none; color: var(--coral); border:1px solid var(--coral);
    padding: 0.4rem 1rem; border-radius:6px; cursor:pointer;
    font-family: var(--font-body); font-size:0.75rem;
    font-weight:500; letter-spacing:0.04em; text-transform:uppercase;
    transition: all 0.3s;
  }
  .ck-btn-logout:hover { background: var(--coral); color:white; }

  .ck-hamburger {
    display:none; background:none; border:none; cursor:pointer;
    width:32px; height:32px; position:relative;
  }
  .ck-hamburger span {
    display:block; width:24px; height:2px; background:var(--ocean);
    position:absolute; left:4px; transition: all 0.3s;
  }
  .ck-hamburger span:nth-child(1) { top:8px; }
  .ck-hamburger span:nth-child(2) { top:15px; }
  .ck-hamburger span:nth-child(3) { top:22px; }
  .ck-hamburger.open span:nth-child(1) { transform:rotate(45deg); top:15px; }
  .ck-hamburger.open span:nth-child(2) { opacity:0; }
  .ck-hamburger.open span:nth-child(3) { transform:rotate(-45deg); top:15px; }

  .ck-mobile-menu {
    display:none; position:fixed; top:60px; left:0; right:0; bottom:0;
    background: var(--white); z-index:99; padding:2rem;
    flex-direction:column; gap:0.5rem; overflow-y:auto;
  }
  .ck-mobile-menu.open { display:flex; }
  .ck-mobile-menu .ck-nav-link {
    font-size:1rem; padding:0.8rem 0; text-align:left;
    border-bottom: 1px solid var(--sand);
  }

  @media(max-width:900px) {
    .ck-nav-links, .ck-nav-auth { display:none; }
    .ck-hamburger { display:block; }
    .ck-mobile-menu .ck-nav-auth-mobile { display:flex; gap:0.5rem; margin-top:1rem; }
  }

  /* ── HERO ── */
  .ck-hero {
    position:relative; height:100vh; min-height:600px;
    overflow:hidden; display:flex; align-items:center; justify-content:center;
  }
  .ck-hero-slide {
    position:absolute; inset:0;
    background-size:cover; background-position:center;
    transition: opacity 1.2s ease;
    opacity:0;
  }
  .ck-hero-slide.active { opacity:1; }
  .ck-hero-slide::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(180deg, rgba(26,58,74,0.15) 0%, rgba(26,58,74,0.5) 100%);
  }
  .ck-hero-content {
    position:relative; z-index:2; text-align:center; color:white;
    padding: 2rem;
  }
  .ck-hero-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 300;
    letter-spacing: 0.06em;
    line-height: 1.1;
    text-shadow: 0 2px 40px rgba(0,0,0,0.3);
  }
  .ck-hero-subtitle {
    font-family: var(--font-body);
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    font-weight: 300;
    margin-top: 1.2rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    opacity: 0.85;
  }
  .ck-hero-caption {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    z-index:3; color:rgba(255,255,255,0.7);
    font-size:0.8rem; letter-spacing:0.1em;
    text-transform:uppercase;
  }
  .ck-hero-dots {
    position:absolute; bottom:4rem; left:50%; transform:translateX(-50%);
    z-index:3; display:flex; gap:0.75rem;
  }
  .ck-hero-dot {
    width:8px; height:8px; border-radius:50%;
    background:rgba(255,255,255,0.4); border:none; cursor:pointer;
    transition: all 0.3s;
  }
  .ck-hero-dot.active { background:white; transform:scale(1.3); }

  /* ── SECTIONS ── */
  .ck-section {
    max-width:1200px; margin:0 auto;
    padding: 5rem 2rem;
  }
  .ck-section-wide { max-width:1400px; }
  .ck-section-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    color: var(--ocean);
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
  }
  .ck-section-line {
    width: 60px; height:2px;
    background: var(--gold);
    margin-bottom: 2rem;
  }
  .ck-section-desc {
    font-size:1.05rem; line-height:1.8;
    color: var(--text-light);
    max-width:700px;
    margin-bottom:3rem;
  }

  /* ── PAGE HEADER ── */
  .ck-page-header {
    padding-top:120px; padding-bottom:3rem;
    background: linear-gradient(180deg, var(--sand) 0%, var(--white) 100%);
  }
  .ck-page-header-inner {
    max-width:1200px; margin:0 auto; padding:0 2rem;
  }
  .ck-breadcrumb {
    font-size:0.8rem; color:var(--stone);
    margin-bottom:1rem; letter-spacing:0.04em; text-transform:uppercase;
  }
  .ck-breadcrumb button {
    background:none; border:none; cursor:pointer;
    color:var(--ocean); font-family:var(--font-body);
    font-size:0.8rem; letter-spacing:0.04em; text-transform:uppercase;
  }
  .ck-breadcrumb button:hover { text-decoration:underline; }

  /* ── CARDS ── */
  .ck-grid {
    display:grid; gap:2rem;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  .ck-grid-3 { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

  .ck-card {
    border-radius:12px; overflow:hidden;
    background:white;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    transition: all 0.4s ease;
    cursor:pointer;
  }
  .ck-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  }
  .ck-card-img {
    width:100%; height:220px; object-fit:cover;
    transition: transform 0.6s ease;
  }
  .ck-card:hover .ck-card-img { transform:scale(1.05); }
  .ck-card-img-wrap { overflow:hidden; }
  .ck-card-body { padding:1.5rem; }
  .ck-card-title {
    font-family: var(--font-display);
    font-size:1.4rem; font-weight:500;
    color: var(--ocean);
    margin-bottom:0.5rem;
  }
  .ck-card-text {
    font-size:0.92rem; line-height:1.7;
    color: var(--text-light);
  }
  .ck-card-meta {
    font-size:0.78rem; color:var(--stone);
    margin-bottom:0.4rem; letter-spacing:0.04em;
    text-transform:uppercase;
  }
  .ck-card-tags { display:flex; gap:0.4rem; margin-top:0.75rem; flex-wrap:wrap; }
  .ck-tag {
    font-size:0.72rem; padding:0.25rem 0.6rem;
    border-radius:20px; background:var(--sand);
    color:var(--stone); letter-spacing:0.03em; text-transform:uppercase;
  }

  /* ── DETAIL PAGE ── */
  .ck-detail-hero {
    width:100%; height:50vh; min-height:300px;
    object-fit:cover; margin-top:60px;
  }
  .ck-detail-content {
    max-width:800px; margin:0 auto; padding:3rem 2rem;
  }
  .ck-detail-title {
    font-family:var(--font-display);
    font-size: clamp(2rem,4vw,3rem);
    font-weight:400; color:var(--ocean);
    margin-bottom:1rem;
  }
  .ck-detail-body {
    font-size:1.05rem; line-height:1.9;
    color: var(--text);
  }
  .ck-detail-body p { margin-bottom:1.5rem; }
  .ck-detail-info {
    background:var(--sand); border-radius:12px;
    padding:2rem; margin:2rem 0;
  }
  .ck-detail-info h3 {
    font-family:var(--font-display);
    font-size:1.3rem; color:var(--ocean);
    margin-bottom:0.75rem;
  }
  .ck-detail-info p {
    font-size:0.95rem; line-height:1.7;
    color: var(--text-light);
  }
  .ck-detail-badge {
    display:inline-block; padding:0.3rem 0.8rem;
    background:var(--ocean); color:white;
    border-radius:20px; font-size:0.78rem;
    letter-spacing:0.04em; margin-right:0.5rem; margin-bottom:0.5rem;
  }

  /* ── GALLERY ── */
  .ck-gallery-grid {
    display:grid; gap:0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .ck-gallery-item {
    position:relative; overflow:hidden; border-radius:8px;
    cursor:pointer; aspect-ratio:4/3;
  }
  .ck-gallery-item img {
    width:100%; height:100%; object-fit:cover;
    transition: transform 0.6s ease;
  }
  .ck-gallery-item:hover img { transform:scale(1.08); }
  .ck-gallery-item::after {
    content:attr(data-caption);
    position:absolute; bottom:0; left:0; right:0;
    padding:1rem; color:white; font-size:0.85rem;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    opacity:0; transition: opacity 0.3s;
    letter-spacing:0.03em;
  }
  .ck-gallery-item:hover::after { opacity:1; }

  /* ── LIGHTBOX ── */
  .ck-lightbox {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,0.92);
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
  }
  .ck-lightbox img {
    max-width:90vw; max-height:85vh;
    object-fit:contain; border-radius:8px;
  }
  .ck-lightbox-close {
    position:absolute; top:1.5rem; right:1.5rem;
    background:none; border:none; color:white;
    font-size:2rem; cursor:pointer; opacity:0.7;
    transition: opacity 0.3s;
  }
  .ck-lightbox-close:hover { opacity:1; }
  .ck-lightbox-caption {
    position:absolute; bottom:2rem; left:50%;
    transform:translateX(-50%); color:white;
    font-family:var(--font-display); font-size:1.2rem;
    letter-spacing:0.04em;
  }

  /* ── BLOG ── */
  .ck-blog-post { margin-bottom:2rem; }
  .ck-blog-date {
    font-size:0.78rem; color:var(--gold);
    letter-spacing:0.1em; text-transform:uppercase;
    margin-bottom:0.3rem;
  }
  .ck-read-more {
    display:inline-block; margin-top:0.75rem;
    color:var(--ocean); font-size:0.85rem; font-weight:500;
    letter-spacing:0.06em; text-transform:uppercase;
    border:none; background:none; cursor:pointer;
    transition: color 0.3s;
  }
  .ck-read-more:hover { color:var(--gold); }

  /* ── FORMS ── */
  .ck-form-group { margin-bottom:1.25rem; }
  .ck-label {
    display:block; font-size:0.8rem; font-weight:500;
    color:var(--text-light); margin-bottom:0.4rem;
    letter-spacing:0.06em; text-transform:uppercase;
  }
  .ck-input, .ck-textarea {
    width:100%; padding:0.75rem 1rem;
    border:1px solid var(--sand-dark);
    border-radius:8px; font-family:var(--font-body);
    font-size:0.95rem; color:var(--text);
    background:white; transition: border-color 0.3s;
  }
  .ck-input:focus, .ck-textarea:focus {
    outline:none; border-color:var(--ocean);
  }
  .ck-textarea { min-height:150px; resize:vertical; }
  .ck-btn {
    padding:0.7rem 1.8rem; border:none; border-radius:8px;
    font-family:var(--font-body); font-size:0.85rem;
    font-weight:500; letter-spacing:0.06em; text-transform:uppercase;
    cursor:pointer; transition: all 0.3s;
  }
  .ck-btn-primary { background:var(--ocean); color:white; }
  .ck-btn-primary:hover { background:var(--ocean-light); transform:translateY(-1px); }
  .ck-btn-secondary { background:var(--sand); color:var(--ocean); }
  .ck-btn-secondary:hover { background:var(--sand-dark); }
  .ck-btn-danger { background:#d44; color:white; }
  .ck-btn-danger:hover { background:#c33; }
  .ck-btn-sm { padding:0.4rem 1rem; font-size:0.78rem; }

  /* ── CALENDAR ── */
  .ck-cal { user-select:none; }
  .ck-cal-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:1.5rem;
  }
  .ck-cal-nav {
    background:none; border:1px solid var(--sand-dark);
    width:36px; height:36px; border-radius:8px;
    cursor:pointer; font-size:1.1rem; color:var(--ocean);
    display:flex; align-items:center; justify-content:center;
    transition: all 0.3s;
  }
  .ck-cal-nav:hover { background:var(--sand); }
  .ck-cal-month {
    font-family:var(--font-display);
    font-size:1.5rem; font-weight:400; color:var(--ocean);
  }
  .ck-cal-grid {
    display:grid; grid-template-columns:repeat(7,1fr); gap:2px;
  }
  .ck-cal-day-label {
    text-align:center; font-size:0.72rem; font-weight:500;
    color:var(--stone); padding:0.5rem;
    letter-spacing:0.08em; text-transform:uppercase;
  }
  .ck-cal-day {
    aspect-ratio:1; display:flex; align-items:center; justify-content:center;
    font-size:0.9rem; border-radius:8px;
    cursor:pointer; transition: all 0.2s;
    position:relative;
  }
  .ck-cal-day:hover { background:var(--sand); }
  .ck-cal-day.empty { cursor:default; }
  .ck-cal-day.empty:hover { background:transparent; }
  .ck-cal-day.today { font-weight:600; box-shadow:inset 0 0 0 2px var(--ocean); }
  .ck-cal-day.booked { background:#fde8e8; color:#a33; }
  .ck-cal-day.available { background:#e8f5e8; color:#3a7; }
  .ck-cal-day.owner { background:#e8f0fd; color:#36a; }
  .ck-cal-legend {
    display:flex; gap:1.5rem; margin-top:1.5rem; flex-wrap:wrap;
  }
  .ck-cal-legend-item {
    display:flex; align-items:center; gap:0.5rem;
    font-size:0.82rem; color:var(--text-light);
  }
  .ck-cal-legend-dot {
    width:14px; height:14px; border-radius:4px;
  }

  /* ── PARKRUN ── */
  .ck-parkrun-card {
    padding:1.5rem; border-radius:12px;
    border:1px solid var(--sand-dark);
    margin-bottom:1rem; transition: all 0.3s;
  }
  .ck-parkrun-card:hover {
    border-color:var(--ocean);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .ck-parkrun-link {
    color:var(--ocean); text-decoration:none;
    font-family:var(--font-display); font-size:1.3rem;
    font-weight:500;
  }
  .ck-parkrun-link:hover { color:var(--gold); }

  /* ── REMEDIES ── */
  .ck-remedy-section { margin-bottom:2.5rem; }
  .ck-remedy-title {
    font-family:var(--font-display);
    font-size:1.4rem; color:var(--ocean);
    margin-bottom:1rem; font-weight:500;
  }
  .ck-remedy-item {
    display:flex; align-items:flex-start; gap:1rem;
    padding:1rem; border-radius:8px;
    border:1px solid var(--sand-dark);
    margin-bottom:0.5rem;
    transition: all 0.3s;
  }
  .ck-remedy-item:hover { border-color:var(--ocean); background:var(--sand); }
  .ck-remedy-icon { font-size:1.5rem; flex-shrink:0; }
  .ck-remedy-name { font-weight:500; color:var(--ocean); margin-bottom:0.2rem; }
  .ck-remedy-detail { font-size:0.9rem; color:var(--text-light); }

  /* ── CONTACT ── */
  .ck-contact-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:3rem;
  }
  @media(max-width:768px) { .ck-contact-grid { grid-template-columns:1fr; } }
  .ck-map-container {
    width:100%; height:400px; border-radius:12px; overflow:hidden;
    border:1px solid var(--sand-dark);
  }
  .ck-contact-info { display:flex; flex-direction:column; gap:1.5rem; }
  .ck-contact-item h3 {
    font-family:var(--font-display);
    font-size:1.2rem; color:var(--ocean);
    margin-bottom:0.3rem;
  }
  .ck-contact-item p {
    font-size:0.95rem; color:var(--text-light); line-height:1.6;
  }
  .ck-contact-item a { color:var(--ocean); text-decoration:none; }
  .ck-contact-item a:hover { color:var(--gold); }

  /* ── AUTH MODAL ── */
  .ck-modal-overlay {
    position:fixed; inset:0; z-index:300;
    background:rgba(26,58,74,0.5);
    backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
  }
  .ck-modal {
    background:white; border-radius:16px;
    padding:2.5rem; max-width:440px; width:100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .ck-modal-title {
    font-family:var(--font-display);
    font-size:1.8rem; color:var(--ocean);
    margin-bottom:0.5rem;
  }
  .ck-modal-subtitle {
    font-size:0.9rem; color:var(--text-light);
    margin-bottom:2rem; line-height:1.6;
  }
  .ck-modal-error {
    background:#fde8e8; color:#a33;
    padding:0.6rem 1rem; border-radius:8px;
    font-size:0.85rem; margin-bottom:1rem;
  }

  /* ── SITE GATE ── */
  .ck-gate {
    position:fixed; inset:0; z-index:500;
    background: var(--ocean);
    display:flex; align-items:center; justify-content:center;
    flex-direction:column; padding:2rem;
  }
  .ck-gate-title {
    font-family:var(--font-display);
    font-size: clamp(2.5rem,6vw,4.5rem);
    color:white; font-weight:300;
    letter-spacing:0.06em; margin-bottom:0.5rem;
    text-align:center;
  }
  .ck-gate-subtitle {
    color:rgba(255,255,255,0.5);
    font-size:0.85rem; letter-spacing:0.15em;
    text-transform:uppercase; margin-bottom:3rem;
    text-align:center;
  }
  .ck-gate-form {
    max-width:360px; width:100%; text-align:center;
  }
  .ck-gate-input {
    width:100%; padding:0.85rem 1.2rem;
    border:1px solid rgba(255,255,255,0.2);
    border-radius:8px; background:rgba(255,255,255,0.08);
    color:white; font-family:var(--font-body);
    font-size:1rem; text-align:center;
    letter-spacing:0.05em;
    transition: border-color 0.3s;
  }
  .ck-gate-input::placeholder { color:rgba(255,255,255,0.3); }
  .ck-gate-input:focus { outline:none; border-color:var(--gold); }
  .ck-gate-btn {
    margin-top:1rem; width:100%;
    padding:0.85rem; border:none; border-radius:8px;
    background:var(--gold); color:var(--ocean);
    font-family:var(--font-body); font-size:0.9rem;
    font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
    cursor:pointer; transition: all 0.3s;
  }
  .ck-gate-btn:hover { background:var(--gold-light); transform:translateY(-1px); }
  .ck-gate-error {
    color:var(--coral); font-size:0.85rem; margin-top:1rem;
  }

  /* ── FOOTER ── */
  .ck-footer {
    background:var(--ocean); color:rgba(255,255,255,0.6);
    padding:3rem 2rem; text-align:center;
  }
  .ck-footer-name {
    font-family:var(--font-display);
    font-size:1.4rem; color:white;
    margin-bottom:0.5rem; letter-spacing:0.05em;
  }
  .ck-footer p { font-size:0.85rem; line-height:1.8; }

  /* ── EDITOR ── */
  .ck-editor-actions {
    display:flex; gap:0.75rem; margin-bottom:2rem; flex-wrap:wrap;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
  }
  .ck-animate { animation: fadeInUp 0.6s ease forwards; }
  .ck-animate-d1 { animation-delay:0.1s; opacity:0; }
  .ck-animate-d2 { animation-delay:0.2s; opacity:0; }
  .ck-animate-d3 { animation-delay:0.3s; opacity:0; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────

// Site Password Gate
function SiteGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="ck-gate">
      <h1 className="ck-gate-title">Chy Kernyk</h1>
      <p className="ck-gate-subtitle">A Cornish retreat on the Roseland Peninsula</p>
      <div className="ck-gate-form">
        <input
          className="ck-gate-input"
          type="password"
          placeholder="Enter password to continue"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(""); }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              if (pw === SITE_PASSWORD) onUnlock();
              else setError("Incorrect password. Please try again.");
            }
          }}
          aria-label="Site password"
          autoFocus
        />
        <button className="ck-gate-btn" onClick={() => {
          if (pw === SITE_PASSWORD) onUnlock();
          else setError("Incorrect password. Please try again.");
        }}>Enter</button>
        {error && <p className="ck-gate-error">{error}</p>}
      </div>
    </div>
  );
}

// Admin Login Modal
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = ADMIN_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user.email);
      onClose();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="ck-modal-overlay" onClick={onClose}>
      <div className="ck-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ck-modal-title">Admin Login</h2>
        <p className="ck-modal-subtitle">Sign in to manage blog posts and calendar availability.</p>
        {error && <div className="ck-modal-error">{error}</div>}
        <div className="ck-form-group">
          <label className="ck-label">Email</label>
          <input className="ck-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="ck-form-group">
          <label className="ck-label">Password</label>
          <input className="ck-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button className="ck-btn ck-btn-primary" onClick={handleLogin}>Sign In</button>
          <button className="ck-btn ck-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// Navigation
function Nav({ page, setPage, isAdmin, onLoginClick, onLogout, mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "blog", label: "Blog" },
    { id: "gallery", label: "Gallery" },
    { id: "food", label: "Food" },
    { id: "activities", label: "Activities" },
    { id: "walks", label: "Walks" },
    { id: "parkrun", label: "parkrun" },
    { id: "calendar", label: "Calendar" },
    { id: "remedies", label: "Remedies" },
    { id: "contact", label: "Contact" },
  ];

  const navigate = (id) => { setPage(id); setMobileOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <nav className={`ck-nav ${scrolled ? "scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="ck-nav-inner">
          <div className="ck-logo" onClick={() => navigate("home")} role="button" tabIndex={0} aria-label="Go to home page">
            Chy <span>Kernyk</span>
          </div>
          <div className="ck-nav-links">
            {links.map(l => (
              <button key={l.id} className={`ck-nav-link ${page === l.id ? "active" : ""}`}
                onClick={() => navigate(l.id)}>{l.label}</button>
            ))}
          </div>
          <div className="ck-nav-auth">
            {isAdmin ? (
              <button className="ck-btn-logout" onClick={onLogout}>Logout</button>
            ) : (
              <button className="ck-btn-login" onClick={onLoginClick}>Admin</button>
            )}
          </div>
          <button className={`ck-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`ck-mobile-menu ${mobileOpen ? "open" : ""}`}>
        {links.map(l => (
          <button key={l.id} className={`ck-nav-link ${page === l.id ? "active" : ""}`}
            onClick={() => navigate(l.id)}>{l.label}</button>
        ))}
        <div className="ck-nav-auth-mobile">
          {isAdmin ? (
            <button className="ck-btn-logout" onClick={() => { onLogout(); setMobileOpen(false); }}>Logout</button>
          ) : (
            <button className="ck-btn-login" onClick={() => { onLoginClick(); setMobileOpen(false); }}>Admin Login</button>
          )}
        </div>
      </div>
    </>
  );
}

// Hero Carousel
function Hero({ setPage }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ck-hero" aria-label="Hero carousel">
      {HERO_IMAGES.map((img, i) => (
        <div key={i} className={`ck-hero-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img.url})` }} role="img" aria-label={img.caption} />
      ))}
      <div className="ck-hero-content">
        <h1 className="ck-hero-title ck-animate">Chy Kernyk</h1>
        <p className="ck-hero-subtitle ck-animate ck-animate-d1">Portscatho · Roseland Peninsula · Cornwall</p>
      </div>
      <div className="ck-hero-dots">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} className={`ck-hero-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
      <div className="ck-hero-caption">{HERO_IMAGES[current].caption}</div>
    </section>
  );
}

// Page Header
function PageHeader({ title, subtitle, page, setPage, backTo, backLabel }) {
  return (
    <div className="ck-page-header">
      <div className="ck-page-header-inner">
        {backTo && (
          <div className="ck-breadcrumb">
            <button onClick={() => { setPage(backTo); window.scrollTo(0, 0); }}>{backLabel || "Back"}</button>
            <span> / {title}</span>
          </div>
        )}
        <h1 className="ck-section-title">{title}</h1>
        <div className="ck-section-line" />
        {subtitle && <p className="ck-section-desc">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────

// HOME
function HomePage({ setPage }) {
  return (
    <main>
      <Hero setPage={setPage} />
      <section className="ck-section" style={{ textAlign: "center" }}>
        <h2 className="ck-section-title" style={{ marginBottom: "1rem" }}>Welcome</h2>
        <div className="ck-section-line" style={{ margin: "0 auto 2rem" }} />
        <p style={{ maxWidth: 650, margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.9, color: "var(--text-light)" }}>
          Perched above the beach in Portscatho, on Cornwall's beautiful Roseland Peninsula,
          Chy Kernyk offers an extraordinary coastal retreat. Wake to the sound of the sea,
          watch the light play across the water towards Gull Rock, and discover one of the
          most unspoilt corners of Cornwall.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
          <button className="ck-btn ck-btn-primary" onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }}>View Gallery</button>
          <button className="ck-btn ck-btn-secondary" onClick={() => { setPage("calendar"); window.scrollTo(0, 0); }}>Check Availability</button>
        </div>
      </section>
    </main>
  );
}

// BLOG
function BlogPage({ setPage, posts, setPosts, isAdmin, setSubPage }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "" });

  const startEdit = (post) => {
    setEditing(post ? post.id : "new");
    setForm(post ? { title: post.title, excerpt: post.excerpt, content: post.content } : { title: "", excerpt: "", content: "" });
  };
  const savePost = () => {
    if (editing === "new") {
      const id = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setPosts([{ id, title: form.title, date: new Date().toISOString().split("T")[0], excerpt: form.excerpt, content: form.content }, ...posts]);
    } else {
      setPosts(posts.map(p => p.id === editing ? { ...p, ...form } : p));
    }
    setEditing(null);
  };
  const deletePost = (id) => {
    if (confirm("Delete this post?")) setPosts(posts.filter(p => p.id !== id));
  };

  if (editing) {
    return (
      <>
        <PageHeader title={editing === "new" ? "New Post" : "Edit Post"} setPage={setPage} backTo="blog" backLabel="Blog" />
        <section className="ck-section" style={{ maxWidth: 800, paddingTop: "2rem" }}>
          <div className="ck-form-group">
            <label className="ck-label">Title</label>
            <input className="ck-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="ck-form-group">
            <label className="ck-label">Excerpt</label>
            <input className="ck-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div className="ck-form-group">
            <label className="ck-label">Content (use double newline for paragraphs)</label>
            <textarea className="ck-textarea" rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="ck-btn ck-btn-primary" onClick={savePost}>Save</button>
            <button className="ck-btn ck-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Our Story" subtitle="The journey of finding, designing, and building our Cornish retreat." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        {isAdmin && (
          <div className="ck-editor-actions">
            <button className="ck-btn ck-btn-primary ck-btn-sm" onClick={() => startEdit(null)}>+ New Post</button>
          </div>
        )}
        {posts.map(post => (
          <article key={post.id} className="ck-blog-post ck-animate" style={{ marginBottom: "2.5rem" }}>
            <p className="ck-blog-date">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            <h2 className="ck-card-title" style={{ marginBottom: "0.5rem", cursor: "pointer" }}
              onClick={() => { setSubPage({ type: "blog-detail", id: post.id }); window.scrollTo(0, 0); }}>{post.title}</h2>
            <p className="ck-card-text">{post.excerpt}</p>
            <button className="ck-read-more" onClick={() => { setSubPage({ type: "blog-detail", id: post.id }); window.scrollTo(0, 0); }}>Read more →</button>
            {isAdmin && (
              <span style={{ marginLeft: "1rem" }}>
                <button className="ck-btn ck-btn-secondary ck-btn-sm" onClick={() => startEdit(post)} style={{ marginRight: "0.5rem" }}>Edit</button>
                <button className="ck-btn ck-btn-danger ck-btn-sm" onClick={() => deletePost(post.id)}>Delete</button>
              </span>
            )}
          </article>
        ))}
      </section>
    </>
  );
}

function BlogDetail({ post, setPage, setSubPage }) {
  if (!post) return <div className="ck-section"><p>Post not found.</p></div>;
  return (
    <>
      <div className="ck-page-header">
        <div className="ck-page-header-inner">
          <div className="ck-breadcrumb">
            <button onClick={() => { setSubPage(null); setPage("blog"); window.scrollTo(0, 0); }}>Blog</button>
            <span> / {post.title}</span>
          </div>
        </div>
      </div>
      <div className="ck-detail-content">
        <p className="ck-blog-date">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="ck-detail-title">{post.title}</h1>
        <div className="ck-detail-body">
          {post.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </>
  );
}

// GALLERY
function GalleryPage({ setPage }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <PageHeader title="Gallery" subtitle="Explore Chy Kernyk and the surrounding Roseland Peninsula." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-gallery-grid">
          {GALLERY_IMAGES.map(img => (
            <div key={img.id} className="ck-gallery-item" data-caption={img.caption}
              onClick={() => setLightbox(img)}>
              <img src={img.url} alt={img.caption} loading="lazy" />
            </div>
          ))}
        </div>
      </section>
      {lightbox && (
        <div className="ck-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-label="Image lightbox">
          <button className="ck-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">×</button>
          <img src={lightbox.url} alt={lightbox.caption} />
          <div className="ck-lightbox-caption">{lightbox.caption}</div>
        </div>
      )}
    </>
  );
}

// FOOD
function FoodPage({ setPage, setSubPage }) {
  return (
    <>
      <PageHeader title="Places to Eat" subtitle="From beach cafés to fine dining — the Roseland and beyond offer extraordinary food." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-grid">
          {FOOD_PLACES.map(place => (
            <div key={place.id} className="ck-card" onClick={() => { setSubPage({ type: "food-detail", id: place.id }); window.scrollTo(0, 0); }}>
              <div className="ck-card-img-wrap"><img className="ck-card-img" src={place.image} alt={place.name} loading="lazy" /></div>
              <div className="ck-card-body">
                <p className="ck-card-meta">{place.location}</p>
                <h3 className="ck-card-title">{place.name}</h3>
                <p className="ck-card-text">{place.desc}</p>
                <div className="ck-card-tags">
                  {place.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FoodDetail({ place, setPage, setSubPage }) {
  if (!place) return <div className="ck-section"><p>Place not found.</p></div>;
  return (
    <>
      <img src={place.image} alt={place.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage("food"); window.scrollTo(0, 0); }}>Food</button>
          <span> / {place.name}</span>
        </div>
        <h1 className="ck-detail-title">{place.name}</h1>
        <div className="ck-card-tags" style={{ marginBottom: "1.5rem" }}>
          {place.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
        </div>
        <div className="ck-detail-body"><p>{place.desc}</p></div>
        <div className="ck-detail-info">
          <h3>Location</h3>
          <p>{place.location}</p>
        </div>
      </div>
    </>
  );
}

// ACTIVITIES
function ActivitiesPage({ setPage, setSubPage }) {
  return (
    <>
      <PageHeader title="Things to Do" subtitle="Adventures, gardens, culture, and coastline — there's something for everyone." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-grid">
          {ACTIVITIES.map(a => (
            <div key={a.id} className="ck-card" onClick={() => { setSubPage({ type: "activity-detail", id: a.id }); window.scrollTo(0, 0); }}>
              <div className="ck-card-img-wrap"><img className="ck-card-img" src={a.image} alt={a.name} loading="lazy" /></div>
              <div className="ck-card-body">
                <h3 className="ck-card-title">{a.name}</h3>
                <p className="ck-card-text">{a.desc}</p>
                <div className="ck-card-tags">
                  {a.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ActivityDetail({ activity, setPage, setSubPage }) {
  if (!activity) return <div className="ck-section"><p>Activity not found.</p></div>;
  return (
    <>
      <img src={activity.image} alt={activity.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage("activities"); window.scrollTo(0, 0); }}>Activities</button>
          <span> / {activity.name}</span>
        </div>
        <h1 className="ck-detail-title">{activity.name}</h1>
        <div className="ck-card-tags" style={{ marginBottom: "1.5rem" }}>
          {activity.tags.map(t => <span key={t} className="ck-tag">{t}</span>)}
        </div>
        <div className="ck-detail-body"><p>{activity.desc}</p></div>
      </div>
    </>
  );
}

// WALKS
function WalksPage({ setPage, setSubPage }) {
  return (
    <>
      <PageHeader title="Local Walks" subtitle="The Roseland Peninsula offers some of the finest coastal and countryside walking in Cornwall." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-grid">
          {WALKS.map(w => (
            <div key={w.id} className="ck-card" onClick={() => { setSubPage({ type: "walk-detail", id: w.id }); window.scrollTo(0, 0); }}>
              <div className="ck-card-img-wrap"><img className="ck-card-img" src={w.image} alt={w.name} loading="lazy" /></div>
              <div className="ck-card-body">
                <h3 className="ck-card-title">{w.name}</h3>
                <p className="ck-card-text">{w.desc}</p>
                <div className="ck-card-tags">
                  <span className="ck-tag">{w.length}</span>
                  <span className="ck-tag">{w.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function WalkDetail({ walk, setPage, setSubPage }) {
  if (!walk) return <div className="ck-section"><p>Walk not found.</p></div>;
  return (
    <>
      <img src={walk.image} alt={walk.name} className="ck-detail-hero" />
      <div className="ck-detail-content">
        <div className="ck-breadcrumb" style={{ marginBottom: "1rem" }}>
          <button onClick={() => { setSubPage(null); setPage("walks"); window.scrollTo(0, 0); }}>Walks</button>
          <span> / {walk.name}</span>
        </div>
        <h1 className="ck-detail-title">{walk.name}</h1>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <span className="ck-detail-badge">{walk.length}</span>
          <span className="ck-detail-badge">{walk.difficulty}</span>
        </div>
        <div className="ck-detail-body"><p>{walk.desc}</p></div>

        {/* Embedded Map Placeholder */}
        <div className="ck-detail-info" style={{ marginTop: "2rem" }}>
          <h3>Trail Map</h3>
          <div style={{ width: "100%", height: 300, borderRadius: 8, overflow: "hidden", marginTop: "1rem", background: "var(--sand-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iframe
              title={`Map for ${walk.name}`}
              width="100%" height="300" style={{ border: 0, borderRadius: 8 }}
              src={`https://www.google.com/maps/embed/v1/place?key=PLACEHOLDER&q=Portscatho,Cornwall,UK`}
              allowFullScreen loading="lazy"
              onError={e => e.target.style.display = "none"}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <a href={`/gpx/${walk.id}.gpx`} className="ck-btn ck-btn-secondary ck-btn-sm" style={{ textDecoration: "none" }} download>
              ↓ Download GPX Route
            </a>
          </div>
        </div>

        <div className="ck-detail-info">
          <h3>Parking</h3>
          <p>{walk.parking}</p>
        </div>
        <div className="ck-detail-info">
          <h3>Where to Eat</h3>
          <p>{walk.eating}</p>
        </div>
      </div>
    </>
  );
}

// PARKRUN
function ParkrunPage({ setPage }) {
  return (
    <>
      <PageHeader title="parkrun" subtitle="Three wonderful parkruns within easy reach. Every Saturday at 9am, free, for everyone, forever." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem", maxWidth: 700 }}>
        {PARKRUNS.map(pr => (
          <div key={pr.name} className="ck-parkrun-card">
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className="ck-parkrun-link">{pr.name} parkrun ↗</a>
            <p style={{ fontSize: "0.92rem", color: "var(--text-light)", marginTop: "0.5rem", lineHeight: 1.7 }}>{pr.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}

// REMEDIES
function RemediesPage({ setPage }) {
  return (
    <>
      <PageHeader title="Useful Information" subtitle="Emergency contacts, maintenance details, and practical information for your stay." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem", maxWidth: 800 }}>
        {REMEDIES.map(cat => (
          <div key={cat.category} className="ck-remedy-section">
            <h2 className="ck-remedy-title">{cat.category}</h2>
            {cat.items.map(item => (
              <div key={item.name} className="ck-remedy-item">
                <span className="ck-remedy-icon">{item.icon}</span>
                <div>
                  <div className="ck-remedy-name">{item.name}</div>
                  <div className="ck-remedy-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

// CONTACT
function ContactPage({ setPage }) {
  return (
    <>
      <PageHeader title="Contact & Location" subtitle="Find us on the Roseland Peninsula, overlooking the beach at Portscatho." setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem" }}>
        <div className="ck-contact-grid">
          <div className="ck-map-container">
            <iframe
              title="Property location"
              width="100%" height="100%" style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2584.0!2d-4.9724!3d50.1817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDEwJzU0LjEiTiA0wrA1OCcyMC42Ilc!5e0!3m2!1sen!2suk!4v1"
              allowFullScreen loading="lazy"
            />
          </div>
          <div className="ck-contact-info">
            <div className="ck-contact-item">
              <h3>Address</h3>
              <p>Chy Kernyk<br />Portscatho<br />Truro, Cornwall<br />TR2 5DU</p>
            </div>
            <div className="ck-contact-item">
              <h3>What3Words</h3>
              <p><a href="https://w3w.co/latches.invisible.rope" target="_blank" rel="noopener noreferrer">///latches.invisible.rope</a></p>
            </div>
            <div className="ck-contact-item">
              <h3>Email</h3>
              <p><a href="mailto:contact@chykernyk.co.uk">contact@chykernyk.co.uk</a></p>
            </div>
            <div className="ck-contact-item">
              <h3>Getting Here</h3>
              <p>From the A390, take the A3078 towards St Mawes. Turn left at Trewithian towards Portscatho. The property is on the coastal road overlooking the beach.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// CALENDAR
function CalendarPage({ setPage, isAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState({
    "2026-04-10": "booked", "2026-04-11": "booked", "2026-04-12": "booked",
    "2026-04-13": "booked", "2026-04-14": "booked",
    "2026-04-25": "owner", "2026-04-26": "owner", "2026-04-27": "owner",
    "2026-07-01": "booked", "2026-07-02": "booked", "2026-07-03": "booked",
    "2026-07-04": "booked", "2026-07-05": "booked", "2026-07-06": "booked", "2026-07-07": "booked",
    "2026-08-15": "booked", "2026-08-16": "booked", "2026-08-17": "booked",
    "2026-08-18": "booked", "2026-08-19": "booked", "2026-08-20": "booked", "2026-08-21": "booked", "2026-08-22": "booked",
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const toggleDate = (dateStr) => {
    if (!isAdmin) return;
    const states = [undefined, "booked", "owner", "available"];
    const current = bookings[dateStr];
    const idx = states.indexOf(current);
    const next = states[(idx + 1) % states.length];
    if (next === undefined) {
      const newBookings = { ...bookings };
      delete newBookings[dateStr];
      setBookings(newBookings);
    } else {
      setBookings({ ...bookings, [dateStr]: next });
    }
  };

  const days = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <>
      <PageHeader title="Availability"
        subtitle={isAdmin ? "Click on dates to cycle through: clear → booked → owner → available." : "Check when Chy Kernyk is available for your visit."}
        setPage={setPage} />
      <section className="ck-section" style={{ paddingTop: "1rem", maxWidth: 700 }}>
        <div className="ck-cal">
          <div className="ck-cal-header">
            <button className="ck-cal-nav" onClick={prevMonth} aria-label="Previous month">←</button>
            <h2 className="ck-cal-month">
              {currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </h2>
            <button className="ck-cal-nav" onClick={nextMonth} aria-label="Next month">→</button>
          </div>
          <div className="ck-cal-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="ck-cal-day-label">{d}</div>
            ))}
            {days.map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="ck-cal-day empty" />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const status = bookings[dateStr] || "";
              const isToday = dateStr === todayStr;
              return (
                <div key={dateStr}
                  className={`ck-cal-day ${status} ${isToday ? "today" : ""}`}
                  onClick={() => toggleDate(dateStr)}
                  role={isAdmin ? "button" : undefined}
                  aria-label={`${d} ${currentMonth.toLocaleDateString("en-GB", { month: "long" })} ${status || "available"}`}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div className="ck-cal-legend">
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "white", border: "1px solid var(--sand-dark)" }} />
              Available
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#fde8e8" }} />
              Booked
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#e8f0fd" }} />
              Owner
            </div>
            <div className="ck-cal-legend-item">
              <div className="ck-cal-legend-dot" style={{ background: "#e8f5e8" }} />
              Confirmed Available
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Footer
function Footer() {
  return (
    <footer className="ck-footer">
      <div className="ck-footer-name">Chy Kernyk</div>
      <p>Portscatho · Roseland Peninsula · Cornwall · TR2 5DU</p>
      <p style={{ marginTop: "0.5rem" }}>contact@chykernyk.co.uk</p>
      <p style={{ marginTop: "1rem", fontSize: "0.75rem", opacity: 0.5 }}>© {new Date().getFullYear()} Chy Kernyk. All rights reserved.</p>
    </footer>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [siteUnlocked, setSiteUnlocked] = useState(false);
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState(BLOG_POSTS);

  const isAdmin = !!adminUser;

  // Reset subpage when main page changes
  useEffect(() => { setSubPage(null); }, [page]);

  // Render sub-pages (detail views)
  if (subPage) {
    let content = null;
    if (subPage.type === "blog-detail") {
      const post = posts.find(p => p.id === subPage.id);
      content = <BlogDetail post={post} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "food-detail") {
      const place = FOOD_PLACES.find(p => p.id === subPage.id);
      content = <FoodDetail place={place} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "activity-detail") {
      const activity = ACTIVITIES.find(a => a.id === subPage.id);
      content = <ActivityDetail activity={activity} setPage={setPage} setSubPage={setSubPage} />;
    } else if (subPage.type === "walk-detail") {
      const walk = WALKS.find(w => w.id === subPage.id);
      content = <WalkDetail walk={walk} setPage={setPage} setSubPage={setSubPage} />;
    }

    if (content) {
      return (
        <div className="ck-app">
          <style>{CSS}</style>
          <Nav page={page} setPage={p => { setSubPage(null); setPage(p); }} isAdmin={isAdmin}
            onLoginClick={() => setShowLogin(true)} onLogout={() => setAdminUser(null)}
            mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          {content}
          <Footer />
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setAdminUser} />}
        </div>
      );
    }
  }

  if (!siteUnlocked) {
    return (
      <div className="ck-app">
        <style>{CSS}</style>
        <SiteGate onUnlock={() => setSiteUnlocked(true)} />
      </div>
    );
  }

  const pageMap = {
    home: <HomePage setPage={setPage} />,
    blog: <BlogPage setPage={setPage} posts={posts} setPosts={setPosts} isAdmin={isAdmin} setSubPage={setSubPage} />,
    gallery: <GalleryPage setPage={setPage} />,
    food: <FoodPage setPage={setPage} setSubPage={setSubPage} />,
    activities: <ActivitiesPage setPage={setPage} setSubPage={setSubPage} />,
    walks: <WalksPage setPage={setPage} setSubPage={setSubPage} />,
    parkrun: <ParkrunPage setPage={setPage} />,
    calendar: <CalendarPage setPage={setPage} isAdmin={isAdmin} />,
    remedies: <RemediesPage setPage={setPage} />,
    contact: <ContactPage setPage={setPage} />,
  };

  return (
    <div className="ck-app">
      <style>{CSS}</style>
      <Nav page={page} setPage={setPage} isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)} onLogout={() => setAdminUser(null)}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {pageMap[page] || <HomePage setPage={setPage} />}
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={setAdminUser} />}
    </div>
  );
}

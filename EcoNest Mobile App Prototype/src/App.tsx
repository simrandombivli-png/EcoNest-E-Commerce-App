import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Screen =
  | "home" | "shop" | "cart" | "wishlist" | "profile" | "product"
  | "checkout" | "confirmation" | "orders" | "tracking" | "contact"
  | "auth" | "edit" | "compare";
type Product = {
  id: number; name: string; category: string; price: number; oldPrice?: number;
  rating: number; eco: number; image: string; description: string;
  certs: string[]; features: string[]; specs: [string, string][];
};
type Cart = Record<number, number>;
type Order = {
  id: string; date: string; items: { product: Product; quantity: number }[];
  subtotal: number; discount: number; shipping: number; gst: number; total: number;
  payment: string; status: string; delivery: string; co2: number; plastic: number;
};

const categories = ["Bamboo Products", "Reusable Kitchen", "Recycled Fashion", "Solar & Energy", "Home & Garden", "Zero-Waste Personal Care"];
const imgs = [
  "https://images.unsplash.com/photo-1553691158-91a7f9183156?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1698553497889-704f27f3d170?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1633878353628-5fc8b983325c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556037867-bc64ed32b2af?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1661347365618-630c0c20e5f8?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1566707675793-3ec9e5590bb6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=85",
];

const base = {
  certs: ["Plastic-Free", "Carbon Neutral"],
  features: ["Thoughtfully sourced materials", "Made to last", "Low-waste packaging", "Supports ethical makers"],
  specs: [["Origin", "Made in India"], ["Packaging", "100% plastic-free"], ["Care", "Wipe clean and air dry"], ["Warranty", "6 months"]],
};
const products: Product[] = [
  { id: 1, name: "Bamboo Toothbrush Set", category: categories[0], price: 199, oldPrice: 249, rating: 4.8, eco: 5, image: imgs[0], description: "A set of four naturally antibacterial bamboo toothbrushes with soft, charcoal-infused bristles.", ...base, certs: ["FSC", "Plastic-Free", "Cruelty-Free"] },
  { id: 2, name: "Steel Water Bottle", category: categories[1], price: 649, oldPrice: 799, rating: 4.7, eco: 5, image: imgs[1], description: "Double-wall insulated stainless steel that keeps drinks cold for 24 hours.", ...base, certs: ["Recycled Content", "Plastic-Free"] },
  { id: 3, name: "Recycled Cotton Tote", category: categories[2], price: 299, oldPrice: 399, rating: 4.6, eco: 4, image: imgs[2], description: "A roomy everyday tote woven from post-consumer cotton with reinforced handles.", ...base, certs: ["Recycled Content", "Organic"] },
  { id: 4, name: "Compostable Phone Case", category: categories[2], price: 499, oldPrice: 699, rating: 4.5, eco: 4, image: imgs[3], description: "Flexible shock protection made from wheat straw and compostable biopolymers.", ...base, certs: ["Plastic-Free", "Carbon Neutral"] },
  { id: 5, name: "Solar Garden Lights", category: categories[3], price: 899, rating: 4.7, eco: 5, image: imgs[4], description: "Warm, weatherproof garden lights powered entirely by the sun.", ...base, certs: ["Carbon Neutral", "Recycled Content"] },
  { id: 6, name: "Beeswax Food Wraps", category: categories[1], price: 349, rating: 4.6, eco: 5, image: imgs[5], description: "Three reusable cotton wraps coated in local beeswax to keep food fresh.", ...base, certs: ["Organic", "Plastic-Free"] },
  { id: 7, name: "Bamboo Cutlery Kit", category: categories[0], price: 279, oldPrice: 329, rating: 4.4, eco: 5, image: imgs[6], description: "A travel-ready fork, spoon, knife, straw and cleaning brush in a cotton pouch.", ...base, certs: ["FSC", "Plastic-Free"] },
  { id: 8, name: "Recycled Everyday Sweatshirt", category: categories[2], price: 1199, oldPrice: 1499, rating: 4.8, eco: 4, image: imgs[7], description: "A soft, relaxed sweatshirt made with recovered cotton fibres and low-impact dyes.", ...base, certs: ["Recycled Content", "Organic"] },
  { id: 9, name: "Foldable Solar Charger", category: categories[3], price: 1499, oldPrice: 1799, rating: 4.6, eco: 5, image: imgs[8], description: "A lightweight 15W solar panel for clean charging on the move.", ...base, certs: ["Carbon Neutral", "Recycled Content"] },
  { id: 10, name: "Self-Watering Herb Planter", category: categories[4], price: 749, rating: 4.5, eco: 4, image: imgs[9], description: "A recycled-fibre planter that keeps kitchen herbs watered for up to a week.", ...base, certs: ["Recycled Content", "Carbon Neutral"] },
  { id: 11, name: "Kitchen Compost Caddy", category: categories[4], price: 999, oldPrice: 1199, rating: 4.7, eco: 5, image: imgs[10], description: "A compact odour-filtering caddy that makes everyday composting effortless.", ...base, certs: ["Recycled Content", "Plastic-Free"] },
  { id: 12, name: "Neem & Aloe Shampoo Bar", category: categories[5], price: 249, oldPrice: 299, rating: 4.8, eco: 5, image: imgs[11], description: "A gentle, sulphate-free shampoo bar with neem, aloe and cold-pressed oils.", ...base, certs: ["Cruelty-Free", "Organic", "Plastic-Free"] },
];

const Icon = ({ name, size = 22 }: { name: string; size?: number }) => {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    shop: <><path d="M4 9h16l-1 12H5L4 9Z"/><path d="M8 9a4 4 0 0 1 8 0"/></>,
    cart: <><path d="M3 4h2l2 11h10l3-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    moon: <path d="M20 15a8 8 0 1 1-11-11 7 7 0 0 0 11 11Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    leaf: <path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16ZM5 20c2-5 6-8 11-11"/>,
    star: <path d="m12 2 3 6 7 .8-5 4.8 1.5 7-6.5-3.5-6.5 3.5 1.5-7-5-4.8L9 8l3-6Z"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    bag: <><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.2.9-1.2 1.8M12 17h.01"/></>,
  };
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};
const Button = ({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) =>
  <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
const Field = ({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) =>
  <label className="field"><span>{label}</span><input {...props}/>{error && <small>{error}</small>}</label>;
const TextArea = ({ label, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) =>
  <label className="field"><span>{label}</span><textarea {...props}/>{error && <small>{error}</small>}</label>;
const Badge = ({ children }: { children: ReactNode }) => <span className="badge">{children}</span>;

function ProductCard({ product, onOpen, onAdd, wished, onWish, compact = false }: { product: Product; onOpen: () => void; onAdd: () => void; wished: boolean; onWish: () => void; compact?: boolean }) {
  return <article className={`product-card ${compact ? "compact" : ""}`}>
    <div className="product-image-wrap" onClick={onOpen}>
      <img src={product.image} alt={product.name}/>
      {product.oldPrice && <Badge>-{Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>}
      <Button variant="icon" className={wished ? "wished" : ""} aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${wished ? "from" : "to"} wishlist`} onClick={(e) => { e.stopPropagation(); onWish(); }}><Icon name="heart" size={18}/></Button>
    </div>
    <div className="product-copy" onClick={onOpen}>
      <span className="eyebrow">{product.category}</span>
      <h3>{product.name}</h3>
      <div className="rating"><Icon name="star" size={13}/> {product.rating} <span>·</span> <span className="leaves">{Array.from({ length: product.eco }).map((_, i) => <Icon name="leaf" size={12} key={i}/>)}</span></div>
      <div className="price">₹{product.price.toLocaleString("en-IN")} {product.oldPrice && <del>₹{product.oldPrice}</del>}</div>
    </div>
    {!compact && <Button variant="soft" className="card-add" onClick={onAdd}><Icon name="plus" size={17}/> Add</Button>}
  </article>;
}

function BottomSheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="overlay" onMouseDown={onClose}><section className="sheet" onMouseDown={(e) => e.stopPropagation()}><div className="grabber"/><div className="sheet-head"><h2>{title}</h2><Button variant="icon" onClick={onClose} aria-label="Close"><Icon name="close"/></Button></div>{children}</section></div>;
}

function App() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("econest-onboarded") === "yes");
  const [slide, setSlide] = useState(0);
  const [screen, setScreen] = useState<Screen>("home");
  const [history, setHistory] = useState<Screen[]>([]);
  const [selected, setSelected] = useState(products[0]);
  const [cart, setCart] = useState<Cart>(() => JSON.parse(localStorage.getItem("econest-cart") || "{}"));
  const [wishlist, setWishlist] = useState<number[]>(() => JSON.parse(localStorage.getItem("econest-wishlist") || "[]"));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem("econest-orders") || "[]"));
  const [theme, setTheme] = useState(() => localStorage.getItem("econest-theme") || "light");
  const [wire, setWire] = useState(() => localStorage.getItem("econest-wire") === "yes");
  const [toast, setToast] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<Order | null>(null);
  const [recent, setRecent] = useState<number[]>([]);
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("econest-profile") || '{"name":"Ananya Sharma","email":"ananya@example.com"}'));

  useEffect(() => localStorage.setItem("econest-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("econest-wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("econest-orders", JSON.stringify(orders)), [orders]);
  useEffect(() => { localStorage.setItem("econest-theme", theme); }, [theme]);
  useEffect(() => localStorage.setItem("econest-wire", wire ? "yes" : "no"), [wire]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);

  const go = (next: Screen) => { setHistory((h) => [...h, screen]); setScreen(next); window.scrollTo(0, 0); };
  const back = () => { const h = [...history]; setScreen(h.pop() || "home"); setHistory(h); window.scrollTo(0, 0); };
  const openProduct = (p: Product) => { setSelected(p); setRecent((r) => [p.id, ...r.filter((id) => id !== p.id)].slice(0, 6)); go("product"); };
  const add = (id: number, qty = 1) => { setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty })); setToast("Added to cart"); };
  const toggleWish = (id: number) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const completeOnboarding = () => { localStorage.setItem("econest-onboarded", "yes"); setOnboarded(true); };

  if (!onboarded) return <div className="desktop-shell"><main className="phone onboarding">
    <Button variant="ghost" className="skip" onClick={completeOnboarding}>Skip</Button>
    <div className={`onboard-visual visual-${slide}`}>
      <div className="orbit one"/><div className="orbit two"/>
      {slide === 0 ? <><Icon name="leaf" size={96}/><span className="float-card">82K <small>plastic items avoided</small></span></> : <><Icon name="bag" size={96}/><span className="float-card">42 <small>ethical Indian makers</small></span></>}
    </div>
    <div className="onboard-copy">
      <span className="brand-mark"><i>e</i> EcoNest</span>
      <h1>{slide === 0 ? "Live lighter. Leave more green." : "Better products, brighter future."}</h1>
      <p>{slide === 0 ? "Small swaps. Big planet impact. Discover everyday essentials that are kinder to you and the Earth." : "Shop thoughtfully sourced products from makers who put people and the planet first."}</p>
      <div className="dots"><i className={slide === 0 ? "active" : ""}/><i className={slide === 1 ? "active" : ""}/></div>
      <Button onClick={() => slide === 0 ? setSlide(1) : completeOnboarding()}>{slide === 0 ? "Next" : "Get started"} <span>→</span></Button>
    </div>
  </main></div>;

  const tabScreens: Screen[] = ["home", "shop", "cart", "wishlist", "profile"];
  const showTabs = tabScreens.includes(screen);
  const renderScreen = () => {
    const common = { openProduct, add, wishlist, toggleWish };
    switch (screen) {
      case "home": return <Home {...common} go={go} theme={theme} setTheme={setTheme} recent={recent}/>;
      case "shop": return <Shop {...common}/>;
      case "product": return <ProductDetail product={selected} {...common} go={go} back={back}/>;
      case "cart": return <CartScreen cart={cart} setCart={setCart} go={go} askRemove={setConfirmRemove}/>;
      case "wishlist": return <Wishlist ids={wishlist} {...common}/>;
      case "checkout": return <Checkout cart={cart} go={go} back={back} onOrder={(order) => { setOrders((o) => [order, ...o]); setLastOrder(order); setCart({}); setScreen("confirmation"); }}/>;
      case "confirmation": return <Confirmation order={lastOrder} go={go} onTrack={(o) => { setTracking(o); go("tracking"); }}/>;
      case "orders": return <Orders orders={orders} back={back} buyAgain={(o) => { const next = { ...cart }; o.items.forEach((i) => next[i.product.id] = (next[i.product.id] || 0) + i.quantity); setCart(next); setToast("Order added to cart"); }} track={(o) => { setTracking(o); go("tracking"); }}/>;
      case "tracking": return <Tracking order={tracking} back={back}/>;
      case "profile": return <Profile profile={profile} go={go} theme={theme} setTheme={setTheme} wire={wire} setWire={setWire} orders={orders}/>;
      case "contact": return <Contact back={back}/>;
      case "auth": return <Auth back={back}/>;
      case "edit": return <EditProfile profile={profile} back={back} save={(p) => { setProfile(p); localStorage.setItem("econest-profile", JSON.stringify(p)); setToast("Profile updated"); back(); }}/>;
      case "compare": return <Compare back={back}/>;
    }
  };

  return <div className={`desktop-shell theme-${theme} ${wire ? "wireframe" : ""}`}><main className="phone">
    <div className={`app-content ${showTabs ? "has-tabs" : ""}`}>{renderScreen()}</div>
    {showTabs && <TabBar active={screen} go={(s) => { setHistory([]); setScreen(s); window.scrollTo(0, 0); }} cartCount={cartCount} wishCount={wishlist.length}/>}
    {toast && <div className="toast"><Icon name="check" size={18}/>{toast}</div>}
    {confirmRemove !== null && <div className="overlay dialog-wrap"><section className="dialog"><div className="danger-icon"><Icon name="bag"/></div><h2>Remove this item?</h2><p>You can always add it again later.</p><div><Button variant="secondary" onClick={() => setConfirmRemove(null)}>Cancel</Button><Button variant="danger" onClick={() => { setCart((c) => { const n = { ...c }; delete n[confirmRemove]; return n; }); setConfirmRemove(null); setToast("Item removed"); }}>Remove</Button></div></section></div>}
  </main></div>;
}

function TabBar({ active, go, cartCount, wishCount }: { active: Screen; go: (s: Screen) => void; cartCount: number; wishCount: number }) {
  const tabs: [Screen, string, string][] = [["home", "home", "Home"], ["shop", "shop", "Shop"], ["cart", "cart", "Cart"], ["wishlist", "heart", "Wishlist"], ["profile", "user", "Profile"]];
  return <nav className="tabbar" aria-label="Main navigation">{tabs.map(([s, icon, label]) => <Button key={s} variant="tab" className={active === s ? "active" : ""} onClick={() => go(s)}><span className="tab-icon"><Icon name={icon}/>{s === "cart" && cartCount > 0 && <b>{cartCount}</b>}{s === "wishlist" && wishCount > 0 && <b>{wishCount}</b>}</span><small>{label}</small></Button>)}</nav>;
}
const Header = ({ title, back, action }: { title: string; back: () => void; action?: ReactNode }) => <header className="inner-header"><Button variant="icon" onClick={back} aria-label="Back"><Icon name="back"/></Button><h1>{title}</h1><div className="header-action">{action}</div></header>;

function Home({ go, openProduct, add, wishlist, toggleWish, theme, setTheme, recent }: any) {
  const [email, setEmail] = useState("");
  const [review, setReview] = useState(0);
  const reviews = [
    ["Ananya S.", "Mumbai", "EcoNest makes sustainable shopping feel joyful, not complicated. The quality is genuinely lovely."],
    ["Rahul M.", "Bengaluru", "Fast delivery, almost no plastic, and products I use every day. The impact tracker is a great touch."],
    ["Meera K.", "Pune", "My family started with one small swap. Now half our kitchen is lower waste."],
  ];
  return <>
    <div className="announcement">Free shipping over ₹999 <span>Shop now →</span></div>
    <header className="home-header"><div className="logo"><i>e</i><span>EcoNest<small>small swaps, big impact</small></span></div><div><Button variant="icon" aria-label="Search" onClick={() => go("shop")}><Icon name="search"/></Button><Button variant="icon" aria-label="Toggle dark mode" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Icon name={theme === "dark" ? "sun" : "moon"}/></Button></div></header>
    <div className="home-pad">
      <button className="search-prompt" onClick={() => go("shop")}><Icon name="search"/><span>Search sustainable essentials</span><kbd>⌘ K</kbd></button>
      <section className="hero">
        <div className="hero-copy"><Badge>Earth-friendly everyday</Badge><h1>Live lighter.<br/><em>Leave more green.</em></h1><p>Better choices for your home, your life, and our shared planet.</p><div><Button onClick={() => go("shop")}>Shop planet-friendly</Button><Button variant="text">Our story →</Button></div></div>
        <div className="hero-art"><span className="sun-disc"/><span className="hill one"/><span className="hill two"/><span className="tree t1">♧</span><span className="tree t2">♧</span><span className="impact-pill"><Icon name="leaf" size={16}/> 100% mindful</span></div>
      </section>
      <SectionHead title="Shop by collection" action="View all" onAction={() => go("shop")}/>
      <div className="collection-scroll">{categories.map((c, i) => <button key={c} className="collection-card" onClick={() => go("shop")}><span>{["B", "K", "F", "S", "H", "Z"][i]}</span><b>{c}</b><small>{products.filter((p) => p.category === c).length} products</small></button>)}</div>
      <SectionHead title="Community favourites" action="Shop all" onAction={() => go("shop")}/>
      <div className="product-scroll">{products.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} onOpen={() => openProduct(p)} onAdd={() => add(p.id)} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)}/>)}</div>
      {recent.length > 0 && <><SectionHead title="Recently viewed"/><div className="product-scroll mini">{recent.map((id: number) => products.find((p) => p.id === id)).filter(Boolean).map((p: any) => <ProductCard compact key={p.id} product={p} onOpen={() => openProduct(p)} onAdd={() => add(p.id)} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)}/>)}</div></>}
      <section className="impact"><span className="eyebrow">WHY ECONEST</span><h2>Small swaps, measurable change.</h2><p>Every order helps move us towards a cleaner, fairer future.</p><div className="stats"><div><b>82K</b><span>Plastic items<br/>avoided</span></div><div><b>18.4t</b><span>CO₂<br/>saved</span></div><div><b>94%</b><span>Plastic-free<br/>packaging</span></div><div><b>42</b><span>Ethical<br/>makers</span></div></div></section>
      <SectionHead title="Loved by conscious homes"/>
      <section className="review-card"><div className="quote">“</div><div className="stars">★★★★★</div><p>{reviews[review][2]}</p><div className="reviewer"><span>{reviews[review][0][0]}</span><div><b>{reviews[review][0]}</b><small>{reviews[review][1]}</small></div><div className="review-arrows"><Button variant="icon" onClick={() => setReview((review + 2) % 3)} aria-label="Previous">←</Button><Button variant="icon" onClick={() => setReview((review + 1) % 3)} aria-label="Next">→</Button></div></div></section>
      <section className="newsletter"><Icon name="leaf" size={32}/><h2>Good news for the planet</h2><p>New arrivals, simple eco tips, and 10% off your first order.</p><form onSubmit={(e) => { e.preventDefault(); setEmail(""); }}><input aria-label="Email address" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"/><Button>Join us</Button></form><small>No spam. Just greener living.</small></section>
      <footer><div className="logo"><i>e</i><span>EcoNest</span></div><p>Small swaps. Big planet impact.</p><div><button onClick={() => go("contact")}>Help & contact</button><button onClick={() => go("orders")}>Orders</button><button>Our standards</button></div><small>© 2025 EcoNest India</small></footer>
    </div>
  </>;
}
function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) { return <div className="section-head"><h2>{title}</h2>{action && <Button variant="text" onClick={onAction}>{action} →</Button>}</div>; }

function Shop({ openProduct, add, wishlist, toggleWish }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [max, setMax] = useState(2000);
  const [eco, setEco] = useState(0);
  const [stock, setStock] = useState(false);
  const [sort, setSort] = useState("Featured");
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const results = useMemo(() => products.filter((p) => (!search || `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())) && (category === "All" || p.category === category) && p.price <= max && p.eco >= eco).sort((a, b) => sort === "Price: low to high" ? a.price - b.price : sort === "Price: high to low" ? b.price - a.price : sort === "Rating" ? b.rating - a.rating : sort === "Eco-score" ? b.eco - a.eco : b.id - a.id), [search, category, max, eco, sort]);
  return <><header className="shop-top"><div><span className="eyebrow">EXPLORE</span><h1>Shop thoughtfully</h1></div><Button variant="icon"><Icon name="bag"/></Button></header>
    <div className="shop-pad"><label className="search-box"><Icon name="search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search all products"/></label>
      <div className="chip-scroll"><button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>All</button>{categories.map((c) => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <div className="result-row"><span><b>{results.length}</b> earth-friendly finds</span><div><Button variant="filter" onClick={() => setSheet("filter")}><Icon name="filter" size={17}/> Filter</Button><Button variant="filter" onClick={() => setSheet("sort")}>Sort <span>↕</span></Button></div></div>
      <div className="product-grid">{results.map((p) => <ProductCard key={p.id} product={p} onOpen={() => openProduct(p)} onAdd={() => add(p.id)} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)}/>)}</div>
      {!results.length && <div className="empty"><Icon name="search" size={44}/><h2>No greener finds yet</h2><p>Try another search or clear your filters.</p><Button onClick={() => { setSearch(""); setCategory("All"); setMax(2000); setEco(0); }}>Clear filters</Button></div>}
    </div>
    {sheet === "filter" && <BottomSheet title="Filter products" onClose={() => setSheet(null)}><div className="sheet-body"><label className="field"><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></label><label className="field"><span>Price up to <b>₹{max}</b></span><input type="range" min="200" max="2000" step="50" value={max} onChange={(e) => setMax(+e.target.value)}/></label><div className="field"><span>Minimum eco-rating</span><div className="eco-select">{[0,3,4,5].map((n) => <button className={eco === n ? "active" : ""} onClick={() => setEco(n)} key={n}>{n === 0 ? "Any" : `${n} leaves`}</button>)}</div></div><div className="cert-list"><span>Certifications</span><label><input type="checkbox"/> FSC certified</label><label><input type="checkbox"/> Plastic-free</label><label><input type="checkbox"/> Organic</label></div><label className="switch-row"><span><b>In-stock only</b><small>Ready to ship within 24 hours</small></span><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)}/></label><Button className="wide" onClick={() => setSheet(null)}>Show {results.length} products</Button></div></BottomSheet>}
    {sheet === "sort" && <BottomSheet title="Sort by" onClose={() => setSheet(null)}><div className="sort-list">{["Featured","Price: low to high","Price: high to low","Rating","Eco-score","Newest"].map((s) => <button key={s} onClick={() => { setSort(s); setSheet(null); }}><span>{s}</span>{sort === s && <Icon name="check"/>}</button>)}</div></BottomSheet>}
  </>;
}

function ProductDetail({ product, add, wishlist, toggleWish, openProduct, go, back }: any) {
  const [qty, setQty] = useState(1);
  const [gallery, setGallery] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const galleryImgs = [product.image, product.image, product.image];
  return <div className="detail"><div className="gallery"><div className="gallery-actions"><Button variant="glass" onClick={back} aria-label="Back"><Icon name="back"/></Button><Button variant="glass" className={wishlist.includes(product.id) ? "wished" : ""} onClick={() => toggleWish(product.id)}><Icon name="heart"/></Button></div><img src={galleryImgs[gallery]} alt={product.name}/><button className="gallery-left" aria-label="Previous image" onClick={() => setGallery((gallery + 2) % 3)}>‹</button><button className="gallery-right" aria-label="Next image" onClick={() => setGallery((gallery + 1) % 3)}>›</button><div className="gallery-dots">{galleryImgs.map((_: string, i: number) => <i key={i} className={gallery === i ? "active" : ""}/>)}</div></div>
    <div className="detail-pad"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><div className="detail-rating"><span>★ {product.rating}</span><u>128 reviews</u><span className="eco-pill">{product.eco}/5 <Icon name="leaf" size={14}/></span></div><div className="detail-price">₹{product.price.toLocaleString("en-IN")} {product.oldPrice && <><del>₹{product.oldPrice}</del><Badge>Save ₹{product.oldPrice - product.price}</Badge></>}</div><p className="tax">Inclusive of all taxes</p>
      <div className="certs">{product.certs.map((c: string) => <Badge key={c}><Icon name="check" size={12}/>{c}</Badge>)}</div>
      <section className="detail-section"><h2>Why you'll love it</h2><p>{product.description}</p><div className="features">{product.features.map((f: string) => <div key={f}><Icon name="leaf"/><span>{f}</span></div>)}</div></section>
      <section className="impact-card"><span><Icon name="leaf" size={28}/></span><div><small>ENVIRONMENTAL IMPACT</small><h3>A lighter footprint, built in</h3><p>Choosing this over a conventional alternative saves around <b>1.8 kg CO₂</b> and keeps <b>6 plastic items</b> out of landfill.</p></div></section>
      <section className="detail-section"><h2>Product specifications</h2><div className="specs">{product.specs.map(([a,b]: [string,string]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}</div></section>
      <section className="detail-section reviews"><div className="section-head"><h2>Reviews</h2><Button variant="text" onClick={() => setReviewOpen(!reviewOpen)}>Write a review</Button></div>{reviewOpen && <form onSubmit={(e) => { e.preventDefault(); setReviewText(""); setReviewOpen(false); }}><div className="stars">★★★★★</div><TextArea label="Your review" required minLength={10} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="What did you think?"/><Button>Submit review</Button></form>}<article><div><b>AS</b><span><strong>Ananya S.</strong><small>Verified buyer · 2 weeks ago</small></span><em>★★★★★</em></div><p>Beautiful quality and thoughtful packaging. It already feels like a staple in our home.</p></article></section>
      <SectionHead title="Pairs well with"/><div className="product-scroll">{products.filter((p) => p.id !== product.id).slice(0,3).map((p) => <ProductCard key={p.id} compact product={p} onOpen={() => openProduct(p)} onAdd={() => add(p.id)} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)}/>)}</div>
    </div>
    <div className="sticky-buy"><div className="quantity"><Button variant="icon" disabled={qty === 1} onClick={() => setQty(qty - 1)}><Icon name="minus" size={17}/></Button><b>{qty}</b><Button variant="icon" onClick={() => setQty(qty + 1)}><Icon name="plus" size={17}/></Button></div><Button variant="secondary" onClick={() => add(product.id, qty)}>Add to cart</Button><Button onClick={() => { add(product.id, qty); go("cart"); }}>Buy now</Button></div>
  </div>;
}

function CartScreen({ cart, setCart, go, askRemove }: { cart: Cart; setCart: (c: Cart) => void; go: (s: Screen) => void; askRemove: (id: number) => void }) {
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState("");
  const [msg, setMsg] = useState("");
  const items = products.filter((p) => cart[p.id]).map((p) => ({ product: p, quantity: cart[p.id] }));
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = applied === "ECO10" ? subtotal * .1 : applied === "GREEN20" ? subtotal * .2 : 0;
  const shipping = subtotal >= 999 ? 0 : 49;
  const gst = (subtotal - discount + shipping) * .18;
  const apply = () => { const c = coupon.trim().toUpperCase(); if (c === "ECO10") { setApplied(c); setMsg("10% off applied"); } else if (c === "GREEN20" && subtotal > 1500) { setApplied(c); setMsg("20% off applied"); } else { setApplied(""); setMsg(c === "GREEN20" ? "GREEN20 requires a subtotal above ₹1,500" : "That coupon code isn't valid"); } };
  if (!items.length) return <><header className="simple-title"><h1>Your cart</h1><span>0 items</span></header><div className="empty cart-empty"><span><Icon name="bag" size={56}/></span><h2>Your cart feels a little light</h2><p>Fill it with thoughtful finds for a greener everyday.</p><Button onClick={() => go("shop")}>Explore products</Button></div></>;
  return <><header className="simple-title"><h1>Your cart</h1><span>{items.length} {items.length === 1 ? "item" : "items"}</span></header><div className="cart-pad">
    <section className="shipping-progress"><div><b>{subtotal >= 999 ? "You've unlocked free shipping!" : `Add ₹${999 - subtotal} more for free shipping`}</b><Icon name={subtotal >= 999 ? "check" : "cart"} size={18}/></div><progress value={Math.min(subtotal, 999)} max="999"/></section>
    <div className="cart-list">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}><img src={product.image} alt={product.name}/><div><span className="eyebrow">{product.category}</span><h3>{product.name}</h3><div className="price">₹{product.price}</div><div className="quantity"><Button variant="icon" onClick={() => quantity === 1 ? askRemove(product.id) : setCart({ ...cart, [product.id]: quantity - 1 })}><Icon name="minus" size={15}/></Button><b>{quantity}</b><Button variant="icon" onClick={() => setCart({ ...cart, [product.id]: quantity + 1 })}><Icon name="plus" size={15}/></Button></div></div><Button variant="icon" className="remove" onClick={() => askRemove(product.id)} aria-label={`Remove ${product.name}`}><Icon name="close" size={17}/></Button></article>)}</div>
    <section className="coupon"><h3>Have a coupon?</h3><div><input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter code"/><Button variant="secondary" onClick={apply}>Apply</Button></div>{msg && <small className={applied ? "success" : "error"}>{applied && <Icon name="check" size={14}/>} {msg}</small>}<p>Try <button onClick={() => setCoupon("ECO10")}>ECO10</button> or <button onClick={() => setCoupon("GREEN20")}>GREEN20</button></p></section>
    <Bill subtotal={subtotal} discount={discount} shipping={shipping} gst={gst}/>
  </div><div className="checkout-stick"><div><small>Total incl. GST</small><b>₹{(subtotal - discount + shipping + gst).toFixed(0)}</b></div><Button onClick={() => go("checkout")}>Checkout <span>→</span></Button></div></>;
}
function Bill({ subtotal, discount, shipping, gst }: { subtotal: number; discount: number; shipping: number; gst: number }) { const total = subtotal - discount + shipping + gst; return <section className="bill"><h2>Order summary</h2><div><span>Subtotal</span><b>₹{subtotal.toFixed(0)}</b></div><div className="green"><span>Discount</span><b>-₹{discount.toFixed(0)}</b></div><div><span>Shipping</span><b>{shipping ? `₹${shipping}` : "FREE"}</b></div><div><span>GST (18%)</span><b>₹{gst.toFixed(0)}</b></div><div className="bill-total"><span>Grand total</span><b>₹{total.toFixed(0)}</b></div></section>; }

function Wishlist({ ids, openProduct, add, wishlist, toggleWish }: any) {
  const list = products.filter((p) => ids.includes(p.id));
  return <><header className="simple-title"><div><span className="eyebrow">SAVED WITH CARE</span><h1>Your wishlist</h1></div><span>{list.length} items</span></header><div className="shop-pad">{list.length ? <div className="product-grid">{list.map((p) => <ProductCard key={p.id} product={p} onOpen={() => openProduct(p)} onAdd={() => { add(p.id); toggleWish(p.id); }} wished={wishlist.includes(p.id)} onWish={() => toggleWish(p.id)}/>)}</div> : <div className="empty"><Icon name="heart" size={52}/><h2>Save what you love</h2><p>Tap the heart on any product to keep it close.</p></div>}</div></>;
}

function Checkout({ cart, onOrder, back }: { cart: Cart; go: (s: Screen) => void; back: () => void; onOrder: (o: Order) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", pin: "", address: "" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [delivery, setDelivery] = useState("Standard");
  const [neutral, setNeutral] = useState(true);
  const [round, setRound] = useState(false);
  const [payment, setPayment] = useState("UPI");
  const [pay, setPay] = useState({ upi: "", card: "", cardName: "", expiry: "", cvv: "" });
  const items = products.filter((p) => cart[p.id]).map((p) => ({ product: p, quantity: cart[p.id] }));
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipBase = delivery === "Standard" ? 49 : delivery === "Express" ? 99 : 149;
  const shipping = (subtotal >= 999 && delivery === "Standard" ? 0 : shipBase) + (neutral ? 20 : 0);
  const gst = (subtotal + shipping) * .18;
  const total = subtotal + shipping + gst + (round ? Math.ceil(subtotal + shipping + gst) - (subtotal + shipping + gst) : 0);
  const validateShipping = () => { const e: Record<string,string> = {}; if (!form.name.trim()) e.name = "Full name is required"; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email"; if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number"; if (!/^\d{6}$/.test(form.pin)) e.pin = "Enter a 6-digit PIN"; if (!form.address.trim()) e.address = "Address is required"; setErrors(e); return !Object.keys(e).length; };
  const payValid = payment === "UPI" ? /^[\w.-]+@[\w.-]+$/.test(pay.upi) : payment === "Card" ? /^\d{4} \d{4} \d{4} \d{4}$/.test(pay.card) && !!pay.cardName && /^(0[1-9]|1[0-2])\/\d{2}$/.test(pay.expiry) && /^\d{3,4}$/.test(pay.cvv) : true;
  const place = () => { const d = new Date(); d.setDate(d.getDate() + (delivery === "Same-day" ? 0 : delivery === "Express" ? 2 : 5)); onOrder({ id: `EN${Date.now().toString().slice(-8)}`, date: new Date().toISOString(), items, subtotal, discount: 0, shipping, gst, total, payment, status: "Placed", delivery: d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), co2: +(items.length * 1.8).toFixed(1), plastic: items.reduce((a, b) => a + b.quantity * 6, 0) }); };
  return <><Header title="Secure checkout" back={() => step ? setStep(step - 1) : back()}/><div className="steps">{["Shipping","Delivery","Payment","Review"].map((s, i) => <div className={i <= step ? "active" : ""} key={s}><span>{i < step ? <Icon name="check" size={13}/> : i + 1}</span><small>{s}</small></div>)}</div><div className="checkout-page">
    {step === 0 && <section><span className="eyebrow">STEP 1 OF 4</span><h2>Where should we send it?</h2><p>We'll use this for delivery updates too.</p><Field label="Full name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="e.g. Ananya Sharma" error={errors.name}/><Field label="Email address" type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} placeholder="you@example.com" error={errors.email}/><Field label="Phone number" inputMode="numeric" value={form.phone} maxLength={10} onChange={(e) => setForm({...form,phone:e.target.value.replace(/\D/g,"")})} placeholder="10-digit mobile number" error={errors.phone}/><TextArea label="Full address" value={form.address} onChange={(e) => setForm({...form,address:e.target.value})} placeholder="House, street, area and landmark" error={errors.address}/><Field label="PIN code" inputMode="numeric" maxLength={6} value={form.pin} onChange={(e) => setForm({...form,pin:e.target.value.replace(/\D/g,"")})} placeholder="6-digit PIN" error={errors.pin}/><Button className="wide thumb-action" onClick={() => validateShipping() && setStep(1)}>Continue to delivery</Button></section>}
    {step === 1 && <section><span className="eyebrow">STEP 2 OF 4</span><h2>Choose your pace</h2><p>All orders are packed without single-use plastic.</p><div className="choice-list">{[["Standard","3–5 business days","₹49"],["Express","1–2 business days","₹99"],["Same-day","Order before 12 PM","₹149"]].map(([a,b,c]) => <label className={delivery === a ? "active" : ""} key={a}><input type="radio" name="delivery" checked={delivery === a} onChange={() => setDelivery(a)}/><span><b>{a}</b><small>{b}</small></span><strong>{c}</strong></label>)}</div><label className="switch-row eco-option"><span><Icon name="leaf"/><span><b>Carbon-neutral delivery</b><small>Offset this journey for ₹20</small></span></span><input type="checkbox" checked={neutral} onChange={(e) => setNeutral(e.target.checked)}/></label><label className="switch-row"><span><b>Round up for trees</b><small>Round your total to support native planting</small></span><input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)}/></label><Button className="wide thumb-action" onClick={() => setStep(2)}>Continue to payment</Button></section>}
    {step === 2 && <section><span className="eyebrow">STEP 3 OF 4</span><h2>How would you like to pay?</h2><div className="payment-tabs">{["UPI","Card","Net Banking","Cash on Delivery"].map((p) => <button className={payment === p ? "active" : ""} onClick={() => setPayment(p)} key={p}>{p}</button>)}</div>{payment === "UPI" && <Field label="UPI ID" value={pay.upi} onChange={(e) => setPay({...pay,upi:e.target.value})} placeholder="name@bank" error={pay.upi && !payValid ? "Enter a valid UPI ID" : ""}/>} {payment === "Card" && <><Field label="Card number" inputMode="numeric" maxLength={19} value={pay.card} onChange={(e) => setPay({...pay,card:e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim()})} placeholder="1234 5678 9012 3456"/><Field label="Name on card" value={pay.cardName} onChange={(e) => setPay({...pay,cardName:e.target.value})} placeholder="As printed on card"/><div className="field-row"><Field label="Expiry" maxLength={5} value={pay.expiry} onChange={(e) => { let v=e.target.value.replace(/\D/g,"").slice(0,4); if(v.length>2)v=`${v.slice(0,2)}/${v.slice(2)}`; setPay({...pay,expiry:v}); }} placeholder="MM/YY"/><Field label="CVV" type="password" inputMode="numeric" maxLength={4} value={pay.cvv} onChange={(e) => setPay({...pay,cvv:e.target.value.replace(/\D/g,"")})} placeholder="•••"/></div></>} {payment === "Net Banking" && <label className="field"><span>Select bank</span><select><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option></select></label>} {payment === "Cash on Delivery" && <div className="info-card"><Icon name="check"/><p>Pay securely when your order arrives. Please keep the exact amount ready.</p></div>}<Button className="wide thumb-action" disabled={!payValid} onClick={() => setStep(3)}>Review order</Button></section>}
    {step === 3 && <section><span className="eyebrow">STEP 4 OF 4</span><h2>Review your order</h2><div className="review-order-items">{items.map((i) => <div key={i.product.id}><img src={i.product.image} alt={i.product.name}/><span><b>{i.product.name}</b><small>Qty {i.quantity}</small></span><strong>₹{i.product.price * i.quantity}</strong></div>)}</div><div className="review-address"><h3>Shipping to</h3><p>{form.name}<br/>{form.address}, {form.pin}<br/>{form.phone}</p></div><Bill subtotal={subtotal} discount={0} shipping={shipping} gst={gst}/><p className="secure-note"><Icon name="leaf" size={17}/> Payment via {payment} · Carbon-aware checkout</p><Button className="wide thumb-action" onClick={place}>Place order · ₹{total.toFixed(0)}</Button></section>}
  </div></>;
}

function Confirmation({ order, go, onTrack }: { order: Order | null; go: (s: Screen) => void; onTrack: (o: Order) => void }) {
  if (!order) return <div className="empty"><h2>No recent order</h2><Button onClick={() => go("home")}>Go home</Button></div>;
  return <div className="confirmation"><div className="success-mark"><Icon name="check" size={42}/></div><span className="eyebrow">ORDER CONFIRMED</span><h1>Thank you for choosing greener.</h1><p>Your order is in good hands. We'll keep you posted as it makes its way to you.</p><section className="order-ticket"><div><small>ORDER ID</small><b>#{order.id}</b></div><div><small>ESTIMATED DELIVERY</small><b>{order.delivery}</b></div><div className="timeline mini"><i className="active"/><i/><i/><i/></div><div className="timeline-labels"><span>Placed</span><span>Packed</span><span>Shipped</span><span>Delivered</span></div></section><section className="saved-impact"><Icon name="leaf" size={38}/><div><small>YOUR ORDER'S POSITIVE IMPACT</small><h3>You saved {order.co2} kg CO₂</h3><p>and kept {order.plastic} plastic items out of landfill.</p></div></section><Button className="wide" onClick={() => onTrack(order)}>Track order</Button><Button className="wide" variant="secondary" onClick={() => go("shop")}>Continue shopping</Button><button className="text-link" onClick={() => go("orders")}>View order history</button></div>;
}

function Profile({ profile, go, theme, setTheme, wire, setWire, orders }: any) {
  const co2 = orders.reduce((a: number,o: Order) => a + o.co2, 0), plastic = orders.reduce((a: number,o: Order) => a + o.plastic, 0), points = Math.round(orders.reduce((a: number,o: Order) => a + o.total, 0) / 10);
  return <><header className="profile-head"><div className="avatar">{profile.name.split(" ").map((n: string) => n[0]).slice(0,2).join("")}</div><div><span className="eyebrow">YOUR ECO SPACE</span><h1>{profile.name}</h1><p>{profile.email}</p></div><Button variant="icon" onClick={() => go("edit")}><Icon name="chevron"/></Button></header><div className="profile-pad"><section className="points-card"><div><span><Icon name="leaf"/> GREEN POINTS</span><b>{points}</b><small>You're {Math.max(0,500-points)} points from a ₹100 reward</small></div><div className="ring">{Math.min(100,Math.round(points/5))}%</div></section><section className="profile-impact"><h2>Your positive impact</h2><div><article><Icon name="leaf"/><b>{co2.toFixed(1)} kg</b><span>CO₂ avoided</span></article><article><Icon name="bag"/><b>{plastic}</b><span>Plastic items saved</span></article><article><Icon name="shop"/><b>{orders.length}</b><span>Conscious orders</span></article></div></section><div className="menu-list"><button onClick={() => go("orders")}><span><Icon name="clock"/>Order history</span><Icon name="chevron"/></button><button onClick={() => go("compare")}><span><Icon name="leaf"/>Compare eco-scores</span><Icon name="chevron"/></button><button onClick={() => go("contact")}><span><Icon name="help"/>Help & contact</span><Icon name="chevron"/></button><button onClick={() => go("auth")}><span><Icon name="user"/>Login / Create account</span><Icon name="chevron"/></button></div><section className="settings"><h2>App preferences</h2><label className="switch-row"><span><b>Dark mode</b><small>Gentler viewing after sunset</small></span><input type="checkbox" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}/></label><label className="switch-row"><span><b>Wireframe view</b><small>Preview the low-fidelity experience</small></span><input type="checkbox" checked={wire} onChange={(e) => setWire(e.target.checked)}/></label></section></div></>;
}

function Orders({ orders, back, buyAgain, track }: { orders: Order[]; back: () => void; buyAgain: (o: Order) => void; track: (o: Order) => void }) {
  return <><Header title="Order history" back={back}/><div className="inner-pad">{orders.length ? orders.map((o) => <article className="order-card" key={o.id}><div className="order-card-head"><span><small>#{o.id}</small><b>{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</b></span><Badge>{o.status}</Badge></div><div className="order-thumbs">{o.items.map((i) => <img key={i.product.id} src={i.product.image} alt={i.product.name}/>)}</div><div className="order-card-total"><span>{o.items.reduce((a,i) => a+i.quantity,0)} items</span><b>₹{o.total.toFixed(0)}</b></div><div><Button variant="secondary" onClick={() => buyAgain(o)}>Buy again</Button><Button onClick={() => track(o)}>Track order</Button></div></article>) : <div className="empty"><Icon name="clock" size={52}/><h2>No orders yet</h2><p>Your conscious purchases will appear here.</p></div>}</div></>;
}
function Tracking({ order, back }: { order: Order | null; back: () => void }) {
  const stages = [["Placed","We've received your order"],["Packed","Your items are being packed"],["Shipped","On the way to your city"],["Out for Delivery","Arriving at your doorstep"],["Delivered","Delivered with care"]];
  return <><Header title="Track order" back={back}/><div className="inner-pad">{order && <><section className="tracking-hero"><span className="eyebrow">ORDER #{order.id}</span><Icon name="bag" size={44}/><h2>Estimated delivery</h2><b>{order.delivery}</b></section><div className="vertical-timeline">{stages.map(([a,b],i) => <div className={i === 0 ? "active" : ""} key={a}><i>{i === 0 ? <Icon name="check" size={15}/> : ""}</i><span><b>{a}</b><small>{b}</small></span>{i === 0 && <Badge>Current</Badge>}</div>)}</div></>}</div></>;
}

function Contact({ back }: { back: () => void }) {
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""}); const [errors,setErrors]=useState<Record<string,string>>({}); const [sent,setSent]=useState(false); const [chat,setChat]=useState(false);
  const submit=(e:FormEvent)=>{e.preventDefault();const er:Record<string,string>={};if(!form.name.trim())er.name="Name is required";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))er.email="Enter a valid email";if(form.message.trim().length<10)er.message="Message must be at least 10 characters";setErrors(er);if(!Object.keys(er).length){setSent(true);setForm({name:"",email:"",subject:"",message:""});}};
  return <><Header title="Help & contact" back={back}/><div className="inner-pad"><section className="help-intro"><span><Icon name="help" size={30}/></span><h2>We're here to help</h2><p>Our care team usually replies within one business day.</p></section>{sent && <div className="success-banner"><Icon name="check"/>Thanks! Your message is on its way.</div>}<form className="form-stack" onSubmit={submit}><Field label="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Your name" error={errors.name}/><Field label="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="you@example.com" error={errors.email}/><Field label="Subject" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} placeholder="How can we help?"/><TextArea label="Message" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} placeholder="Tell us a little more..." error={errors.message}/><Button>Send message</Button></form><section className="faq"><h2>Quick answers</h2>{["Where is my order?","What is your return policy?","How do you verify certifications?"].map(q=><details key={q}><summary>{q}<span>+</span></summary><p>Visit your order history for live updates, or message our care team for personalised help.</p></details>)}</section></div><Button className="chat-fab" onClick={()=>setChat(!chat)}><Icon name="help"/> FAQ</Button>{chat&&<div className="chat-pop"><div><b>EcoNest Guide</b><Button variant="icon" onClick={()=>setChat(false)}><Icon name="close" size={17}/></Button></div><p>Hi! What can I help you find today?</p>{["Track my order","Returns & refunds","Product certifications"].map(x=><button key={x}>{x}</button>)}</div>}</>;
}

function Auth({back}:{back:()=>void}) {
  const [create,setCreate]=useState(false),[show,setShow]=useState(false); const [f,setF]=useState({name:"",email:"",password:"",confirm:""}); const [error,setError]=useState("");
  const submit=(e:FormEvent)=>{e.preventDefault();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))setError("Enter a valid email");else if(f.password.length<8)setError("Password must be at least 8 characters");else if(create&&f.password!==f.confirm)setError("Passwords do not match");else{setError("");back();}};
  return <><Header title={create?"Create account":"Welcome back"} back={back}/><div className="auth inner-pad"><span className="brand-mark"><i>e</i> EcoNest</span><h2>{create?"Start your greener journey":"Good to see you again"}</h2><p>{create?"Earn Green Points and track your impact.":"Sign in to see orders, points, and your impact."}</p><form onSubmit={submit}>{create&&<Field label="Full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Your name" required/>}<Field label="Email address" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="you@example.com"/><div className="password-wrap"><Field label="Password" type={show?"text":"password"} value={f.password} onChange={e=>setF({...f,password:e.target.value})} placeholder="At least 8 characters"/><button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div>{create&&<Field label="Confirm password" type="password" value={f.confirm} onChange={e=>setF({...f,confirm:e.target.value})} placeholder="Repeat password"/>}{error&&<div className="form-error">{error}</div>}<Button className="wide">{create?"Create account":"Login"}</Button></form><button className="text-link" onClick={()=>{setCreate(!create);setError("");}}>{create?"Already have an account? Login":"New to EcoNest? Create an account"}</button></div></>;
}
function EditProfile({profile,back,save}:{profile:any;back:()=>void;save:(p:any)=>void}){const[f,setF]=useState(profile);const[e,setE]=useState("");return <><Header title="Edit profile" back={back}/><form className="inner-pad form-stack" onSubmit={x=>{x.preventDefault();if(!f.name.trim())setE("Name is required");else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))setE("Enter a valid email");else save(f);}}><div className="edit-avatar">{f.name?.[0]||"E"}</div><Field label="Full name" value={f.name} onChange={x=>setF({...f,name:x.target.value})} placeholder="Your name" error={e.includes("Name")?e:""}/><Field label="Email address" type="email" value={f.email} onChange={x=>setF({...f,email:x.target.value})} placeholder="you@example.com" error={e.includes("email")?e:""}/><Button>Save changes</Button></form></>;}
function Compare({back}:{back:()=>void}){const[ids,setIds]=useState([1,2]);const toggle=(id:number)=>setIds(x=>x.includes(id)?x.filter(i=>i!==id):x.length<3?[...x,id]:x);return <><Header title="Compare eco-scores" back={back}/><div className="inner-pad"><p className="muted">Select 2–3 products to compare their planet-friendly credentials.</p><div className="compare-picks">{products.slice(0,6).map(p=><button className={ids.includes(p.id)?"active":""} onClick={()=>toggle(p.id)} key={p.id}><img src={p.image} alt={p.name}/><span>{p.name}</span>{ids.includes(p.id)&&<Icon name="check" size={16}/>}</button>)}</div>{ids.length>=2&&<div className="compare-table"><div><b>Product</b>{ids.map(id=><strong key={id}>{products.find(p=>p.id===id)?.name.split(" ").slice(0,2).join(" ")}</strong>)}</div><div><b>Eco score</b>{ids.map(id=><span key={id}>{products.find(p=>p.id===id)?.eco}/5 leaves</span>)}</div><div><b>Plastic-free</b>{ids.map(id=><span key={id}>{products.find(p=>p.id===id)?.certs.includes("Plastic-Free")?"Yes":"Partial"}</span>)}</div><div><b>Made in India</b>{ids.map(id=><span key={id}>Yes</span>)}</div></div>}</div></>;}

export default App;

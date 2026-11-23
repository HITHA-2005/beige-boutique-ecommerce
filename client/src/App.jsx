import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag, Menu, X, Plus, Minus, ArrowUpRight, Leaf, Heart, UserRound } from "lucide-react";

const API = "http://localhost:5000/api"
const fallbackProducts = [
  { _id:"p1", name:"Linen Day Dress", category:"Clothing", price:1899, image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900", description:"An effortless linen-blend dress for slow, sunny days.", featured:true },
  { _id:"p2", name:"Everyday Tote", category:"Accessories", price:999, image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900", description:"A roomy everyday carryall with a clean silhouette.", featured:true },
  { _id:"p3", name:"Classic Knit Top", category:"Clothing", price:1299, image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900", description:"A soft, versatile knit designed for easy layering." },
  { _id:"p4", name:"Minimal Gold Earrings", category:"Accessories", price:799, image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900", description:"Subtle gold-tone accents for everyday styling." },
  { _id:"p5", name:"Relaxed Cotton Shirt", category:"Clothing", price:1599, image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900", description:"A relaxed-fit cotton shirt with timeless appeal." },
  { _id:"p6", name:"Soft Shoulder Bag", category:"Accessories", price:2199, image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900", description:"A polished shoulder bag for day-to-evening plans." },
  { _id:"p7", name:"Weekend Sneakers", category:"Footwear", price:2499, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900", description:"Comfort-first sneakers for everyday adventures." },
  { _id:"p8", name:"Strap Sandals", category:"Footwear", price:1799, image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900", description:"Minimal sandals that pair with everything." }
];
const money = n => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(n);

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("bb-cart") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("bb-user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("bb-token") || "");
  const [notice, setNotice] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API}/products`).then(r => { if (!r.ok) throw Error(); return r.json(); })
      .then(data => { if (data.length) setProducts(data); }).catch(() => {});
  }, []);
  useEffect(() => localStorage.setItem("bb-cart", JSON.stringify(cart)), [cart]);

  const visible = useMemo(() => products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [products, category, search]);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function toast(message) { setNotice(message); setTimeout(() => setNotice(""), 2600); }
  function add(product) {
    setCart(old => {
      const found = old.find(i => i._id === product._id);
      return found ? old.map(i => i._id === product._id ? { ...i, quantity:i.quantity+1 } : i) : [...old, { ...product, quantity:1 }];
    });
    toast(`${product.name} added to your bag`);
  }
  function changeQty(id, delta) {
    setCart(old => old.map(i => i._id === id ? { ...i, quantity:i.quantity+delta } : i).filter(i => i.quantity > 0));
  }
  async function submitAuth(e) {
    e.preventDefault(); setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch(`${API}/auth/${authMode}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw Error(data.message || "Could not sign in");
      setToken(data.token); setUser(data.user); localStorage.setItem("bb-token", data.token); localStorage.setItem("bb-user", JSON.stringify(data.user));
      setAuthOpen(false); toast(`Welcome${data.user.name ? `, ${data.user.name}` : ""}!`);
    } catch (err) { toast(err.message + " (Check that the server is running.)"); }
    finally { setBusy(false); }
  }
  async function checkout() {
    if (!token) { setAuthOpen(true); toast("Please log in to place your demo order."); return; }
    if (!checkoutAddress.trim()) { toast("Please enter a delivery address."); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API}/orders`, { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body:JSON.stringify({ deliveryAddress:checkoutAddress, items:cart.map(i => ({ productId:i._id, quantity:i.quantity })) }) });
      const data = await res.json();
      if (!res.ok) throw Error(data.message || "Order failed");
      setCart([]); setCheckoutAddress(""); setCartOpen(false); toast("Demo order placed successfully!");
    } catch (err) { toast(err.message); }
    finally { setBusy(false); }
  }

  return <div className="app">
    <div className="announcement">A little something lovely — complimentary shipping on orders over ₹2,500</div>
    <header className="header">
      <button className="icon mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X/> : <Menu/>}</button>
      <a className="logo" href="#home">beige<span>.</span></a>
      <nav className={menuOpen ? "nav open" : "nav"}>
        <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a>
      </nav>
      <div className="header-actions">
        <button className="icon account" aria-label="Account" onClick={() => setAuthOpen(true)}><UserRound/><span>{user ? user.name.split(" ")[0] : "Account"}</span></button>
        <button className="icon bag-button" onClick={() => setCartOpen(true)} aria-label="Shopping bag"><ShoppingBag/><span>Bag ({count})</span></button>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">THE EVERYDAY EDIT · 2026</p><h1>Find beauty in<br/><em>the everyday.</em></h1><p className="hero-text">Thoughtfully chosen pieces for a life well lived. Considered details, effortless style, and a little more joy in every day.</p><a className="primary-btn" href="#shop">Explore the collection <ArrowUpRight size={17}/></a><div className="hero-note"><span>01 / 03</span><span>Curated with care</span></div></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400" alt="Fashion editorial with neutral outfits"/><div className="image-label">A softer kind of statement.</div></div>
      </section>

      <section className="values"><div><Leaf/><span>Thoughtfully selected</span></div><div><Heart/><span>Made for real life</span></div><div><ShoppingBag/><span>Easy, considered shopping</span></div></section>

      <section className="shop-section" id="shop">
        <div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Pieces to <em>keep close.</em></h2></div><p>Good things, chosen slowly.</p></div>
        <div className="shop-tools"><div className="filters">{["All","Clothing","Accessories","Footwear"].map(c => <button key={c} className={category===c?"filter active":"filter"} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="search"><Search size={17}/><input placeholder="Find something..." value={search} onChange={e => setSearch(e.target.value)}/></label></div>
        <div className="product-grid">{visible.map((p, index) => <article className="product-card" key={p._id}>
          <button className="product-image" onClick={() => setSelected(p)}><img src={p.image} alt={p.name} loading="lazy"/>{(p.featured || index===0) && <span className="tag">CURATED PICK</span>}<span className="quick-view">Quick view <ArrowUpRight size={14}/></span></button>
          <div className="product-info"><div><p className="product-category">{p.category}</p><h3>{p.name}</h3></div><strong>{money(p.price)}</strong></div>
          <button className="add-btn" onClick={() => add(p)}>Add to bag <Plus size={15}/></button>
        </article>)}</div>
        {visible.length===0 && <p className="empty">No pieces found. Try another search.</p>}
      </section>

      <section className="story" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" alt="Calm boutique interior"/></div><div className="story-copy"><p className="eyebrow">A NOTE FROM BEIGE</p><h2>Less, but<br/><em>more meaningful.</em></h2><p>We believe the best wardrobe is built with pieces you reach for again and again. Beige is a small edit of everyday essentials — chosen for their thoughtful details, easy feel, and lasting appeal.</p><a href="#shop" className="text-link">Shop the edit <ArrowUpRight size={16}/></a></div></section>
    </main>

    <footer id="footer"><a className="logo" href="#home">beige<span>.</span></a><p>Everyday pieces. Thoughtfully chosen.</p><div className="footer-bottom"><span>© 2026 Beige Boutique · Student portfolio demo</span><span>Designed with intention.</span></div></footer>

    {cartOpen && <div className="overlay" onMouseDown={e => e.target===e.currentTarget && setCartOpen(false)}><aside className="drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({count})</span></h2></div><button className="icon" onClick={() => setCartOpen(false)}><X/></button></div>
      {cart.length===0 ? <div className="empty-cart"><ShoppingBag size={32}/><h3>Your bag is taking a breather.</h3><p>Find a piece that feels like you.</p><button className="primary-btn" onClick={() => setCartOpen(false)}>Continue shopping</button></div> :
      <><div className="cart-items">{cart.map(i => <div className="cart-item" key={i._id}><img src={i.image} alt={i.name}/><div className="cart-detail"><h3>{i.name}</h3><p>{money(i.price)}</p><div className="qty"><button onClick={() => changeQty(i._id,-1)}><Minus size={13}/></button><span>{i.quantity}</span><button onClick={() => changeQty(i._id,1)}><Plus size={13}/></button></div></div><strong>{money(i.price*i.quantity)}</strong></div>)}</div>
      <div className="checkout"><label>Delivery address<textarea value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} placeholder="Enter your delivery address"/></label><div className="subtotal"><span>Subtotal</span><strong>{money(total)}</strong></div><p className="shipping-note">Shipping and taxes calculated at checkout.</p><button className="primary-btn full" disabled={busy} onClick={checkout}>{busy?"Please wait...":"Place demo order"} <ArrowUpRight size={16}/></button><small>Demo checkout only — no real payment is collected.</small></div></>}
    </aside></div>}

    {selected && <div className="overlay modal-overlay" onMouseDown={e => e.target===e.currentTarget && setSelected(null)}><div className="product-modal"><button className="icon close-modal" onClick={() => setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><strong>{money(selected.price)}</strong><p>{selected.description}</p><button className="primary-btn full" onClick={() => {add(selected);setSelected(null)}}>Add to bag <Plus size={16}/></button></div></div></div>}

    {authOpen && <div className="overlay modal-overlay" onMouseDown={e => e.target===e.currentTarget && setAuthOpen(false)}><form className="auth-modal" onSubmit={submitAuth}><button type="button" className="icon close-modal" onClick={() => setAuthOpen(false)}><X/></button><p className="eyebrow">WELCOME TO BEIGE</p><h2>{authMode==="login"?"Good to see you.":"Create your account."}</h2><p className="auth-sub">A little account makes checkout easier.</p>{authMode==="register" && <input name="name" placeholder="Your name" required/>}<input name="email" type="email" placeholder="Email address" required/><input name="password" type="password" placeholder="Password (at least 6 characters)" minLength="6" required/><button className="primary-btn full" disabled={busy}>{busy?"Please wait...":authMode==="login"?"Log in":"Create account"} <ArrowUpRight size={16}/></button><p className="switch-auth">{authMode==="login"?"New here?":"Already have an account?"} <button type="button" onClick={() => setAuthMode(authMode==="login"?"register":"login")}>{authMode==="login"?"Create an account":"Log in"}</button></p></form></div>}
    {notice && <div className="toast">{notice}</div>}
  </div>;
}

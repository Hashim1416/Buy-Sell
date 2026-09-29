import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, Search, ShoppingBag, Heart, SlidersHorizontal, Star, 
  ChevronDown, ChevronRight, Zap, Tag, CheckCircle2, Clock, X, 
  ShoppingCart, CreditCard, Package, Truck, Shield, Plus, Minus, 
  Trash2, Grid, List, ArrowUpDown, Sparkles, Paintbrush, Layers, 
  Gauge, Lightbulb, Compass, Cpu, Music, Wrench, ShieldAlert, Disc, Eye,
  Loader2, Receipt, Calendar, MapPin
} from "lucide-react";
import { storeProducts } from "../data/storeProducts";
import { storeStructure } from "../data/storeStructure";
import { AppContext } from "../context/AppContext";

const OFFERS = [
  { label: "10% OFF", pct: 10, badge: "Deal", color: "#22c55e" },
  { label: "15% OFF", pct: 15, badge: "Hot Deal", color: "#f97316" },
  { label: "20% OFF", pct: 20, badge: "Flash Sale", color: "#ef4444" },
  { label: "5% OFF", pct: 5, badge: "Offer", color: "#a78bfa" },
];

function getOffer(product) {
  const code = product.id.charCodeAt(product.id.length - 1);
  if (code % 5 > 1) return null;
  return OFFERS[code % OFFERS.length];
}

function getAvailability(product) {
  const code = product.id.charCodeAt(0) + product.id.charCodeAt(product.id.length - 1);
  if (code % 7 === 0) return { label: "Out of Stock", color: "#ef4444", inStock: false };
  if (code % 7 <= 2) return { label: "Low Stock", color: "#f97316", inStock: true };
  return { label: "In Stock", color: "#22c55e", inStock: true };
}

// Map Lucide icons to Department Names
const getDepartmentIcon = (name) => {
  switch (name) {
    case "Wheels & Tires": return <Disc className="w-4 h-4 text-luxury-gold" />;
    case "Paint & Exterior Finish": return <Paintbrush className="w-4 h-4 text-luxury-gold" />;
    case "Carbon Fiber Parts": return <Layers className="w-4 h-4 text-luxury-gold" />;
    case "Body Kits": return <Grid className="w-4 h-4 text-luxury-gold" />;
    case "Performance Parts": return <Gauge className="w-4 h-4 text-luxury-gold" />;
    case "Braking System": return <Disc className="w-4 h-4 text-red-500" />;
    case "Suspension": return <SlidersHorizontal className="w-4 h-4 text-luxury-gold" />;
    case "Lighting": return <Lightbulb className="w-4 h-4 text-luxury-gold" />;
    case "Interior Accessories": return <Compass className="w-4 h-4 text-luxury-gold" />;
    case "Electronics": return <Cpu className="w-4 h-4 text-luxury-gold" />;
    case "Audio System": return <Music className="w-4 h-4 text-luxury-gold" />;
    case "Car Care & Detailing": return <Sparkles className="w-4 h-4 text-luxury-gold" />;
    case "Maintenance & Tools": return <Wrench className="w-4 h-4 text-luxury-gold" />;
    case "Safety & Emergency": return <ShieldAlert className="w-4 h-4 text-luxury-gold" />;
    case "Off-Road & Adventure": return <Compass className="w-4 h-4 text-luxury-gold" />;
    case "EV Accessories": return <Zap className="w-4 h-4 text-emerald-500" />;
    default: return <SlidersHorizontal className="w-4 h-4 text-luxury-gold" />;
  }
};

const CategoryNode = ({ node, activeCategory, setActiveCategory, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isString = typeof node === "string";

  if (isString) {
    return (
      <button
        onClick={() => setActiveCategory(node)}
        className={`w-full text-left py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${
          activeCategory === node 
            ? "text-luxury-gold font-semibold bg-white/5 border-l-2 border-luxury-gold pl-4" 
            : "text-zinc-550 hover:text-zinc-200 hover:bg-white/5 pl-3"
        }`}
      >
        <span className="text-[11px] tracking-wide">{node}</span>
        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  const title = node.name || node.category;
  const isSelected = activeCategory === title;

  return (
    <div className="space-y-1">
      <button
        onClick={() => { setIsExpanded(!isExpanded); setActiveCategory(title); }}
        className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-300 ${
          isSelected 
            ? "bg-luxury-gold/10 text-luxury-gold font-bold border-l-2 border-luxury-gold" 
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {level === 0 && <span className="text-zinc-400 group-hover:text-luxury-gold">{getDepartmentIcon(title)}</span>}
          <span className="text-xs font-medium tracking-wide">{title}</span>
        </div>
        {node.subcategories && node.subcategories.length > 0 && (
          isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && node.subcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-0.5 ml-2.5 pl-2.5 border-l border-zinc-800"
          >
            {node.subcategories.map((sub, index) => (
              <CategoryNode key={typeof sub === "string" ? sub : sub.name || index} node={sub} activeCategory={activeCategory} setActiveCategory={setActiveCategory} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Order Processing & Receipt Screen ────────────────────────────────────
function CheckoutModal({ items, total, onClose, onClearCart }) {
  const [step, setStep] = useState(0); // 0: Processing, 1: Success
  const [loadingText, setLoadingText] = useState("Securing premium terminal connection...");
  const [orderNumber] = useState(() => `AETH-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Real-life time and shipping date estimation
  const orderDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3); // 3-day premium delivery
  const deliveryString = deliveryDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  useEffect(() => {
    if (step === 0) {
      const timers = [
        setTimeout(() => setLoadingText("Authorizing tokenized transaction..."), 700),
        setTimeout(() => setLoadingText("Allocating inventory in central depot..."), 1400),
        setTimeout(() => {
          setStep(1);
          onClearCart();
        }, 2200)
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {step === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4 max-w-sm"
          >
            <div className="relative w-20 h-20 mx-auto">
              <Loader2 className="w-20 h-20 text-luxury-gold animate-spin stroke-[1.5]" />
              <Shield className="w-8 h-8 text-luxury-gold absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-white text-base font-bold tracking-wide">Processing Luxury Payment</h3>
            <p className="text-zinc-550 text-xs animate-pulse">{loadingText}</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-[#0b0b0b] border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient luxury glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3.5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-white text-xl font-bold tracking-wide">Purchase Completed</h2>
              <p className="text-zinc-500 text-xs mt-1">Thank you for choosing Aetherion Boutique</p>
            </div>

            {/* Receipt Summary */}
            <div className="space-y-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-900">
                <span className="text-zinc-550 uppercase font-bold tracking-wider">Order Reference</span>
                <span className="text-white font-mono font-bold">{orderNumber}</span>
              </div>

              <div className="flex justify-between items-start text-xs pb-3 border-b border-zinc-900">
                <span className="text-zinc-550 uppercase font-bold tracking-wider">Purchase Time</span>
                <span className="text-white text-right font-medium">{orderDate}</span>
              </div>

              <div className="flex justify-between items-start text-xs pb-3 border-b border-zinc-900">
                <span className="text-zinc-550 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-luxury-gold" /> Estimated Delivery
                </span>
                <span className="text-luxury-gold text-right font-bold">{deliveryString}</span>
              </div>

              {/* Items breakdown list */}
              <div className="space-y-2 py-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 truncate max-w-[280px]">{item.name} <span className="text-zinc-600 font-bold">x{item.qty}</span></span>
                    <span className="text-white font-medium">${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center text-sm pt-3 border-t border-zinc-900 font-bold">
                <span className="text-white">Amount Settled</span>
                <span className="text-luxury-gold text-base">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address mockup info */}
            <div className="flex gap-3 items-start text-xs text-zinc-500 mb-6 px-1">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-zinc-300 font-bold">Premium Courier Signature Delivery</p>
                <p className="text-[10px] mt-0.5">Tracking codes will be dispatched to your registered credentials shortly.</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-luxury-gold hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-luxury-gold/5 flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" /> Return to Boutique
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

function CartDrawer({ open, onClose, onCheckout }) {
  const { storeCart, removeFromCart, updateCartQty, clearCart, cartTotal } = useContext(AppContext);
  const freeShippingThreshold = 500;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#090909]/95 backdrop-blur-2xl border-l border-zinc-900 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-black/20">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-luxury-gold" />
                <span className="text-white font-bold text-sm tracking-wide">Your Cart</span>
                {storeCart.length > 0 && (
                  <span className="bg-luxury-gold text-black text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {storeCart.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {storeCart.length > 0 && (
                  <button onClick={clearCart} className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-widest font-bold transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-900/60 hover:bg-zinc-800 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {storeCart.length > 0 && (
              <div className="px-6 py-4 bg-zinc-950/40 border-b border-zinc-900/60">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-luxury-gold" />
                    {remainingForFreeShipping > 0 
                      ? `Spend $${remainingForFreeShipping.toLocaleString()} more for Free Delivery`
                      : "You have unlocked Free Delivery!"
                    }
                  </span>
                  <span className="text-[10px] text-luxury-gold font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-luxury-gold transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3 custom-scrollbar">
              {storeCart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-16">
                  <div className="w-16 h-16 rounded-full bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 text-zinc-650" />
                  </div>
                  <p className="text-white text-sm font-bold mb-1">Your cart is empty</p>
                  <p className="text-zinc-555 text-xs">Add products using the Add to Cart button</p>
                </div>
              ) : (
                storeCart.map(item => {
                  const offer = getOffer(item);
                  const finalPrice = offer ? Math.round(item.price * (1 - offer.pct / 100)) : item.price;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3.5 hover:border-zinc-800 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest mb-0.5">{item.brand}</p>
                          <p className="text-white text-xs font-bold leading-tight line-clamp-2">{item.name}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          {/* Qty controls */}
                          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                            <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-zinc-850 transition-colors text-zinc-400">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs font-bold w-5 text-center">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-zinc-850 transition-colors text-zinc-400">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {/* Price */}
                          <div className="text-right">
                            {offer && <p className="text-zinc-650 text-[9px] line-through">${(item.price * item.qty).toLocaleString()}</p>}
                            <p className="text-white text-xs font-bold">${(finalPrice * item.qty).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeFromCart(item.id)} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/10 text-zinc-650 hover:text-red-400 transition-colors self-start">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {storeCart.length > 0 && (
              <div className="px-6 py-5 border-t border-zinc-900 space-y-3.5 bg-black/25">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-455 text-xs uppercase tracking-widest font-bold">Subtotal</span>
                  <span className="text-white text-lg font-bold">${cartTotal.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => { onCheckout(storeCart, cartTotal); onClose(); }}
                  className="w-full py-4 rounded-2xl bg-luxury-gold text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg shadow-luxury-gold/10"
                >
                  <CreditCard className="w-4 h-4" /> Proceed to Checkout
                </button>
                <button onClick={onClose} className="w-full py-3 rounded-2xl border border-zinc-800 text-zinc-455 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BuyNowPanel({ product, offer, availability, onClose, onAddToCart, onCheckoutDirect }) {
  const discountedPrice = offer ? Math.round(product.price * (1 - offer.pct / 100)) : product.price;
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.97 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 md:inset-0 md:m-auto md:max-w-2xl md:max-h-[85vh] md:rounded-3xl z-50 bg-[#0a0a0a] border border-zinc-900 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
          <span className="text-luxury-gold text-xs font-bold uppercase tracking-widest">Quick Purchase</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-850 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="relative h-60 overflow-hidden bg-zinc-950">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            {offer && <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: offer.color }}>{offer.badge} — {offer.label}</div>}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: availability.color + "20", color: availability.color, border: `1px solid ${availability.color}40` }}>{availability.label}</div>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-widest mb-1">{product.brand}</p>
              <h2 className="text-white text-xl font-bold leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "text-luxury-gold fill-luxury-gold" : "text-zinc-700"}`} />)}</div>
                <span className="text-zinc-400 text-xs">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between">
              <div>
                {offer ? (
                  <>
                    <p className="text-zinc-650 text-xs line-through">${product.price.toLocaleString()}</p>
                    <p className="text-white text-2xl font-bold">${discountedPrice.toLocaleString()}</p>
                    <p className="text-xs mt-0.5" style={{ color: offer.color }}>You save ${(product.price - discountedPrice).toLocaleString()} with {offer.badge}</p>
                  </>
                ) : (
                  <p className="text-white text-2xl font-bold">${product.price.toLocaleString()}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Per Set</p>
                <p className="text-zinc-400 text-xs mt-1">Free shipping over $500</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: Truck, label: "Free Delivery", sub: "Orders $500+" }, { icon: Shield, label: "2-Year Warranty", sub: "Full cover" }, { icon: Package, label: "Easy Returns", sub: "30-day policy" }].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-zinc-900/40 border border-zinc-900/60 rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-luxury-gold mx-auto mb-1" />
                  <p className="text-white text-[10px] font-bold">{label}</p>
                  <p className="text-zinc-555 text-[9px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-zinc-900 bg-zinc-950/30 flex gap-3">
          <button onClick={() => { onAddToCart(product); onClose(); }} className="flex-1 py-3.5 border border-zinc-800 hover:border-luxury-gold/60 rounded-xl text-zinc-300 hover:text-luxury-gold text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <button
            disabled={!availability.inStock}
            onClick={() => { onCheckoutDirect(product, discountedPrice); onClose(); }}
            className="flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: availability.inStock ? "#D4AF37" : "#222", color: availability.inStock ? "#000" : "#555" }}
          >
            <CreditCard className="w-4 h-4" /> {availability.inStock ? "Buy Now" : "Unavailable"}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Store ───────────────────────────────────────────────────────────
export default function Store() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);

  // Sorting & Layout controls
  const [sortBy, setSortBy] = useState("featured");
  const [layoutMode, setLayoutMode] = useState("grid"); // grid | list
  const [quickFilter, setQuickFilter] = useState("all"); // all | offers | new | instock

  // Checkout modal controls
  const [checkoutData, setCheckoutData] = useState(null);

  const { addNotification, addToCart, storeCart, cartCount, clearCart } = useContext(AppContext);

  useEffect(() => {
    const category = queryParams.get("category");
    if (category) setActiveCategory(category);
  }, [location.search]);

  // Filter & Sort logic
  const filteredProducts = storeProducts
    .filter(product => {
      const matchCategory = activeCategory === "All" || 
        product.category === activeCategory || 
        product.subcategory === activeCategory || 
        (product.tags && product.tags.includes(activeCategory));

      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const offer = getOffer(product);
      const availability = getAvailability(product);
      let matchQuick = true;
      if (quickFilter === "offers") matchQuick = !!offer;
      if (quickFilter === "new") matchQuick = product.isNew;
      if (quickFilter === "instock") matchQuick = availability.inStock;

      return matchCategory && matchSearch && matchQuick;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0; // featured/default
    });

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(`${product.name} added to cart.`, "success");
    setCartOpen(true);
  };

  const handleCheckoutCart = (cartItems, totalVal) => {
    setCheckoutData({
      items: cartItems,
      total: totalVal
    });
  };

  const handleCheckoutDirect = (product, finalPrice) => {
    setCheckoutData({
      items: [{ ...product, qty: 1, price: finalPrice }],
      total: finalPrice
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) { 
        next.delete(product.id); 
        addNotification("Removed from wishlist.", "info"); 
      } else { 
        next.add(product.id); 
        addNotification(`${product.name} saved to wishlist.`, "success"); 
      }
      return next;
    });
  };

  return (
    <div className="bg-luxury-black min-h-screen text-luxury-silver font-sans pt-28 pb-20 selection:bg-luxury-gold selection:text-black">
      {/* Checkout Wizard / Success Screen */}
      {checkoutData && (
        <CheckoutModal 
          items={checkoutData.items}
          total={checkoutData.total}
          onClose={() => setCheckoutData(null)}
          onClearCart={clearCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckoutCart} />

      {/* Buy Now Panel */}
      <AnimatePresence>
        {buyNowProduct && (
          <BuyNowPanel 
            product={buyNowProduct} 
            offer={getOffer(buyNowProduct)} 
            availability={getAvailability(buyNowProduct)} 
            onClose={() => setBuyNowProduct(null)} 
            onAddToCart={handleAddToCart}
            onCheckoutDirect={handleCheckoutDirect}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Header section */}
        <div className="mb-8 border-b border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-luxury-gold text-xs tracking-[0.35em] font-semibold uppercase block mb-2">Luxury Boutique</span>
            <h1 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-wide">
              {activeCategory === "All" ? "Aetherion Store" : activeCategory}
            </h1>
            <p className="text-zinc-500 text-xs mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              {filteredProducts.length} premium products matching your selection
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial md:w-64">
              <input 
                type="text" 
                placeholder="Search boutique..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-full py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-luxury-gold/50 focus:bg-zinc-900/80 transition-all placeholder-zinc-650" 
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative shrink-0 w-10 h-10 rounded-full bg-zinc-900/50 border border-zinc-800/80 hover:border-luxury-gold/50 flex items-center justify-center text-zinc-405 hover:text-luxury-gold transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-gold text-black text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Toggle */}
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden shrink-0 bg-zinc-900/50 border border-zinc-800/80 p-2.5 rounded-full text-zinc-450 hover:text-white">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Layout controls bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-[#0b0b0b] border border-zinc-900 rounded-2xl p-4">
          {/* Quick Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Items" },
              { id: "offers", label: "Special Offers", icon: <Tag className="w-3.5 h-3.5" /> },
              { id: "new", label: "New Arrivals", icon: <Zap className="w-3.5 h-3.5" /> },
              { id: "instock", label: "Available Only", icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setQuickFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  quickFilter === tab.id
                    ? "bg-luxury-gold text-black shadow-md shadow-luxury-gold/10"
                    : "text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-550" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-800 text-[11px] font-semibold text-zinc-350 focus:outline-none focus:border-luxury-gold/50 rounded-xl px-3 py-2 cursor-pointer uppercase tracking-wider transition-all"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {/* Layout Toggles */}
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${layoutMode === "grid" ? "bg-luxury-gold text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${layoutMode === "list" ? "bg-luxury-gold text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Departments tree */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-1/4 shrink-0 lg:sticky lg:top-32`}>
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" /> Departments
                </h3>
                <div className="space-y-1.5 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-6">
                  <button 
                    onClick={() => setActiveCategory("All")} 
                    className={`w-full text-left text-xs py-2 px-3 rounded-xl transition-all ${
                      activeCategory === "All" ? "bg-luxury-gold/10 text-luxury-gold font-bold" : "text-zinc-450 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    All Categories
                  </button>
                  {storeStructure.map((group, index) => (
                    <CategoryNode key={group.category || index} node={group} activeCategory={activeCategory} setActiveCategory={setActiveCategory} level={0} />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product list grid */}
          <div className="w-full lg:w-3/4 flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-zinc-900 border-dashed rounded-3xl bg-zinc-950/20">
                <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">No matching products</h3>
                <p className="text-zinc-500 text-sm">Try adjusting your filters or checking a different category.</p>
                <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); setQuickFilter("all"); }} className="mt-6 text-luxury-gold text-xs font-bold uppercase tracking-widest hover:text-white transition">Clear All Filters</button>
              </div>
            ) : (
              <div className={layoutMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map(product => {
                  const offer = getOffer(product);
                  const availability = getAvailability(product);
                  const discountedPrice = offer ? Math.round(product.price * (1 - offer.pct / 100)) : product.price;
                  const inWishlist = wishlist.has(product.id);
                  const inCart = storeCart.some(i => i.id === product.id);

                  if (layoutMode === "grid") {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        key={product.id}
                        className="group relative bg-[#0a0a0a] border border-zinc-900 hover:border-luxury-gold/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(212,175,55,0.04)] flex flex-col"
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-[16/11] overflow-hidden bg-zinc-950 border-b border-zinc-900/60">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" loading="lazy" />

                          {/* Quick Badges overlay */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center pointer-events-none">
                            {offer && (
                              <div className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-md" style={{ backgroundColor: offer.color }}>
                                <Tag className="w-2.5 h-2.5" /> {offer.label}
                              </div>
                            )}
                            {product.isNew && !offer && (
                              <div className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <Zap className="w-2.5 h-2.5 fill-black" /> New
                              </div>
                            )}
                          </div>

                          {/* Availability tag & Wishlist */}
                          <div className="absolute top-3 right-3 flex items-center gap-2">
                            <div className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-md">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: availability.color }} />
                              {availability.label}
                            </div>
                            <button onClick={() => toggleWishlist(product)} className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-black/80" style={{ color: inWishlist ? "#D4AF37" : "#999" }}>
                              <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-luxury-gold text-luxury-gold" : ""}`} />
                            </button>
                          </div>

                          {/* Quick view detail overlay on hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button 
                              onClick={() => setBuyNowProduct(product)}
                              className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xl hover:scale-105 transition-transform"
                            >
                              <Eye className="w-4 h-4" /> Quick View
                            </button>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-4.5 flex flex-col flex-1">
                          <div className="flex justify-between items-start gap-3 mb-2.5">
                            <div className="min-w-0">
                              <p className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest mb-0.5">{product.brand}</p>
                              <h3 className="text-white text-sm font-bold leading-tight line-clamp-1 group-hover:text-luxury-gold transition-colors">{product.name}</h3>
                            </div>
                            <div className="text-right shrink-0">
                              {offer ? (
                                <>
                                  <p className="text-zinc-650 text-[10px] line-through">${product.price.toLocaleString()}</p>
                                  <p className="text-white font-bold text-sm">${discountedPrice.toLocaleString()}</p>
                                </>
                              ) : (
                                <p className="text-white font-bold text-sm">${product.price.toLocaleString()}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? "text-luxury-gold fill-luxury-gold" : "text-zinc-700"}`} />)}</div>
                            <span className="text-[10px] text-zinc-400">{product.rating}</span>
                            <span className="text-[10px] text-zinc-650">({product.reviews})</span>
                          </div>

                          <p className="text-[10px] text-zinc-555 line-clamp-2 leading-relaxed mb-4 flex-grow">{product.description}</p>

                          {/* Buttons row */}
                          <div className="flex gap-2.5 mt-auto">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!availability.inStock}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed border ${
                                inCart
                                  ? "border-luxury-gold/50 text-luxury-gold bg-luxury-gold/5 hover:bg-luxury-gold/10"
                                  : "border-zinc-800 text-zinc-450 hover:border-luxury-gold/30 hover:text-white"
                              }`}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              {inCart ? "Add More" : "Add to Cart"}
                            </button>
                            <button
                              onClick={() => setBuyNowProduct(product)}
                              disabled={!availability.inStock}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300 ${
                                availability.inStock 
                                  ? "bg-luxury-gold hover:bg-white text-black shadow-md shadow-luxury-gold/5" 
                                  : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5" /> Buy Now
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  } else {
                    // List Layout Mode
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={product.id}
                        className="group relative bg-[#0a0a0a] border border-zinc-900 hover:border-luxury-gold/30 rounded-2xl overflow-hidden transition-all duration-300 p-4 flex gap-5 items-center hover:shadow-[0_8px_32px_rgba(212,175,55,0.04)]"
                      >
                        {/* Image */}
                        <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800 relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          {offer && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: offer.color }}>
                              {offer.label}
                            </div>
                          )}
                        </div>

                        {/* Name and description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-luxury-gold font-bold uppercase tracking-widest">{product.brand}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: availability.color + "15", color: availability.color }}>
                              {availability.label}
                            </span>
                          </div>
                          <h3 className="text-white text-sm font-bold truncate group-hover:text-luxury-gold transition-colors">{product.name}</h3>
                          <p className="text-[10px] text-zinc-555 line-clamp-1 leading-relaxed mt-0.5">{product.description}</p>
                        </div>

                        {/* Rating & Review */}
                        <div className="hidden md:flex flex-col items-center shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
                            <span className="text-white text-xs font-bold">{product.rating}</span>
                          </div>
                          <span className="text-[9px] text-zinc-650">({product.reviews} reviews)</span>
                        </div>

                        {/* Price Column */}
                        <div className="text-right shrink-0 min-w-[70px]">
                          {offer ? (
                            <>
                              <p className="text-zinc-650 text-[9px] line-through">${product.price.toLocaleString()}</p>
                              <p className="text-white font-bold text-sm">${discountedPrice.toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-white font-bold text-sm">${product.price.toLocaleString()}</p>
                          )}
                        </div>

                        {/* Actions buttons */}
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => toggleWishlist(product)} className={`w-9 h-9 rounded-xl border border-zinc-900 flex items-center justify-center transition-all hover:border-luxury-gold/20 ${inWishlist ? "text-luxury-gold" : "text-zinc-550 hover:text-white"}`}>
                            <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-luxury-gold" : ""}`} />
                          </button>
                          <button onClick={() => setBuyNowProduct(product)} className="w-9 h-9 rounded-xl border border-zinc-900 flex items-center justify-center text-zinc-550 hover:text-white hover:border-luxury-gold/20 transition-all">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!availability.inStock}
                            className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 border ${
                              inCart
                                ? "border-luxury-gold/40 text-luxury-gold bg-luxury-gold/5"
                                : "border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-white"
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  }
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

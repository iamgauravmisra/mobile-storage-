import React, { useState, useEffect, useRef } from 'react';
import api from './api/axios';
import { gsap } from 'gsap';
import { Smartphone, Plus, Trash2, IndianRupee, ShoppingBag, Box } from 'lucide-react';
import AddModal from './components/AddModal';

// --- Navbar ---
const Navbar = ({ onAddClick }) => (
  <nav className="fixed top-0 w-full z-50 px-6 py-8">
    <div className="max-w-7xl mx-auto apple-glass rounded-[2.5rem] px-10 py-5 flex justify-between items-center border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
          <Smartphone className="text-white" size={28} />
        </div>
        <span className="text-3xl font-black text-white tracking-tighter uppercase italic">
          Storage<span className="text-blue-500">Vault</span>
        </span>
      </div>
      <button onClick={onAddClick} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-all shadow-xl shadow-blue-600/20">
        <Plus size={20} />
        <span className="hidden md:inline">Restock Mobile</span>
      </button>
    </div>
  </nav>
);

// --- MobileCard ---
const MobileCard = ({ mobile, onDelete, onPurchase }) => {
  const cardRef = useRef();
  const handleMouseMove = (e) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(cardRef.current, { rotateY: x * 15, rotateX: -y * 15, transformPerspective: 1000, duration: 0.4 });
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={() => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0 })}
      className="apple-glass p-10 rounded-[3rem] relative shadow-2xl border border-white/5 transition-all"
    >
      <div className="flex justify-between mb-8">
        <Box className="text-blue-400" size={24} />
        <button onClick={() => onDelete(mobile._id)} className="text-slate-600 hover:text-red-500 transition-colors">
          <Trash2 size={20}/>
        </button>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase leading-none">{mobile.modelName}</h3>
      <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase mb-10">{mobile.brand}</p>
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl mb-8">
        <p className="text-2xl font-black text-white flex items-center"><IndianRupee size={18}/>{mobile.price.toLocaleString()}</p>
        <p className={`font-bold ${mobile.stockQuantity < 5 ? 'text-orange-500' : 'text-blue-500'}`}>{mobile.stockQuantity} Left</p>
      </div>
      <button disabled={mobile.stockQuantity <= 0} onClick={() => onPurchase(mobile)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white rounded-2xl font-bold flex justify-center gap-2 active:scale-95 transition-all"
      >
        <ShoppingBag size={20}/> {mobile.stockQuantity > 0 ? "Buy Unit" : "Sold Out"}
      </button>
    </div>
  );
};

export default function App() {
  const [mobiles, setMobiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [uiError, setUiError] = useState("");
  const textContainerRef = useRef();

  const phrases = ["INVENTORY", "SHIPMENTS", "VAULT", "ASSETS"];

  useEffect(() => {
    fetchMobiles();
    
    const tl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      const charsHTML = phrase.split('').map((char) => 
        `<span class="anim-char inline-block origin-center">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      tl.add(() => { if(textContainerRef.current) textContainerRef.current.innerHTML = charsHTML; });

      tl.fromTo(".anim-char", 
        { y: 60, rotateX: 90, opacity: 0, scale: 0.5 }, 
        { duration: 1, y: 0, rotateX: 0, opacity: 1, scale: 1, stagger: 0.05, ease: "elastic.out(1.2, 0.5)" }
      );
      tl.to({}, { duration: 2 });
      tl.to(".anim-char", { duration: 0.5, opacity: 0, y: -40, rotateX: -90, stagger: 0.03, ease: "power2.in" });
    });

    return () => tl.kill();
  }, []);

  const fetchMobiles = async () => {
    try {
      const { data } = await api.get('/mobiles');
      setMobiles(data);
    } catch (err) { console.error(err); }
  };

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    setUiError("");
    const cleanPhone = customerInfo.phone.trim();
    if (cleanPhone.length !== 10) return setUiError("Phone must be 10 digits.");

    try {
      // FIX: Ensure keys match backend expected fields
      const { data } = await api.post(`/mobiles/buy/${checkoutItem._id}`, { 
        customerName: customerInfo.name,
        customerPhone: cleanPhone,
        customerAddress: customerInfo.address 
      });
      
      setActiveReceipt(data.receipt);
      setCheckoutItem(null);
      setCustomerInfo({ name: '', phone: '', address: '' });
      fetchMobiles();
    } catch (err) { 
      setUiError(err.response?.data?.message || "Transaction failed"); 
    }
  };

  return (
    <div className="min-h-screen pt-44 pb-20 px-6 overflow-hidden">
      <div className="bg-gradient-mesh fixed inset-0 -z-10" />
      <Navbar onAddClick={() => setIsModalOpen(true)} />
      
      <main className="max-w-7xl mx-auto relative z-10 text-center">
        <div style={{ perspective: '1500px' }} className="mb-32">
          <h1 className="text-9xl font-black text-white tracking-tighter leading-none select-none">
            Secure <br />
            <span ref={textContainerRef} className="text-blue-500 inline-block min-w-[500px] origin-center mt-6 uppercase" style={{ textShadow: "0 0 40px rgba(59, 130, 246, 0.4)" }}>VAULT</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mobiles.map(m => (
            <MobileCard key={m._id} mobile={m} onDelete={(id) => api.delete(`/mobiles/${id}`).then(fetchMobiles)} onPurchase={setCheckoutItem} />
          ))}
        </div>

        {checkoutItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 text-left">
            <div className="apple-glass p-10 rounded-[3rem] max-w-md w-full border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">Retail Dispatch</h2>
              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                {uiError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-2xl text-center">{uiError}</div>}
                <input type="text" placeholder="Customer Name" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                <input type="tel" placeholder="10-Digit Phone" required maxLength="10" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-blue-500" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value.replace(/\D/g, '')})} />
                <textarea placeholder="Address" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none h-24 resize-none focus:border-blue-500" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black active:scale-95 transition-all shadow-xl">Finalize Sale</button>
                <button type="button" onClick={() => {setCheckoutItem(null); setUiError("");}} className="w-full text-slate-500 font-bold mt-2">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {activeReceipt && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <div className="apple-glass p-10 rounded-[3rem] max-w-sm w-full text-center border-white/20 shadow-2xl">
              <div className="text-emerald-500 text-5xl mb-4 italic font-black">PAID</div>
              <div className="bg-white/5 p-6 rounded-3xl mb-8 text-left space-y-2 text-[11px]">
                <div className="flex justify-between"><span>INV_ID</span><span className="text-white font-mono">{activeReceipt.receiptId}</span></div>
                <div className="flex justify-between bg-blue-500/10 p-4 rounded-xl mt-4 border border-blue-500/20 text-blue-400 font-bold uppercase">
                  <span>Guarantee Expiry</span><span>{new Date(activeReceipt.guaranteeUntil).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-emerald-400 pt-4 border-t border-white/10 mt-2"><span>TOTAL</span><span>₹{activeReceipt.pricePaid.toLocaleString()}</span></div>
              </div>
              <button onClick={() => setActiveReceipt(null)} className="w-full py-4 bg-white text-black rounded-2xl font-bold shadow-xl">Close</button>
            </div>
          </div>
        )}
      </main>

      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchMobiles} />
    </div>
  );
}
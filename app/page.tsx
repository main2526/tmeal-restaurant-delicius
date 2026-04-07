'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  ChevronRight, 
  Search, 
  Plus, 
  Minus, 
  X,
  Utensils,
  IceCream,
  Wine,
  Globe,
  CheckCircle2,
  Clock,
  ChefHat,
  History,
  Trash2,
  ArrowLeft,
  Coffee,
  Pizza,
  Leaf,
  Smile
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const WHATSAPP_NUMBER = "18494795388";
const RESTAURANT_NAME = "DELICIAS DE BÁVARO";

// --- INTERFACES ---
interface Category {
  id: string;
  name: { es: string; en: string };
  icon: React.ReactNode;
}

interface MenuItem {
  id: number;
  category: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  price: number;
  image: string;
}

interface CartItem extends MenuItem {
  qty: number;
}

interface OrderHistory {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  status: 'sent' | 'cooking' | 'ready';
}

// --- CATEGORÍAS ADAPTADAS AL MENÚ FÍSICO ---
const CATEGORIES: Category[] = [
  { id: 'entradas', name: { es: 'Entradas', en: 'Appetizers' }, icon: <Utensils size={18} /> },
  { id: 'ensaladas', name: { es: 'Ensaladas', en: 'Salads' }, icon: <Leaf size={18} /> },
  { id: 'comida_rapida', name: { es: 'Comida Rápida', en: 'Fast Food' }, icon: <Pizza size={18} /> },
  { id: 'principales', name: { es: 'Platos Fuertes', en: 'Main Courses' }, icon: <Utensils size={18} /> },
  { id: 'ninos', name: { es: 'Menú Niños', en: 'Kids Menu' }, icon: <Smile size={18} /> },
  { id: 'postres', name: { es: 'Postres', en: 'Desserts' }, icon: <IceCream size={18} /> },
  { id: 'bebidas', name: { es: 'Bebidas', en: 'Drinks' }, icon: <Coffee size={18} /> },
  { id: 'bar', name: { es: 'Bar & Cócteles', en: 'Bar & Cocktails' }, icon: <Wine size={18} /> }
];

// --- DATOS EXTRAÍDOS DE LAS FOTOS ---
const MENU_ITEMS: MenuItem[] = [
  // ENTRADAS
  {
    id: 1, category: 'entradas',
    name: { es: 'Croquetas de Pollo (6 unid.)', en: 'Chicken Croquettes (6 unit)' },
    description: { es: 'Deliciosas croquetas crujientes de pollo caseras.', en: 'Delicious crispy homemade chicken croquettes.' },
    price: 300, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 2, category: 'entradas',
    name: { es: 'Ceviche de Pescado', en: 'Fish Ceviche' },
    description: { es: 'Pescado fresco marinado al limón con especias.', en: 'Fresh fish marinated in lemon with spices.' },
    price: 550, image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 3, category: 'entradas',
    name: { es: 'Bolitas de Queso Mozzarella', en: 'Mozzarella Cheese Balls' },
    description: { es: '6 unidades de queso mozzarella empanizado y frito.', en: '6 units of breaded and fried mozzarella cheese.' },
    price: 300, image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 4, category: 'entradas',
    name: { es: 'Coctel de Camarones', en: 'Shrimp Cocktail' },
    description: { es: 'Camarones frescos con nuestra salsa especial de la casa.', en: 'Fresh shrimps with our special house sauce.' },
    price: 1100, image: 'https://images.unsplash.com/photo-1593685418041-d68a529e7118?q=80&w=500&auto=format&fit=crop'
  },

  // ENSALADAS
  {
    id: 5, category: 'ensaladas',
    name: { es: 'Ensalada César de Pollo', en: 'Chicken Caesar Salad' },
    description: { es: 'Lechuga fresca, crutones, parmesano y jugosa pechuga de pollo.', en: 'Fresh lettuce, croutons, parmesan and juicy chicken breast.' },
    price: 700, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 6, category: 'ensaladas',
    name: { es: 'Ensalada de Atún', en: 'Tuna Salad' },
    description: { es: 'Ensalada fresca con atún de primera calidad.', en: 'Fresh salad with premium quality tuna.' },
    price: 490, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop'
  },

  // COMIDA RÁPIDA (Sandwiches, Burgers, Tacos)
  {
    id: 7, category: 'comida_rapida',
    name: { es: 'Classic Beef Burger', en: 'Classic Beef Burger' },
    description: { es: 'Hamburguesa clásica de res con papas fritas.', en: 'Classic beef burger served with french fries.' },
    price: 350, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 8, category: 'comida_rapida',
    name: { es: 'Club Sandwich', en: 'Club Sandwich' },
    description: { es: 'Pan rebanado, jamón picnic, queso cheddar, pollo desmenuzado y papas.', en: 'Sliced bread, picnic ham, cheddar cheese, shredded chicken and fries.' },
    price: 425, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 9, category: 'comida_rapida',
    name: { es: 'Philly Cheese Sandwich', en: 'Philly Cheese Sandwich' },
    description: { es: 'Res, queso cheddar, ají morrón, cebolla y salsa china con papas.', en: 'Beef, cheddar, bell pepper, onion and chinese sauce with fries.' },
    price: 520, image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 10, category: 'comida_rapida',
    name: { es: 'Tacos de Res', en: 'Beef Tacos' },
    description: { es: 'Tacos tradicionales de res con tomate, cebolla y lechuga.', en: 'Traditional beef tacos with tomato, onion and lettuce.' },
    price: 180, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=500&auto=format&fit=crop'
  },

  // PLATOS FUERTES (Mofongo, Carnes, Mariscos, Pastas)
  {
    id: 11, category: 'principales',
    name: { es: 'Mofongo de Chicharrón y Mozzarella', en: 'Pork Crackling & Mozzarella Mofongo' },
    description: { es: 'Mofongo tradicional dominicano de plátano machacado.', en: 'Traditional Dominican mashed plantain mofongo.' },
    price: 950, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 12, category: 'principales',
    name: { es: 'Spaghetti a la Carbonara', en: 'Spaghetti Carbonara' },
    description: { es: 'Pasta en salsa blanca con tocineta y crema de leche.', en: 'Pasta in white sauce with bacon and milk cream.' },
    price: 750, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 13, category: 'principales',
    name: { es: 'Churrasco Angus (10 onzas)', en: 'Angus Churrasco (10 oz)' },
    description: { es: 'Corte premium al grill con salsa chimichurri.', en: 'Premium grilled cut with chimichurri sauce.' },
    price: 1800, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 14, category: 'principales',
    name: { es: 'Salmón Filet (8 onzas)', en: 'Salmon Fillet (8 oz)' },
    description: { es: 'Fresco filete de salmón preparado a su gusto.', en: 'Fresh salmon fillet prepared to your liking.' },
    price: 825, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 15, category: 'principales',
    name: { es: 'Yaroa de Pollo', en: 'Chicken Yaroa' },
    description: { es: 'Base de papas o plátano maduro con pollo y queso gratinado.', en: 'Fries or sweet plantain base with chicken and melted cheese.' },
    price: 700, image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 16, category: 'principales',
    name: { es: 'Pechuga de Pollo a la Plancha', en: 'Grilled Chicken Breast' },
    description: { es: 'Jugosa pechuga al grill acompañada de su guarnición preferida.', en: 'Juicy grilled breast accompanied by your favorite side.' },
    price: 600, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=500&auto=format&fit=crop'
  },

  // MENÚ NIÑOS
  {
    id: 17, category: 'ninos',
    name: { es: 'Nuggets de Pollo + Papas Fritas', en: 'Chicken Nuggets + French Fries' },
    description: { es: 'Crujientes nuggets de pechuga ideales para los más pequeños.', en: 'Crispy breast nuggets ideal for kids.' },
    price: 450, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 18, category: 'ninos',
    name: { es: 'Pancake Tradicional', en: 'Traditional Pancake' },
    description: { es: 'Pancakes suaves con sirope.', en: 'Soft pancakes with syrup.' },
    price: 220, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=500&auto=format&fit=crop'
  },

  // POSTRES
  {
    id: 19, category: 'postres',
    name: { es: 'Flan de Leche', en: 'Milk Flan' },
    description: { es: 'Postre casero tradicional dominicano.', en: 'Traditional homemade Dominican dessert.' },
    price: 200, image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a228bc?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 20, category: 'postres',
    name: { es: 'Pedazo de Bizcocho (Piece of cake)', en: 'Piece of Cake' },
    description: { es: 'Pregunte por la variedad del día.', en: 'Ask for the variety of the day.' },
    price: 250, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop'
  },

  // BEBIDAS (Sin Alcohol)
  {
    id: 21, category: 'bebidas',
    name: { es: 'Jugo de Chinola', en: 'Passion Fruit Juice' },
    description: { es: 'Jugo natural refrescante de chinola.', en: 'Refreshing natural passion fruit juice.' },
    price: 135, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 22, category: 'bebidas',
    name: { es: 'Batida de Fresa en Leche', en: 'Strawberry Shake with Milk' },
    description: { es: 'Batida cremosa de fresas frescas.', en: 'Creamy fresh strawberry shake.' },
    price: 220, image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 23, category: 'bebidas',
    name: { es: 'Limonada Frozen de Coco', en: 'Coconut Lemonade Smoothie' },
    description: { es: 'Nuestra mezcla especial de limón y coco.', en: 'Our special mix of lemon and coconut.' },
    price: 220, image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 24, category: 'bebidas',
    name: { es: 'Café Expreso Pequeño', en: 'Small Black Coffee' },
    description: { es: 'Para despertar tus sentidos.', en: 'To awaken your senses.' },
    price: 50, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=500&auto=format&fit=crop'
  },

  // BAR (Cócteles, Vinos y Cervezas)
  {
    id: 25, category: 'bar',
    name: { es: 'Piña Colada', en: 'Piña Colada' },
    description: { es: 'El clásico cóctel caribeño de piña, coco y ron.', en: 'The classic Caribbean cocktail of pineapple, coconut and rum.' },
    price: 500, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 26, category: 'bar',
    name: { es: 'Margarita', en: 'Margarita' },
    description: { es: 'Cóctel refrescante a base de tequila y limón.', en: 'Refreshing cocktail based on tequila and lemon.' },
    price: 500, image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 27, category: 'bar',
    name: { es: 'Cerveza Presidente', en: 'Presidente Beer' },
    description: { es: 'Cerveza pilsner dominicana, bien fría.', en: 'Dominican pilsner beer, very cold.' },
    price: 250, image: 'https://images.unsplash.com/photo-1614316311814-1e0388915b22?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 28, category: 'bar',
    name: { es: 'Copa de Vino (Glass of Wine)', en: 'Glass of Wine' },
    description: { es: 'Vino de la casa, pregunte a su mesero por las opciones.', en: 'House wine, ask your waiter for options.' },
    price: 400, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=500&auto=format&fit=crop'
  }
];

const UI_TEXT = {
  es: {
    welcome: 'Bienvenido a',
    mesa: 'Mesa',
    search: 'Busca tu plato favorito...',
    options: 'opciones',
    empty: 'No encontramos lo que buscas...',
    viewOrder: 'Ver mi orden',
    myCart: 'Mi Carrito',
    yourOrder: 'TU ORDEN',
    subtotal: 'Subtotal',
    total: 'Total Estimado',
    confirm: 'ENVIAR A COCINA',
    footer: 'Pago al finalizar en caja',
    history: 'Mi Historial',
    noOrders: 'Aún no has pedido nada',
    orderId: 'Pedido #',
    statusSent: 'Enviado',
    clearHistory: 'Limpiar Historial',
    added: '¡Añadido!',
    back: 'Atras'
  },
  en: {
    welcome: 'Welcome to',
    mesa: 'Table',
    search: 'Search for your favorite dish...',
    options: 'options',
    empty: 'No items found...',
    viewOrder: 'View my order',
    myCart: 'My Cart',
    yourOrder: 'YOUR ORDER',
    subtotal: 'Subtotal',
    total: 'Estimated Total',
    confirm: 'SEND TO KITCHEN',
    footer: 'Pay at the counter',
    history: 'Order History',
    noOrders: 'No orders yet',
    orderId: 'Order #',
    statusSent: 'Sent',
    clearHistory: 'Clear History',
    added: 'Added!',
    back: 'Back'
  }
};

export default function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [activeCategory, setActiveCategory] = useState<string>('principales');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mesa, setMesa] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  const t = UI_TEXT[lang];

  useEffect(() => {
    const savedCart = localStorage.getItem('delicias_cart');
    const savedHistory = localStorage.getItem('delicias_history');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const params = new URLSearchParams(window.location.search);
    if (params.get('mesa')) setMesa(params.get('mesa')!);
  }, []);

  useEffect(() => {
    localStorage.setItem('delicias_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('delicias_history', JSON.stringify(history));
  }, [history]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => 
      item.category === activeCategory && 
      item.name[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeCategory, searchQuery, lang]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return newQty === 0 ? null : { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const confirmOrder = () => {
    const newOrder: OrderHistory = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      timestamp: Date.now(),
      items: [...cart],
      total: cartTotal,
      status: 'sent'
    };

    setHistory(prev => [newOrder, ...prev]);
    
    let message = `*${RESTAURANT_NAME} - PEDIDO MESA ${mesa}*\n\n`;
    cart.forEach(item => message += `• ${item.qty}x ${item.name[lang]}\n`);
    message += `\n*TOTAL: RD$ ${cartTotal.toLocaleString()}*`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    setCart([]);
    setIsCartOpen(false);
    setIsHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans selection:bg-red-100">
      
      {/* Toast Notification */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-black italic text-sm tracking-tighter flex items-center gap-2">
          <CheckCircle2 size={16} /> {t.added}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-6 py-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 bg-neutral-100 rounded-xl text-neutral-600 hover:text-red-600 transition-colors"
            >
              <History size={20} />
            </button>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">{t.welcome}</span>
              <h1 className="text-xl font-black italic tracking-tighter text-neutral-900 leading-none">
                DELICIAS <span className="text-red-600">DE BÁVARO</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 p-2 bg-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-tighter border border-neutral-200"
            >
              <Globe size={14} className="text-red-600" />
              {lang}
            </button>
            <div className="bg-neutral-900 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-neutral-200">
              {t.mesa} {mesa}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-32">
        {/* Search */}
        <section className="px-6 pt-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-red-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={t.search}
              className="w-full bg-white border-none shadow-sm rounded-3xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-8 overflow-x-auto no-scrollbar px-6 flex gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-105' 
                : 'bg-white text-neutral-400 border border-neutral-100'
              }`}
            >
              {cat.icon}
              {cat.name[lang]}
            </button>
          ))}
        </section>

        {/* Food List */}
        <section className="mt-10 px-6 space-y-4">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black tracking-tight capitalize italic">{CATEGORIES.find(c => c.id === activeCategory)?.name[lang]}</h2>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{filteredItems.length} {t.options}</span>
          </div>
          
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="flex bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 p-3 gap-4 group hover:shadow-md transition-all active:scale-[0.98]">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100">
                  <img src={item.image} alt={item.name[lang]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <h3 className="font-bold text-neutral-800 leading-tight">{item.name[lang]}</h3>
                    <p className="text-neutral-400 text-[11px] line-clamp-2 mt-1">{item.description[lang]}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-red-600 text-sm">RD$ {item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-neutral-900 text-white p-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-neutral-400 italic">
                    {t.empty}
                </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full px-6 max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-neutral-900 text-white p-5 rounded-[2.5rem] flex justify-between items-center shadow-2xl hover:bg-black transition-all group active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                {cartCount}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">{t.viewOrder}</p>
                <p className="font-bold text-lg leading-none italic">{t.myCart}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="text-xl font-black">RD$ {cartTotal.toLocaleString()}</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* MODAL: Carrito */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]" onClick={() => setIsCartOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[70] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black tracking-tighter italic uppercase">{t.yourOrder} <span className="text-red-600">.</span></h3>
              <button onClick={() => setIsCartOpen(false)} className="bg-neutral-100 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-neutral-50 pb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-800">{item.name[lang]}</h4>
                    <p className="text-xs text-red-600 font-bold">RD$ {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-neutral-50 px-4 py-2 rounded-2xl">
                    <button onClick={() => updateQty(item.id, -1)} className="text-neutral-400 hover:text-black">
                      <Minus size={18} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-neutral-400 hover:text-black">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-center text-xl font-black border-t border-neutral-100 pt-6">
                <span>{t.total}</span>
                <span className="text-red-600 font-black text-2xl">RD$ {cartTotal.toLocaleString()}</span>
              </div>
              <button onClick={confirmOrder} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-lg mt-4 shadow-xl shadow-red-100 active:scale-95 transition-transform flex items-center justify-center gap-3">
                <ChefHat /> {t.confirm}
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Historial */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-white z-[80] overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 bg-neutral-100 rounded-full">
                <ArrowLeft />
              </button>
              <h3 className="text-2xl font-black tracking-tighter italic uppercase">{t.history} <span className="text-red-600">.</span></h3>
              <button 
                onClick={() => { if(confirm('¿Limpiar historial?')) setHistory([]); }}
                className="text-neutral-400 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-32 opacity-30 italic">
                <History size={60} className="mx-auto mb-4" />
                <p>{t.noOrders}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {history.map(order => (
                  <div key={order.id} className="bg-neutral-50 rounded-[2rem] p-6 border border-neutral-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t.orderId}{order.id}</p>
                        <p className="text-xs text-neutral-500 font-medium">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                        <CheckCircle2 size={12} /> {t.statusSent}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-neutral-600"><span className="font-bold text-neutral-900">{item.qty}x</span> {item.name[lang]}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-dashed border-neutral-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase">{t.total}</span>
                      <span className="font-black text-lg">RD$ {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setIsHistoryOpen(false)}
              className="w-full mt-12 bg-neutral-900 text-white py-5 rounded-3xl font-black uppercase tracking-tighter"
            >
              { UI_TEXT[lang].back || 'Back'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
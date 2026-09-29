import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [cars, setCars] = useState([]);
  const [compareBasket, setCompareBasket] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState('EN');

  // ── Store Cart ──────────────────────────────────────────────────────────
  const [storeCart, setStoreCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('storeCart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('storeCart', JSON.stringify(storeCart));
  }, [storeCart]);

  const addToCart = (product, qty = 1) => {
    setStoreCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setStoreCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setStoreCart(prev => prev.map(i => i.id === productId ? { ...i, qty } : i));
  };

  const clearCart = () => setStoreCart([]);

  const cartCount = storeCart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = storeCart.reduce((sum, i) => sum + i.price * i.qty, 0);
  // ───────────────────────────────────────────────────────────────────────
  const { user, token, updateWishlistState } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const bodyClass = document.body.classList;
    if (theme === 'light') {
      bodyClass.add('light');
    } else {
      bodyClass.remove('light');
    }
  }, [theme]);

  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cars');
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (err) {
      console.error('Failed to fetch cars', err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleWishlist = async (carName) => {
    if (!token) {
      addNotification('Please log in to manage your wishlist', 'warning');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carId: carName })
      });
      if (res.ok) {
        const data = await res.json();
        updateWishlistState(data.wishlist);
        
        const isRemoving = user?.wishlist?.includes(carName);
        addNotification(
          isRemoving
            ? `Removed ${carName} from Wishlist`
            : `Added ${carName} to Wishlist`,
          'success'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCompare = (car) => {
    setCompareBasket(prev => {
      const exists = prev.find(c => c.name === car.name);
      if (exists) {
        addNotification(`Removed ${car.brand} ${car.name} from comparison`, 'info');
        return prev.filter(c => c.name !== car.name);
      }
      if (prev.length >= 4) {
        addNotification('You can compare a maximum of 4 vehicles', 'warning');
        return prev;
      }
      addNotification(`Added ${car.brand} ${car.name} to comparison`, 'success');
      return [...prev, car];
    });
  };

  const clearCompare = () => {
    setCompareBasket([]);
  };

  const addNotification = (text, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const addRecentlyViewed = (car) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(c => c.name !== car.name);
      return [car, ...filtered].slice(0, 5);
    });
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      cars,
      fetchCars,
      compareBasket,
      toggleCompare,
      clearCompare,
      toggleWishlist,
      notifications,
      addNotification,
      recentlyViewed,
      addRecentlyViewed,
      activeLanguage,
      setActiveLanguage,
      // cart
      storeCart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;

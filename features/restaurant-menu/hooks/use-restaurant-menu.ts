import { useEffect, useMemo, useState } from "react";

import { RESTAURANT_CONFIG } from "../config/restaurant";
import { categories } from "../data/categories";
import { menuItems } from "../data/menu-items";
import { uiText } from "../data/ui-text";
import { createOrder, createWhatsAppOrderUrl } from "../lib/order";
import type { CartItem, CategoryId, Language, MenuItem, OrderHistory } from "../types";

export function useRestaurantMenu() {
  const [language, setLanguage] = useState<Language>("es");
  const [activeCategory, setActiveCategory] = useState<CategoryId>(
    RESTAURANT_CONFIG.defaultCategory,
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [table, setTable] = useState<string>(RESTAURANT_CONFIG.defaultTable);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);

  const copy = uiText[language];
  const activeCategoryData = categories.find((category) => category.id === activeCategory);

  useEffect(() => {
    const savedCart = localStorage.getItem(RESTAURANT_CONFIG.storageKeys.cart);
    const savedHistory = localStorage.getItem(RESTAURANT_CONFIG.storageKeys.history);

    if (savedCart) {
      // Browser-only persisted state is loaded after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(savedCart));
    }

    if (savedHistory) {
      // Browser-only persisted state is loaded after hydration.
      setHistory(JSON.parse(savedHistory));
    }

    const tableFromQuery = new URLSearchParams(window.location.search).get("mesa");

    if (tableFromQuery) {
      // The table identifier comes from the current browser URL.
      setTable(tableFromQuery);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RESTAURANT_CONFIG.storageKeys.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(RESTAURANT_CONFIG.storageKeys.history, JSON.stringify(history));
  }, [history]);

  const filteredItems = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          item.category === activeCategory &&
          item.name[language].toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [activeCategory, language, searchQuery],
  );

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  function toggleLanguage() {
    setLanguage((currentLanguage) => (currentLanguage === "es" ? "en" : "es"));
  }

  function addToCart(item: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem,
        );
      }

      return [...currentCart, { ...item, qty: 1 }];
    });

    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2000);
  }

  function updateQuantity(itemId: number, change: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          const nextQuantity = Math.max(0, item.qty + change);
          return nextQuantity === 0 ? null : { ...item, qty: nextQuantity };
        })
        .filter((item): item is CartItem => item !== null),
    );
  }

  function confirmOrder() {
    const newOrder = createOrder({ items: cart, total: cartTotal });

    setHistory((currentHistory) => [newOrder, ...currentHistory]);
    window.open(
      createWhatsAppOrderUrl({
        items: cart,
        total: cartTotal,
        language,
        table,
      }),
      "_blank",
    );
    setCart([]);
    setIsCartOpen(false);
    setIsHistoryOpen(true);
  }

  return {
    activeCategory,
    activeCategoryData,
    addToCart,
    cart,
    cartCount,
    cartTotal,
    categories,
    confirmOrder,
    copy,
    filteredItems,
    history,
    isCartOpen,
    isHistoryOpen,
    language,
    searchQuery,
    setActiveCategory,
    setIsCartOpen,
    setIsHistoryOpen,
    setSearchQuery,
    setShowToast,
    setHistory,
    showToast,
    table,
    toggleLanguage,
    updateQuantity,
  };
}

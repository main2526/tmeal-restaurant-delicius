import { useEffect, useMemo, useState } from "react";

import { hasSupabasePublicConfig } from "@/lib/supabase/client";

import { RESTAURANT_CONFIG } from "../config/restaurant";
import { categories as defaultCategories } from "../data/categories";
import { menuItems as defaultMenuItems } from "../data/menu-items";
import { uiText } from "../data/ui-text";
import { createOrder, createWhatsAppOrderUrl } from "../lib/order";
import { fetchPublicCatalog } from "../lib/supabase-catalog";
import { submitRestaurantOrder } from "../lib/submit-order";
import type { CartItem, CategoryId, Language, MenuItem, OrderHistory } from "../types";

function parseStoredValue<T>(value: string | null, fallback: T) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

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
  const [catalogCategories, setCatalogCategories] = useState(defaultCategories);
  const [catalogItems, setCatalogItems] = useState(defaultMenuItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const copy = uiText[language];
  const activeCategoryData = catalogCategories.find(
    (category) => category.id === activeCategory,
  );

  useEffect(() => {
    const savedCart = parseStoredValue<CartItem[]>(
      localStorage.getItem(RESTAURANT_CONFIG.storageKeys.cart),
      [],
    );
    const savedHistory = parseStoredValue<OrderHistory[]>(
      localStorage.getItem(RESTAURANT_CONFIG.storageKeys.history),
      [],
    );

    // Browser-only persisted state is loaded after hydration.
    setCart(savedCart);
    setHistory(savedHistory);

    const tableFromQuery = new URLSearchParams(window.location.search).get("mesa");

    if (tableFromQuery) {
      // The table identifier comes from the current browser URL.
      setTable(tableFromQuery);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchPublicCatalog()
      .then((catalog) => {
        if (!catalog || !isMounted || catalog.categories.length === 0) {
          return;
        }

        setCatalogCategories(catalog.categories);
        setCatalogItems(catalog.menuItems);
        setActiveCategory((currentCategory) =>
          catalog.categories.some((category) => category.id === currentCategory)
            ? currentCategory
            : catalog.categories[0].id,
        );
      })
      .catch(() => {
        // The bundled catalog keeps the public menu usable if Supabase is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(RESTAURANT_CONFIG.storageKeys.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(RESTAURANT_CONFIG.storageKeys.history, JSON.stringify(history));
  }, [history]);

  const filteredItems = useMemo(
    () =>
      catalogItems.filter(
        (item) =>
          item.category === activeCategory &&
          item.name[language].toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [activeCategory, catalogItems, language, searchQuery],
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

  async function confirmOrder() {
    if (cart.length === 0 || isSubmitting) {
      return;
    }

    const whatsappUrl = createWhatsAppOrderUrl({
      items: cart,
      total: cartTotal,
      language,
      table,
    });
    const whatsappWindow = window.open("about:blank", "_blank");

    setIsSubmitting(true);
    setOrderError(null);

    try {
      if (hasSupabasePublicConfig()) {
        await submitRestaurantOrder({ items: cart, total: cartTotal, language, table });
      }

      const newOrder = createOrder({ items: cart, total: cartTotal });

      setHistory((currentHistory) => [newOrder, ...currentHistory]);

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, "_blank");
      }

      setCart([]);
      setIsCartOpen(false);
      setIsHistoryOpen(true);
    } catch (error) {
      whatsappWindow?.close();
      setOrderError(error instanceof Error ? error.message : copy.orderError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    activeCategory,
    activeCategoryData,
    addToCart,
    cart,
    cartCount,
    cartTotal,
    categories: catalogCategories,
    confirmOrder,
    copy,
    filteredItems,
    history,
    isCartOpen,
    isHistoryOpen,
    isSubmitting,
    language,
    orderError,
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

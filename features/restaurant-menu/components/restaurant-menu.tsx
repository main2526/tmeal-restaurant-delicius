"use client";

import { CartDrawer } from "./cart/cart-drawer";
import { FloatingCartButton } from "./cart/floating-cart-button";
import { AddedToast } from "./feedback/added-toast";
import { RestaurantHeader } from "./header/restaurant-header";
import { OrderHistoryPanel } from "./history/order-history-panel";
import { CategoryTabs } from "./menu/category-tabs";
import { MenuList } from "./menu/menu-list";
import { MenuSearch } from "./menu/menu-search";
import { useRestaurantMenu } from "../hooks/use-restaurant-menu";

export function RestaurantMenu() {
  const {
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
    setHistory,
    setIsCartOpen,
    setIsHistoryOpen,
    setSearchQuery,
    showToast,
    table,
    toggleLanguage,
    updateQuantity,
  } = useRestaurantMenu();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-neutral-900 selection:bg-red-100">
      <AddedToast message={copy.added} visible={showToast} />

      <RestaurantHeader
        copy={copy}
        language={language}
        table={table}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onToggleLanguage={toggleLanguage}
      />

      <main className="mx-auto max-w-2xl pb-32">
        <MenuSearch
          value={searchQuery}
          placeholder={copy.search}
          onChange={setSearchQuery}
        />
        <CategoryTabs
          activeCategory={activeCategory}
          categories={categories}
          language={language}
          onSelect={setActiveCategory}
        />
        <MenuList
          categoryName={activeCategoryData?.name[language] ?? ""}
          emptyMessage={copy.empty}
          items={filteredItems}
          language={language}
          optionsLabel={copy.options}
          onAdd={addToCart}
        />
      </main>

      <FloatingCartButton
        cartCount={cartCount}
        cartTotal={cartTotal}
        copy={copy}
        onOpen={() => setIsCartOpen(true)}
      />
      <CartDrawer
        cart={cart}
        cartTotal={cartTotal}
        copy={copy}
        isOpen={isCartOpen}
        language={language}
        onClose={() => setIsCartOpen(false)}
        onConfirm={confirmOrder}
        onQuantityChange={updateQuantity}
      />
      <OrderHistoryPanel
        copy={copy}
        history={history}
        isOpen={isHistoryOpen}
        language={language}
        onClear={() => setHistory([])}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}


import React, { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
  return JSON.parse(
    localStorage.getItem("shopstack-wishlist") || "[]"
  );
});

useEffect(() => {
  localStorage.setItem(
    "shopstack-wishlist",
    JSON.stringify(wishlist)
  );
}, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => String(item.id) === String(product.id))) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const isWishlisted = (id) =>
    wishlist.some((item) => String(item.id) === String(id));

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

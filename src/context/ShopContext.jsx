import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initialOrders, initialProfile, initialAddresses,
  initialWishlist, initialRecentlyViewed
} from "../data/accountData";

const ShopContext = createContext(null);
const load = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }) {
  const [orders, setOrders] = useState(() => load("ss_orders", initialOrders));
  const [profile, setProfile] = useState(() => load("ss_profile", initialProfile));
  const [addresses, setAddresses] = useState(() => load("ss_addresses", initialAddresses));
  const [wishlist, setWishlist] = useState(() => load("ss_wishlist", initialWishlist));
  const [recentlyViewed] = useState(() => load("ss_recent", initialRecentlyViewed));
  const [notifications, setNotifications] = useState(() => load("ss_notifications", [
    { id: 1, title: "Welcome to SHOPSTACK", message: "Your account is ready.", date: "Today", read: false },
    { id: 2, title: "Order update", message: "Your order SS1002 has been shipped.", date: "Today", read: false }
  ]));

  useEffect(() => localStorage.setItem("ss_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("ss_profile", JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem("ss_addresses", JSON.stringify(addresses)), [addresses]);
  useEffect(() => localStorage.setItem("ss_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("ss_notifications", JSON.stringify(notifications)), [notifications]);

  const value = {
    orders, setOrders, profile, setProfile, addresses, setAddresses,
    wishlist, setWishlist, recentlyViewed, notifications, setNotifications
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
};

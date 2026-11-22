export const initialOrders = [
  {
    id: "SS1001",
    date: "10 Nov 2026",
    total: 2499,
    status: "Delivered",
    expected: "Delivered on 12 Nov 2026",
    items: [{ name: "Wireless Headphones", price: 2499, quantity: 1, emoji: "🎧" }]
  },
  {
    id: "SS1002",
    date: "11 Nov 2026",
    total: 3999,
    status: "Shipped",
    expected: "Expected on 15 Nov 2026",
    items: [{ name: "Smart Watch", price: 3999, quantity: 1, emoji: "⌚" }]
  },
  {
    id: "SS1003",
    date: "12 Nov 2026",
    total: 1799,
    status: "Processing",
    expected: "Preparing your order",
    items: [{ name: "Running Shoes", price: 1799, quantity: 1, emoji: "👟" }]
  }
];

export const initialProfile = {
  name: "Shopstack User",
  email: "customer@gmail.com",
  phone: "",
};

export const initialAddresses = [
  {
    id: 1,
    name: "Shopstack User",
    phone: "",
    line: "Add your delivery address",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    isDefault: true
  }
];

export const initialWishlist = [
  { id: 1, name: "Eco-friendly Water Bottle", price: 499, emoji: "🥤" },
  { id: 2, name: "Organic Cotton Tote Bag", price: 699, emoji: "👜" }
];

export const initialRecentlyViewed = [
  { id: 1, name: "Wireless Headphones", price: 2499, emoji: "🎧" },
  { id: 2, name: "Smart Watch", price: 3999, emoji: "⌚" },
  { id: 3, name: "Running Shoes", price: 1799, emoji: "👟" }
];


const PRODUCT_KEY = "products";
const ORDER_KEY = "orders";
const PROFILE_KEY = "vendorProfile";

export function readData(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getVendorId(user, profile) {
  return user?.uid || profile?.uid || "demo-vendor";
}

export function getVendorProducts(vendorId) {
  return readData(PRODUCT_KEY).filter(
    item => !item.vendorId || item.vendorId === vendorId
  );
}

export function getVendorOrders(vendorId) {
  return readData(ORDER_KEY).filter(
    item => !item.vendorId || item.vendorId === vendorId
  );
}

export function saveProduct(product) {
  const products = readData(PRODUCT_KEY);
  saveData(PRODUCT_KEY, [...products, product]);
}

export function updateProduct(id, updates) {
  const products = readData(PRODUCT_KEY).map(product =>
    product.id === id ? { ...product, ...updates } : product
  );

  saveData(PRODUCT_KEY, products);
}

export function deleteProduct(id) {
  const products = readData(PRODUCT_KEY).filter(
    product => product.id !== id
  );

  saveData(PRODUCT_KEY, products);
}

export function updateOrderStatus(id, status) {
  const orders = readData(ORDER_KEY).map(order =>
    order.id === id ? { ...order, status } : order
  );

  saveData(ORDER_KEY, orders);
}

export function saveVendorProfile(profile) {
  saveData(PROFILE_KEY, profile);
}

export function getVendorProfile() {
  return readData(PROFILE_KEY, {});
}


import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CompareContext = createContext(null);

const STORAGE_KEY = "shopstack-compare";
const MAX_COMPARE = 4;

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      return Array.isArray(saved)
        ? saved.slice(0, MAX_COMPARE)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(compareItems)
    );
  }, [compareItems]);

  function addToCompare(product) {
    if (!product || product.id == null) {
      return { success: false, message: "Invalid product." };
    }

    const exists = compareItems.some(
      (item) => String(item.id) === String(product.id)
    );

    if (exists) {
      return {
        success: false,
        message: "Product already added."
      };
    }

    if (compareItems.length >= MAX_COMPARE) {
      return {
        success: false,
        message: "You can compare up to 4 products."
      };
    }

    setCompareItems((prev) => [...prev, product]);

    return {
      success: true,
      message: "Product added for comparison!"
    };
  }

  function removeFromCompare(id) {
    setCompareItems((prev) =>
      prev.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  }

  function clearCompare() {
    setCompareItems([]);
  }

  function isInCompare(id) {
    return compareItems.some(
      (item) => String(item.id) === String(id)
    );
  }

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareItems.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error(
      "useCompare must be used inside CompareProvider"
    );
  }

  return context;
}

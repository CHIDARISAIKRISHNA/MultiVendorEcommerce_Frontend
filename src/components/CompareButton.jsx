
import React from "react";
import { useCompare } from "../context/CompareContext";
import "./Compare.css";

function CompareButton({ product }) {
  const {
    addToCompare,
    removeFromCompare,
    isInCompare
  } = useCompare();

  const active = isInCompare(product.id);

  function handleCompare(e) {
    e.preventDefault();
    e.stopPropagation();

    if (active) {
      removeFromCompare(product.id);
      return;
    }

    const result = addToCompare(product);

    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <button
      type="button"
      className={`compare-btn ${active ? "selected" : ""}`}
      onClick={handleCompare}
      title={active ? "Remove from comparison" : "Compare product"}
    >
      {active ? "✓ Added" : "⇄ Compare"}
    </button>
  );
}

export default CompareButton;

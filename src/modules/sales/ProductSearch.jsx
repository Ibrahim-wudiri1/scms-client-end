import { useState, useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";

export default function ProductSearch({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosClient.get(`/products?search=${query}`);
        const productData = Array.isArray(res.data) ? res.data : res.data?.products || [];
        setResults(productData);
        
        if (productData.length === 0) {
          setError("No products found matching your search");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search products. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query]);

  const handleSelectProduct = (product) => {
    onAdd(product);
    setQuery("");
    setResults([]);
    setError("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full mb-4 relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search product by name or SKU... (min 2 chars)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {loading && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow p-4 z-10">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      )}

      {error && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 mt-1 bg-yellow-50 border border-yellow-200 rounded shadow p-3 z-10">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 max-h-64 overflow-y-auto z-10">
          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              className="block w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition focus:outline-none focus:bg-blue-50"
              onClick={() => handleSelectProduct(product)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  {product.sku && (
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>
                <div className="ml-2 text-right">
                  <p className="font-semibold text-green-600">₦{product.sellingPrice?.toFixed(2) || "0.00"}</p>
                  {product.inventory?.currentQty !== undefined && (
                    <p className="text-xs text-gray-500">Stock: {product.inventory.currentQty}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

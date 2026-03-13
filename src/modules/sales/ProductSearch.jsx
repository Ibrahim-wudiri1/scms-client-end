import { useState, useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";

export default function ProductSearch({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        const res = await axiosClient.get(`/products?search=${query}`);
        setResults(res.data);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search product by name or SKU..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full text-lg"
      />
      {results.length > 0 && (
        <div className="absolute bg-white border rounded shadow mt-1 w-full max-h-64 overflow-y-auto z-10">
          {results.map((p) => (
            <button
              key={p.id}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onAdd(p);
                setQuery("");
                setResults([]);
                inputRef.current?.focus();
              }}
            >
              {p.name} - ${p.sellingPrice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

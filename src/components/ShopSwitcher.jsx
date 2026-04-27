import { useShop } from "../context/ShopContext";

export default function ShopSwitcher() {
  const { shops, activeShop, switchShop } = useShop();

  if (!activeShop) return null;

  return (
    <select
      value={activeShop.id}
      onChange={(e) => {
        const shop = shops.find((s) => s.id === e.target.value);
        switchShop(shop);
        window.location.reload(); // simple + safe
      }}
      className="border rounded px-2 py-1 text-sm bg-white"
    >
      {shops.map((shop) => (
        <option key={shop.id} value={shop.id}>
          {shop.name}
        </option>
      ))}
    </select>
  );
}

import { useTenant } from "../context/TenantContext";

export default function TenantSwitcher({ tenants }) {
  const { tenant} = useTenant();

  return (
    <select
      value={tenant?.id || ""}
      onChange={(e) => {
        const selected = tenants.find((t) => t.id === e.target.value);
        switchTenant(selected);
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="">Select Shop</option>
      {tenants.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

import { useEffect, useState } from "react";
import { customerApi } from "../../api/customerApi";
import CustomerForm from "./CustomerForm";
import CustomerCard from "./CustomerCard";
import { Plus } from "lucide-react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCustomers = async () => {
    const data = await customerApi.getAll();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async (data) => {
    if (selected) {
      await customerApi.update(selected.id, data);
    } else {
      await customerApi.create(data);
    }
    setShowForm(false);
    setSelected(null);
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this customer?")) {
      await customerApi.remove(id);
      fetchCustomers();
    }
  };

    return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-dark">Customers</h1>
        <button
          className="flex items-center gap-2 btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(c);
                      setShowForm(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid md:hidden gap-3">
        {customers.map((c) => (
          <CustomerCard
            key={c.id}
            customer={c}
            onEdit={(cust) => {
              setSelected(cust);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <CustomerForm
          customer={selected}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}


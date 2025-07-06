import { useServices } from '../context/ServicesContext';
import { useState } from 'react';

export default function ServicesEditor() {
  const { services, setServices } = useServices();
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  function addService() {
    if (!newServiceName || !newServicePrice) return;
    const newService = {
      id: Date.now(),
      name: newServiceName,
      price: parseFloat(newServicePrice),
    };
    setServices([...services, newService]);
    setNewServiceName('');
    setNewServicePrice('');
  }

  function updateService(id, key, value) {
    setServices(
      services.map(s =>
        s.id === id ? { ...s, [key]: key === 'price' ? parseFloat(value) : value } : s
      )
    );
  }

  function deleteService(id) {
    setServices(services.filter(s => s.id !== id));
  }

  return (
    <div className="admin-container">
      <h2>Manage Services</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(({ id, name, price }) => (
              <tr key={id}>
                <td>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateService(id, 'name', e.target.value)}
                    className="admin-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => updateService(id, 'price', e.target.value)}
                    className="admin-input"
                  />
                </td>
                <td>
                  <button className="admin-cancel-button" onClick={() => deleteService(id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  placeholder="New service name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="admin-input"
                />
              </td>
              <td>
                <input
                  placeholder="Price"
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="admin-input"
                />
              </td>
              <td>
                <button className="admin-button" onClick={addService}>
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

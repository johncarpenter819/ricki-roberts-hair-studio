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
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Manage Services</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#a77b5a', color: 'white' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Service Name</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Price ($)</th>
            <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(({ id, name, price }) => (
            <tr key={id}>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateService(id, 'name', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => updateService(id, 'price', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                <button
                  onClick={() => deleteService(id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
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
                style={{ width: '100%' }}
              />
            </td>
            <td>
              <input
                placeholder="Price"
                type="number"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <td>
              <button
                onClick={addService}
                style={{
                  backgroundColor: '#4b7bec',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

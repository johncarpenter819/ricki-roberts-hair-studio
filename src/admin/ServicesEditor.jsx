import { useServices } from '../context/ServicesContext';
import { useState } from 'react';

export default function ServicesEditor() {
  const { services, setServices } = useServices();
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');

  function addService() {
    if (!newServiceName || !newServicePrice || !newServiceCategory || !newServiceDuration) return;
    const newService = {
      id: Date.now(),
      name: newServiceName,
      price: parseFloat(newServicePrice),
      category: newServiceCategory,
      duration: newServiceDuration,
      description: newServiceDescription,
    };
    setServices([...services, newService]);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceCategory('');
    setNewServiceDuration('');
    setNewServiceDescription('');
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
              <th>Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price ($)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(({ id, name, price, category, duration, description }) => (
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
                    type="text"
                    value={category}
                    onChange={(e) => updateService(id, 'category', e.target.value)}
                    className="admin-input"
                    placeholder="e.g., Haircut"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => updateService(id, 'duration', e.target.value)}
                    className="admin-input"
                    placeholder="e.g., 30 min"
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
                  <textarea
                    value={description || ''}
                    onChange={(e) => updateService(id, 'description', e.target.value)}
                    className="admin-input"
                    placeholder="Service description"
                    rows={2}
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
                  placeholder="Category"
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="admin-input"
                />
              </td>
              <td>
                <input
                  placeholder="Duration"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
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
                <textarea
                  placeholder="New service description"
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  className="admin-input"
                  rows={2}
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
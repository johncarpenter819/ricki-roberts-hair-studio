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
    <div className="services-editor-container"> {/* Changed from admin-container */}
      <h2>Manage Services</h2>
      <div className="services-table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) =>
                      updateService(service.id, 'name', e.target.value)
                    }
                    className="admin-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={service.category}
                    onChange={(e) =>
                      updateService(service.id, 'category', e.target.value)
                    }
                    className="admin-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) =>
                      updateService(service.id, 'duration', e.target.value)
                    }
                    className="admin-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) =>
                      updateService(service.id, 'price', e.target.value)
                    }
                    className="admin-input"
                  />
                </td>
                <td>
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      updateService(service.id, 'description', e.target.value)
                    }
                    className="admin-input"
                    rows={2}
                  />
                </td>
                <td>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="services-editor-delete-button"
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
                <button className="services-editor-add-button" onClick={addService}> {/* Changed from admin-button */}
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
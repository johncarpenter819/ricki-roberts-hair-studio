import { useState } from 'react';

const mockAppointments = [
  {
    id: 1,
    name: 'Sarah Johnson',
    service: 'Haircut',
    date: '2025-07-05',
    time: '10:00 AM',
    phone: '555-1234',
    status: 'Confirmed',
  },
  {
    id: 2,
    name: 'Michael Lee',
    service: 'Color',
    date: '2025-07-06',
    time: '2:00 PM',
    phone: '555-5678',
    status: 'Confirmed',
  },
  {
    id: 3,
    name: 'Emma Davis',
    service: 'Styling',
    date: '2025-07-06',
    time: '4:00 PM',
    phone: '555-9876',
    status: 'Confirmed',
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filterDate, setFilterDate] = useState('');

  // Filter appointments by selected date
  const filteredAppointments = filterDate
    ? appointments.filter((appt) => appt.date === filterDate)
    : appointments;

  // Cancel an appointment by id
  function cancelAppointment(id) {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: 'Cancelled' } : appt
        )
      );
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Appointments Management</h2>

      <label htmlFor="filterDate">Filter by Date: </label>
      <input
        type="date"
        id="filterDate"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.3rem' }}
      />

      {filteredAppointments.length === 0 ? (
        <p>No appointments found for this date.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#a77b5a', color: 'white' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Name
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Service
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Date
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Time
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Phone
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Status
              </th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr
                key={appt.id}
                style={{
                  backgroundColor:
                    appt.status === 'Cancelled' ? '#f8d7da' : 'transparent',
                }}
              >
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.name}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.service}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.date}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.time}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.phone}
                </td>
                <td
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    color:
                      appt.status === 'Cancelled' ? '#721c24' : '#155724',
                    fontWeight: '600',
                  }}
                >
                  {appt.status}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
                  {appt.status !== 'Cancelled' && (
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      style={{
                        padding: '0.3rem 0.7rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

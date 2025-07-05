import { useState } from 'react';
import { useAppointments } from '../context/AppointmentsContext';

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year}`;
}

export default function Appointments() {
  const { appointments, setAppointments } = useAppointments();
  const [filterDate, setFilterDate] = useState('');

  // Always exclude cancelled, then filter by date if filterDate is set
  const filteredAppointments = appointments
    .filter((appt) => appt.status !== 'Cancelled')
    .filter((appt) => (filterDate ? appt.date === filterDate : true));

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
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Service</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Date</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Time</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Phone</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Status</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt.id}>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{appt.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{appt.service}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{formatDate(appt.date)}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{appt.time}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>{appt.phone}</td>
                <td
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    color: '#155724',
                    fontWeight: '600',
                  }}
                >
                  {appt.status}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ccc' }}>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

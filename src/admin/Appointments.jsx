import { useState } from 'react';
import { useAppointments } from '../context/AppointmentsContext';
import '../styles/Appointments.css'; // Assuming this imports AdminPortal.css or similar

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year}`;
}

export default function Appointments() {
  const { appointments, setAppointments } = useAppointments();
  const [filterDate, setFilterDate] = useState('');

  const filteredAppointments = appointments
    .filter((appt) => appt.status !== 'Cancelled')
    .filter((appt) => (filterDate ? appt.date === filterDate : true));

  const confirmedAppointments = filteredAppointments.filter(
    (appt) => appt.status === 'Confirmed'
  );

  function cancelAppointment(id) {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: 'Cancelled' } : appt
        )
      );
    }
  }

  function exportToCSV() {
    const headers = [
      'Name',
      'Email',
      'Subscribed',
      'Service',
      'Stylist',
      'Date',
      'Time',
      'Phone',
      'Status',
    ];

    const rows = filteredAppointments.map((appt) => [
      appt.name,
      appt.email || '',
      appt.subscribe ? 'Yes' : 'No',
      appt.service,
      appt.stylist || '',
      formatDate(appt.date),
      appt.time,
      appt.phone,
      appt.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'appointments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>

      <div className="admin-toolbar">
        <label>
          Filter by Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="admin-input"
          />
        </label>
        <button onClick={exportToCSV} className="primary-action-button">
          Export to CSV
        </button>
      </div>

      <div className="admin-counts">
        <p>Total Appointments: {filteredAppointments.length}</p>
        <p>Confirmed: {confirmedAppointments.length}</p>
        <p>Pending: {filteredAppointments.length - confirmedAppointments.length}</p>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found for this date.</p>
      ) : (
        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.name}</td>
                  <td>{appt.email || '—'}</td>
                  <td>{appt.subscribe ? '✅ Yes' : '❌ No'}</td>
                  <td>{appt.service}</td>
                  <td>{appt.stylist || '—'}</td>
                  <td>{formatDate(appt.date)}</td>
                  <td>{appt.time}</td>
                  <td>{appt.phone}</td>
                  <td className="status-cell">{appt.status}</td>
                  <td>
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      className="danger-action-button"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
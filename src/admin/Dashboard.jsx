import { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentsContext";
import '../styles/Dashboard.css';

function isToday(dateStr) {
  const today = new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-based

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export default function Dashboard() {
  const { appointments } = useAppointments();
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    const todayAppts = appointments.filter(
      (appt) => isToday(appt.date) && appt.status !== "Cancelled"
    );
    setTodaysAppointments(todayAppts);
  }, [appointments]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Here is a quick overview of today’s appointments.</p>

      {todaysAppointments.length === 0 ? (
        <p>No appointments scheduled for today.</p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr><th>Name</th><th>Stylist</th><th>Service</th><th>Time</th></tr>
          </thead>
          <tbody>
            {todaysAppointments.map(({ id, name, stylist, service, time }) => (
              <tr key={id}><td>{name}</td><td>{stylist || '—'}</td><td>{service}</td><td>{time}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

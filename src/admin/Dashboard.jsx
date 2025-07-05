import { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentsContext";

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
  const { appointments } = useAppointments(); // ✅ use context
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    // Only show non-cancelled appointments for today
    const todayAppts = appointments.filter(
      (appt) => isToday(appt.date) && appt.status !== "Cancelled"
    );
    setTodaysAppointments(todayAppts);
  }, [appointments]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Here is a quick overview of today’s appointments.</p>

      {todaysAppointments.length === 0 ? (
        <p>No appointments scheduled for today.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#a77b5a", color: "white" }}>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Name</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Service</th>
              <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {todaysAppointments.map(({ id, name, service, time }) => (
              <tr key={id}>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{name}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{service}</td>
                <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

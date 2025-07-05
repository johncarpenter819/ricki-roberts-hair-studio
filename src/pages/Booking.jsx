import { useState, useEffect } from 'react';
import { useServices } from '../context/ServicesContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useTeam } from '../context/TeamContext';

function formatTimeTo12Hour(time24) {
  const [hour, minute] = time24.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
}

export default function Booking() {
  const { services } = useServices();
  const { appointments, setAppointments } = useAppointments();
  const { team } = useTeam();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: '',
    stylistId: '',
    date: '',
    time: '',
    subscribe: false,
  });

  // Load appointments from localStorage once on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, [setAppointments]);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedService = services.find((s) => s.id === parseInt(form.serviceId));
    const selectedStylist = team.find((t) => t.id === parseInt(form.stylistId));

    if (!selectedService) {
      alert('Please select a valid service.');
      return;
    }

    if (!selectedStylist) {
      alert('Please select a stylist.');
      return;
    }

    const newAppointment = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: selectedService.name,
      stylist: selectedStylist.name,
      date: form.date,
      time: formatTimeTo12Hour(form.time),
      status: 'Confirmed',
      subscribe: form.subscribe,
    };

    setAppointments([...appointments, newAppointment]);

    alert(`Thank you, ${form.name}! Your ${selectedService.name} with ${selectedStylist.name} is booked.`);

    setForm({
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      stylistId: '',
      date: '',
      time: '',
      subscribe: false,
    });
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '3rem auto',
        padding: '2rem',
        backgroundColor: '#f7f3ef',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ color: '#4b3b2b', textAlign: 'center', marginBottom: '1.5rem' }}>
        Book an Appointment
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Phone Number
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Service
          <select name="serviceId" value={form.serviceId} onChange={handleChange} required style={inputStyle}>
            <option value="">Select a Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ${s.price.toFixed(2)}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Stylist
          <select name="stylistId" value={form.stylistId} onChange={handleChange} required style={inputStyle}>
            <option value="">Select a Stylist</option>
            {team.map((stylist) => (
              <option key={stylist.id} value={stylist.id}>
                {stylist.name}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Time
          <input type="time" name="time" value={form.time} onChange={handleChange} required style={inputStyle} />
        </label>

        {/* Newsletter Subscription Checkbox */}
        <label style={{ ...labelStyle, flexDirection: 'row', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="subscribe"
            checked={form.subscribe}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
          />
          I’d like to receive newsletters, discounts, or service updates.
        </label>

        <button type="submit" style={buttonStyle}>
          Book Now
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '0.6rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  marginTop: '0.3rem',
};

const labelStyle = {
  color: '#4b3b2b',
  fontWeight: '600',
  display: 'flex',
  flexDirection: 'column',
};

const buttonStyle = {
  padding: '0.75rem',
  backgroundColor: '#a77b5a',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'background-color 0.3s',
};

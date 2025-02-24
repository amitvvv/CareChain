import React, { useEffect, useState } from "react";
import { getUserDetails, getAppointmentsByPatient, cancelAppointment } from "../../api/api";
import logo from "../../assets/CareChain.png"; // ייבוא הלוגו

const PatientAppointments = () => {
    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState("");

    // Fetch the details of the logged-in patient
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await getUserDetails();
                setPatientId(response.data.idNumber);
                setPatientName(`${response.data.firstName} ${response.data.lastName}`);
                fetchAppointments(response.data.idNumber);
            } catch (err) {
                setError("Failed to fetch patient details.");
            }
        };
        fetchPatientDetails();
    }, []);

    // Fetch appointments for the logged-in patient
    const fetchAppointments = async (patientId) => {
        try {
            const response = await getAppointmentsByPatient(patientId);
            setAppointments(response);
        } catch (err) {
            setError("Failed to load appointments.");
        }
    };

    // Cancel an appointment
    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await cancelAppointment(appointmentId);
                alert("Appointment canceled.");
                fetchAppointments(patientId);
            } catch (err) {
                setError("Failed to cancel appointment.");
            }
        }
    };

    return (
        <div className="appointments-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h1>Appointments for {patientName}</h1>
            {error && <p className="error-message">{error}</p>}

            <table>
                <thead>
                <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                        <td>{appointment.doctorName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.description}</td>
                        <td>{appointment.canceled ? "Canceled" : "Active"}</td>
                        <td>
                            {!appointment.canceled && (
                                <button onClick={() => handleCancelAppointment(appointment._id)}>
                                    Cancel
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="back-button" onClick={() => window.history.back()}>Back</button>
        </div>
    );
};

export default PatientAppointments;
import React, { useEffect, useState } from "react";
import { getUserDetails, getUserById, createAppointment, getAppointmentsByDoctor, toggleAppointmentStatus } from "../../api/api";
import "./DoctorsAppointments.css";
import logo from "../../assets/CareChain.png";


const DoctorsAppointments = () => {
    const [doctorName, setDoctorName] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        patientId: "",
        date: "",
        time: "",
        description: "",
        canceled: false
    });
    const [patientName, setPatientName] = useState(null);
    const [error, setError] = useState("");
    const [showNewAppointmentPopup, setShowNewAppointmentPopup] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await getUserDetails();
                setDoctorId(response.data.idNumber);
                setDoctorName(`${response.data.firstName} ${response.data.lastName}`);
                fetchAppointments(response.data.idNumber);
            } catch (err) {
                setError("Failed to fetch doctor details.");
            }
        };
        fetchDoctorDetails();
    }, []);

    const fetchAppointments = async (doctorId) => {
        try {
            const response = await getAppointmentsByDoctor(doctorId);
            const appointmentsWithNames = await Promise.all(
                response.map(async (appointment) => {
                    try {
                        const patient = await getUserById(appointment.patientId);
                        return {
                            ...appointment,
                            patientName: `${patient.firstName} ${patient.lastName}`
                        };
                    } catch {
                        return {
                            ...appointment,
                            patientName: "Unknown"
                        };
                    }
                })
            );
            appointmentsWithNames.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
            setAppointments(appointmentsWithNames);
        } catch (err) {
            setError("Failed to load appointments.");
        }
    };

    const handlePatientIdValidation = async () => {
        try {
            const response = await getUserById(newAppointment.patientId);
            setPatientName(`${response.firstName} ${response.lastName}`);
        } catch {
            setError("Patient not found.");
            setPatientName(null);
        }
    };

    const handleCreateAppointment = async () => {
        if (!patientName) {
            setError("Please verify a valid patient ID first.");
            return;
        }
        try {
            await createAppointment({
                doctorId,
                ...newAppointment,
                canceled: false
            });
            alert("Appointment created successfully.");
            setShowNewAppointmentPopup(false);
            resetNewAppointment();
            fetchAppointments(doctorId);
        } catch (err) {
            setError("Failed to create appointment.");
        }
    };

    const resetNewAppointment = () => {
        setNewAppointment({
            patientId: "",
            date: "",
            time: "",
            description: "",
            canceled: false
        });
        setPatientName(null);
        setError("");
    };

    const handleToggleAppointmentStatus = async (appointmentId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await toggleAppointmentStatus(appointmentId, newStatus);
            alert(`Appointment ${newStatus ? "canceled" : "activated"} successfully.`);
            fetchAppointments(doctorId);
        } catch (err) {
            setError("Failed to toggle appointment status.");
        }
    };

    const now = new Date();
    const activeAppointments = appointments.filter(
        (appointment) => !appointment.canceled && new Date(`${appointment.date} ${appointment.time}`) > now
    );
    const canceledOrExpiredAppointments = appointments.filter(
        (appointment) => appointment.canceled || new Date(`${appointment.date} ${appointment.time}`) <= now
    );

    return (
        <div className="appointments-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h1>Appointments for Dr. {doctorName}</h1>
            {error && <p className="error-message">{error}</p>}

            <button onClick={() => setShowNewAppointmentPopup(true)} className="popup-button">
                ➕ Create New Appointment
            </button>

            <h2>Active Appointments</h2>
            <table>
                <thead>
                <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {activeAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                        <td>{appointment.patientId}</td>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.description}</td>
                        <td>
                            <button
                                onClick={() => handleToggleAppointmentStatus(appointment._id, appointment.canceled)}>
                                {appointment.canceled ? "Activate" : "Cancel"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Canceled or Expired Appointments</h2>
            <table>
                <thead>
                <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {canceledOrExpiredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                        <td>{appointment.patientId}</td>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.description}</td>
                        <td>
                            <button
                                onClick={() => handleToggleAppointmentStatus(appointment._id, appointment.canceled)}>
                                {appointment.canceled ? "Activate" : "Cancel"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showNewAppointmentPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Create New Appointment</h2>
                        <div>
                            <input
                                type="text"
                                placeholder="Patient ID"
                                value={newAppointment.patientId}
                                onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                            />
                            <button className="verify-button" onClick={handlePatientIdValidation}>Verify</button>
                           {!patientName &&  <button className="cancel-button" onClick={() => {
                                setNewAppointment({...newAppointment, patientId: ""});
                                setPatientName(null);
                                setError("");
                                setShowNewAppointmentPopup(false);
                            }}>Cancel
                            </button>}
                        </div>
                        {patientName && <p>Patient: {patientName}</p>}

                        {patientName && (
                            <>
                                <input
                                    type="date"
                                    value={newAppointment.date}
                                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                                />
                                <input
                                    type="time"
                                    value={newAppointment.time}
                                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={newAppointment.description}
                                    onChange={(e) => setNewAppointment({
                                        ...newAppointment,
                                        description: e.target.value
                                    })}
                                ></textarea>
                                <div>
                                    <button
                                        className="create-button"
                                        onClick={handleCreateAppointment}
                                        disabled={!patientName || !newAppointment.date || !newAppointment.time || !newAppointment.description}
                                    >
                                        Create
                                    </button>

                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            resetNewAppointment();
                                            setShowNewAppointmentPopup(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <button className="back-button" onClick={() => window.history.back()}>
                Back
            </button>
        </div>
    );
};

export default DoctorsAppointments;
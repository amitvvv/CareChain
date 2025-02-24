import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyToken from "./pages/VerifyToken";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/Patient/UserDashboard";
import PatientContracts from "./pages/Patient/PatientContracts";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorContracts from "./pages/Doctor/DoctorContracts";
import MyProfile from "./pages/MyProfile"; 
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ViewContractsAdmin from "./pages/Admin/ViewMedicalContracts";
import DoctorsAppointments from "./pages/Doctor/DoctorsAppointments";
import PatientAppointments from "./pages/Patient/PatientAppointments";
import AdminSupport from "./pages/Admin/ViewSupportReq";

const App = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://localhost/auth-check", {
                    method: "GET",
                    credentials: "include", 
                });

                if (response.status !== 200) {
                    throw new Error("Not authenticated");
                }
                const data = await response.json(); 
                setUserType(data.userType);
                console.log("User Type:", data.userType);
                console.log("authenticated");

            } catch (error) {
                console.log("User not authenticated");
            }
        };

        checkAuth();
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-token" element={<VerifyToken />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {userType === 0 && // IF ADMIN
                        <>
                            <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/user-management" element={<UserManagement />} />
                            <Route path="/view-contracts" element={< ViewContractsAdmin/>} />
                            <Route path="/admin/support-requests" element={< AdminSupport/>} />
                        </>
                    }

                    {userType === 1 && // IF DOCTOR
                        <>
                            <Route path="/dashboard" element={<DoctorDashboard />} />
                            <Route path="/contracts" element={<DoctorContracts />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/appointments" element={<DoctorsAppointments />} />
                        </>
                    }

                    {userType === 2 && // IF PATIENT
                        <>
                            <Route path="/dashboard" element={<UserDashboard />} />
                            <Route path="/contracts" element={<PatientContracts />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/appointments" element={<PatientAppointments />} />
                        </>
                    }
                </Routes>
            </div>
        </Router>
    );
}

export default App;
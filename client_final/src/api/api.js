import axios from "axios";

const API = axios.create({
    baseURL: "https://localhost", 
    withCredentials: true
});


/* ---------------- AUTHENTICATION ---------------- */

// Registers a new user
export const register = async (userData) => {
    return API.post("/register", userData);
};

// Sends a password reset token to the user's email
export const sendResetToken = async (email) => {
    return API.post("/forgot-password", { email });
};

// Verifies if the provided token is valid
export const verifyToken = async ({ email, token }) => {
    return API.post("/verify-token", { email, token });
};

// Resets the user's password
export const resetPassword = async ({ email, token, newPassword }) => {
    return API.post("/reset-password", { email, token, newPassword });
};

// Logs in the user
export const login = async (email, password) => {
    return API.post("/login", { email, password });
};

// Logs out the user
export const logout = async () => {
    return API.post("/logout");
};

/* ---------------- USERS ---------------- */

// Fetches details of the logged-in user
export const getUserDetails = async () => {
    return await API.get("/users/user-details");
};

// Retrieves a list of all users (Admin only)
export const getUsers = async () => {
    try {
        const response = await API.get("/users");
        console.log("✅ Fetched Users:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching users:", error.response?.data || error.message);
        throw error;
    }
};

// Creates a new user (Admin only)
export const createUser = async (userData) => {
    try {
        const response = await API.post("/users", userData);
        console.log("✅ User Created:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error creating user:", error.response?.data || error.message);
        throw error;
    }
};

// Updates user details (Admin only)
export const updateUser = async (userId, updatedData) => {
    try {
        const response = await API.put(`/users/${userId}`, updatedData);
        console.log("✅ User Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating user:", error.response?.data || error.message);
        throw error;
    }
};

// Deletes a user (Admin only)
export const deleteUser = async (userId) => {
    try {
        const response = await API.delete(`/users/${userId}`);
        console.log("✅ User Deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting user:", error.response?.data || error.message);
        throw error;
    }
};

// Toggles the active status of a user (Admin only)
export const toggleUserActive = async (userId, isActive) => {
    await API.put(`/users/${userId}/toggle-active`, { active: isActive });
};

// Fetches user information by ID
export const getUserById = async (patientId) => {
    const response = await API.get(`/users/${patientId}`);
    return response.data;
};

/* ---------------- CONTRACTS ---------------- */

// Fetches contracts associated with a specific doctor
export const getContractsByDoctor = async (doctorId) => {
    try {
        const response = await API.get(`/contracts/doctor/${doctorId}`);
        console.log("✅ Fetched Contracts:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching contracts:", error.response?.data || error.message);
        throw error;
    }
};

// Approves a contract
export const approveContract = async (contractId) => {
    try {
        const response = await API.put(`/contracts/${contractId}/approve`);
        console.log("✅ Contract approved:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error approving contract:", error.response?.data || error.message);
        throw error;
    }
};

// Updates a specific contract
export const updateContract = async (contractId, updatedData) => {
    try {
        const response = await API.put(`/contracts/${contractId}`, updatedData);
        console.log("✅ Contract updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating contract:", error.response?.data || error.message);
        throw error;
    }
};

// Creates a new contract
export const createContract = async (contractData) => {
    try {
        const response = await API.post("/contracts", contractData);
        console.log("✅ New Contract Created:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error creating contract:", error.response?.data || error.message);
        throw error;
    }
};

// Fetches contracts associated with a specific patient
export const getContractsByPatient = async (patientId) => {
    try {
        const response = await API.get(`/contracts/patient/${patientId}`);
        console.log("✅ Fetched Contracts for Patient:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching contracts for patient:", error.response?.data || error.message);
        throw error;
    }
};

// Deletes a contract (Admin only)
export const deleteContract = async (contractId) => {
    return API.put(`/contracts/delete/${contractId}`);
};

// Restores a previously deleted contract
export const restoreContract = async (contractId) => {
    return API.put(`/contracts/${contractId}/restore`);
};

// Fetches all contracts for admin review
export const getContracts = async () => {
    const response = await API.get("/contracts/contractsAdmin");
    return response.data;
};

/* ---------------- APPOINTMENTS ---------------- */

// Creates a new appointment
export const createAppointment = async (appointmentData) => {
    return await API.post("/appointments", appointmentData);
};

// Fetches appointments for a specific doctor
export const getAppointmentsByDoctor = async (doctorId) => {
    const response = await API.get(`/appointments/doctor/${doctorId}`);
    return response.data;
};

// Cancels a specific appointment
export const cancelAppointment = async (appointmentId) => {
    return await API.put(`/appointments/${appointmentId}/cancel`);
};

// Toggles the status (canceled or not) of an appointment
export const toggleAppointmentStatus = async (appointmentId, canceled) => {
    try {
        const response = await API.put(`/appointments/${appointmentId}/toggle`, { canceled });
        return response.data;
    } catch (error) {
        console.error("Error toggling appointment status:", error);
        throw error;
    }
};

// Fetches appointments for a specific patient
export const getAppointmentsByPatient = async (patientId) => {
    const response = await API.get(`/appointments/patient/${patientId}`);
    return response.data;
};

/* ---------------- SUPPORT REQUESTS ---------------- */

// Submits a new support request
export const submitSupportRequest = async (description) => {
    try {
        const response = await API.post('/support-requests/', { description });
        return response.data;
    } catch (error) {
        console.error("Error submitting support request:", error);
        throw error;
    }
};

// Fetches all support requests (Admin only)
export const getSupportRequests = async () => {
    const response = await API.get("/support-requests/");
    return response.data;
};

// Marks a support request as completed (Admin only)
export const markSupportRequestCompleted = async (requestId) => {
    await API.put(`/support-requests/${requestId}/complete`);
};
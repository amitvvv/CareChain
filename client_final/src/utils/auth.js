export const getToken = () => localStorage.getItem("token");
export const getUserType = () => localStorage.getItem("userType");

export const isAuthenticated = () => {
    return !!getToken();
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    window.location.href = "/login"; // Return to login if token expired/deleted
};

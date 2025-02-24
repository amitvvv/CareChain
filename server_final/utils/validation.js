// Function to validate inputs
function validateInputs({ firstName, lastName, email, phone, idNumber, password, birthDate }) {
    const nameRegex = /^[A-Za-zא-ת]+$/;
    const idRegex = /^\d{9}$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return "First and last names should contain letters only.";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }
    if (!idRegex.test(idNumber)) {
        return "ID Number should contain exactly 9 digits.";
    }
    if (!phoneRegex.test(phone)) {
        return "Phone number should contain exactly 10 digits.";
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
        return passwordError;
    }
    if (!birthDate) {
        return "Birth date is required.";
    }

    return null;
}

// Password validation
function validatePassword(password) {
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain at least one special character.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    return null;
}

module.exports = {validateInputs,validatePassword};
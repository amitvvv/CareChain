import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";
import "./Register.css";
import logo from "../assets/CareChain.png";
import backgroundImage from "../assets/img/signup.jpg";

const Register = () => {
    useEffect(() => {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.minHeight = "100vh";

        return () => {
            document.body.style.backgroundImage = "";
        };
    }, []);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const validateInputs = () => {
        const nameRegex = /^[A-Za-zא-ת]+$/;
        const idRegex = /^\d{9}$/;
        const phoneRegex = /^\d{10}$/;

        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return "First and last names should contain letters only.";
        }
        if (!idRegex.test(idNumber)) {
            return "ID Number should contain exactly 9 digits.";
        }
        if (!phoneRegex.test(phone)) {
            return "Phone number should contain exactly 10 digits.";
        }
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const inputError = validateInputs();
        if (inputError) {
            setError(inputError);
            return;
        }

        try {
            await register({ firstName, lastName, email, phone, idNumber, password, birthDate });
            alert("Registration successful! Press OK to proceed.");
            navigate("/");
        } catch (error) {
            // הצגת שגיאה אם תעודת זהות קיימת
            setError(error.response?.data?.error || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <form onSubmit={handleRegister} className="register-form">
                <h2>Create Account</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="register-input"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="register-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="register-input"
                />
                <input
                    type="text"
                    placeholder="ID Number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="register-input"
                />
                <input
                    type="date"
                    placeholder="Birth Date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="register-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <div className="button-group">
                    <button type="submit" className="register-button">Register</button>
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Register;
import React, { useState, useEffect} from "react";
import { login } from "../api/api";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../assets/CareChain.png";


const Login = () => {
    useEffect(() => {
        document.body.className = "login-page";
        return () => {
            document.body.className = "";
        };
    }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    //const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            console.log("📤 Sending login request...");
            const response = await login(email, password);

            console.log("✅ API Response:", response);

            // Blocked user check
            if (response.active === false) {
                console.error("❌ User is disabled, blocking login.");
                setError("❌ Your account is disabled. Please contact the system administrator.");
                return;
            }

            console.log("✅ User logged in successfully");
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("❌ Login error:", err);

            if (err.response && err.response.status === 403) {
                setError("❌ Your account is disabled. Please contact the system administrator.");
            } else {
                setError("❌ Login failed. Please check your credentials.");
            }
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
                
                
                <button className="back-button" onClick={() => window.history.back()}>
                    Back
                </button>
            </form>
            <div className="login-footer">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        </div>
    );
};

export default Login;

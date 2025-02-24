import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/CareChain.png";


const Home = () => {
    useEffect(() => {
        document.body.className = "home-page";
        return () => {
            document.body.className = "";
        };
    }, []);
    const navigate = useNavigate();

    return (
        <div className="home-container2">
            <img src={logo} alt="CareChain Logo" className="home-logo" />
            <h1>Welcome to CareChain</h1>
            <p>Your secure platform for managing smart medical contracts on the blockchain.</p>
            <p>
                CareChain leverages blockchain technology to ensure secure, transparent, and immutable management of medical contracts.
                Join us to experience a decentralized solution for handling sensitive medical information with utmost reliability and privacy.
            </p>

            <div className="home-buttons">
                <button onClick={() => navigate("/register")} className="home-button">Sign Up</button>
                <button onClick={() => navigate("/login")} className="home-button">Login</button>
            </div>
        </div>
    );
};

export default Home;

import React, { useState } from 'react';
import { submitSupportRequest } from '../api/api';
import './ContactSupport.css';

const ContactSupport = ({ onClose }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!description.trim()) {
            setError("Description cannot be empty.");
            return;
        }

        try {
            await submitSupportRequest(description);
            alert("Request submitted successfully.");
            onClose();
        } catch (err) {
            setError("Failed to submit the request.");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Contact Support</h2>
                {error && <p className="error-message">{error}</p>}
                <textarea
                    placeholder="Describe your issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="popup-buttons">
                    <button onClick={handleSubmit}>Send</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;

import React, { useEffect, useState } from "react";
import { getSupportRequests, markSupportRequestCompleted } from "../../api/api";
import "./ViewSupportReq.css";
import logo from "../../assets/CareChain.png"; // ייבוא הלוגו

const ViewSupportReq = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [completedRequests, setCompletedRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchSupportRequests();
    }, []);

    const fetchSupportRequests = async () => {
        try {
            const response = await getSupportRequests();
            const pending = response.filter(req => !req.completed);
            const completed = response.filter(req => req.completed);
            setPendingRequests(pending);
            setCompletedRequests(completed);
        } catch (error) {
            console.error("Failed to fetch support requests", error);
        }
    };

    const handleCompleteRequest = async (requestId) => {
        try {
            await markSupportRequestCompleted(requestId);
            fetchSupportRequests();  // רענון הנתונים לאחר סימון כהושלם
        } catch (error) {
            console.error("Failed to mark request as completed", error);
        }
    };

    return (
        <div className="support-requests-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h1>Support Requests</h1>

            {/* טבלה של בקשות שלא הושלמו */}
            <h2>Pending Requests</h2>
            <table>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {pendingRequests.map(request => (
                    <tr key={request._id}>
                        <td>{request.description}</td>
                        <td>{request.userId}</td>
                        <td>{request.date}</td>
                        <td>{request.time}</td>
                        <td>
                            <button onClick={() => setSelectedRequest(request)}>View</button>
                            <button onClick={() => handleCompleteRequest(request._id)}>Mark Completed</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Completed Requests</h2>
            <table>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>User ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {completedRequests.map(request => (
                    <tr key={request._id}>
                        <td>{request.description}</td>
                        <td>{request.userId}</td>
                        <td>{request.date}</td>
                        <td>{request.time}</td>
                        <td>✅ Completed</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedRequest && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Request Details</h2>
                        <p><strong>Description:</strong> {selectedRequest.description}</p>
                        <p><strong>User ID:</strong> {selectedRequest.userId}</p>
                        <p><strong>Date:</strong> {selectedRequest.date}</p>
                        <p><strong>Time:</strong> {selectedRequest.time}</p>
                        <button onClick={() => setSelectedRequest(null)}>Close</button>
                    </div>
                </div>
            )}

            <button className="back-button" onClick={() => window.history.back()}>
                Back
            </button>
        </div>
    );
};

export default ViewSupportReq;
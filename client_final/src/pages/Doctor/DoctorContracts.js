import React, { useState, useEffect } from "react";
import { getContractsByDoctor, createContract, getUserDetails, getUserById } from "../../api/api";
import logo from "../../assets/CareChain.png";

const DoctorContracts = () => {
    const [contracts, setContracts] = useState([]);
    const [doctorId, setDoctorId] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showNewContractPopup, setShowNewContractPopup] = useState(false);
    const [formData, setFormData] = useState({
        patientId: "",
        treatmentType: "",
        description: "",
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await getUserDetails();
                setDoctorId(response.data.idNumber);
            } catch (err) {
                setError("❌ Failed to fetch user details.");
            }
        };
        fetchUserDetails();
    }, []);

    const fetchContracts = async () => {
        if (!doctorId) return;
        try {
            const data = await getContractsByDoctor(doctorId);

            const contractsWithNames = await Promise.all(
                data.map(async (contract) => {
                    try {
                        const patient = await getUserById(contract.patientId);  
                        return {
                            ...contract,
                            patientName: `${patient.firstName} ${patient.lastName}` || "Unknown",
                            createdAtFormatted: new Date(contract.createdAt).toLocaleString() // פורמט נוח לתצוגה
                        };
                    } catch {
                        return { ...contract, patientName: "Unknown", createdAtFormatted: new Date(contract.createdAt).toLocaleString() };
                    }
                })
            );

            setContracts(contractsWithNames);
        } catch (err) {
            setError("❌ Failed to load contracts.");
        }
    };

    useEffect(() => {
        if (!doctorId) return;
        fetchContracts();
    }, [doctorId]);

    const handleCreateContract = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.patientId.trim() || !formData.treatmentType.trim() || !formData.description.trim()) {
            setError("❌ Please fill in all fields.");
            return;
        }

        try {
            const response = await createContract({
                patientId: Number(formData.patientId),
                doctorId: Number(doctorId),
                treatmentType: formData.treatmentType,
                description: formData.description
            });

            if (response) {
                alert("✅ Contract created successfully!");
                setShowNewContractPopup(false);
                setFormData({ patientId: "", treatmentType: "", description: "" });
                fetchContracts();
            } else {
                setError("❌ Server did not confirm success.");
            }
        } catch (err) {
            setError("❌ Failed to create contract.");
        }
    };

    const handleViewContract = (contract) => {
        setSelectedContract(contract);
    };

    return (
        <div className="contracts-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h2>Doctor Contracts</h2>

            {error && <p className="error-message">{error}</p>}

            <button className="create-button" onClick={() => setShowNewContractPopup(true)}>
                ➕ Create New Contract
            </button>

            <h3>Existing Contracts</h3>
            <div className="table-wrapper">
                <table className="contracts-table">
                    <thead>
                    <tr>
                        <th>Contract ID</th>
                        <th>Patient ID</th>
                        <th>Patient Name</th>
                        <th>Treatment</th>
                        <th>Description</th>
                        <th>Created At</th> {/* 🕒 עמודת זמן יצירה */}
                        <th>Approved</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contracts.map((contract) => (
                        <tr key={contract.contractId}>
                            <td>{contract.contractId}</td>
                            <td>{contract.patientId}</td>
                            <td>{contract.patientName}</td>
                            <td>{contract.treatmentType}</td>
                            <td>{contract.description}</td>
                            <td>{contract.createdAtFormatted}</td> {/* הצגת זמן יצירה בפורמט קריא */}
                            <td className={contract.isApproved ? "contract-approved" : "contract-not-approved"}>
                                {contract.isApproved ? "✅ Yes" : "❌ No"}
                            </td>
                            <td>
                                <button className="view-button" onClick={() => handleViewContract(contract)}>
                                    👁 View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="back-button-container">
                <button className="back-button" onClick={() => window.history.back()}>
                    Back
                </button>
            </div>

            {selectedContract && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Contract Details</h3>
                        <p><strong>Contract ID:</strong> {selectedContract.contractId}</p>
                        <p><strong>Patient ID:</strong> {selectedContract.patientId}</p>
                        <p><strong>Treatment:</strong> {selectedContract.treatmentType}</p>
                        <p><strong>Description:</strong> {selectedContract.description}</p>
                        <p><strong>Created At:</strong> {selectedContract.createdAtFormatted}</p> {/* 🕒 הצגת הזמן גם כאן */}
                        <p><strong>Approved:</strong> {selectedContract.isApproved ? "✅ Yes" : "❌ No"}</p>
                        <button className="close-button" onClick={() => setSelectedContract(null)}>Close</button>
                    </div>
                </div>
            )}

            {showNewContractPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Create New Contract</h3>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleCreateContract} className="contract-form">
                            <input
                                type="text"
                                placeholder="Patient ID"
                                value={formData.patientId}
                                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Treatment Type"
                                value={formData.treatmentType}
                                onChange={(e) => setFormData({...formData, treatmentType: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                            <div className="button-group">
                                <button type="submit" className="approve-button">✔ Create</button>
                                <button
                                    type="button"
                                    className="close-button"
                                    onClick={() => setShowNewContractPopup(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorContracts;

import React, { useEffect, useState } from "react";
import { getContracts, deleteContract, restoreContract } from "../../api/api"; // נדרש להוסיף restoreContract ב-API
import "./ViewMedicalContracts.css";
import logo from "../../assets/CareChain.png";

export default function ViewMedicalContracts() {
    const [contracts, setContracts] = useState([]);
    const [searchDoctor, setSearchDoctor] = useState("");
    const [searchPatient, setSearchPatient] = useState("");

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await getContracts();
                console.log("📦 Contracts fetched:", response);
                setContracts(response);
            } catch (error) {
                console.error("Failed to fetch contracts", error);
            }
        };
        fetchContracts();
    }, []);

    const handleToggleContractStatus = async (contractId, currentStatus) => {
        if (window.confirm(`Are you sure you want to ${currentStatus ? "restore" : "delete"} this contract?`)) {
            try {
                if (currentStatus) {
                    await restoreContract(contractId);
                    alert("Contract restored successfully");
                } else {
                    await deleteContract(contractId);
                    alert("Contract deleted successfully");
                }

                const updatedContracts = await getContracts();
                setContracts(updatedContracts);
            } catch (error) {
                console.error("Failed to toggle contract status", error);
            }
        }
    };

    const activeContracts = contracts.filter(contract => !contract.isDeleted);
    const deletedContracts = contracts.filter(contract => contract.isDeleted);

    const filteredActiveContracts = activeContracts.filter(contract =>
        (!searchDoctor || contract.doctorId.toString().includes(searchDoctor)) &&
        (!searchPatient || contract.patientId.toString().includes(searchPatient))
    );

    const filteredDeletedContracts = deletedContracts.filter(contract =>
        (!searchDoctor || contract.doctorId.toString().includes(searchDoctor)) &&
        (!searchPatient || contract.patientId.toString().includes(searchPatient))
    );

    return (
        <div className="contracts-container">
            <img src={logo} alt="CareChain Logo" className="login-logo"/>
            <h1>View Medical Contracts</h1>

            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search by Doctor ID"
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search by Patient ID"
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                />
            </div>

            <h2>Active Contracts</h2>
            <table>
                <thead>
                <tr>
                    <th>Contract ID</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredActiveContracts.map(contract => (
                    <tr key={contract.contractId}>
                        <td>{contract.contractId}</td>
                        <td className={!contract.doctorName ? "empty-value" : ""}>
                            {`${contract.doctorId} - ${contract.doctorName || "Unknown"}`}
                        </td>
                        <td className={!contract.patientName ? "empty-value" : ""}>
                            {`${contract.patientId} - ${contract.patientName || "Unknown"}`}
                        </td>
                        <td>
                            <button onClick={() => handleToggleContractStatus(contract.contractId, false)}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Deleted Contracts</h2>
            <table>
                <thead>
                <tr>
                    <th>Contract ID</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredDeletedContracts.map(contract => (
                    <tr key={contract.contractId}>
                        <td>{contract.contractId}</td>
                        <td className={!contract.doctorName ? "empty-value" : ""}>
                            {`${contract.doctorId} - ${contract.doctorName || "Unknown"}`}
                        </td>
                        <td className={!contract.patientName ? "empty-value" : ""}>
                            {`${contract.patientId} - ${contract.patientName || "Unknown"}`}
                        </td>
                        <td>
                            <button className="restore-button"
                                    onClick={() => handleToggleContractStatus(contract.contractId, true)}>Restore
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="back-button-wrapper">
                <button className="back-button" onClick={() => window.history.back()}>
                    Back
                </button>
            </div>

        </div>
    );
}
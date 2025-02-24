// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicalContract {
    struct Contract {
        uint256 contractId;
        uint256 patientId;
        uint256 doctorId;
        string treatmentType;
        string description;
        uint256 createdAt;
        uint256 lastUpdated;
        bool isApproved;
        bool isDeleted;
    }

    Contract[] public contracts;
    mapping(uint256 => uint256) private contractIndexById;

    event ContractCreated(uint indexed contractId, uint256 patientId, uint256 doctorId);
    event ContractUpdated(uint indexed contractId, string newTreatmentType, string newDescription);
    event ContractApproved(uint indexed contractId);
    event ContractDeleted(uint indexed contractId);
    event ContractRestored(uint indexed contractId);

    function generateRandomContractId() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, contracts.length))) % 10**10;
    }

    function createContract(
        uint256 _patientId,
        uint256 _doctorId,
        string memory _treatmentType,
        string memory _description
    ) public {
        uint256 newContractId = generateRandomContractId();

        contracts.push(Contract({
            contractId: newContractId,
            patientId: _patientId,
            doctorId: _doctorId,
            treatmentType: _treatmentType,
            description: _description,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp, // ✅ lastUpdated מוגדר כברירת מחדל
            isApproved: false,
            isDeleted: false
        }));

        contractIndexById[newContractId] = contracts.length - 1;

        emit ContractCreated(newContractId, _patientId, _doctorId);
    }

    function updateContract(
        uint256 _contractId,
        string memory _newTreatmentType,
        string memory _newDescription
    ) public {
        require(contractIndexById[_contractId] < contracts.length, "Invalid contract ID");

        uint256 index = contractIndexById[_contractId];
        Contract storage c = contracts[index];
        c.treatmentType = _newTreatmentType;
        c.description = _newDescription;
        c.lastUpdated = block.timestamp; // ✅ עדכון lastUpdated בעת שינוי

        emit ContractUpdated(_contractId, _newTreatmentType, _newDescription);
    }

    function approveContract(uint256 _contractId, uint256 _approverId) public {
        require(contractIndexById[_contractId] < contracts.length, "Invalid contract ID");

        uint256 index = contractIndexById[_contractId];
        Contract storage medicalContract = contracts[index];

        // וידוא שהמאשר הוא המטופל של החוזה
        require(medicalContract.patientId == _approverId, "Only the assigned patient can approve this contract");

        // אישור החוזה
        medicalContract.isApproved = true;
        medicalContract.lastUpdated = block.timestamp; // ✅ עדכון lastUpdated

        emit ContractApproved(_contractId);
    }

    function getContractsByPatient(uint256 _patientId) public view returns (Contract[] memory) {
        uint256 count = 0;

        // ספירה של חוזים פעילים
        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i].patientId == _patientId && !contracts[i].isDeleted) {
                count++;
            }
        }

        Contract[] memory result = new Contract[](count);
        uint256 index = 0;

        // הוספת חוזים לרשימה
        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i].patientId == _patientId && !contracts[i].isDeleted) {
                result[index] = contracts[i];
                index++;
            }
        }

        return result;
    }

    function getContractsByDoctor(uint256 _doctorId) public view returns (Contract[] memory) {
        uint256 count = 0;

        // ספירה של חוזים פעילים
        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i].doctorId == _doctorId && !contracts[i].isDeleted) {
                count++;
            }
        }

        Contract[] memory result = new Contract[](count);
        uint256 index = 0;

        // הוספת חוזים לרשימה
        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i].doctorId == _doctorId && !contracts[i].isDeleted) {
                result[index] = contracts[i];
                index++;
            }
        }

        return result;
    }

    function getAllContracts() public view returns (Contract[] memory) {
        uint256 totalContracts = contracts.length;
        Contract[] memory result = new Contract[](totalContracts);

        for (uint256 i = 0; i < totalContracts; i++) {
            result[i] = contracts[i];
        }

        return result;
    }

    function markAsDeleted(uint256 _contractId) public {
        require(contractIndexById[_contractId] < contracts.length, "Invalid contract ID");

        uint256 index = contractIndexById[_contractId];
        contracts[index].isDeleted = true;
        contracts[index].lastUpdated = block.timestamp; // ✅ עדכון lastUpdated למחיקה

        emit ContractDeleted(_contractId);
    }

    function markAsNotDeleted(uint256 _contractId) public {
        require(contractIndexById[_contractId] < contracts.length, "Invalid contract ID");

        uint256 index = contractIndexById[_contractId];
        contracts[index].isDeleted = false;
        contracts[index].lastUpdated = block.timestamp; // ✅ עדכון lastUpdated לשחזור

        emit ContractRestored(_contractId);
    }
}

const { ethers } = require("hardhat");

async function main() {
    const MedicalContract = await ethers.getContractFactory("MedicalContract");
    const medicalContract = await MedicalContract.deploy();

    await medicalContract.waitForDeployment();

    console.log("✅ MedicalContract deployed locally at:", medicalContract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });

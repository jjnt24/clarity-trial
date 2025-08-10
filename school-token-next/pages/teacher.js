import { useState, useEffect } from "react";
import { openContractCall } from "@stacks/connect";
import { uintCV, principalCV } from "@stacks/transactions";
import { contractAddress, contractName } from "../lib/contractConfig";
import { authenticate, userSession } from "../lib/auth";
import { STACKS_TESTNET } from "@stacks/network";

export default function TeacherPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!userSession.isUserSignedIn()) {
      authenticate();
    }
  }, []);

  const mintToken = async () => {
    if (!address || !amount) {
      alert("Alamat dan jumlah token wajib diisi");
      return;
    }

    const options = {
      contractAddress,
      contractName,
      functionName: "mint",
      functionArgs: [
        uintCV(Number(amount)),
        principalCV(address)
      ],
      network: STACKS_TESTNET,
      appDetails: { name: "School Reward", icon: "/favicon.ico" },
      onFinish: (data) => {
        console.log("Tx selesai:", data);
        alert("Mint token berhasil dikirim!");
      },
      userSession
    };

    await openContractCall(options);
  };

  const styles = {
    container: {
      padding: 24,
      fontFamily: "'Inter', sans-serif",
      maxWidth: 420,
      margin: "auto",
      backgroundColor: "#1e1e2f",
      borderRadius: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      color: "#e4e6eb",
    },
    heading: {
      textAlign: "center",
      color: "#ffffff",
      fontSize: "1.6rem",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      padding: 12,
      marginBottom: 12,
      border: "1px solid #333",
      borderRadius: 10,
      backgroundColor: "#2a2a40",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: 12,
      background: "linear-gradient(135deg, #00b4d8, #0077b6)",
      color: "white",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "all 0.2s ease",
    },
    buttonHover: {
      filter: "brightness(1.1)",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 Halaman Guru</h2>
      <input
        style={styles.input}
        placeholder="Alamat Siswa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Jumlah Token"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.filter = styles.buttonHover.filter}
        onMouseOut={(e) => e.currentTarget.style.filter = "none"}
        onClick={mintToken}
      >
        Mint Token
      </button>
    </div>
  );
}

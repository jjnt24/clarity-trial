import { useState } from "react";
import { fetchCallReadOnlyFunction, principalCV, uintCV, cvToValue, PostConditionMode } from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";
import { contractAddress, contractName } from "../lib/contractConfig";
import { userSession, authenticate } from "../lib/auth";
import { openContractCall } from '@stacks/connect';

export default function StudentPage() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [burnAmount, setBurnAmount] = useState("");

  const checkBalance = async () => {
    if (!userSession.isUserSignedIn()) {
      authenticate();
      return;
    }

    if (!address) {
      alert("Alamat wajib diisi");
      return;
    }

    const result = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: "get-balance",
      functionArgs: [principalCV(address)],
      senderAddress: address,
      network: STACKS_TESTNET,
    });

    const value = cvToValue(result).value;
    setBalance(value);
  };

  const burnToken = async () => {
    if (!userSession.isUserSignedIn()) {
      authenticate();
      return;
    }

    if (!burnAmount || Number(burnAmount) <= 0) {
      alert("Masukkan jumlah token yang valid");
      return;
    }

    const userData = userSession.loadUserData();
    const senderAddress = userData.profile.stxAddress.testnet;

    const options = {
      contractAddress,
      contractName,
      functionName: "burn",
      functionArgs: [uintCV(Number(burnAmount))],
      network: STACKS_TESTNET,
      appDetails: {
        name: "My Token App",
        icon: window.location.origin + "/logo.png"
      },
      onFinish: () => {
        alert("Token berhasil diburn!");
        checkBalance();
      },
      onCancel: () => {
        alert("Burn dibatalkan");
      },
      postConditionMode: PostConditionMode.Allow
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
      background: "linear-gradient(135deg, #7f5af0, #2cb67d)",
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
    divider: {
      margin: "20px 0",
      border: "none",
      borderTop: "1px solid #333",
    },
    balanceText: {
      textAlign: "center",
      fontSize: "1.1rem",
      color: "#00ffad",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💎 My Token Dashboard</h2>

      <input
        style={styles.input}
        placeholder="Alamat Kamu"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.filter = styles.buttonHover.filter}
        onMouseOut={(e) => e.currentTarget.style.filter = "none"}
        onClick={checkBalance}
      >
        Cek Saldo
      </button>

      {balance !== null && (
        <p style={styles.balanceText}>
          Saldo Token: <strong>{balance}</strong>
        </p>
      )}

      <hr style={styles.divider} />

      <h3 style={{ textAlign: "center", marginBottom: 10 }}>🔥 Burn Token</h3>
      <input
        style={styles.input}
        placeholder="Jumlah Token"
        type="number"
        value={burnAmount}
        onChange={(e) => setBurnAmount(e.target.value)}
      />
      <button
        style={{
          ...styles.button,
          background: "linear-gradient(135deg, #ef476f, #ff9a5a)"
        }}
        onMouseOver={(e) => e.currentTarget.style.filter = styles.buttonHover.filter}
        onMouseOut={(e) => e.currentTarget.style.filter = "none"}
        onClick={burnToken}
      >
        Burn Token
      </button>
    </div>
  );
}

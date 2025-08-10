import { useState, useEffect } from "react";
import { openContractCall } from "@stacks/connect";
import { uintCV, principalCV } from "@stacks/transactions";
import { contractAddress, contractName } from "../lib/contractConfig";
import { authenticate, userSession } from "../lib/auth";
import { STACKS_TESTNET } from "@stacks/network";

export default function TeacherPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Pastikan user sudah login
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Halaman Guru</h2>
      <input
        placeholder="Alamat Siswa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="Jumlah Token"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={mintToken}>Mint Token</button>
    </div>
  );
}

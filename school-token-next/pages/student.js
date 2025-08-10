import { useState } from "react";
import { fetchCallReadOnlyFunction, principalCV, uintCV, cvToValue, makeContractCall, PostConditionMode } from "@stacks/transactions";
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


  return (
    <div style={{ padding: 20 }}>
      <h2>Halaman Siswa</h2>
      <input
        placeholder="Alamat Kamu"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={checkBalance}>Cek Saldo</button>
      {balance !== null && <p>Saldo Token: {balance}</p>}

      <hr style={{ margin: "20px 0" }} />

      <h3>Burn Token</h3>
      <input
        placeholder="Jumlah Token"
        type="number"
        value={burnAmount}
        onChange={(e) => setBurnAmount(e.target.value)}
      />
      <button onClick={burnToken}>Burn Token</button>
    </div>
  );
}

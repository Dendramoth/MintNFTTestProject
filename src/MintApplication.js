import React from "react";
import { useEffect, useState } from "react";
import {
  mintNFTContract,
  connectWallet,
  mintNFT,
  loadCurrentMessage,
  getCurrentWalletConnected,
  loadNFTCollectionName,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const MintApplication = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");

  //called only once
  useEffect(async () => {
    async function fetchNFTCollectionName() {
      const message = await loadNFTCollectionName();
      setMessage(message);
    }
    fetchNFTCollectionName();

    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status); 
    }
    fetchWallet();

    addWalletListener(); 
  }, []);

  function addSmartContractListener() { //TODO: implement
    
  }

  function addWalletListener() { 
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Enter amount of NFTs to mint.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => { 
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => { 
    const { status } = await mintNFT(walletAddress, 1);
    setStatus(status);
  };

  //the UI of our component
  return (
    <div id="container">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>NFT Project name (read from Smart Contract):</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>Mint NFT:</h2>

      <div>
        <input
          type="text"
          placeholder="Enter amount of NFTs to mint. (Currently is supported just one at a time)"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          MINT
        </button>
      </div>
    </div>
  );
};

export default MintApplication;

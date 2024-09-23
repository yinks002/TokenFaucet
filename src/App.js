import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./abi";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [address, setAddress] =  useState("");

  useEffect(() => {
    if(walletAddress){
      initializeContract();
    }
    
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);


  const contractAddress =  "0xB211BFEdBC3bC47523a683dbBdAfDDe1Bf134AAa";

  const initializeContract = async ()=>{
   try {
    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
      console.log("Provider:", provider);
      console.log("Signer:", signer);
      console.log("contract instantiated", contractInstance);
      console.log("Contract functions: ", Object.keys(contractInstance.functions));
    }
   } catch (error) {
    console.log("contract not instantiated", error);
   }
  };

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      alert("please install metamask");
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };
  const disburseToken = async()=>{
    // if ( !contract || !walletAddress){
    //   console.log("contract or wallet address not connected");
    //   return;
    // }
    try {
      const tx = await contract.requestTokens();
      tx.wait();
      alert("tokens withdrawn, enjoy");
    } catch (error) {
      alert("Error")
      console.log("error in requesting tokens", error);
    }
  }

 
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Yinks Token (YKT)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-3">Faucet</h1>
            <p>Fast and reliable. 50 YKT/day.</p>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input onChange={(e)=> setAddress(e.target.value)}
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                  />
                 
                </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick={disburseToken}>
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>transaction data</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

// yinks token contract address : 0x5588E94Ed7630Db3985dbF9918D80f69C7A5E6B0
// faucet token smarrt contract : 0xB211BFEdBC3bC47523a683dbBdAfDDe1Bf134AAa
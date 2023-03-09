import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { encryptSafely } from '@metamask/eth-sig-util';
import { Buffer } from "buffer";

import SearchApp from './table.js';
import { Writer, WriterABI } from '../ABI/writer';

window.Buffer = window.Buffer || Buffer;
const WRITERCONTRACTADDRESS="0x8c628E4d586Acb98e84AaF1F62049a5d9E35dc10";


export function Main() {
  // State Hook - `useState`
  const [libelle, setNewLibelle] = useState("");
  const [username, setNewUsername] = useState("");
  const [password, setNewPassword] = useState("");
  const [items, setItems] = useState([]);

  const [showEdit, setShowEdit] = useState(-1);

  const [state, setState] = useState({});
  let CT;
  
  // Web3 
  async function connect() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const network = await provider.getNetwork();
      const networkName = network.name;
      const chainId = network.chainId;
      setState({ providerData: { networkName, chainId, signerAddress }, provider, signer });
      CT = new ethers.Contract(WRITERCONTRACTADDRESS, WriterABI.abi, state.signer);
      console.log("Wallet connecté sur " + networkName);
    } catch (error) {
      console.log(error);
      setState({ error: "une erreur est survenue" });
    };
  }

  async function disconnect() {
    setState({});
  }

  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  async function getData(){
    if (await state.signer){
      const data = await CT.getData();
      setItems([]);

      const getBTN = document.getElementById("getBTN");
      if (data.length === 0){
        getBTN.innerText = "No data found, start by adding a password ;)";
        await delay(3000);  
      }
      getBTN.innerText = "Refresh Data";
      
      data.forEach(element => {
        // Create new item
        const item = {
          id: Math.floor(Math.random() * 1000),
          libelle: element['libelle'],
          encryptedData: element['encryptedData'],
          username:'',
          password:'',
          show: false,
        };
        // Add new item to items array
        setItems((oldList) => [...oldList, item]);
      });
    }else{
      connect();
    }
  }

  // Crypting Functions
  
  async function Encrypt(dataToEncrypt){
    if (await state.signer){
      let userAddress = await state.signer.getAddress()
      let pkey = await state.provider.send("eth_getEncryptionPublicKey", [userAddress]);
     
      try {
        const encryptedMessage = stringifiableToHex(
          encryptSafely(
            { publicKey: await pkey,
              data: dataToEncrypt,
              version: 'x25519-xsalsa20-poly1305'
            }
          ),
        );
        return encryptedMessage;
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    } else {connect();} 
  }

  async function Decrypt(cipher){
    if (await state.signer && cipher !== ''){
      try{
        let userAddress = await state.signer.getAddress();
        let data = await state.provider.send("eth_decrypt", [cipher, userAddress]);
        return JSON.parse(data)['data'];
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }  
    } else {connect();} 
  }

  // Helper Functions

  function stringifiableToHex(value) {
    return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
  }

  // Front Functions

  /* Adds a new item to the list array*/
  async function addItem() {
    // ! Check for empty item
    if (!libelle) {
      alert("Please enter an libelle.");
      return;
    }

    let encryptedData = await Encrypt({username: username, password: password});

    // web3
    if (await state.signer){
      await CT.addPassword(libelle, encryptedData);
      console.log("transaction pending...");
      // Reset inputs back to original state
      setNewLibelle("");
      setNewUsername("");
      setNewPassword("");
    }else{
      connect();
    }
    
  }


  async function toggleShow(id, edit=false) {
    if (id !== -1){
      // Get the current item
      const currentItem = items.filter((item) => item.id === id);
      
      if (currentItem[0].username === ''){
        const decryptedData = await Decrypt(currentItem[0].encryptedData);
        currentItem[0].username = await decryptedData.username;
        currentItem[0].password = await decryptedData.password;
      }
      // Change state
      if (!edit){
        currentItem[0].show = !currentItem[0].show;
      } 

      // Refresh the state
      setItems((oldList) => [...oldList]);
    }
  }

  /* Deletes an item based on the `item.id` key */
  async function deleteItem(id) {
    // Get the current item
    const currentItem = items.filter((item) => item.id === id);
    const choice = window.confirm("Are you sure to delete this password '"+currentItem[0].libelle+"' ?");
    if (choice){
      // web3
      if (await state.signer){
        await CT.removePassword(currentItem[0].libelle);
        console.log("transaction pending...");
      }
    }
  }

  /* Edit an item text after creating it. */
  async function editItem(id, libelle, username, password) {
    if (libelle === ''){
      libelle = document.getElementById('libelleUpdate').placeholder;
    }
    if (username === ''){
      username = document.getElementById('usernameUpdate').placeholder;
    }
    if (password === ''){
      password = document.getElementById('passwordUpdate').placeholder;
    }
    
    console.log(libelle);
    // Create a new item with same id
    const encryptedData = await Encrypt({username: username, password: password});

    await deleteItem(id);

    // web3
    if (await state.signer && libelle !== ''){
      await CT.addPassword(libelle, encryptedData);
      console.log("transaction pending...");
      // Reset inputs back to original state
      setNewLibelle("");
      setNewUsername("");
      setNewPassword("");
    }else{
      connect();
    }
    
    setShowEdit(-1);
  }

  useEffect(() => {
    // run something every time we click on edit
    toggleShow(showEdit, true);
  }, [showEdit]); // <-- dependency array

  function resetStates(id) {
    if (showEdit !== -1){
      setShowEdit(-1);
    } else {
      toggleShow(id);
    }
  }

  function formatAddress(address) {
    let start = address.substr(0, 5);
    let end = address.substr(address.length-5, 5);
    return start + '...' + end;
  }

  // Main part of app
  return (
    <div className="app h-screen text-black dark:text-white" style={{backgroundImage: require('../images/bg.png')}}>
      {/* 1. Header  */}
      <div className="p-2 mb-10">
        <h1><Link to="/">Password Manager</Link></h1>
        {!state.signer ? <button className="btn float-right" onClick={connect}>Connect wallet</button>
        : <button className="btn-n float-right" onClick={disconnect}>
            {formatAddress(state.providerData.signerAddress)}
          </button>}
      </div>
      
      
      

      
      {showEdit === -1 ? (
        <div>
          {/* 2. Add new item (input) */}
          <input type="text" placeholder="Add a website name" value={libelle} onChange={(e) => setNewLibelle(e.target.value)}/>
          <input type="text" placeholder="Add your username" value={username} onChange={(e) => setNewUsername(e.target.value)}/>
          <input type="text" placeholder="Add your password" value={password} onChange={(e) => setNewPassword(e.target.value)}/>
          {/* Add (button) */}
          <button className="btn-n" onClick={() => addItem()}>Add</button>
        </div>
      ): null}

      
      
      {/* 3. List of todos (unordered list) */}
      <div style={{padding: '1em'}}>
        {showEdit === -1 ? 
          <div>
            <SearchApp data={items} functions={[deleteItem, setShowEdit, toggleShow, getData]}/>
          </div>
        :null}

        {items.map((item) => {
          return (
            <div key={item.id}>
              
              {showEdit === item.id || item.show ? (
                <div>
                  <div className="inline-grid">
                    <label htmlFor="libelle">Libelle</label>
                    <input disabled={item.show ? "disabled":""} type="text" name="libelle" id="libelleUpdate" placeholder={item.libelle} onChange={(e) => setNewLibelle(e.target.value)}/>
                  </div>
                  <div className="inline-grid">
                    <label htmlFor="username">Username</label>
                    <input disabled={item.show ? "disabled":""} type="text" name="username" id="usernameUpdate" placeholder={item.username} onChange={(e) => setNewUsername(e.target.value)}/>
                  </div>
                  <div className="inline-grid">
                    <label htmlFor="password">Password</label>
                    <input disabled={item.show ? "disabled":""} type="text" name="password" id="passwordUpdate" placeholder={item.password} onChange={(e) => setNewPassword(e.target.value)}/>
                  </div>
                  <div className="inline-flex align-bottom">
                    {showEdit === item.id ? <button className="btn-icon" onClick={() => editItem(item.id, libelle, username, password)}>✅</button>:null}
                    <button className="btn-icon" onClick={() => resetStates(item.id)}>❌</button>
                    <button className="btn-icon" onClick={() => deleteItem(item.id)}>🗑️</button>
                  </div>
                </div>
              ) : null}

            </div>
          );
        })}
        
      </div>
      
    </div>
  );
}
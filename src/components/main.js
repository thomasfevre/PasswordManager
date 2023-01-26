import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { encryptSafely } from '@metamask/eth-sig-util';
import { Buffer } from "buffer";

import SearchApp from './table.js';
import { Writer, WriterABI } from '../ABI/writer';

window.Buffer = window.Buffer || Buffer;


export function Main() {
  // State Hook - `useState`
  const [libelle, setNewLibelle] = useState("");
  const [username, setNewUsername] = useState("");
  const [password, setNewPassword] = useState("");
  const [items, setItems] = useState([]);

  const [showEdit, setShowEdit] = useState(-1);
  const [updatedText, setUpdatedText] = useState("");

  const [state, setState] = useState({});
  
  
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
      console.log("Wallet connecté sur " + networkName);
    } catch (error) {
      console.log(error);
      setState({ error: "une erreur est survenue" });
    };
  }

  async function disconnect() {
    setState({});
  }

  async function getData(){
    if (await state.signer){
      const WriterContractAddress="0x0794527f044fCDeFcdCa82Cf4010c9Ad4644e90D";
      const ct = new ethers.Contract(WriterContractAddress, WriterABI.abi, state.signer);
      const data = await ct.getData();
      setItems([]);
      console.log(items)
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
      alert("Press enter an libelle.");
      return;
    }

    let encryptedData = await Encrypt({username: username, password: password});

    // web3
    if (await state.signer){
      const WriterContractAddress="0x0794527f044fCDeFcdCa82Cf4010c9Ad4644e90D";
      const ct = new ethers.Contract(WriterContractAddress, WriterABI.abi, state.signer);
      await ct.addPassword(libelle, encryptedData);
      console.log("transaction pending...");
      // Reset inputs back to original state
      setNewLibelle("");
      setNewUsername("");
      setNewPassword("");
    }else{
      connect();
    }
    
  }

  // useEffect(() => {
  //   // run something every time name changes
  //   let id = show === -1 ? (showEdit !== -1 ? showEdit : null) :show;
  //   if (id !== null){console.log(id)} 
  //   // if (id !== null){showData(id)} 
  // }, [show, showEdit]);

  async function toggleShow(id) {
    
    // Get the current item
    const currentItem = items.filter((item) => item.id === id);

    // Change state
    if (currentItem[0].show === false){
      currentItem[0].show = !currentItem[0].show;
      const decryptedData = await Decrypt(currentItem[0].encryptedData);
      currentItem[0].username = await decryptedData.username;
      currentItem[0].password = await decryptedData.password;
    } else {
      currentItem[0].show = false;
    }
    
    // Refresh the state
    setItems((oldList) => [...oldList]);
  }

  /* Deletes an item based on the `item.id` key */
  function deleteItem(id) {
    alert("[currently not working] Are you sure to delete this password ?");
    // const newArray = items.filter((item) => item.id !== id);
    // setItems(newArray);
  }

  /* Edit an item text after creating it. */
  async function editItem(id, libelle, username, password) {
    alert("[currently not working] to do...");
    // Get the current item
    // const currentItem = items.filter((item) => item.id === id);

    // // Create a new item with same id
    // const newItem = {
    //   id: currentItem.id,
    //   libelle: libelle,
    //   encryptedData: await Encrypt({username: username, password: password})
    // };

    // deleteItem(id);

    // // Replace item in the item list
    // setItems((oldList) => [...oldList, newItem]);
    // setUpdatedText("");
    // setShowEdit(-1);
  }

  function resetStates(id) {
    setShowEdit(-1);
    toggleShow(id);
  }

  function formatAddress(address) {
    console.log(address);
    let start = address.substr(0, 5);
    let end = address.substr(address.length-5, 5);
    return start + '...' + end;
  }

  // Main part of app
  return (
    <div className="app bg-slate-400 dark:bg-slate-700 h-screen text-black dark:text-white">
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
            <SearchApp data={items} functions={[deleteItem, setShowEdit, toggleShow]}/>
            {items.length == 0 ? <button className="btn-n" onClick={() => getData()}>Get Data from the Blockchain</button> : null}
          </div>
        :null}

          {items.map((item) => {
            return (
              <div key={item.id}>
                
                {showEdit === item.id || item.show === true? (
                  <div>
                    <div className="inline-grid">
                      <label htmlFor="libelle">Libelle</label>
                      <input disabled={item.show ? "disabled":""} type="text" name="libelle" value={libelle} placeholder={item.libelle} onChange={(e) => setUpdatedText(e.target.value)}/>
                    </div>
                    <div className="inline-grid">
                      <label htmlFor="username">Username</label>
                      <input disabled={item.show ? "disabled":""} type="text" name="username" value={username} placeholder={item.username} onChange={(e) => setUpdatedText(e.target.value)}/>
                    </div>
                    <div className="inline-grid">
                      <label htmlFor="password">Password</label>
                      <input disabled={item.show ? "disabled":""} type="text" name="password" value={password} placeholder={item.password} onChange={(e) => setUpdatedText(e.target.value)}/>
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


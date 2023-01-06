import React, { useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import SearchApp from './components/table.js';

function App() {
  // State Hook - `useState`
  const [libelle, setNewLibelle] = useState("");
  const [username, setNewUsername] = useState("");
  const [password, setNewPassword] = useState("");
  const [items, setItems] = useState([]);

  const [showEdit, setShowEdit] = useState(-1);
  const [updatedText, setUpdatedText] = useState("");

  const [state, setState] = useState({});

  // Web3 
  const connect = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();
        const network = await provider.getNetwork();
        const networkName = network.name;
        const chainId = network.chainId;
        setState({providerData: {networkName, chainId, signerAddress}, provider, signer});
        console.log("Metamask connecté sur "+ networkName)
    } catch (error) {
      console.log(error);
      setState({error: "une erreur est survenue"});
    };
  };

  // Helper Functions

  /* Adds a new item to the list array*/
  function addItem() {
    // ! Check for empty item
    if (!libelle) {
      alert("Press enter an libelle.");
      return;
    }

    const item = {
      id: Math.floor(Math.random() * 1000),
      libelle: libelle,
      username: username,
      password: password,
    };

    // Add new item to items array
    setItems((oldList) => [...oldList, item]);

    // Reset libelle back to original state
    setNewLibelle("");
    setNewUsername("");
    setNewPassword("");
  }

  /* Deletes an item based on the `item.id` key */
  function deleteItem(id) {
    const newArray = items.filter((item) => item.id !== id);
    setItems(newArray);
  }

  /* Edit an item text after creating it. */
  function editItem(id, libelle, username, password) {
    // Get the current item
    const currentItem = items.filter((item) => item.id === id);

    // Create a new item with same id
    const newItem = {
      id: currentItem.id,
      libelle: libelle,
      username: username,
      password: password,
    };

    deleteItem(id);

    // Replace item in the item list
    setItems((oldList) => [...oldList, newItem]);
    setUpdatedText("");
    setShowEdit(-1);
  }


  // Main part of app
  return (
    <div className="app">
      {/* 1. Header  */}
      <h1>My Todo List</h1>
      {/* 1.BIS  Metamask  */}
      <div style={{padding: '1em'}}>
        <button className="button" onClick={connect}>Connecter Metamask</button>
      </div>

      {/* 2. Add new item (input) */}
      <input type="text" placeholder="Add a website name" value={libelle} onChange={(e) => setNewLibelle(e.target.value)}/>
      <input type="text" placeholder="Add your username" value={username} onChange={(e) => setNewUsername(e.target.value)}/>
      <input type="text" placeholder="Add your password" value={password} onChange={(e) => setNewPassword(e.target.value)}/>

      {/* Add (button) */}
      <button onClick={() => addItem()}>Add</button>

      {/* 3. List of todos (unordered list) */}
      <div style={{padding: '1em'}}>
        {showEdit === -1 ? <SearchApp data={items} functions={[deleteItem, setShowEdit]}/> : null}

          {items.map((item) => {
            return (
              <div>
                
                {showEdit === item.id ? (
                  <div>
                    <input type="text" value={libelle} placeholder={item.libelle} onChange={(e) => setUpdatedText(e.target.value)}/>
                    <input type="text" value={username} placeholder={item.username} onChange={(e) => setUpdatedText(e.target.value)}/>
                    <input type="text" value={password} placeholder={item.password} onChange={(e) => setUpdatedText(e.target.value)}/>

                    <button onClick={() => editItem(item.id, libelle, username, password)}>Update</button>
                    <button onClick={() => setShowEdit(-1)}>Cancel</button>
                  </div>
                ) : null}
              </div>
            );
          })}
        
      </div>
      
    </div>
  );
}

export default App;

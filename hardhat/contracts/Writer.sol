// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Writer {

    pObject[] private passwordList;

    struct pObject {
        string libelle;
        string encryptedData;
    }

    function addPassword(string memory _libelle, string memory _encryptedData) public {
        pObject memory newP = pObject(_libelle, _encryptedData);
        passwordList.push(newP);     
    }

    function getData() public view returns (pObject[] memory){
        return passwordList;
    }
}
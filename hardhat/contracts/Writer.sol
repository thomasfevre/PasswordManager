// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Writer {

    mapping(address => pObject[]) userData;

    struct pObject {
        string libelle;
        string encryptedData;
    }

    function addPassword(string memory _libelle, string memory _encryptedData) external {
        pObject memory newP = pObject(_libelle, _encryptedData);
        pObject[] storage _passwordList = userData[msg.sender];
        _passwordList.push(newP);     
    }

    function removePassword(string memory _libelle) external {
        pObject[] storage _passwordList = userData[msg.sender];
        removeArray(IndexOf(_passwordList, _libelle), _passwordList);
    }

    function getData() public view returns (pObject[] memory){
        return userData[msg.sender];
    }

    function removeArray(
        uint256 index, pObject[] storage array
    ) internal returns(pObject[]storage){
        if (index <= array.length) {
            array[index] = array[array.length - 1];
            array.pop();
        }        
        return array;
    }

    /** Finds the index of a given value in an array. */
    function IndexOf(pObject[] memory values, string memory value) internal pure returns(uint) {
        uint i = 0;
        while (!compareStrings(values[i].libelle, value)) {
            i++;
        }
        return i;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
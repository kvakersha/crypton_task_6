let jsonAbi = [
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_newValue",
          "type": "bool"
        }
      ],
      "name": "setSolve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "solved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];


import { ethers } from "hardhat";

async function main() {
   const iface = new ethers.utils.Interface(jsonAbi);
   const calldata = iface.encodeFunctionData('setSolve',[true]);

   console.log(calldata);
   
}


main()


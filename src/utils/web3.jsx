import Web3 from 'web3';
import PasswordManager from "../components/PasswordManager.json"
// Ganache default port
export const ABI = PasswordManager.abi;
export const web3 = new Web3(window.ethereum);

export const contractAddress = "0x4C7D9861d53f0505542039231409C657dee5cF99";

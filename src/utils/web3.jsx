import Web3 from 'web3';
import PasswordManager from "../components/PasswordManager.json"
// Ganache default port
export const ABI = PasswordManager.abi;
export const web3 = new Web3(window.ethereum);

export const contractAddress = "0x545b747be24f068ed794faf361724b7f2a914411";

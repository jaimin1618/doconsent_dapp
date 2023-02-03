import { ethers } from "ethers";
import { address } from "../../../constants";
import ABI from "../../../abi.json";

// Meta Mask and Wallet functions
async function requestAccounts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function getOwner() {
  const signer = await requestAccounts();
  const contract = new ethers.Contract(address, ABI.abi, signer);
  const owner = await contract.owner();
  console.log(owner);
}

async function getAddress() {
  const signer = await requestAccounts();
  const address = signer.getAddress();
  return address;
}

// SC interactions
async function insertUserData(data_name, data_cid) {
  var status;

  try {
    const signer = await requestAccounts();
    const contract = new ethers.Contract(address, ABI.abi, signer);
    const tx = await contract.addUserData(data_name, data_cid);
    status = await tx.wait();
    if (!status) status = false;
  } catch (e) {
    console.error("Error occured: ", e);
    status = false;
  }

  return status;
}

async function getCurrentUserDataIndexes() {
  const signer = await requestAccounts();
  const contract = new ethers.Contract(address, ABI.abi, signer);
  const data = await contract.getSenderUserDataIndexes();
  return data;
}

async function getUserDataByID(data_id) {
  const signer = await requestAccounts();
  const contract = new ethers.Contract(address, ABI.abi, signer);
  const data = await contract.readUserData(data_id);
  return data;
}

async function removeUserData(data_id) {
  var status;

  try {
    const signer = await requestAccounts();
    const contract = new ethers.Contract(address, ABI.abi, signer);
    const tx = await contract.removeUserData(data_id);
    status = await tx.wait();
    if (!status) status = false;
  } catch (e) {
    console.error("Error occured: ", e);
    status = false;
  }

  return status;
}

export default {
  requestAccounts,
  getOwner,
  insertUserData,
  getCurrentUserDataIndexes,
  getAddress,
  getUserDataByID,
  removeUserData,
};

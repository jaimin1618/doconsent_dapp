import { create } from "ipfs-http-client";
const environment = process.env.REACT_APP_ENVIRONMENT;

const node =
  environment === "development"
    ? create(process.env.REACT_APP_LOCAL_IPFS_NODE)
    : create();

/** Run below scripts to run local IPFS node on your machine
 * npm install -g ipfs
 * jsipfs daemon
 */

async function upload_data(data) {
  const file = await node.add(JSON.stringify(data));
  return file.cid.toString();
}

async function read_data(cid) {
  if (cid === "" || cid === null) {
    throw Error("found empty CID for data read");
    
  }
  const decoder = new TextDecoder();
  const stream = await node.cat(cid);
  let data = "";

  for await (const chunk of stream) {
    data += decoder.decode(chunk, { stream: true });
  }

  return data;
}

const _ = {
  upload_data,
  read_data,
};

export default _;

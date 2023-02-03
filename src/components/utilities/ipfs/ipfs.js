import { create } from "ipfs-http-client";
const node = create("http://127.0.0.1:5002");

async function upload_data(data) {
  const file = await node.add(JSON.stringify(data));
  return file.cid.toString();
}

async function read_data(cid) {
  if (cid == "" || cid == null) {
    throw Error("found empty CID for data read");
    return;
  }
  const decoder = new TextDecoder();
  const stream = await node.cat(cid);
  let data = "";

  for await (const chunk of stream) {
    data += decoder.decode(chunk, { stream: true });
  }

  return data;
}

export default {
  upload_data,
  read_data,
};
import { create } from "ipfs";

async function upload_data(data) {
  const node = await create();
  const file = await node.add(JSON.stringify(data));
  return file.cid.toString();
}

async function read_data(cid) {
  if (cid === "" || cid === null) {
    throw Error("found empty CID for data read");
  }

  const node = await create();
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

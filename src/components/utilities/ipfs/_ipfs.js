import { create } from "ipfs";

async function main() {
  const node = await create();
  return node;
}



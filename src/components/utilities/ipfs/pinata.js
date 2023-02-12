import axios from "axios";

async function isApplicationConnectedWithPinata() {
  var config = {
    method: "get",
    url: "https://api.pinata.cloud/data/testAuthentication",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
  };

  const res = await axios(config);
  console.log(res.data);
}

async function pin_file(formData) {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
        },
      }
    );

    const response = res.data;
    return response;
  } catch (error) {
    console.log("PINATA FILE UPLOAD ERROR", error);
  }
}

async function unpin_file(cid) {
  var config = {
    method: "delete",
    url: `https://api.pinata.cloud/pinning/unpin/${cid}`,
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
  };

  const res = await axios(config);
  return res;
}

const _ = {
  isApplicationConnectedWithPinata,
  pin_file,
  unpin_file,
};

export default _;

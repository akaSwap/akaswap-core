// src/libs/torus.ts
import { blake2b } from "blakejs";
import Bs58check from "bs58check";
import * as elliptic from "elliptic";
import FetchNodeDetails from "@toruslabs/fetch-node-details";
import TorusUtils from "@toruslabs/torus.js";
var web3AuthClientId = "BBHmFdLXgGDzSiizRVMWtyL_7Dsoxu5B8zep2Pns8sGELslgXDbktJewVDVDDBlknEKkMCtzISLjJtxk60SK2-g";
var verifierMap = {
  google: {
    name: "Google",
    verifier: "tezos-google",
    caseSensitiveVerifierID: false
  },
  twitter: {
    name: "Twitter",
    verifier: "tezos-twitter",
    caseSensitiveVerifierID: false
  }
};
var prefix = {
  tz1: new Uint8Array([6, 161, 159]),
  tz2: new Uint8Array([6, 161, 161]),
  tz3: new Uint8Array([6, 161, 164]),
  edpk: new Uint8Array([13, 15, 37, 217]),
  sppk: new Uint8Array([3, 254, 226, 86]),
  edsk: new Uint8Array([43, 246, 78, 7]),
  spsk: new Uint8Array([17, 162, 224, 201]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  spsig: new Uint8Array([13, 115, 101, 19, 63]),
  sig: new Uint8Array([4, 130, 43]),
  o: new Uint8Array([5, 116]),
  B: new Uint8Array([1, 52]),
  TZ: new Uint8Array([3, 99, 29]),
  KT: new Uint8Array([2, 90, 121])
};
var nodeDetails = null;
function buf2hex(buffer) {
  const byteArray = new Uint8Array(buffer), hexParts = [];
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16);
    const paddedHex = ("00" + hex).slice(-2);
    hexParts.push(paddedHex);
  }
  return hexParts.join("");
}
function pk2pkh(pk) {
  if (pk.length === 54 && pk.slice(0, 4) === "edpk") {
    const pkDecoded = b58cdecode(pk, prefix.edpk);
    return b58cencode(blake2b(pkDecoded, void 0, 20), prefix.tz1);
  } else if (pk.length === 55 && pk.slice(0, 4) === "sppk") {
    const pkDecoded = b58cdecode(pk, prefix.edpk);
    return b58cencode(blake2b(pkDecoded, void 0, 20), prefix.tz2);
  }
  throw new Error("Invalid public key");
}
function b58cdecode(enc, prefixx) {
  let n = Bs58check.decode(enc);
  n = n.subarray(prefixx.length);
  return n;
}
function b58cencode(payload, prefixx) {
  const n = new Uint8Array(prefixx.length + payload.length);
  n.set(prefixx);
  n.set(payload, prefixx.length);
  return Bs58check.encode(Buffer.from(buf2hex(n), "hex"));
}
function isInvertedPk(pk) {
  const invertedPks = [
    "sppk7cqh7BbgUMFh4yh95mUwEeg5aBPG1MBK1YHN7b9geyygrUMZByr",
    // test variable
    "sppk7bMTva1MwF7cXjrcfoj6XVfcYgjrVaR9JKP3JxvPB121Ji5ftHT",
    "sppk7bLtXf9CAVZh5jjDACezPnuwHf9CgVoAneNXQFgHknNtCyE5k8A"
  ];
  return invertedPks.includes(pk);
}
function spPointsToPkh(pubX, pubY) {
  const key = new elliptic.ec("secp256k1").keyFromPublic({
    x: pubX,
    y: pubY
  });
  const yArray = key.getPublic().getY().toArray();
  const prefixVal = yArray[yArray.length - 1] % 2 ? 3 : 2;
  const pad = new Array(32).fill(0);
  let publicKey = new Uint8Array(
    [prefixVal].concat(pad.concat(key.getPublic().getX().toArray()).slice(-32))
  );
  let pk = b58cencode(publicKey, prefix.sppk);
  if (yArray.length < 32 && prefixVal === 3 && isInvertedPk(pk)) {
    publicKey = new Uint8Array(
      [2].concat(pad.concat(key.getPublic().getX().toArray()).slice(-32))
    );
    pk = b58cencode(publicKey, prefix.sppk);
  }
  const pkh = pk2pkh(pk);
  return pkh;
}
function isValidTwitterId(id) {
  const re = /^[0-9]+$/;
  return re.test(id);
}
async function twitterLookup(username, id) {
  let req = {};
  if (id && username || !id && !username) {
    throw new Error("Invalid input");
  } else if (id) {
    req = { id };
  } else {
    req = { username: username.replace("@", "") };
  }
  return await fetch(`https://backend.kukai.network/twitter-lookup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(req)
  }).then((ans) => {
    return ans.json();
  });
}
async function lookupPkh(selectedVerifier, verifierId) {
  if (!["google", "twitter"].includes(selectedVerifier)) {
    return "";
  }
  const fetchNodeDetails = new FetchNodeDetails({ network: "mainnet" });
  const torus = new TorusUtils({
    clientId: web3AuthClientId,
    network: "mainnet"
  });
  let sanitizedVerifierId = verifierId;
  if (!verifierMap[selectedVerifier].caseSensitiveVerifierID && selectedVerifier !== "twitter") {
    sanitizedVerifierId = sanitizedVerifierId.toLocaleLowerCase();
  }
  let twitterId = "";
  if (selectedVerifier === "twitter") {
    const username = sanitizedVerifierId.replace("@", "");
    const { id } = await twitterLookup(username);
    if (isValidTwitterId(id)) {
      sanitizedVerifierId = `twitter|${id}`;
      twitterId = id;
    } else {
      return "";
    }
  }
  const verifier = verifierMap[selectedVerifier].verifier;
  if (!nodeDetails) {
    nodeDetails = await fetchNodeDetails.getNodeDetails({
      verifier,
      verifierId: sanitizedVerifierId
    });
  }
  try {
    const pk = await torus.getPublicAddress(
      nodeDetails.torusNodeEndpoints,
      nodeDetails.torusNodePub,
      { verifier, verifierId: sanitizedVerifierId }
    );
    const pkh = spPointsToPkh(pk.finalKeyData.X, pk.finalKeyData.Y);
    return pkh;
  } catch (e) {
    console.log(e);
    return "";
  }
}

// src/functions.ts
var showWallet = ({
  wallet = "",
  alias = "",
  full = false,
  digits = 5
}) => {
  try {
    if (alias !== "") {
      return alias;
    } else if (!full && wallet.length > digits * 2) {
      return `${wallet.slice(0, digits)}...${wallet.slice(-1 * digits)}`;
    } else return wallet;
  } catch (e) {
    return "";
  }
};
var getIpfsSrc = (gateway, url) => {
  let hash = url.startsWith("ipfs://") ? url.split("ipfs://")[1] : url;
  if (gateway[gateway.length - 1] !== "/") gateway += "/";
  return `${gateway}${hash}`;
};
var lookUpWallet = async (identifier) => {
  const address = await lookupPkh("google", identifier);
  return address;
};

// src/user.ts
var AkaSwapUser = class {
  walletStatus = "disconnected";
  walletAddress = null;
  identifier = "google";
  getWalletStatus() {
    return this.walletStatus;
  }
  getWalletAddress() {
    return this.walletAddress;
  }
  getIdentifier() {
    return this.identifier;
  }
  async connectWallet() {
    this.walletStatus = "connecting";
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    this.walletAddress = "tz123123123";
    this.walletStatus = "connected";
  }
  async disconnectWallet() {
    this.walletStatus = "disconnecting";
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    this.walletAddress = null;
    this.walletStatus = "disconnected";
  }
};
var akaSwapUser = new AkaSwapUser();

// src/types/akaswap.ts
var MediaLevel = /* @__PURE__ */ ((MediaLevel2) => {
  MediaLevel2[MediaLevel2["thumbnail"] = 0] = "thumbnail";
  MediaLevel2[MediaLevel2["display"] = 1] = "display";
  MediaLevel2[MediaLevel2["artifact"] = 2] = "artifact";
  return MediaLevel2;
})(MediaLevel || {});
var MediaType = /* @__PURE__ */ ((MediaType2) => {
  MediaType2["BMP"] = "image/bmp";
  MediaType2["GIF"] = "image/gif";
  MediaType2["JPEG"] = "image/jpeg";
  MediaType2["PNG"] = "image/png";
  MediaType2["SVG"] = "image/svg+xml";
  MediaType2["WEBP"] = "image/webp";
  MediaType2["MP4"] = "video/mp4";
  MediaType2["OGV"] = "video/ogg";
  MediaType2["QUICKTIME"] = "video/quicktime";
  MediaType2["WEBM"] = "video/webm";
  MediaType2["GLB"] = "model/gltf-binary";
  MediaType2["GLTF"] = "model/gltf+json";
  MediaType2["MP3"] = "audio/mpeg";
  MediaType2["OGA"] = "audio/ogg";
  MediaType2["PDF"] = "application/pdf";
  MediaType2["X_DIRECTORY"] = "application/x-directory";
  MediaType2["ZIP"] = "application/zip";
  MediaType2["ZIP1"] = "application/x-zip-compressed";
  MediaType2["ZIP2"] = "multipart/x-zip";
  return MediaType2;
})(MediaType || {});
export {
  MediaLevel,
  MediaType,
  akaSwapUser,
  getIpfsSrc,
  lookUpWallet,
  showWallet
};

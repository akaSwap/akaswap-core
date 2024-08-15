// The MIT License (MIT)
// Copyright (c) 2018 Kukai

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Modified from https://github.com/kukai-wallet/kukai

import { blake2b } from "blakejs";
import Bs58check from "bs58check";
import * as elliptic from "elliptic";
import FetchNodeDetails from "@toruslabs/fetch-node-details";
import { INodeDetails } from "@toruslabs/constants";
import TorusUtils, { TorusPublicKey } from "@toruslabs/torus.js";

const web3AuthClientId =
  "BBHmFdLXgGDzSiizRVMWtyL_7Dsoxu5B8zep2Pns8sGELslgXDbktJewVDVDDBlknEKkMCtzISLjJtxk60SK2-g";

const verifierMap = {
  google: {
    name: "Google",
    verifier: "tezos-google",
    caseSensitiveVerifierID: false,
  },
  twitter: {
    name: "Twitter",
    verifier: "tezos-twitter",
    caseSensitiveVerifierID: false,
  },
};

const prefix = {
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
  KT: new Uint8Array([2, 90, 121]),
};

let nodeDetails: INodeDetails | null = null;

function buf2hex(buffer: Uint8Array) {
  const byteArray = new Uint8Array(buffer),
    hexParts = [];
  for (let i = 0; i < byteArray.length; i++) {
    const hex = byteArray[i].toString(16);
    const paddedHex = ("00" + hex).slice(-2);
    hexParts.push(paddedHex);
  }
  return hexParts.join("");
}

function pk2pkh(pk: string) {
  if (pk.length === 54 && pk.slice(0, 4) === "edpk") {
    const pkDecoded = b58cdecode(pk, prefix.edpk);
    return b58cencode(blake2b(pkDecoded, undefined, 20), prefix.tz1);
  } else if (pk.length === 55 && pk.slice(0, 4) === "sppk") {
    const pkDecoded = b58cdecode(pk, prefix.edpk);
    return b58cencode(blake2b(pkDecoded, undefined, 20), prefix.tz2);
  }
  throw new Error("Invalid public key");
}

function b58cdecode(enc: string, prefixx: Uint8Array) {
  let n = Bs58check.decode(enc);
  n = n.subarray(prefixx.length);
  return n;
}

function b58cencode(payload: Uint8Array, prefixx: Uint8Array) {
  const n = new Uint8Array(prefixx.length + payload.length);
  n.set(prefixx);
  n.set(payload, prefixx.length);
  return Bs58check.encode(Buffer.from(buf2hex(n), "hex"));
}

function isInvertedPk(pk: string) {
  /*
      Detect keys with flipped sign and correct them.
    */
  const invertedPks = [
    "sppk7cqh7BbgUMFh4yh95mUwEeg5aBPG1MBK1YHN7b9geyygrUMZByr", // test variable
    "sppk7bMTva1MwF7cXjrcfoj6XVfcYgjrVaR9JKP3JxvPB121Ji5ftHT",
    "sppk7bLtXf9CAVZh5jjDACezPnuwHf9CgVoAneNXQFgHknNtCyE5k8A",
  ];
  return invertedPks.includes(pk);
}

function spPointsToPkh(pubX: string, pubY: string) {
  const key = new elliptic.ec("secp256k1").keyFromPublic({
    x: pubX,
    y: pubY,
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

function isValidTwitterId(id: string) {
  const re = /^[0-9]+$/;
  return re.test(id);
}

async function twitterLookup(username?: string, id?: string) {
  let req = {};
  if ((id && username) || (!id && !username)) {
    throw new Error("Invalid input");
  } else if (id) {
    req = { id };
  } else {
    req = { username: username!.replace("@", "") };
  }
  return await fetch(`https://backend.kukai.network/twitter-lookup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(req),
  }).then((ans) => {
    return ans.json();
  });
}

export async function lookupPkh(
  selectedVerifier: "google" | "twitter",
  verifierId: string
) {
  if (!["google", "twitter"].includes(selectedVerifier)) {
    return "";
  }

  const fetchNodeDetails = new FetchNodeDetails({ network: "mainnet" });
  const torus = new TorusUtils({
    clientId: web3AuthClientId,
    network: "mainnet",
  });

  let sanitizedVerifierId = verifierId;
  if (
    !verifierMap[selectedVerifier].caseSensitiveVerifierID &&
    selectedVerifier !== "twitter"
  ) {
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
      // throw new Error('Twitter handle not found')
    }
  }
  const verifier = verifierMap[selectedVerifier].verifier;
  if (!nodeDetails) {
    nodeDetails = await fetchNodeDetails.getNodeDetails({
      verifier,
      verifierId: sanitizedVerifierId,
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

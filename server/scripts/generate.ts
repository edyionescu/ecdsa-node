import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex as toHex } from 'ethereum-cryptography/utils.js';
import { getAddress } from '../lib/index.ts';

console.clear();

function generate() {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);
  const address = getAddress(toHex(publicKey));

  return {
    'Address': address,
    'Private key': toHex(privateKey),
  };
}

console.table([generate(), generate(), generate()]);

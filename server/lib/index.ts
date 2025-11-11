import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex as toHex, utf8ToBytes } from 'ethereum-cryptography/utils.js';

function getPublicKeyFromSignature(message: string, signatureHex: string, bit: number) {
  try {
    const messageHash = _hashMessage(message);
    let sig = secp256k1.Signature.fromCompact(signatureHex);
    sig = sig.addRecoveryBit(bit); // bit is not serialized into compact

    const publicKey = sig.recoverPublicKey(messageHash).toHex();
    const isValidSig = secp256k1.verify(sig, messageHash, publicKey);

    return { publicKey, isValidSig };
  } catch (error) {
    console.error('Error getting public key from signature:', error);
    return { publicKey: '', isValidSig: false };
  }
}

function getAddress(publicKey: string) {
  try {
    const hash = keccak256(utf8ToBytes(publicKey.slice(1)));
    const address = hash.slice(-20);
    return toHex(address);
  } catch (error) {
    console.error('Error in getAddress:', error);
    return '';
  }
}

function _hashMessage(message: string) {
  return keccak256(utf8ToBytes(message));
}

export { getAddress, getPublicKeyFromSignature };

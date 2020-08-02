import * as openpgp from 'openpgp'

export async function decrypt ({ message, passphrase, privateKey, publicKey }) {
  console.log(
    { message, passphrase }
  )
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0]
  await privKeyObj.decrypt(passphrase)

  const options = {
    message: await openpgp.message.readArmored(message),
    // publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification (optional)
    privateKeys: [privKeyObj]
  }

  const plaintext = await openpgp.decrypt(options)
  return plaintext
}


export async function encrypt ({ message, passphrase, privateKey, publicKey }) {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0]
  await privKeyObj.decrypt(passphrase)

  const options = {
    message: openpgp.message.fromText(message),
    armored: false,
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification (optional)
    privateKeys: [privKeyObj]
  }

  const cyphertext = await openpgp.encrypt(options)
  return cyphertext
}

export async function getKeyMetadata ({ armoredText }) {
  console.log(armoredText)
  const { keys } = await openpgp.key.readArmored(armoredText)
  const [key] = keys
  const [userId] = key.getUserIds()
  const keyId = key.getKeyId()
  const fingerprint = key.getFingerprint()
  const creationTime = key.getCreationTime()
  return {
    creationTime,
    armoredText,
    userId,
    keyId,
    fingerprint
  }
}

export async function generateKeyPair(options) {
  const { key, publicKeyArmored, privateKeyArmored } = await openpgp.generateKey(options)
  const { userIds } = options
  const keyId = key.getKeyId()
  const fingerprint = key.getFingerprint()
  const creationTime = key.getCreationTime()
  return {
    userId: userIds[0],
    creationTime,
    keyId,
    fingerprint,
    publicKey: publicKeyArmored,
    privateKey: privateKeyArmored
  }
}
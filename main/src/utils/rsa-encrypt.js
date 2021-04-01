import JsEncrypt from 'jsencrypt'

export function RsaEncrypt(encrypt_msg) {
  const jse = new JsEncrypt()
  jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCyjkq+6dprIu6otbW9gWtHRyDJ
U/yjOcKMJji5TEYGnrHeFPOrj6EaiwTAvJ7j4NLG5GlPiN9BQDCclNIezSCOpG7S
oYLXqosg3rSXL+hJ3GFxp/p+mRznlStnnoGSeO+grP/Z3HBC7/fCIu9mKtfr+WNt
k79eySj0s/3eaFHucQIDAQAB
-----END PUBLIC KEY-----`)
  console.log(encrypt_msg)
  const encrypted = jse.encrypt(encrypt_msg)
  console.log('sss', encrypted)
  return encrypted
}


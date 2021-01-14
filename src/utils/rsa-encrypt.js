
import JSEncrypt from 'jsencrypt'


const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4HEvsdD0q5Tm462RLPFVs8kfWDX0Z9aRVb0EaAkkGWiTFCv4FWt8PZABCYuazuUVQXbiB8jOY1TBjj33uxdgkkWA57ws241D5hKSsf+C+k55kyL6Xbb56yBDXBD9f5dhLaAHrSVFgEEVnt/xtgyT42gvL7R79ksnDNytT7hEPEQIDAQAB'

const privateKey = ''

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
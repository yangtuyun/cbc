import { CBC } from "./mode-cbc";
import { pkcs7Strip } from "./padding";
function uint6ToB64(nUint6: number) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
    ? nUint6 + 71
    : nUint6 < 62
    ? nUint6 - 4
    : nUint6 === 62
    ? 43
    : nUint6 === 63
    ? 47
    : 65;
}
function baseEn(aBytes: Uint8Array) {
  let nMod3 = 2;
  let sB64Enc = "";

  const nLen = aBytes.length;
  let nUint24 = 0;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    // To break your base64 into several 80-character lines, add:
    //   if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
    //      sB64Enc += "\r\n";
    //    }

    nUint24 |= aBytes[nIdx] << ((16 >>> nMod3) & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCodePoint(
        uint6ToB64((nUint24 >>> 18) & 63),
        uint6ToB64((nUint24 >>> 12) & 63),
        uint6ToB64((nUint24 >>> 6) & 63),
        uint6ToB64(nUint24 & 63)
      );
      nUint24 = 0;
    }
  }
  return (
    sB64Enc.substring(0, sB64Enc.length - 2 + nMod3) +
    (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==")
  );
}
fetch(
  "http://alist.yangtuyun.cn/d/v2/23-03-30-22-51-19/images_23-03-30-22-51-19.gif"
)
  .then((res) => res.arrayBuffer())
  .then((res) => {
    const oldData = new Uint8Array(res);

    let imageData = oldData.slice(3610);
    console.log(imageData, "imageData");
    const key = imageData.slice(0, 32);
    console.log(key, "key");
    
    imageData = imageData.slice(32);
    const iv = imageData.slice(0, 16);
    console.log(iv, "iv");

    const data = imageData.slice(16);
    console.log(data, "data");
    const mode = new CBC(key, iv);
    const data2 = mode.decrypt(data);
    // const data3 = pkcs7Strip(data2);
    // console.log(baseEn(data3),"data3")
    console.log(data2,"data2")
  });

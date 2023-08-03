// IDトークンを暗号化して保存する関数
export const saveTokenToLocalStorage = (
  token: string,
  encryptionKey: string
): void => {
  // const encryptedToken = CryptoJS.AES.encrypt(token, encryptionKey).toString();
  // localStorage.setItem("idToken", encryptedToken);
  console.log("トークンを保存します。: ", token);
  localStorage.setItem("idToken", token);
};

// IDトークンを復号化して取得する関数
export const getTokenFromLocalStorage = (
  encryptionKey: string
): string | null => {
  // const encryptedToken = localStorage.getItem("idToken");
  // if (encryptedToken) {
  //   const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, encryptionKey);
  //   const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  //   return decryptedToken || null;
  // }
  // return null;
  const token = localStorage.getItem("idToken");
  console.log("トークンを復元します。: ", token);
  return token;
};

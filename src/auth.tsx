import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const AuthComponent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idToken, setIdToken] = useState("");

  const handleLogin = async (username: string, password: string) => {
    try {
      let user = await Auth.signIn(username, password);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        Auth.completeNewPassword(user, password);
        user = await Auth.signIn(username, password);
      }
      const token = user.signInUserSession.idToken.jwtToken;
      setIdToken(token);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleLogin(username, password)}>ログイン</button>
      <p>IDトークン: {idToken}</p>
    </div>
  );
};

export default AuthComponent;

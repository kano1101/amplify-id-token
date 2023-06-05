// import React, { useEffect} from "react";
import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async (email: string, password: string): Promise<any> => {
    let user = await Auth.signIn(email, password);
    if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
      user = await Auth.completeNewPassword(user, password);
    }
    const token = user.signInUserSession.idToken.jwtToken;
    console.log("ログインしました。");
    return token;
  };
  const displayName = async (idToken: string) => {
    try {
      if (idToken !== "") {
        const headers = { Authorization: `Bearer ${idToken}` };
        fetch("http://localhost:9000/lambda-url/", { headers })
          .then((response) => response.json())
          .then((user) => setUsername(user.username));
      } else {
        console.log("トークンがありません。先にログインしてください。");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const total = async () => {
    const token = await handleLogin(email, password);
    await displayName(token);
  };

  return (
    <div className="App">
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => total()}>これでOK</button>
      <p>ログインユーザ: {username}</p>
    </div>
  );
};

export default AuthComponent;

// import React, { useEffect} from "react";
import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cost, setCost] = useState([]);
  // const [username, setUsername] = useState("");
  // const [token, setToken] = useState("");

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
        const headers = {
          Authorization: `Bearer ${idToken}`,
          // Origin: "https://main.d3e5hnts8pqc2m.amplifyapp.com",
          // Origin: "http://localhost:3000",
        };
        // setToken(idToken);
        fetch(
          "https://21xyrztruh.execute-api.ap-northeast-1.amazonaws.com/dev/auth",
          {
            method: "POST",
            mode: "cors",
            headers,
          }
        )
          .then((response) => response.json())
          .then((amount_costs) => setCost(cost + amount_costs));
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
      <div>
        <p>Cost: {cost}</p>
      </div>
    </div>
  );
};

export default AuthComponent;

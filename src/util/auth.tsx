import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { saveTokenToLocalStorage } from "./storage";
import { getTokenFromLocalStorage } from "./storage";
import {
  getEnvContext,
  setAuthHeadersWithBearerAndOrigin,
  constructRequestHeader,
  fetchWithCors,
} from "./login";

Amplify.configure(awsconfig);

async function handleLogin(email: string, password: string): Promise<string> {
  let user = await Auth.signIn(email, password);
  if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
    user = await Auth.completeNewPassword(user, password);
  }
  const token = user.signInUserSession.idToken.jwtToken;
  return token;
}

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cost, setCost] = useState(0);
  const [token, setToken] = useState("");
  async function calcCost() {
    try {
      // const idToken: string | null = getTokenFromLocalStorage("");
      // if (idToken === null) {
      //   console.log("トークンがありません。先にログインしてください。");
      //   return;
      // }
      const idToken: string = token;

      console.log("コストの素材を収集します。1", idToken);
      const ctx = getEnvContext();

      console.log("コストの素材を収集します。2", ctx);
      const authHeaders = setAuthHeadersWithBearerAndOrigin(ctx, idToken);

      console.log("コストの素材を収集します。3", authHeaders);
      const requestHeader = constructRequestHeader(ctx, authHeaders);

      console.log("コストの素材を収集します。4", requestHeader);
      // 環境変数PRODUCTION_URLにAPI GatewayのリソースへのURLを設定しておくこと
      // 指定がなければ自動的にhttp://localhost:9000/lambda_url/となる
      const url: string = "http://localhost:9000/lambda_url/";
      const response = await fetchWithCors(ctx, requestHeader, url);

      console.log("コストの素材を収集します。5", response);
      const amount_costs = await response.json();

      console.log("コストの素材を収集します。6", amount_costs);
      const resultCost = sumCosts(amount_costs);

      console.log("コストを計算しました。");
      setCost(resultCost);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
  type AmountCost = {
    amount: number;
  };

  function sumCosts(amount_costs: AmountCost[]): number {
    const costs: number[] = [];
    for (const item of amount_costs) {
      costs.push(item.amount);
    }
    console.log(costs);
    const resultCost = costs.reduce(function (a, x) {
      return a + x;
    }, 0);
    return resultCost;
  }

  const login = async () => {
    const token = await handleLogin(email, password);
    setToken(token);
    console.log("トークンを取得しました。");
    // saveTokenToLocalStorage(token, "");
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
      <button onClick={() => login()}>ログイン</button>
      <div>
        <p>Token: {token}</p>
      </div>
      <div>
        <button onClick={() => calcCost()}>計算</button>
        <p>Cost: {cost}</p>
      </div>
    </div>
  );
};

export default AuthComponent;

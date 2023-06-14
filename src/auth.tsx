import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

type Header = {
  Authorization: string;
  Origin?: string;
};
type RequestHeader = { method: string; headers: Header };
type InputRequestHeader = {
  requestHeader: RequestHeader;
  lambdaUrl: string;
};

type EnvContext = {
  LAMBDA_URL: string;
  METHOD: string;
  ORIGIN?: string;
};
function getEnvContext(): EnvContext {
  const LAMBDA_URL =
    process.env.REACT_APP_LAMBDA_URL || "http://localhost:9000/lambda_url/";
  const METHOD = process.env.REACT_APP_METHOD || "GET";
  const ORIGIN = process.env.REACT_APP_ORIGIN;

  const result = {
    LAMBDA_URL,
    METHOD,
    ORIGIN,
  };

  console.log(result);

  return result;
}

async function handleLogin(email: string, password: string): Promise<string> {
  let user = await Auth.signIn(email, password);
  if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
    user = await Auth.completeNewPassword(user, password);
  }
  const token = user.signInUserSession.idToken.jwtToken;
  return token;
}

function setAuthHeadersWithBearerAndOrigin(
  ctx: EnvContext,
  idToken: string
): Header {
  let headers: { Authorization: string; Origin?: string } = {
    Authorization: `Bearer ${idToken}`,
  };

  // 環境変数originが設定されていなければundefinedとなり、
  // API Gatewayの統合レスポンスに指定している
  // OPTIONSメソッドのマッピングテンプレートが自動的に適用される
  headers.Origin = ctx.ORIGIN;

  return headers;
}
function constructInputRequestHeader(
  ctx: EnvContext,
  headers: Header
): InputRequestHeader {
  // 環境変数METHODを変えてPOSTやDELETEメソッドなどに対応させる
  // 環境変数に設定がなければ自動的にGETメソッドとなる
  const method = ctx.METHOD;
  const requestHeader = {
    method: method,
    headers,
  };
  // 環境変数PRODUCTION_URLにAPI GatewayのリソースへのURLを設定しておくこと
  // 指定がなければ自動的にhttp://localhost:9000/lambda_url/となる
  const url: string = ctx.LAMBDA_URL;
  return {
    requestHeader,
    lambdaUrl: url,
  };
}
async function fetchWithCors(input: InputRequestHeader): Promise<Response> {
  const fetcher = fetch(input.lambdaUrl, {
    mode: "cors",
    ...input.requestHeader,
  });
  return fetcher;
}

function sumCosts(amount_costs: any[]): number {
  const costs: number[] = [];
  amount_costs.forEach((item: any, index: number) => {
    costs.push(item.amount);
  });
  const resultCost = costs.reduce(function (a, x) {
    return a + x;
  }, 0);
  return resultCost;
}

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cost, setCost] = useState(0);

  async function displayName(idToken: string) {
    try {
      if (idToken === "") {
        console.log("トークンがありません。先にログインしてください。");
        return;
      }

      const ctx = getEnvContext();

      const authHeaders = setAuthHeadersWithBearerAndOrigin(ctx, idToken);

      const requestHeader = constructInputRequestHeader(ctx, authHeaders);

      const response = await fetchWithCors(requestHeader);

      const amount_costs = await response.json();

      const resultCost = sumCosts(amount_costs);

      setCost(resultCost);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

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
      <button onClick={() => total()}>OK</button>
      <div>
        <p>Cost: {cost}</p>
      </div>
    </div>
  );
};

export default AuthComponent;

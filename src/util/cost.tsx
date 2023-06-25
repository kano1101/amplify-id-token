import React, { useState } from "react";
import { getTokenFromLocalStorage } from "./storage";
import {
  getEnvContext,
  setAuthHeadersWithBearerAndOrigin,
  constructRequestHeader,
  fetchWithCors,
} from "./login";

const CostComponent: React.FC = () => {
  const [cost, setCost] = useState(0);
  async function calcCost() {
    try {
      const idToken: string | null = getTokenFromLocalStorage("");
      if (idToken === null) {
        console.log("トークンがありません。先にログインしてください。");
        return;
      }

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

  return (
    <div className="App">
      <div>
        <button onClick={() => calcCost()}>計算</button>
        <p>Cost: {cost}</p>
      </div>
    </div>
  );
};

export default CostComponent;

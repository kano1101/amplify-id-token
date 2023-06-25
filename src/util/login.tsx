export type Header = {
  Authorization: string;
  Origin?: string;
};
export type RequestHeader = { method: string; headers: Header };

export type EnvContext = {
  LAMBDA_URL1: string;
  METHOD: string;
  ORIGIN?: string;
};
export function getEnvContext(): EnvContext {
  const LAMBDA_URL1 =
    process.env.REACT_APP_LAMBDA_URL1 || "http://localhost:9000/lambda_url";
  const METHOD = process.env.REACT_APP_METHOD || "GET";
  const ORIGIN = process.env.REACT_APP_ORIGIN;

  const result = {
    LAMBDA_URL1,
    METHOD,
    ORIGIN,
  };

  console.log(result);

  return result;
}

export function setAuthHeadersWithBearerAndOrigin(
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
export function constructRequestHeader(
  ctx: EnvContext,
  headers: Header
): RequestHeader {
  // 環境変数METHODを変えてPOSTやDELETEメソッドなどに対応させる
  // 環境変数に設定がなければ自動的にGETメソッドとなる
  const method = ctx.METHOD;
  const requestHeader = {
    method: method,
    headers,
  };
  return requestHeader;
}
export async function fetchWithCors(
  ctx: EnvContext,
  request: RequestHeader,
  url?: string
): Promise<Response> {
  let accessUrl = url || ctx.LAMBDA_URL1;
  const fetcher = fetch(accessUrl, {
    mode: "cors",
    ...request,
  });
  return fetcher;
}

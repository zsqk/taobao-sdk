import { hashFn } from './lib';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * 生成请求签名, 可用于接收淘宝开放平台的请求时的签名验证
 * @param secret 应用密钥
 * @param urlParameters 请求 URL query
 * @param body 请求 body
 */
function genSign(
  secret: string,
  urlParameters: string | {
    [key: string]: string;
  },
  body = '',
): string {
  let headerStr: string;
  if (typeof urlParameters === 'string') {
    headerStr = urlParameters;
  } else {
    headerStr = Object.entries(urlParameters)
      .sort()
      .reduce((acc, v): string => acc + v[0] + v[1], '');
  }
  const str = secret + headerStr + body + secret;
  return hashFn('MD5', str).toUpperCase();
}

/**
 * 检查 (AWS Lambda) HTTP 请求中签名是否正确
 * @param event
 */
function checkSignInLambda(event: APIGatewayProxyEvent): boolean {
  if (!process.env.TOP_SECRET) {
    return false;
  }
  if (event.queryStringParameters === null) {
    return false;
  }
  const { sign = '', ...urlParameters } = event.queryStringParameters;
  if (!sign) {
    return false;
  }
  return (
    sign === genSign(process.env.TOP_SECRET, urlParameters, event.body || '')
  );
}

export { genSign, checkSignInLambda };

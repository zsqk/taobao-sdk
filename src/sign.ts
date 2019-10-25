import { hashFn } from './lib';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 *
 * @param secret 淘宝开放平台
 * @param headerStr
 * @param body 请求 body
 */
function genSign(
  secret: string,
  urlParameters: string | Parameters,
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

interface Parameters {
  [key: string]: string;
}

export { genSign, checkSignInLambda };

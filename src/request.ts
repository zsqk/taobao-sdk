import * as https from 'https';
import { IncomingMessage } from 'http';
import { URLSearchParams } from 'url';
import { genSign } from './sign';
import { IncomingHttpHeaders } from 'http2';

export { topRequest };

/**
 * 普通请求
 */
function request(
  options: https.RequestOptions
): Promise<{
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: string;
}> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res: IncomingMessage) => {
      res.on('data', data => {
        resolve({
          statusCode: res.statusCode as number,
          headers: res.headers,
          body: data.toString(),
        });
      });
    });
    req.on('error', e => {
      reject(e);
    });
    req.end();
  });
}

/**
 * TOP 请求
 */
function topRequest(passParams: { method: string }): Promise<any> {
  if (!process.env.TOP_KEY || !process.env.TOP_SECRET) {
    throw new Error('没有从环境变量中读取到 TOP 密钥');
  }
  const options = {
    hostname:
      process.env.NODE_ENV === 'test'
        ? 'gw.api.tbsandbox.com'
        : 'eco.taobao.com',
    path: '/router/rest',
    method: 'POST',
  };
  const params: { [key: string]: string } = {
    app_key: process.env.TOP_KEY, // eslint-disable-line @typescript-eslint/camelcase
    sign_method: 'md5', // eslint-disable-line @typescript-eslint/camelcase
    timestamp: genTaobaoTimestamp(),
    format: 'json',
    v: '2.0',
  };
  Object.assign(params, passParams);
  const sign = genSign(process.env.TOP_SECRET || '', params);
  params.sign = sign;
  const searchParams = new URLSearchParams(params);
  options.path += `?${searchParams.toString()}`;
  return request(options).then(res => {
    if (res.body) {
      res.body = JSON.parse(res.body);
    }
    return res;
  });
}

function genTaobaoTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = to2PadString(date.getDate());
  const hour = to2PadString(date.getHours());
  const minute = to2PadString(date.getMinutes());
  const second = to2PadString(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function to2PadString(v: number): string {
  return v.toString().padStart(2, '0');
}

import * as crypto from 'crypto';
import { IncomingHttpHeaders } from 'http2';
import * as https from 'https';
import { IncomingMessage } from 'http';

export { hashFn, requestFn };

/**
 * hash 散列函数
 * @param method - 散列类型, 具体值参看 `openssl list-message-digest-algorithms`
 * @param data - 需要散列的数据
 * @param encoding - 编码方式
 * @returns 散列值
 */
function hashFn(
  method: string,
  data: string,
  encoding: crypto.HexBase64Latin1Encoding = 'hex'
): string {
  const hash = crypto.createHash(method);
  hash.update(data, 'utf8');
  return hash.digest(encoding);
}

/**
 * 普通请求 (获取最终数据, 非 steam)
 */
function requestFn(
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
    req.on('error', err => {
      reject(err);
    });
    req.end();
  });
}

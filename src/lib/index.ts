import * as crypto from 'crypto';

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

export { hashFn as hash };

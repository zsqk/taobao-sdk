import { hash } from './lib';

export { genSign };

/**
 *
 * @param secret 淘宝开放平台
 * @param headerStr
 * @param body 请求 body
 */
function genSign(
  secret: string,
  header: string | HeaderObject,
  body: string = ''
) {
  let headerStr: string;
  if (typeof header === 'string') {
    headerStr = header;
  } else {
    headerStr = Object.entries(header)
      .sort()
      .reduce((acc, v) => acc + v[0] + v[1], '');
  }
  const str = secret + headerStr + body + secret;
  return hash('MD5', str).toUpperCase();
}

type HeaderObject = {
  [key: string]: string;
};

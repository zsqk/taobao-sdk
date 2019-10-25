import { URLSearchParams } from 'url';
import { genSign } from './sign';
import { requestFn } from './lib';

export { topRequest };

/**
 * 发起 TOP 请求
 * @param method     - 需要请求的 TOP API, 例如 `taobao.time.get`
 * @param passParams - 业务请求参数
 */
async function topRequest(
  method: string,
  passParams: {
    [key: string]: string | number;
  } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (!method) {
    throw new Error('缺少 method 参数. 请指定需要请求的 API.');
  }
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
    method,
    'app_key': process.env.TOP_KEY,
    'sign_method': 'md5',
    simplify: 'true',
    timestamp: genTaobaoTimestamp(),
    format: 'json',
    v: '2.0',
  };
  Object.assign(params, passParams);
  const sign = genSign(process.env.TOP_SECRET || '', params);
  params.sign = sign;
  const searchParams = new URLSearchParams(params);
  options.path += `?${searchParams.toString()}`;
  const res = await requestFn(options);
  if (res.body) {
    res.body = JSON.parse(res.body);
  }
  return res;
}

function genTaobaoTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = to2PadString(date.getMonth() + 1);
  const day = to2PadString(date.getDate());
  const hour = to2PadString(date.getHours());
  const minute = to2PadString(date.getMinutes());
  const second = to2PadString(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function to2PadString(v: number): string {
  return v.toString().padStart(2, '0');
}

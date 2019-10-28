# taobao-sdk [![npm version](https://img.shields.io/npm/v/@zsqk/taobao-sdk.svg?style=flat)](https://www.npmjs.com/package/@zsqk/taobao-sdk) ![node version](https://img.shields.io/node/v/@zsqk/taobao-sdk.svg?style=flat)

## 简介

用于淘宝开放平台, 用来替代 topSDK.

目标之一就是减少不必要依赖.

目前支持功能:

- Promise(async/await) 风格.
- 在 AWS Lambda 中通过 sign 验证来自 TOP 的请求.
- 发起 TOP 请求.

## API

```JavaScript
// 向淘宝开放平台发送请求
topRequest
```

```JavaScript
// 生成请求签名, 可用于接收淘宝开放平台的请求时的签名验证
genSign

// 生成淘宝格式的时间戳
genTaobaoTimestamp
```

## 已知问题

- [ ] 不支持文件上传.
- [ ] 不支持 HMAC-MD5 签名.

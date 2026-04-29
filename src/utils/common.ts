export const  sleep = (ms: number = 2000) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateUUID = (): string => {
      // 生成 16 字节安全随机数据
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);

  // RFC4122: 设置版本4 和 变体
  // 第6字节：0100xxxx (version 4)
  buf[6] = (buf[6] & 0x0f) | 0x40;
  // 第8字节：10xxxxxx (RFC 变体)
  buf[8] = (buf[8] & 0x3f) | 0x80;

  // 格式化 uuid 字符串
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0'));
  
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10).join('')
  ].join('-');
}
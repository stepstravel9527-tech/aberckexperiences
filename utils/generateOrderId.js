export function generateOrderId() {
  const now = new Date();

  const datePart = now
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14); // YYYYMMDDHHMMSS

  // 6位随机数
  const randomPart = Math.floor(100000 + Math.random() * 900000);

  const orderId = `ORD-${randomPart}${datePart}`;

  return orderId;
}

export default generateOrderId;

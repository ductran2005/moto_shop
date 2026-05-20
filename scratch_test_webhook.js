const fs = require('fs');
const path = require('path');

// Đọc file .env.local để lấy SEPAY_API_KEY tự động
let sepayApiKey = 'test_secret_key'; // Default fallback
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^SEPAY_API_KEY=(.*)$/m);
    if (match && match[1].trim()) {
      sepayApiKey = match[1].trim();
      console.log(`🔑 Đã tìm thấy SEPAY_API_KEY trong .env.local: "${sepayApiKey}"`);
    } else {
      console.log('⚠️ SEPAY_API_KEY trong .env.local đang để trống. Sẽ sử dụng key mặc định: "test_secret_key"');
      console.log('👉 Vui lòng tạm thời điền SEPAY_API_KEY=test_secret_key vào .env.local để chạy test này.');
    }
  }
} catch (err) {
  console.error('Không thể đọc file .env.local:', err.message);
}

// Lấy tham số từ command line
const args = process.argv.slice(2);
const orderCode = args[0];
const amount = parseInt(args[1], 10);

if (!orderCode || !amount) {
  console.log('\n❌ Thiếu tham số truyền vào!');
  console.log('👉 Cách chạy: node scratch_test_webhook.js <Mã_Đơn_Hàng> <Số_Tiền>');
  console.log('👉 Ví dụ: node scratch_test_webhook.js SZ-20260520-ABCDEF 150000\n');
  process.exit(1);
}

// Giả lập Payload giống cấu trúc SePay Webhook gửi
const payload = [
  {
    id: Math.floor(Math.random() * 10000000), // Random transaction ID
    transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    amount: amount,
    content: `${orderCode} thanh toan don hang moto shop`,
    bank_code: 'MB',
    bank_account_number: '0961234567',
    bank_account_name: 'NGUYEN VAN A',
    gateway: 'MBBank'
  }
];

const bodyText = JSON.stringify(payload);

console.log(`\n🚀 Đang gửi Webhook giả lập tới http://localhost:3000/api/sepay/webhook...`);
console.log(`📦 Mã đơn hàng: ${orderCode}`);
console.log(`💰 Số tiền: ${amount.toLocaleString('vi-VN')}đ`);
console.log(`📝 Nội dung chuyển khoản: "${payload[0].content}"`);

// Gửi request POST bằng module http/https mặc định của Node.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/sepay/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': sepayApiKey,
    'Content-Length': Buffer.byteLength(bodyText)
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📥 Phản hồi từ Server (HTTP ${res.statusCode}):`);
    try {
      const parsed = JSON.parse(responseData);
      console.dir(parsed, { colors: true });
      if (res.statusCode === 200 && parsed.success) {
        console.log('\n✅ Webhook xử lý THÀNH CÔNG! Đơn hàng đã được xác nhận.');
      } else {
        console.log('\n❌ Webhook thất bại hoặc trả về lỗi.');
      }
    } catch (e) {
      console.log(responseData || '(Không có nội dung trả về)');
    }
  });
});

req.on('error', (e) => {
  console.error(`\n❌ Lỗi kết nối tới Server Next.js: ${e.message}`);
  console.log('👉 Hãy chắc chắn rằng dự án của bạn đang chạy ở cổng 3000 (npm run dev)');
});

req.write(bodyText);
req.end();

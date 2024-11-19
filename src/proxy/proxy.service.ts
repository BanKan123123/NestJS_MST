import { Injectable } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyService {
     public configureProxy(app) {
          // Cấu hình proxy
          app.use(
               '/users', // Điều chỉnh đường dẫn nếu cần
               createProxyMiddleware({
                    target: 'https://localhost:3001',
                    changeOrigin: true,
                    secure: false, // Cho phép qua proxy khi sử dụng https không hợp lệ
               }),
          );
     }
}

# Sử dụng image Node.js để làm nền tảng cho ứng dụng
FROM node:22.1.0

# Thiết lập thư mục làm việc bên trong container
WORKDIR /src

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./
COPY wait-for-it.sh /usr/local/bin/wait-for-it
# Cài đặt dependencies
RUN npm install
RUN chmod +x /usr/local/bin/wait-for-it
# Sao chép toàn bộ mã nguồn của bạn vào thư mục làm việc trong container
COPY . .

# Thiết lập biến môi trường cho cổng ứng dụng
ENV PORT 3000

# Mở cổng 3000 trong container để có thể truy cập từ bên ngoài
EXPOSE 3000

# Chạy lệnh để khởi động ứng dụng (sử dụng npm start:dev cho môi trường development hoặc npm start cho production)
CMD ["wait-for-it", "mongodb", "27017", "--", "npm", "run", "start:dev"]

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load biến môi trường từ .env
dotenv.config();

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET); // Thêm log để kiểm tra

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL, // Điều chỉnh theo domain của frontend trong production
    methods: ['GET', 'POST', 'PUT'], // Mở rộng để hỗ trợ PUT cho approveOrder và updateOrderGroup
    credentials: true, // Cho phép gửi cookie nếu cần
    allowedHeaders: ['Content-Type', 'Authorization'], // Thêm các header cần thiết
  },
});

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors()); // Cho phép gọi API từ frontend
app.use(helmet()); // Bảo mật headers
app.use(morgan('dev')); // Log request
app.use(express.json()); // Parse JSON body

// Lưu io vào app để sử dụng trong controllers
app.set('io', io);

// Lắng nghe sự kiện WebSocket
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });

  // Frontend có thể lắng nghe các sự kiện sau:
  // - 'new_pending_order': Phát khi có order mới được thêm (từ addOrder).
  // - 'order_updated': Phát khi order được cập nhật (từ approveOrder).
  // - 'order_group_updated': Phát khi order group được cập nhật (từ updateOrderGroup).
  // Frontend cần implement logic để xử lý dữ liệu nhận được từ các sự kiện này.
});

// Sử dụng router tổng hợp
app.use('/api', routes);

// Tích hợp Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error middleware should be the last middleware
app.use(errorHandler);

// Khởi chạy server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
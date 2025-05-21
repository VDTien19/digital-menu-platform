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

// Load biến môi trường từ .env
dotenv.config();

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET); // Thêm log để kiểm tra

const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors()); // Cho phép gọi API từ frontend
app.use(helmet()); // Bảo mật headers
app.use(morgan('dev')); // Log request
app.use(express.json()); // Parse JSON body

// Sử dụng router tổng hợp
app.use('/api', routes);

// Tích hợp Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error middleware should be the last middleware
app.use(errorHandler);

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

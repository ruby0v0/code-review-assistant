import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', apiRoutes);

// 404
app.use((req, res) => {
	res.status(404).json({
		success: false,
		error: `路由 ${req.method} ${req.originalUrl} 不存在`,
	});
});

// 全局错误处理
app.use((err, req, res, next) => {
	console.error('全局错误:', err.stack);
	const message =
		process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误';

	res.status(err.status || 500).json({
		success: false,
		error: message,
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
});

export default app;

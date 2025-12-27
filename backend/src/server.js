import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 启动服务器
const server = app.listen(PORT, () => {
	console.log(`
🚀 代码审查助手服务已启动
📍 环境: ${NODE_ENV}
📡 端口: ${PORT}
🔗 本地: http://localhost:${PORT}
🌐 健康检查: http://localhost:${PORT}/api/health
`);
});

// 关闭服务器
const gracefulShutdown = () => {
	console.log('\n🛑 收到关闭信号，正在关闭服务器...');

	server.close(() => {
		console.log('✅ 服务器已关闭');
		process.exit(0);
	});

	setTimeout(() => {
		console.error('❌ 无法正常关闭，强制退出');
		process.exit(1);
	}, 5000);
};

// 捕获退出信号
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// 未捕获的异常
process.on('uncaughtException', (err) => {
	console.error('💥 未捕获的异常:', err);
	gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('⚠️  未处理的Promise拒绝:', reason);
});

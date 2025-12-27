import { Router } from 'express';
import reviewRoutes from './review.routes.js';
import repositoryRoutes from './repository.routes.js';

const router = Router();

router.use('/review', reviewRoutes);
router.use('/repository', repositoryRoutes);

// 健康检查
router.get('/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		service: 'Code Review Assistant API',
	});
});

// API根路径
router.get('/', (req, res) => {
	res.json({
		message: '欢迎使用代码审查助手API',
		endpoints: {
			review: '/api/review',
			repository: '/api/repository',
			health: '/api/health',
		},
		version: '1.0.0',
	});
});

export default router;
